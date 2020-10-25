import { Injectable } from '@angular/core';
import { Rgba, RGBA_INDEXER } from '@app/ressources/global-variables/rgba';

@Injectable({
    providedIn: 'root',
})
export class ColorSelectionService {
    primaryColor: string;
    primaryOpacity: number;
    secondaryColor: string;
    secondaryOpacity: number;

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

    getRgbaPrimaryColor(): Rgba {
        const primaryColor: string = this.primaryColor.slice(5);

        const subStrings = primaryColor.split(',');
        const rgba: Rgba = {
            RED: parseInt(subStrings[RGBA_INDEXER.RED], 10),
            GREEN: parseInt(subStrings[RGBA_INDEXER.GREEN], 10),
            BLUE: parseInt(subStrings[RGBA_INDEXER.BLUE], 10),
            ALPHA: parseFloat(subStrings[RGBA_INDEXER.ALPHA]) * 255,
        };

        return rgba;
    }
}
