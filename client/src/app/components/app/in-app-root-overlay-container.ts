import { OverlayContainer } from '@angular/cdk/overlay';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';

export const OVERLAY_PARENT_HTML = new InjectionToken<string>('OVERLAY_PARENT_HTML');

@Injectable({ providedIn: 'root' })
export class InAppRootOverlayContainer extends OverlayContainer implements OnDestroy {
    constructor(@Inject(DOCUMENT) _document: any) {
        super(_document);
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    getRootElement(): Element {
        const element = this._document.querySelector('app-root');
        if (element instanceof Element) {
            console.log('intercept');
            return element;
        }
        return new Element();
    }

    protected _createContainer(): void {
        super._createContainer();
        this._appendToRootComponent();
    }

    private _appendToRootComponent(): void {
        if (!this._containerElement) {
            return;
        }

        const rootElement = this.getRootElement();
        const parent = rootElement || this._document.body;
        parent.appendChild(this._containerElement);
    }
}
