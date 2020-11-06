import { AfterViewInit, Component, HostListener } from '@angular/core';
import { MAXIMUM_NUMBER_OF_COLORS, MAX_OPACITY } from '@app/ressources/global-variables/global-variables';
import { ColorSelectionService } from '@app/services/color-selection/color-selection.service';
import { PipetteService } from '@app/services/tools/pipette.service';
@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent implements AfterViewInit {
    primaryColor: string = '#000000';
    secondaryColor: string = '#000000';
    colors: string[] = ['#000000'];
    minOpacity: number = 0;
    maxOpacity: number = MAX_OPACITY;
    primaryOpacity: number = MAX_OPACITY;
    secondaryOpacity: number = MAX_OPACITY;

    constructor(public colorSelectionService: ColorSelectionService, public pipetteService: PipetteService) {
        // Initial values for the colors on application opening
        this.colorSelectionService.setPrimaryColor(this.hexToRGBA(this.primaryColor, this.primaryOpacity));
        this.colorSelectionService.setSecondaryColor(this.hexToRGBA(this.secondaryColor, this.secondaryOpacity));
        this.colorSelectionService.setPrimaryOpacity(this.primaryOpacity / MAX_OPACITY);
        this.colorSelectionService.setSecondaryOpacity(this.secondaryOpacity / MAX_OPACITY);
    }

    @HostListener('keyup', ['$event'])
    onInput(e: KeyboardEvent): void {
        e.stopPropagation();
    }

    changePrimaryColor(color: string): void {
        this.primaryColor = color;
        this.colors.unshift(this.primaryColor);
        if (this.colors.length > MAXIMUM_NUMBER_OF_COLORS) {
            this.colors.pop();
        }
        this.colorSelectionService.setPrimaryColor(this.hexToRGBA(color, this.primaryOpacity));
    }

    changeSecondaryColor(color: string): void {
        this.secondaryColor = color;
        this.colors.unshift(this.secondaryColor);
        if (this.colors.length > MAXIMUM_NUMBER_OF_COLORS) {
            this.colors.pop();
        }
        this.colorSelectionService.setSecondaryColor(this.hexToRGBA(color, this.secondaryOpacity));
    }

    swapColors(): void {
        const temp: string = this.primaryColor;
        this.primaryColor = this.secondaryColor;
        this.secondaryColor = temp;
        this.colorSelectionService.setPrimaryColor(this.hexToRGBA(this.primaryColor, this.primaryOpacity));
        this.colorSelectionService.setSecondaryColor(this.hexToRGBA(this.secondaryColor, this.secondaryOpacity));
    }

    decrementPrimaryOpacity(): void {
        if (this.primaryOpacity > this.minOpacity) {
            --this.primaryOpacity;
        }
        this.colorSelectionService.setPrimaryColor(this.hexToRGBA(this.primaryColor, this.primaryOpacity));
    }

    incrementPrimaryOpacity(): void {
        if (this.primaryOpacity < this.maxOpacity) {
            ++this.primaryOpacity;
        }
        this.colorSelectionService.setPrimaryColor(this.hexToRGBA(this.primaryColor, this.primaryOpacity));
    }

    decrementSecondaryOpacity(): void {
        if (this.secondaryOpacity > this.minOpacity) {
            --this.secondaryOpacity;
        }
        this.colorSelectionService.setSecondaryColor(this.hexToRGBA(this.secondaryColor, this.secondaryOpacity));
    }

    incrementSecondaryOpacity(): void {
        if (this.secondaryOpacity < this.maxOpacity) {
            ++this.secondaryOpacity;
        }
        this.colorSelectionService.setSecondaryColor(this.hexToRGBA(this.secondaryColor, this.secondaryOpacity));
    }

    // We had to disable any here to handle different type of input from user
    // tslint:disable-next-line: no-any
    changePrimaryOpacity(opacity: any, event: KeyboardEvent): void {
        event.stopPropagation();
        if (isNaN(opacity) || opacity < 0 || opacity > MAX_OPACITY || opacity === '') {
            this.primaryOpacity = MAX_OPACITY;
            this.colorSelectionService.setPrimaryColor(this.hexToRGBA(this.primaryColor, this.primaryOpacity));
            alert("L'opacité doit être un nombre entre 0 et 100.");
        } else {
            this.primaryOpacity = opacity;
            this.colorSelectionService.setPrimaryColor(this.hexToRGBA(this.primaryColor, this.primaryOpacity));
        }
    }

    // We had to disable any here to handle different type of input from user
    // tslint:disable-next-line: no-any
    changeSecondaryOpacity(opacity: any, event: KeyboardEvent): void {
        event.stopPropagation();
        if (isNaN(opacity) || opacity < 0 || opacity > MAX_OPACITY || opacity === '') {
            this.secondaryOpacity = MAX_OPACITY;
            this.colorSelectionService.setSecondaryColor(this.hexToRGBA(this.secondaryColor, this.secondaryOpacity));
            alert("L'opacité doit être un nombre entre 0 et 100.");
        } else {
            this.secondaryOpacity = opacity;
            this.colorSelectionService.setSecondaryColor(this.hexToRGBA(this.secondaryColor, this.secondaryOpacity));
        }
    }

    restorePreviousColor(color: string, isPrimary: boolean): void {
        if (isPrimary) {
            this.primaryColor = color;
            this.colorSelectionService.setPrimaryColor(this.hexToRGBA(color, this.primaryOpacity));
        } else {
            this.secondaryColor = color;
            this.colorSelectionService.setSecondaryColor(this.hexToRGBA(color, this.secondaryOpacity));
        }
    }

    hexToRGBA(color: string, opacity: number): string {
        // Using variables for string slicing would be as meaningless as not using variables
        // tslint:disable: no-magic-numbers
        const r: number = parseInt(color.slice(-6, -4), 16);
        const g: number = parseInt(color.slice(-4, -2), 16);
        const b: number = parseInt(color.slice(-2), 16);
        const rgba: string = 'rgba(' + r + ',' + g + ',' + b + ',' + (opacity / MAX_OPACITY).toString() + ')';
        return rgba;
    }

    ngAfterViewInit(): void {
        this.pipetteService.primaryColor.subscribe((data: string[]) => {
            this.changePrimaryColor(data[0]);
            this.primaryOpacity = Math.round((Number(data[1]) / 255) * MAX_OPACITY);
            const primary = document.getElementById('primary') as HTMLInputElement;
            primary.value = data[0];
        });
        this.pipetteService.secondaryColor.subscribe((data: string[]) => {
            this.changeSecondaryColor(data[0]);
            this.secondaryOpacity = Math.round((Number(data[1]) / 255) * MAX_OPACITY);
            const secondary = document.getElementById('secondary') as HTMLInputElement;
            secondary.value = data[0];
        });
    }
}
