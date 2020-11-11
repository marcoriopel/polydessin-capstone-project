import { Component } from '@angular/core';
import { GRID_NAME } from '@app/ressources/global-variables/sidebar-elements';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { HotkeyService } from '@app/services/hotkey/hotkey.service';

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
})
export class GridComponent {
    isEnabled: boolean = false;
    minSquareSize: number = 1;
    maxSquareSize: number = 200;
    minOpacity: number = 0.1;
    maxOpacity: number = 1;
    currentSquareSize: number = 5;
    currentOpacity: number = 1;

    constructor(public drawingService: DrawingService, public hotkeyService: HotkeyService) {
        this.drawingService.gridSpacing = this.currentSquareSize;
        this.drawingService.opacity = this.currentOpacity;
        this.hotkeyService.getKey().subscribe((toolName) => {
            if (toolName === GRID_NAME) {
                if (this.isEnabled) this.changeGridView(false);
                else this.changeGridView(true);
            }
        });
    }

    changeGridView(isEnabled: boolean): void {
        this.isEnabled = isEnabled;
        this.drawingService.isGridEnabled = isEnabled;
        if (isEnabled) this.drawingService.setGrid();
        else this.drawingService.clearCanvas(this.drawingService.gridCtx);
    }

    changeGridSize(newSize: number): void {
        this.drawingService.gridSpacing = newSize;
        this.currentSquareSize = newSize;
        if (this.isEnabled) {
            this.drawingService.setGrid();
        }
    }

    changeOpacity(newOpacity: number): void {
        this.drawingService.opacity = newOpacity;
        this.currentOpacity = newOpacity;
        if (this.isEnabled) {
            this.drawingService.setGrid();
        }
    }
}
