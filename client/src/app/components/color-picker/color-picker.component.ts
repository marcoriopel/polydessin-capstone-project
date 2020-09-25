import { Component } from '@angular/core';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent {
    primaryColor: string;
    secondaryColor: string;
    colors: string[] = ['#000000'];

    constructor() {
        this.primaryColor = '#000000';
        this.secondaryColor = '#000000';
        document.addEventListener(
            'contextmenu',
            function (e) {
                e.preventDefault();
            },
            false,
        );
    }

    primaryOpacity: number = 100;
    secondaryOpacity: number = 100;
    min: number = 0;
    max: number = 100;

    colorClickHandler(event: MouseEvent): void {
        console.log(event.button);
    }

    changePrimaryColor(color: string): void {
        this.primaryColor = color;
        this.colors.unshift(this.primaryColor);
        if (this.colors.length > 10) {
            this.colors.pop();
        }
        console.log(this.primaryColor);
    }

    changeSecondaryColor(color: string): void {
        this.secondaryColor = color;
        this.colors.unshift(this.secondaryColor);
        if (this.colors.length > 10) {
            this.colors.pop();
        }
        console.log(this.secondaryColor);
    }

    swapColors(): void {
        const temp: string = this.primaryColor;
        this.primaryColor = this.secondaryColor;
        this.secondaryColor = temp;
    }

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
