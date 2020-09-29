import { Component } from '@angular/core';
import { MAXIMUM_NUMBER_OF_COLORS, MAX_OPACITY } from '@app/ressources/global-variables/global-variables';
import { ColorSelectionService } from '@app/services/color-selection/color-selection.service';
@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent {
    primaryColor: string;
    secondaryColor: string;
    primaryOpacity: number;
    secondaryOpacity: number;
    colors: string[] = ['#000000'];
    minOpacity: number = 0;
    maxOpacity: number = MAX_OPACITY;

    constructor(public colorSelectionService: ColorSelectionService) {
        this.primaryColor = '#000000';
        this.secondaryColor = '#000000';
        this.primaryOpacity = MAX_OPACITY;
        this.secondaryOpacity = MAX_OPACITY;

        // Initial values for the colors on application opening
        this.colorSelectionService.setPrimaryColor(this.primaryColor);
        this.colorSelectionService.setSecondaryColor(this.secondaryColor);
        this.colorSelectionService.setPrimaryOpacity(this.primaryOpacity / MAX_OPACITY);
        this.colorSelectionService.setSecondaryOpacity(this.secondaryOpacity / MAX_OPACITY);
    }

    changePrimaryColor(color: string): void {
        this.primaryColor = color;
        this.colors.unshift(this.primaryColor);
        if (this.colors.length > MAXIMUM_NUMBER_OF_COLORS) {
            this.colors.pop();
        }
        this.colorSelectionService.setPrimaryColor(color);
    }

    changeSecondaryColor(color: string): void {
        this.secondaryColor = color;
        this.colors.unshift(this.secondaryColor);
        if (this.colors.length > MAXIMUM_NUMBER_OF_COLORS) {
            this.colors.pop();
        }
        this.colorSelectionService.setSecondaryColor(color);
    }

    swapColors(): void {
        const temp: string = this.primaryColor;
        this.primaryColor = this.secondaryColor;
        this.secondaryColor = temp;

        this.colorSelectionService.setPrimaryColor(this.primaryColor);
        this.colorSelectionService.setSecondaryColor(this.secondaryColor);
    }

    decrementPrimaryOpacity(): void {
        if (this.primaryOpacity > this.minOpacity) {
            --this.primaryOpacity;
        }
        this.colorSelectionService.setPrimaryOpacity(this.primaryOpacity / MAX_OPACITY);
    }

    incrementPrimaryOpacity(): void {
        if (this.primaryOpacity < this.maxOpacity) {
            ++this.primaryOpacity;
        }
        this.colorSelectionService.setPrimaryOpacity(this.primaryOpacity / MAX_OPACITY);
    }

    decrementSecondaryOpacity(): void {
        if (this.secondaryOpacity > this.minOpacity) {
            --this.secondaryOpacity;
        }
        this.colorSelectionService.setSecondaryOpacity(this.secondaryOpacity / MAX_OPACITY);
    }

    incrementSecondaryOpacity(): void {
        if (this.secondaryOpacity < this.maxOpacity) {
            ++this.secondaryOpacity;
        }
        this.colorSelectionService.setSecondaryOpacity(this.secondaryOpacity / MAX_OPACITY);
    }

    // We had to disable any here to handle different type of input from user
    // tslint:disable-next-line: no-any
    changePrimaryOpacity(opacity: any): void {
        if (isNaN(opacity) || opacity < 0 || opacity > MAX_OPACITY) {
            this.primaryOpacity = MAX_OPACITY;
            this.colorSelectionService.setPrimaryOpacity(this.primaryOpacity / MAX_OPACITY);
            alert("L'opacité doit être un nombre entre 0 et 100.");
        } else {
            this.primaryOpacity = opacity;
            this.colorSelectionService.setPrimaryOpacity(opacity / MAX_OPACITY);
        }
    }

    // We had to disable any here to handle different type of input from user
    // tslint:disable-next-line: no-any
    changeSecondaryOpacity(opacity: any): void {
        if (isNaN(opacity) || opacity < 0 || opacity > MAX_OPACITY) {
            this.secondaryOpacity = MAX_OPACITY;
            this.colorSelectionService.setSecondaryOpacity(this.secondaryOpacity / MAX_OPACITY);
            alert("L'opacité doit être un nombre entre 0 et 100.");
        } else {
            this.secondaryOpacity = opacity;
            this.colorSelectionService.setSecondaryOpacity(opacity / MAX_OPACITY);
        }
    }

    restorePreviousColor(color: string, isPrimary: boolean): void {
        if (isPrimary) {
            this.primaryColor = color;
            this.colorSelectionService.setPrimaryColor(color);
        } else {
            this.secondaryColor = color;
            this.colorSelectionService.setSecondaryColor(color);
        }
    }
}
