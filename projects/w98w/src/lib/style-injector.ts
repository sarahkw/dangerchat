export class StyleInjector {

    private element?: HTMLStyleElement;

    destroy(): void {
        if (this.element) {
            this.element.remove();
            this.element = undefined;
        }
    }

    replaceStyle(body: string): void {
        if (this.element) {
            this.element.innerHTML = body;
        } else {
            this.element = document.createElement('style');
            this.element.innerHTML = body;
            document.head.appendChild(this.element);
        }
    }
}
