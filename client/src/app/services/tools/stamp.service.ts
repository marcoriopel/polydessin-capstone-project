import { Injectable, OnInit } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { DrawingService } from '../drawing/drawing.service';
@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool implements OnInit {
    name: string = TOOL_NAMES.STAMP_TOOL_NAME;
    minSize: number = 1;
    maxSize: number = 10;

    constructor(public drawingService: DrawingService) {
        super(drawingService);
    }

    ngOnInit(): void {
        console.log('init');
    }

    onMouseMove(event: MouseEvent): void {
        let mouseCoordinantes: Vec2 = this.getPositionFromMouse(event);
        let img = new Image();
        let ctx = this.drawingService.previewCtx;
        img.onload = function () {
            ctx.strokeStyle = 'red';
            ctx.drawImage(img, mouseCoordinantes.x - 50, mouseCoordinantes.y - 50, 100, 100);
        };
        img.src = '/assets/stamps/angular-brands.svg';
        this.drawingService.clearCanvas(ctx);
    }

    onMouseUp(event: MouseEvent): void {
        let mouseCoordinantes: Vec2 = this.getPositionFromMouse(event);
        let img = new Image();
        let ctx = this.drawingService.baseCtx;
        img.onload = function () {
            ctx.drawImage(img, mouseCoordinantes.x - 50, mouseCoordinantes.y - 50, 100, 100);
        };
        img.src = '/assets/stamps/angular-brands.svg';
    }

    onMouseLeave(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
}
