import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { DrawingService } from '../drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool {
    name: string = TOOL_NAMES.STAMP_TOOL_NAME;
    minSize: number = 1;
    maxSize: number = 10;

    constructor(public drawingService: DrawingService) {
        super(drawingService);
    }

    onMouseUp(event: MouseEvent): void {
        console.log('works');
    }
}
