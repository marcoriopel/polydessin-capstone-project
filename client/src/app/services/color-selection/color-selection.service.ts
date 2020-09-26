import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ColorSelectionService {
    primaryColor: string;
    primaryOpacity: number;
    secondaryColor: string;
    secondaryOpacity: number;

    constructor() {}

    setPrimaryColor(color: string): void {
        this.primaryColor = color;
    }

    setSecondaryColor(color: string): void {
        this.secondaryColor = color;
    }

    setPrimaryOpacity(opacity: number): void {
        this.primaryOpacity = opacity;
    }

    setSecondaryOpacity(opacity: number): void {
        this.secondaryOpacity = opacity;
    }
}
