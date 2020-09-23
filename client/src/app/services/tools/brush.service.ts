import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/ressources/global-variables/global-variables';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class BrushService extends Tool {
    name: string = TOOL_NAMES.BRUSH_TOOL_NAME;
    private pathData: Vec2[];
    width: number = 1;
    image: HTMLImageElement = new Image();

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.loadImage();
    }

    handleCursor(): void {
        const previewLayer = document.getElementById('previewLayer');
        if (previewLayer) {
            previewLayer.style.cursor = 'crosshair';
        }
    }
    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    changeWidth(newWidth: number): void {
        this.width = newWidth;
    }
    loadImage(): void {
        console.log('called');
        this.image.style.fill = 'black';
        this.image = new Image();
        this.image.style.fill = 'black';
        // this.image.src = 'https://i.imgur.com/ph8BJoX.jpg';
        this.image.src = '/assets/formal-invitation2.svg';
        this.image.style.fill = 'black';
        console.log(this.image.complete);
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.lineWidth = this.width;
        this.image.style.fill = 'black';
        ctx.lineJoin = ctx.lineCap = 'round';
        const pat = ctx.createPattern(this.image, 'repeat');
        if (pat instanceof CanvasPattern) {
            this.image.style.fill = 'black';
            ctx.strokeStyle = pat;
            this.image.style.fill = 'black';
        } else {
            console.log('Could not load pattern');
        }
        this.image.style.fill = 'black';
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
