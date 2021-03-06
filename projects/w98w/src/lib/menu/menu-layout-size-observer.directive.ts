
/* the root menu will subscribe to my output, and then enrich it to pass to its submenus.
   the submenus can interact with me directly to request a subscription, but it will get its
   results by waiting for it to trickle down throughout the hierarchy */

import { Directive, Input } from "@angular/core";
import { Observable, Subscriber, Unsubscribable } from "rxjs";
import { resolveContentRect } from "../rx/resize-observer";

export type Redeliverable<T> = {
   value: T,
   redelivery: boolean  // ! if it's a redelivery because of a resubscription, this won't reflect that
};

function ORIGINAL<T>(value: T): Redeliverable<T> {
   return { value, redelivery: false };
}

function REDELIVERY<T>(value: T): Redeliverable<T> {
   return { value, redelivery: true };
}

export class ResizeUpdates {
   root: Redeliverable<DOMRectReadOnly> | undefined;
   updates: Map<Element, Redeliverable<DOMRectReadOnly>> = new Map();

   // TODO: maybe have an option where function can "take" older, so we don't have to keep copying
   //       data. when using as an accumulator, we don't need the older one anymore, it'll get discarded.
   static accumulateNewerData(older: ResizeUpdates | undefined, newer: ResizeUpdates | undefined): ResizeUpdates | undefined {
      if (!older) {
         return newer;
      }
      if (!newer) {
         return older;
      }

      const result = new ResizeUpdates();

      result.root = older.root;
      if (newer.root) {
         result.root = newer.root;
         result.root.redelivery = result.root.redelivery && newer.root.redelivery;
      }

      for (const [k, v] of older.updates) {
         result.updates.set(k, v);
      }

      for (const [k, v] of newer.updates) {
         const preExisting = result.updates.get(k);
         if (preExisting) {
            preExisting.value = v.value;
            preExisting.redelivery = preExisting.redelivery && v.redelivery;
         } else {
            result.updates.set(k, v);
         }
      }

      return result;
   }
}

export interface MlsoMenuContext {
   observe(caller: unknown, targets: Element[], redeliver: boolean): void;
   unobserve(caller: unknown, target: Element): void;
   unobserveAll(caller: unknown): void;
}

function generate(rootElement_: Element) {
   let subscriber_: Subscriber<ResizeUpdates> | undefined;
   let ro_: ResizeObserver | undefined;

   const contextObservations_: Map<Element, {observers: Set<unknown>, latestValue: DOMRectReadOnly | undefined}> = new Map();
   let rootLatestValue_: DOMRectReadOnly | undefined;

   function ensureObservationOfBy(of: Element, by: unknown) {
      let details = contextObservations_.get(of);
      if (!details) { // haven't seen before
         details = {observers: new Set(), latestValue: undefined};
         contextObservations_.set(of, details);

         if (ro_) {
            ro_.observe(of);
         }
      }

      details.observers.add(by);
      return details.latestValue && REDELIVERY(details.latestValue);
   }

   const context: MlsoMenuContext = new class implements MlsoMenuContext {

      // is OK to only wait for root by passing blank array to targets
      observe(caller: unknown, targets: Element[], redeliver: boolean): void {

         const batch = redeliver ? new ResizeUpdates() : undefined;

         targets.forEach(v => {
            const latestValue = ensureObservationOfBy(v, caller);
            latestValue && batch?.updates.set(v, latestValue);
         });

         if (batch && rootLatestValue_) {
            batch.root = REDELIVERY(rootLatestValue_);
         }

         if (batch?.root || batch?.updates.size != 0) {
            subscriber_?.next(batch);
         }
      }
      unobserve(caller: unknown, target: Element): void {
         const details = contextObservations_.get(target);
         if (details) {
            details.observers.delete(caller);
            if (details.observers.size == 0) {
               contextObservations_.delete(target);
               ro_?.unobserve(target);
            }
         }
      }
      unobserveAll(caller: unknown): void {
         const toDiscard: Element[] = [];

         contextObservations_.forEach((details, elem) => {
            if (details.observers.has(caller)) {
               details.observers.delete(caller);
               if (details.observers.size == 0) {
                  toDiscard.push(elem);
               }
            }
         });

         for (const discard of toDiscard) {
            contextObservations_.delete(discard);
            ro_?.unobserve(discard);
         }
      }
   };

   const resizeUpdates$ = new Observable<ResizeUpdates>((subscriber: Subscriber<ResizeUpdates>) => {
      if (subscriber_) {
         // this API doesn't support multiple subscribers. there's only 1 menucontext.
         subscriber_.error(new Error("you're getting replaced"));
      }
      subscriber_ = subscriber;

      if (!ro_) {
         ro_ = new ResizeObserver((entries, _observer) => {

            const batch = new ResizeUpdates();

            for (const entry of entries) {

               if (entry.target == rootElement_) {
                  rootLatestValue_ = resolveContentRect(entry);
                  batch.root = ORIGINAL(rootLatestValue_);
                  // do continue as normal in case someone specifically observed for it
               }

               const detail = contextObservations_.get(entry.target);
               if (detail) {
                  const val = resolveContentRect(entry);
                  detail.latestValue = val;

                  batch.updates.set(entry.target, ORIGINAL(val));
               }
            }

            subscriber_?.next(batch);
         });
         ro_.observe(rootElement_);

         for (const element of contextObservations_.keys()) {
            ro_.observe(element);
         }
      }

      return new class implements Unsubscribable {
         unsubscribe(): void {
            if (ro_) {
               ro_.disconnect();
               ro_ = undefined;
            }

            subscriber_ = undefined;
         }
      };
   });

   return {context, resizeUpdates$};
}

@Directive({selector: '[w98w-menu-layout-size-observer]'})
export class MenuLayoutSizeObserverDirective {

   @Input() rootElement!: Element;

   generate() {
      return generate(this.rootElement);
   }
}
