import { Component } from '@angular/core';

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
})
export class GridComponent {
    isEnabled: boolean = false;
    minSquareSize: number = 1;
    maxSquareSize: number = 200;
    currentSquareSize: number = 5;

    constructor() {}

    changeGridView(isEnabled: boolean): void {
        console.log('called');
    }

    changeGridSize(newSize: number): void {
        console.log('called');
    }
}
