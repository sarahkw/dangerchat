
/* the root menu will subscribe to my output, and then enrich it to pass to its submenus.
   the submenus can interact with me directly to request a subscription, but it will get its
   results by waiting for it to trickle down throughout the hierarchy */

import { Directive, Input } from "@angular/core";
import { Observable, Subscriber, TeardownLogic, Unsubscribable } from "rxjs";

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
   static accumulateNewerData(older: ResizeUpdates, newer: ResizeUpdates): ResizeUpdates {
      const result = new ResizeUpdates();

      if (newer.root) {
         console.assert(!!older.root);  // losing root not supported

         result.root = {
            value: newer.root.value,
            redelivery: older.root!.redelivery && newer.root.redelivery
         }
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
   observe(caller: any, targets: Element[], redeliver: boolean): void;
   unobserve(caller: any, target: Element): void;
   unobserveAll(caller: any): void;
}

export function resolveContentRect(entry: ResizeObserverEntry): DOMRectReadOnly {
   // support firefox ESR, which doesn't give array
   if (Array.isArray(entry.contentRect)) {
     return entry.contentRect[0];
   } else {
     return entry.contentRect;
   }
 }

function generate(rootElement_: Element) {
   let subscriber_: Subscriber<ResizeUpdates> | undefined;
   let ro_: ResizeObserver | undefined;

   let contextObservations_: Map<Element, {observers: Set<any>, latestValue: DOMRectReadOnly | undefined}> = new Map();
   let rootLatestValue_: DOMRectReadOnly | undefined;

   function ensureObservationOfBy(of: Element, by: any) {
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
      observe(caller: any, targets: Element[], redeliver: boolean): void {

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
      unobserve(caller: any, target: Element): void {
         const details = contextObservations_.get(target);
         if (details) {
            details.observers.delete(caller);
            if (details.observers.size == 0) {
               contextObservations_.delete(target);
               ro_?.unobserve(target);
            }
         }
      }
      unobserveAll(caller: any): void {
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
