import { Injectable } from '@angular/core';
import { SCALE_FACTOR, STAMPS, TRANSLATION_FACTOR } from '@app/../assets/stamps/stamps';
import { Tool } from '@app/classes/tool';
import { Stamp } from '@app/classes/tool-properties';
import { ROTATION_STEP } from '@app/ressources/global-variables/global-variables';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { ColorSelectionService } from '../color-selection/color-selection.service';
import { DrawingService } from '../drawing/drawing.service';
@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool {
    currentMouseEvent: MouseEvent;
    name: string = TOOL_NAMES.STAMP_TOOL_NAME;
    minSize: number = 1;
    maxSize: number = 10;
    stampSize: number = 5;
    currentStamp: string = STAMPS.ANGULAR;
    stampData: Stamp;
    isAltKeyDown: boolean = false;
    angle: number = 0;

    constructor(public drawingService: DrawingService, public colorSelectionService: ColorSelectionService) {
        super(drawingService);
    }

    onMouseEnter(): void {
        this.drawingService.gridCanvas.style.cursor = 'none';
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.altKey) {
            this.isAltKeyDown = true;
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.altKey) {
            this.isAltKeyDown = false;
        }
        console.log(this.isAltKeyDown);
    }

    onMouseMove(event: MouseEvent): void {
        this.currentMouseEvent = event;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.updateStampData(event);
        this.printStamp(this.drawingService.previewCtx, this.stampData);
    }

    onMouseUp(event: MouseEvent): void {
        this.updateStampData(event);
        this.printStamp(this.drawingService.baseCtx, this.stampData);
        this.drawingService.updateStack(this.stampData);
        this.drawingService.setIsToolInUse(false);
    }

    printStamp(ctx: CanvasRenderingContext2D, stampData: Stamp): void {
        let path = new Path2D(stampData.stamp);
        ctx.translate(stampData.position.x - stampData.size * TRANSLATION_FACTOR, stampData.position.y - stampData.size * TRANSLATION_FACTOR);
        ctx.scale(stampData.size / SCALE_FACTOR, stampData.size / SCALE_FACTOR);
        ctx.rotate((this.angle * Math.PI) / 180);
        ctx.strokeStyle = ctx.fillStyle = stampData.color;
        ctx.stroke(path);
        ctx.fill(path);
        ctx.scale(stampData.size * SCALE_FACTOR, stampData.size * SCALE_FACTOR);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    onWheelEvent(event: WheelEvent): void {
        this.onMouseMove(this.currentMouseEvent);
        let rotationStep = ROTATION_STEP;
        if (this.isAltKeyDown) {
            rotationStep = 1;
        }
        const newAngle = this.angle + (event.deltaY / Math.abs(event.deltaY)) * rotationStep;
        this.angle = newAngle;
        console.log(newAngle);
    }

    onMouseLeave(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    updateStampData(mouseEvent: MouseEvent): void {
        this.stampData = {
            type: 'stamp',
            color: this.colorSelectionService.primaryColor,
            opacity: this.colorSelectionService.primaryOpacity,
            size: this.stampSize,
            position: this.getPositionFromMouse(mouseEvent),
            stamp: this.currentStamp,
        };
    }
}
