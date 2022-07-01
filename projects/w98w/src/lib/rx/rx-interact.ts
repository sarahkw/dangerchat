import interact from 'interactjs';
import { Observable, Unsubscribable } from 'rxjs';

export function rxInteract(
        target: any,
        setup: (i: Interact.Interactable) => void
        ) {

    return new Observable<null>(_subscription => {

        const foo = interact(target);
        setup(foo);

        return new class implements Unsubscribable {
            unsubscribe(): void {
                foo.unset();
            }
        };
    });
}