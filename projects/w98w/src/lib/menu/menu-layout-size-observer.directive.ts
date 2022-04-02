
/* the root menu will subscribe to my output, and then enrich it to pass to its submenus.
   the submenus can interact with me directly to request a subscription, but it will get its
   results by waiting for it to trickle down throughout the hierarchy */

import { Directive, Input } from "@angular/core";
import { Subscriber, Unsubscribable } from "rxjs";

export class ResizeUpdates {
   root: DOMRectReadOnly | undefined;
   updates: Map<Element, DOMRectReadOnly> = new Map();
}

export interface MlsoMenuContext {
   observe(caller: any, target: Element): void;
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

   let contextObservations_: Map<Element, Set<any>> = new Map();

   const context = new class implements MlsoMenuContext {
      observe(caller: any, target: Element): void {
         let s = contextObservations_.get(target);
         if (!s) {
            s = new Set();
            contextObservations_.set(target, s);

            if (ro_) {
               ro_.observe(target);
            }
         }

         s.add(caller);
      }
      unobserve(caller: any, target: Element): void {
         const obsset = contextObservations_.get(target);
         if (obsset) {
            obsset.delete(caller);
            if (obsset.size == 0) {
               contextObservations_.delete(target);
               ro_?.unobserve(target);
            }
         }
      }
      unobserveAll(caller: any): void {
         const toDiscard: Element[] = [];

         contextObservations_.forEach((observers, elem) => {
            if (observers.has(caller)) {
               observers.delete(caller);
               if (observers.size == 0) {
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

   const subscribe = (subscriber: Subscriber<ResizeUpdates>) => {
      if (subscriber_) {
         // this API doesn't support multiple subscribers. there's only 1 menucontext.
         subscriber_.error(new Error("you're getting replaced"));
      }
      subscriber_ = subscriber;

      if (!ro_) {
         ro_ = new ResizeObserver((entries, _observer) => {
            let rootRect: DOMRectReadOnly | undefined;

            const updates: Map<Element, DOMRectReadOnly> = new Map();
            for (const entry of entries) {
               if (entry.target == rootElement_) {
                  rootRect = resolveContentRect(entry);
                  // root rect is treated special as in we hardcode subscribe it.
                  // but there's a small chance that someone is interested in it too.
                  if (contextObservations_.has(entry.target)) {
                     updates.set(entry.target, rootRect);
                  }
               } else {
                  updates.set(entry.target, resolveContentRect(entry));
               }
            }

            subscriber_?.next({root: rootRect, updates});
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
   }

   return {context, subscribe};
}

@Directive({selector: '[w98w-menu-layout-size-observer]'})
export class MenuLayoutSizeObserverDirective {

   @Input() rootElement!: Element;

   generate() {
      return generate(this.rootElement);
   }
}
