import { Injectable } from '@angular/core';
import { MAXIMUM_DISTANCE_LINE_CONNECTION, TOOL_NAMES } from '@app/../ressources/global-variables';
import { Line } from '@app/classes/line';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
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
    line: Line;

    constructor(drawingService: DrawingService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = true;
    }

    onMouseUp(event: MouseEvent): void {
        this.mouseDown = false;
        this.isDrawing = true;
        this.mouseClicks.push(this.getPositionFromMouse(event));
        this.numberOfClicks = this.mouseClicks.length;

        // Check if it's a new line
        if (this.numberOfClicks <= 1) {
            return;
        }

        // Check if it is a double click
        if (this.checkIfDoubleClick(event)) {
            this.isDrawing = false;

            // Check if the last point is 20px away from initial point
            if (this.checkIf20pxAway(this.mouseClicks[0], this.mouseClicks[this.numberOfClicks - 2])) {
                // Replace the ending point received from the click coordinates with the inital point of the line
                this.storedLines[this.storedLines.length - 1].endingPoint = this.mouseClicks[0];
            }

            // Draw line on base canvas
            this.storedLines.forEach((line) => {
                this.drawLine(line.startingPoint, line.endingPoint, false);
            });

            // Clear the preview canvas and the mouse clicks used to create the previous line
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
            this.drawLine(this.line.startingPoint, this.line.endingPoint, true);

            // Add the new line segment to the stored lines
            this.storedLines.push(this.line);

            // Replace last click with the coordinates of the last click
            this.mouseClicks.pop();
            this.mouseClicks.push(this.endingClickCoordinates);
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.isDrawing) return;

        // Clear the old line segment preview
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        // Restore previous line segments
        this.storedLines.forEach((line) => {
            this.drawLine(line.startingPoint, line.endingPoint, true);
        });

        if (this.isShiftKeyDown) {
            // Handle angles (set a different ending coordinates)
            this.evaluateClosestAngle(this.getPositionFromMouse(event));
        } else {
            // Get new coordinates for end of line
            this.endingClickCoordinates = this.getPositionFromMouse(event);
        }
        // Draw the new line preview
        this.drawLine(this.mouseClicks[this.numberOfClicks - 1], this.endingClickCoordinates, true);
    }

    drawLine(startingPoint: Vec2, endingPoint: Vec2, isPreview: boolean): void {
        if (isPreview) {
            // Using the preview canvas
            this.drawingService.previewCtx.lineWidth = this.lineWidth;
            this.drawingService.previewCtx.beginPath();
            this.drawingService.previewCtx.moveTo(startingPoint.x, startingPoint.y);
            this.drawingService.previewCtx.lineTo(endingPoint.x, endingPoint.y);
            this.drawingService.previewCtx.stroke();
        } else {
            // Using the base canvas
            this.drawingService.baseCtx.lineWidth = this.lineWidth;
            this.drawingService.baseCtx.beginPath();
            this.drawingService.baseCtx.moveTo(startingPoint.x, startingPoint.y);
            this.drawingService.baseCtx.lineTo(endingPoint.x, endingPoint.y);
            this.drawingService.baseCtx.stroke();
        }
    }

    changeWidth(newWidth: number): void {
        this.lineWidth = newWidth;
    }

    checkIfDoubleClick(event: MouseEvent): boolean {
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
        // Shoutout to my boy Phytagore
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
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        switch (event.key) {
            case 'Shift': {
                this.isShiftKeyDown = false;
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
            this.drawLine(line.startingPoint, line.endingPoint, true);
        });

        // Draw the new line preview
        this.drawLine(this.mouseClicks[this.numberOfClicks - 1], this.endingClickCoordinates, true);
    }

    deleteLine(): void {
        this.storedLines = [];
        this.mouseClicks = [];
        this.numberOfClicks = 0;
        this.isDrawing = false;

        // Clear the old line segment preview
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        // Restore previous line segments
        this.storedLines.forEach((line) => {
            this.drawLine(line.startingPoint, line.endingPoint, true);
        });
    }

    // tslint:disable-next-line: cyclomatic-complexity
    evaluateClosestAngle(mouseCoordinates: Vec2): void {
        let opposite: number;
        let adjacent: number;
        let hypothenuse: number;
        let angleDegree: number;
        let angleRadians: number;
        let quadrant: Quadrant;
        let lineAngle: LineAngles;

        adjacent = mouseCoordinates.x - this.mouseClicks[this.mouseClicks.length - 1].x;
        opposite = this.mouseClicks[this.mouseClicks.length - 1].y - mouseCoordinates.y;

        hypothenuse = Math.sqrt(Math.pow(opposite, 2) + Math.pow(adjacent, 2));

        enum Quadrant {
            TOP_RIGHT = 0,
            TOP_LEFT = 1,
            BOTTOM_LEFT = 2,
            BOTTOM_RIGHT = 3,
        }

        enum LineAngles {
            DEGREES_0 = 0,
            DEGREES_45 = 1,
            DEGREES_90 = 2,
            DEGREES_135 = 3,
            DEGREES_180 = 4,
            DEGREES_225 = 5,
            DEGREES_270 = 6,
            DEGREES_315 = 7,
        }

        if (adjacent > 0 && opposite > 0) {
            quadrant = Quadrant.TOP_RIGHT;
        } else if (adjacent < 0 && opposite > 0) {
            quadrant = Quadrant.TOP_LEFT;
        } else if (adjacent < 0 && opposite < 0) {
            quadrant = Quadrant.BOTTOM_LEFT;
        } else {
            quadrant = Quadrant.BOTTOM_RIGHT;
        }

        if (adjacent < 0) {
            adjacent = adjacent * -1;
        }
        if (opposite < 0) {
            opposite = opposite * -1;
        }
        angleRadians = Math.asin(opposite / hypothenuse);
        angleDegree = angleRadians * (180 / Math.PI);

        switch (quadrant) {
            case Quadrant.TOP_RIGHT: {
                if (0 < angleDegree && angleDegree <= 22.5) {
                    lineAngle = LineAngles.DEGREES_0;
                } else if (22.5 < angleDegree && angleDegree < 67.5) {
                    lineAngle = LineAngles.DEGREES_45;
                } else {
                    lineAngle = LineAngles.DEGREES_90;
                }
                break;
            }
            case Quadrant.TOP_LEFT: {
                if (90 > angleDegree && angleDegree >= 67.5) {
                    lineAngle = LineAngles.DEGREES_90;
                } else if (67.5 > angleDegree && angleDegree > 22.5) {
                    lineAngle = LineAngles.DEGREES_135;
                } else {
                    lineAngle = LineAngles.DEGREES_180;
                }
                break;
            }
            case Quadrant.BOTTOM_LEFT: {
                if (0 < angleDegree && angleDegree <= 22.5) {
                    lineAngle = LineAngles.DEGREES_180;
                } else if (22.5 < angleDegree && angleDegree < 67.5) {
                    lineAngle = LineAngles.DEGREES_225;
                } else {
                    lineAngle = LineAngles.DEGREES_270;
                }
                break;
            }
            case Quadrant.BOTTOM_RIGHT: {
                if (90 > angleDegree && angleDegree >= 67.5) {
                    lineAngle = LineAngles.DEGREES_270;
                } else if (67.5 > angleDegree && angleDegree > 22.5) {
                    lineAngle = LineAngles.DEGREES_315;
                } else {
                    lineAngle = LineAngles.DEGREES_0;
                }
                break;
            }
        }

        switch (lineAngle) {
            case LineAngles.DEGREES_0: {
                this.endingClickCoordinates = { x: mouseCoordinates.x, y: this.mouseClicks[this.mouseClicks.length - 1].y };
                break;
            }
            case LineAngles.DEGREES_45: {
                this.endingClickCoordinates = { x: mouseCoordinates.x, y: this.mouseClicks[this.mouseClicks.length - 1].y - adjacent };
                break;
            }
            case LineAngles.DEGREES_90: {
                this.endingClickCoordinates = { x: this.mouseClicks[this.mouseClicks.length - 1].x, y: mouseCoordinates.y };
                break;
            }
            case LineAngles.DEGREES_135: {
                this.endingClickCoordinates = { x: mouseCoordinates.x, y: this.mouseClicks[this.mouseClicks.length - 1].y - adjacent };
                break;
            }
            case LineAngles.DEGREES_180: {
                this.endingClickCoordinates = { x: mouseCoordinates.x, y: this.mouseClicks[this.mouseClicks.length - 1].y };
                break;
            }
            case LineAngles.DEGREES_225: {
                this.endingClickCoordinates = { x: mouseCoordinates.x, y: this.mouseClicks[this.mouseClicks.length - 1].y + adjacent };
                break;
            }
            case LineAngles.DEGREES_270: {
                this.endingClickCoordinates = { x: this.mouseClicks[this.mouseClicks.length - 1].x, y: mouseCoordinates.y };
                break;
            }
            case LineAngles.DEGREES_315: {
                this.endingClickCoordinates = { x: mouseCoordinates.x, y: this.mouseClicks[this.mouseClicks.length - 1].y + adjacent };
                break;
            }
        }
    }
}
