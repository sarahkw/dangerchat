import { EventEmitter } from "@angular/core";
import { Observable, observeOn, asapScheduler } from "rxjs";

//   DEPRECATED
// I just realized that "static" in the query solves this issue.

// This solves the issue where you have a component which is a library of templates that you
// want to use with ngTemplateOutlet. The problem is that ngTemplateOutlet takes the template from
// an input variable which gets resolved before the view children are set.
//
// asapScheduler seems to let us render the value without causing some rendered frame where
// the template didn't try to get rendered.

export function templateViewChildAsap<T>(getter: () => T) {
    const checkEvent = new EventEmitter<null>();
    const completeEvent = new EventEmitter<null>();

    return {
        $: new Observable<T>(subscriber => {
            let hasSent = false;
            let last: T;

            function check_fn() {
                const candidate = getter();
                if (!hasSent) {
                    hasSent = true;
                    last = candidate;
                    subscriber.next(candidate);
                } else if (candidate !== last) {
                    last = candidate;
                    subscriber.next(candidate);
                }
            }

            const subscription = checkEvent.subscribe(() => check_fn());
            subscription.add(completeEvent.subscribe(() => subscriber.complete()));

            return subscription;

        }).pipe(observeOn(asapScheduler)),

        check: () => checkEvent.next(null),
        complete: () => completeEvent.next(null)
    };
}