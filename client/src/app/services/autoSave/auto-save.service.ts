import { Injectable } from '@angular/core';

export interface CanvasShape {
    width: number;
    height: number;
    color: string;
}

export enum autoSaveIndex {
    DRAW = 'draw',
    FORM = 'form',
}

export interface LocalStorageReturn {
    shape: CanvasShape;
    form: HTMLCanvasElement;
}
@Injectable({
    providedIn: 'root',
})
export class AutoSaveService {
    // tslint:disable-next-line: no-empty
    constructor() {}
    saveForm(shape: CanvasShape): void {
        localStorage.setItem(autoSaveIndex.FORM, JSON.stringify(shape));
    }

    clearDesigns(): void {
        localStorage.removeItem(autoSaveIndex.DRAW);
    }

    savestatus(draw: HTMLCanvasElement): void {
        const canvasDesignString = new XMLSerializer().serializeToString(draw);
        try {
            localStorage.setItem(autoSaveIndex.DRAW, canvasDesignString);
        } catch (error) {
            console.warn('Taille maximale atteinte pour sauvegarde automatique');
            localStorage.removeItem(autoSaveIndex.DRAW);
        }
    }
}
