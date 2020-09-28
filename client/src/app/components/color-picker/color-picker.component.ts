import { Component } from '@angular/core';
import { MAXIMUM_NUMBER_OF_COLORS, ONE_HUNDRED } from '@app/ressources/global-variables/global-variables';
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
    maxOpacity: number = 100;

    constructor(public colorSelectionService: ColorSelectionService) {
        this.primaryColor = '#000000';
        this.secondaryColor = '#000000';
        this.primaryOpacity = ONE_HUNDRED;
        this.secondaryOpacity = ONE_HUNDRED;

        // Initial values for the colors on application opening
        this.colorSelectionService.setPrimaryColor(this.primaryColor);
        this.colorSelectionService.setSecondaryColor(this.secondaryColor);
        this.colorSelectionService.setPrimaryOpacity(this.primaryOpacity / ONE_HUNDRED);
        this.colorSelectionService.setSecondaryOpacity(this.secondaryOpacity / ONE_HUNDRED);
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
        this.colorSelectionService.setPrimaryOpacity(this.primaryOpacity / ONE_HUNDRED);
    }

    incrementPrimaryOpacity(): void {
        if (this.primaryOpacity < this.maxOpacity) {
            ++this.primaryOpacity;
        }
        this.colorSelectionService.setPrimaryOpacity(this.primaryOpacity / ONE_HUNDRED);
    }

    decrementSecondaryOpacity(): void {
        if (this.secondaryOpacity > this.minOpacity) {
            --this.secondaryOpacity;
        }
        this.colorSelectionService.setSecondaryOpacity(this.secondaryOpacity / ONE_HUNDRED);
    }

    incrementSecondaryOpacity(): void {
        if (this.secondaryOpacity < this.maxOpacity) {
            ++this.secondaryOpacity;
        }
        this.colorSelectionService.setSecondaryOpacity(this.secondaryOpacity / ONE_HUNDRED);
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
