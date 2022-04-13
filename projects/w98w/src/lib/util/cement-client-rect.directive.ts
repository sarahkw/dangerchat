import { Directive, ElementRef, HostBinding, OnDestroy, Renderer2 } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { resizeObserverWaitForAll } from '../rx/resize-observer';

function* iterateElementChildren<ElementType>(element: Element) {
  let ptr: Element | null;
  ptr = element.firstElementChild;

  while (ptr) {
    yield ptr as unknown as ElementType;
    ptr = ptr.nextElementSibling;
  }
}

function copyValue(dr: DOMRect) {
  return {
    left: dr.left,
    top: dr.top,
    width: dr.width,
    height: dr.height
  }
}

type DOMCopy = ReturnType<typeof copyValue>;

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

  private cemented = false;
  cement() {
    console.assert(!this.cemented);
    this.cemented = true;

    const targets: Element[] = [];
    for (const child of iterateElementChildren<HTMLElement>(this.rootElementRef.nativeElement)) {
      targets.push(child);
    }

    console.assert(!!this.subscription);
    this.subscription?.unsubscribe();

    this.subscription = resizeObserverWaitForAll(targets).pipe(take(1)).subscribe(rowfa => {

      const rootRect = copyValue(this.rootElementRef.nativeElement.getBoundingClientRect());
      const clientRects: Map<Element, DOMCopy> = new Map();

      rowfa.forEach((_rect, element) => {
        clientRects.set(element, copyValue(element.getBoundingClientRect()));
      });

      rowfa.forEach((rect, element) => {
        const clientRect = clientRects.get(element);
        console.assert(!!clientRect);
        if (clientRect) {
          this.renderer.setStyle(element, 'position', 'absolute');
          this.renderer.setStyle(element, 'top', `${clientRect.top - rootRect.top}px`);
          this.renderer.setStyle(element, 'left', `${clientRect.left - rootRect.left}px`);
          this.renderer.setStyle(element, 'width', `${rect.width}px`);
          this.renderer.setStyle(element, 'height', `${rect.height}px`);
        }
      });
    });
  }
}
