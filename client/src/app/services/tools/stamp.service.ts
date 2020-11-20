import { Injectable, OnInit } from '@angular/core';
import { STAMPS } from '@app/../assets/stamps/stamps';
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
    stampSize: number = 5;

    constructor(public drawingService: DrawingService) {
        super(drawingService);
    }

    ngOnInit(): void {
        console.log('init');
    }

    // onMouseEnter(): void {
    //     this.drawingService.gridCanvas.style.cursor = 'none';
    // }

    onMouseMove(event: MouseEvent): void {
        let mouseCoordinates: Vec2 = this.getPositionFromMouse(event);
        let ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);
        let path = new Path2D(STAMPS.ANGULAR);
        ctx.setTransform(1, 0, 0, 1, mouseCoordinates.x - 50, mouseCoordinates.y - this.stampSize - 50);
        ctx.scale(this.stampSize / 20, this.stampSize / 20);
        ctx.strokeStyle = 'red';
        ctx.fillStyle = 'red';
        ctx.stroke(path);
        ctx.fill(path);
        ctx.scale(this.stampSize * 20, this.stampSize * 20);
    }

    onMouseUp(event: MouseEvent): void {
        let mouseCoordinates: Vec2 = this.getPositionFromMouse(event);
        let ctx = this.drawingService.baseCtx;
        let path = new Path2D(STAMPS.ANGULAR);
        ctx.setTransform(1, 0, 0, 1, mouseCoordinates.x, mouseCoordinates.y);
        ctx.scale(this.stampSize / 20, this.stampSize / 20);
        ctx.strokeStyle = 'red';
        ctx.fillStyle = 'red';
        ctx.stroke(path);
        ctx.fill(path);
        ctx.scale(this.stampSize * 20, this.stampSize * 20);
    }

    onMouseLeave(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
}
