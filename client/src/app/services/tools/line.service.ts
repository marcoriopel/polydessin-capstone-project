import { Injectable } from '@angular/core';
import { Line } from '@app/classes/line';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { LineAngle, MAXIMUM_DISTANCE_LINE_CONNECTION, Quadrant } from '@app/ressources/global-variables/global-variables';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { ColorSelectionService } from '@app/services/color-selection/color-selection.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { TrigonometryService } from '@app/services/trigonometry/trigonometry.service';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    name: string = TOOL_NAMES.LINE_TOOL_NAME;
    isShiftKeyDown: boolean = false;
    endingClickCoordinates: Vec2;
    isDrawing: boolean = false;
    numberOfClicks: number = 0;
    mouseClicks: Vec2[] = [];
    storedLines: Line[] = [];
    lineWidth: number = 1;
    dotWidth: number = 1;
    isDot: boolean = false;
    line: Line;
    mouseEvent: MouseEvent;

    constructor(
        public drawingService: DrawingService,
        public colorSelectionService: ColorSelectionService,
        public trigonometryService: TrigonometryService,
    ) {
        super(drawingService);
    }

    changeLineWidth(newWidth: number): void {
        this.lineWidth = newWidth;
    }

    changeJunction(isDot: boolean): void {
        this.isDot = isDot;
    }

    changeDotWidth(newWidth: number): void {
        this.dotWidth = newWidth;
    }

    onMouseUp(event: MouseEvent): void {
        this.isDrawing = true;
        this.mouseClicks.push(this.getPositionFromMouse(event));
        this.numberOfClicks = this.mouseClicks.length;

        // Check if it's a new line
        if (this.numberOfClicks <= 1) {
            return;
        }

        // Check if it is a double click
        if (this.checkIfDoubleClick()) {
            this.isDrawing = false;

            // Handle case when user double click when there is no line
            if (this.mouseClicks[0].x === this.mouseClicks[1].x && this.mouseClicks[0].y === this.mouseClicks[1].y) {
                this.mouseClicks = [];
                this.numberOfClicks = 0;
                return;
            }
            // Check if the last point is 20px away from initial point
            if (this.checkIf20pxAway(this.mouseClicks[0], this.mouseClicks[this.numberOfClicks - 2])) {
                // Replace the ending point received from the click coordinates with the inital point of the line
                this.mouseClicks[this.mouseClicks.length - 1] = this.mouseClicks[0];
                this.storedLines[this.storedLines.length - 1].endingPoint = this.mouseClicks[0];
            }

            // Draw line on base canvas
            this.storedLines.forEach((line) => {
                this.drawLine(line.startingPoint, line.endingPoint, false, this.lineWidth);
            });

            // Draw the junction dots
            if (this.isDot) {
                this.drawDots(this.dotWidth, false);
            }

            // Clear the preview canvas, the stored clikcs and the stored lines used for previewing
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.storedLines = [];
            this.mouseClicks = [];
            return;
        }

        if (this.isDrawing) {
            // Create a new line segment
            this.line = {
                startingPoint: this.mouseClicks[this.numberOfClicks - 2],
                endingPoint: this.endingClickCoordinates,
            };
            // Draw the line with the new segment on preview canvas
            this.drawLine(this.line.startingPoint, this.line.endingPoint, true, this.lineWidth);

            // Draw the junction dots
            if (this.isDot) {
                this.drawDots(this.dotWidth, true);
            }
            // Add the new line segment to the stored lines
            this.storedLines.push(this.line);

            // Replace last click with the good coordinates
            this.mouseClicks[this.mouseClicks.length - 1] = this.endingClickCoordinates;
        }
    }

    onMouseMove(event: MouseEvent): void {
        this.mouseEvent = event;
        if (!this.isDrawing) return;

        // Clear the old line segment preview
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        // Restore previous line segments
        this.storedLines.forEach((line) => {
            this.drawLine(line.startingPoint, line.endingPoint, true, this.lineWidth);
        });

        if (this.isDot) {
            this.drawDots(this.dotWidth, true);
        }

        if (this.isShiftKeyDown) {
            // Handle angles (set a different ending coordinates depending on mouse position)
            this.adjustLineAngle(this.getPositionFromMouse(event));
        } else {
            // Get new coordinates for end of line
            this.endingClickCoordinates = this.getPositionFromMouse(event);
        }
        // Draw the new line preview
        this.drawLine(this.mouseClicks[this.numberOfClicks - 1], this.endingClickCoordinates, true, this.lineWidth);
    }

    checkIfDoubleClick(): boolean {
        const previousClickX = this.mouseClicks[this.numberOfClicks - 2].x;
        const previousClickY = this.mouseClicks[this.numberOfClicks - 2].y;
        const currentClickX = this.mouseClicks[this.numberOfClicks - 1].x;
        const currentClickY = this.mouseClicks[this.numberOfClicks - 1].y;

        if (previousClickX === currentClickX && previousClickY === currentClickY) {
            return true;
        }
        return false;
    }

    checkIf20pxAway(firstPoint: Vec2, secondPoint: Vec2): boolean {
        // Phytagore
        const a = secondPoint.x - firstPoint.x;
        const b = secondPoint.y - firstPoint.y;
        const c = Math.sqrt(a * a + b * b);
        if (c <= MAXIMUM_DISTANCE_LINE_CONNECTION) {
            return true;
        } else {
            return false;
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.isShiftKeyDown = true;
            this.onMouseMove(this.mouseEvent);
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        switch (event.key) {
            case 'Shift': {
                this.isShiftKeyDown = false;
                this.onMouseMove(this.mouseEvent);
                break;
            }
            case 'Backspace': {
                if (this.numberOfClicks > 1) {
                    this.deleteLastSegment();
                }
                break;
            }
            case 'Escape': {
                this.deleteLine();
                break;
            }
        }
    }

    deleteLastSegment(): void {
        this.storedLines.pop();
        this.mouseClicks.pop();
        --this.numberOfClicks;

        // Clear the old line segment preview
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        // Restore previous line segments
        this.storedLines.forEach((line) => {
            this.drawLine(line.startingPoint, line.endingPoint, true, this.lineWidth);
        });

        // Draw the new line preview
        this.drawLine(this.mouseClicks[this.numberOfClicks - 1], this.endingClickCoordinates, true, this.lineWidth);

        if (this.isDot) {
            this.drawDots(this.dotWidth, true);
        }
    }

    deleteLine(): void {
        this.storedLines = [];
        this.mouseClicks = [];
        this.numberOfClicks = 0;
        this.isDrawing = false;
        // Clear the old line segment preview
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    adjustLineAngle(mouseCoordinates: Vec2): void {
        let opposite: number;
        let adjacent: number;
        let hypothenuse: number;
        let angleDegree: number;
        let angleRadians: number;
        let quadrant: Quadrant;
        let lineAngle: LineAngle;

        adjacent = mouseCoordinates.x - this.mouseClicks[this.mouseClicks.length - 1].x;
        opposite = this.mouseClicks[this.mouseClicks.length - 1].y - mouseCoordinates.y;

        hypothenuse = Math.sqrt(Math.pow(opposite, 2) + Math.pow(adjacent, 2));

        quadrant = this.trigonometryService.findCursorQuadrant(adjacent, opposite);

        // Make adjacent and opposite values positive if they are negative
        if (adjacent < 0) {
            adjacent = Math.abs(adjacent);
        }
        if (opposite < 0) {
            opposite = Math.abs(opposite);
        }
        if (hypothenuse === 0) {
            hypothenuse = 1;
        }

        angleRadians = Math.asin(opposite / hypothenuse);
        angleDegree = this.trigonometryService.radiansToDegrees(angleRadians);

        lineAngle = this.trigonometryService.findClosestAngle(quadrant, angleDegree);
        this.adjustEndingPoint(lineAngle, mouseCoordinates, adjacent);
    }

    adjustEndingPoint(lineAngle: LineAngle, mouseCoordinates: Vec2, adjacent: number): void {
        switch (lineAngle) {
            case LineAngle.DEGREES_0: {
                this.endingClickCoordinates = { x: mouseCoordinates.x, y: this.mouseClicks[this.mouseClicks.length - 1].y };
                break;
            }
            case LineAngle.DEGREES_45: {
                this.endingClickCoordinates = { x: mouseCoordinates.x, y: this.mouseClicks[this.mouseClicks.length - 1].y - adjacent };
                break;
            }
            case LineAngle.DEGREES_90: {
                this.endingClickCoordinates = { x: this.mouseClicks[this.mouseClicks.length - 1].x, y: mouseCoordinates.y };
                break;
            }
            case LineAngle.DEGREES_135: {
                this.endingClickCoordinates = { x: mouseCoordinates.x, y: this.mouseClicks[this.mouseClicks.length - 1].y - adjacent };
                break;
            }
            case LineAngle.DEGREES_180: {
                this.endingClickCoordinates = { x: mouseCoordinates.x, y: this.mouseClicks[this.mouseClicks.length - 1].y };
                break;
            }
            case LineAngle.DEGREES_225: {
                this.endingClickCoordinates = { x: mouseCoordinates.x, y: this.mouseClicks[this.mouseClicks.length - 1].y + adjacent };
                break;
            }
            case LineAngle.DEGREES_270: {
                this.endingClickCoordinates = { x: this.mouseClicks[this.mouseClicks.length - 1].x, y: mouseCoordinates.y };
                break;
            }
            case LineAngle.DEGREES_315: {
                this.endingClickCoordinates = { x: mouseCoordinates.x, y: this.mouseClicks[this.mouseClicks.length - 1].y + adjacent };
                break;
            }
        }
    }

    handleCursor(): void {
        const previewLayer = document.getElementById('previewLayer');
        if (previewLayer) {
            previewLayer.style.cursor = 'crosshair';
        }
    }

    drawLine(startingPoint: Vec2, endingPoint: Vec2, isPreview: boolean, lineWidth: number): void {
        if (isPreview) {
            console.log(startingPoint);
            // Using the preview canvas
            this.drawingService.previewCtx.strokeStyle = this.colorSelectionService.primaryColor;
            this.drawingService.previewCtx.globalAlpha = this.colorSelectionService.primaryOpacity;
            this.drawingService.previewCtx.lineWidth = lineWidth;
            this.drawingService.previewCtx.beginPath();
            this.drawingService.previewCtx.moveTo(startingPoint.x, startingPoint.y);
            this.drawingService.previewCtx.lineTo(endingPoint.x, endingPoint.y);
            this.drawingService.previewCtx.stroke();
        } else {
            // Using the base canvas
            this.drawingService.baseCtx.strokeStyle = this.colorSelectionService.primaryColor;
            this.drawingService.baseCtx.globalAlpha = this.colorSelectionService.primaryOpacity;
            this.drawingService.baseCtx.lineWidth = lineWidth;
            this.drawingService.baseCtx.beginPath();
            this.drawingService.baseCtx.moveTo(startingPoint.x, startingPoint.y);
            this.drawingService.baseCtx.lineTo(endingPoint.x, endingPoint.y);
            this.drawingService.baseCtx.stroke();
        }
    }

    drawDots(width: number, isPreview: boolean): void {
        const LAST_DOT = this.mouseClicks.length;
        if (isPreview) {
            for (let i = 0; i < LAST_DOT; i++) {
                this.drawingService.previewCtx.strokeStyle = this.colorSelectionService.secondaryColor;
                this.drawingService.previewCtx.fillStyle = this.colorSelectionService.secondaryColor;
                this.drawingService.previewCtx.globalAlpha = this.colorSelectionService.secondaryOpacity;
                this.drawingService.previewCtx.beginPath();
                this.drawingService.previewCtx.arc(this.mouseClicks[i].x, this.mouseClicks[i].y, width, 0, 2 * Math.PI);
                this.drawingService.previewCtx.fill();
                this.drawingService.previewCtx.stroke();
            }
        } else {
            // Remove the double click that doesnt need to be drawed on the canvas
            this.mouseClicks[this.mouseClicks.length - 2] = this.mouseClicks[this.mouseClicks.length - 1];
            this.mouseClicks.pop();
            for (let i = 0; i < LAST_DOT - 1; i++) {
                this.drawingService.baseCtx.strokeStyle = this.colorSelectionService.secondaryColor;
                this.drawingService.baseCtx.fillStyle = this.colorSelectionService.secondaryColor;
                this.drawingService.baseCtx.globalAlpha = this.colorSelectionService.secondaryOpacity;
                this.drawingService.baseCtx.beginPath();
                this.drawingService.baseCtx.arc(this.mouseClicks[i].x, this.mouseClicks[i].y, width, 0, 2 * Math.PI);
                this.drawingService.baseCtx.fill();
                this.drawingService.baseCtx.stroke();
            }
        }
    }
}
