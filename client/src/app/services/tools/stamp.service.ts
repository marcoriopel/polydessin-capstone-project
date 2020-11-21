import { Injectable } from '@angular/core';
import {
    INITIAL_STAMP_ANGLE,
    INITIAL_STAMP_SIZE,
    MAX_STAMP_SIZE,
    MIN_STAMP_SIZE,
    SCALE_FACTOR,
    StampAttributes,
    STAMPS,
    TRANSLATION_FACTOR,
} from '@app/../assets/stamps/stamps';
import { Tool } from '@app/classes/tool';
import { Stamp } from '@app/classes/tool-properties';
import { Vec2 } from '@app/classes/vec2';
import { ROTATION_STEP } from '@app/ressources/global-variables/global-variables';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { ColorSelectionService } from '../color-selection/color-selection.service';
import { DrawingService } from '../drawing/drawing.service';
@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool {
    currentStamp: StampAttributes = STAMPS.ANGULAR;
    name: string = TOOL_NAMES.STAMP_TOOL_NAME;
    stampSize: number = INITIAL_STAMP_SIZE;
    angle: number = INITIAL_STAMP_ANGLE;
    maxSize: number = MAX_STAMP_SIZE;
    minSize: number = MIN_STAMP_SIZE;
    currentMouseEvent: MouseEvent;
    isAltKeyDown: boolean = false;
    stampData: Stamp;

    constructor(public drawingService: DrawingService, public colorSelectionService: ColorSelectionService) {
        super(drawingService);
    }

    onMouseEnter(): void {
        this.drawingService.gridCanvas.style.cursor = 'none';
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Alt') {
            event.preventDefault();
            this.isAltKeyDown = true;
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.key === 'Alt') {
            this.isAltKeyDown = false;
        }
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
        let path = new Path2D(stampData.stamp.path);

        const center: Vec2 = { x: stampData.position.x, y: stampData.position.y };

        // Rotate stamp
        ctx.translate(center.x, center.y);
        ctx.rotate((stampData.angle * Math.PI) / 90);
        ctx.translate(-center.x, -center.y);

        // Move stamp center to cursor position
        ctx.translate(stampData.position.x - stampData.size * TRANSLATION_FACTOR, stampData.position.y - stampData.size * TRANSLATION_FACTOR);
        ctx.scale(stampData.size / SCALE_FACTOR, stampData.size / SCALE_FACTOR);

        // Print stamp on canvas
        ctx.strokeStyle = ctx.fillStyle = stampData.color;
        ctx.stroke(path);
        ctx.fill(path);
        ctx.scale(stampData.size * SCALE_FACTOR, stampData.size * SCALE_FACTOR);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    onWheelEvent(event: WheelEvent): void {
        let rotationStep = ROTATION_STEP;
        if (this.isAltKeyDown) {
            rotationStep = 1;
        }
        this.angle = this.angle + (event.deltaY / Math.abs(event.deltaY)) * rotationStep;
        this.onMouseMove(this.currentMouseEvent);
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
            angle: this.angle,
        };
    }
}
