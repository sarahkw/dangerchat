import { Directive, ElementRef, HostBinding, OnDestroy, Renderer2 } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { resizeObserverWaitForAll } from '../rx/resize-observer';

function* iterateElementChildren(element: Element) {
  let ptr: Element | null;
  ptr = element.firstElementChild;

  while (ptr) {
    yield ptr;
    ptr = ptr.nextElementSibling;
  }
}

@Directive({
  selector: '[w98w-cement-client-rect]',
  exportAs: 'cement'
})
export class CementClientRectDirective implements OnDestroy {

  @HostBinding('style.position') private readonly hbsP = "relative";

  constructor(
    private rootElementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2)
  {
  }

  private subscription: Subscription | undefined;

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private cementedAssertionFlag = false;  // it's just weird to do it multiple times. maybe it's ok though? idk.
  cement() {
    console.assert(!this.cementedAssertionFlag);
    this.cementedAssertionFlag = true;

    const targets: Element[] = [];
    for (const child of iterateElementChildren(this.rootElementRef.nativeElement)) {
      targets.push(child);
    }

    console.assert(!!this.subscription);
    this.subscription?.unsubscribe();

    this.subscription = resizeObserverWaitForAll(targets).pipe(take(1)).subscribe(rowfa => {

      const rootClientRect = this.rootElementRef.nativeElement.getBoundingClientRect();
      const clientRects: Map<Element, DOMRect> = new Map();

      rowfa.forEach((_rect, element) => {
        clientRects.set(element, element.getBoundingClientRect());
      });

      rowfa.forEach((rect, element) => {
        const clientRect = clientRects.get(element);
        console.assert(!!clientRect);
        if (clientRect) {
          this.renderer.setStyle(element, 'position', 'absolute');
          this.renderer.setStyle(element, 'margin', 0);
          this.renderer.setStyle(element, 'top', `${clientRect.top - rootClientRect.top}px`);
          this.renderer.setStyle(element, 'left', `${clientRect.left - rootClientRect.left}px`);
          this.renderer.setStyle(element, 'width', `${rect.width}px`);
          this.renderer.setStyle(element, 'height', `${rect.height}px`);
        }
      });
    });
  }
}
