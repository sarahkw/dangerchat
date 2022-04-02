
/* the root menu will subscribe to my output, and then enrich it to pass to its submenus.
   the submenus can interact with me directly to request a subscription, but it will get its
   results by waiting for it to trickle down throughout the hierarchy */

import { Directive, Input } from "@angular/core";
import { Subscriber, Unsubscribable } from "rxjs";

export type ResizeUpdates = {
   root: DOMRectReadOnly;
   updates: Map<Element, DOMRectReadOnly>;
};

export interface MlsoMenuContext {
   observe(caller: any, target: Element): void;
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
   let rootRect_: DOMRectReadOnly | undefined;

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
      unobserveAll(caller: any): void {
         const toDiscard: Element[] = [];

         contextObservations_.forEach((v, k) => {
            if (v.has(caller)) {
               v.delete(caller);
               if (v.size == 0) {
                  toDiscard.push(k);
               }
            }
         });

         for (const discard of toDiscard) {
            contextObservations_.delete(discard);
            if (ro_) {
               ro_.unobserve(discard);
            }
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
            const updates: Map<Element, DOMRectReadOnly> = new Map();
            for (const entry of entries) {
               if (entry.target == rootElement_) {
                  rootRect_ = resolveContentRect(entry);
               } else {
                  updates.set(entry.target, resolveContentRect(entry));
               }
            }

            if (rootRect_) {
               subscriber_?.next({root: rootRect_, updates});
            } else {
               // XXX this isn't that great, but with the current planned usage this shouldn't happen
               //
               // but i guess circumstances can change so that it can happen, so TODO maybe merge
               // dropped updates until we get rootRect
               console.error('dropping update because of missing rootRect');
            }
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
