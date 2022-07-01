import { ElementRef } from "@angular/core";

export function elementRefIsSame(a: ElementRef<HTMLElement> | undefined, b: ElementRef<HTMLElement> | undefined) {
    if (a === undefined || b === undefined) {
        return a === b;
    }
    return a.nativeElement === b.nativeElement;
}