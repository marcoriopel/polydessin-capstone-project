import { Component } from '@angular/core';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent {
    constructor() {}

    primaryOpacity: number = 100;
    secondaryOpacity: number = 100;
    min: number = 0;
    max: number = 100;

    changeColor(event: any) {
        console.log(event.target.value);
    }

    swapColors(): void {}

    decrementPrimaryOpacity(): void {
        if (this.primaryOpacity > this.min) {
            --this.primaryOpacity;
        }
    }

    incrementPrimaryOpacity(): void {
        if (this.primaryOpacity < this.max) {
            ++this.primaryOpacity;
        }
    }

    decrementSecondaryOpacity(): void {
        if (this.secondaryOpacity > this.min) {
            --this.secondaryOpacity;
        }
    }

    incrementSecondaryOpacity(): void {
        if (this.secondaryOpacity < this.max) {
            ++this.secondaryOpacity;
        }
    }
}
