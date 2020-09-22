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

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.lineWidth = this.width;
        this.image.src = 'https://i.imgur.com/huy6X9t.png';
        this.image.onload = () => {
            const pat = ctx.createPattern(this.image, 'repeat');
            if (pat instanceof CanvasPattern) {
                ctx.strokeStyle = pat;
            }
            ctx.lineJoin = ctx.lineCap = 'round';
        };
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    private clearPath(): void {
        this.pathData = [];
    }
    //     function midPointBtw(p1, p2) {
    //   return {
    //     x: p1.x + (p2.x - p1.x) / 2,
    //     y: p1.y + (p2.y - p1.y) / 2
    //   };
    // }

    // function getPattern() {
    //   return ctx.createPattern(img, 'repeat');
    // }

    // var el = document.getElementById('c');
    // var ctx = el.getContext('2d');

    // ctx.lineWidth = 25;
    // ctx.lineJoin = ctx.lineCap = 'round';

    // var img = new Image;
    // img.onload = function() {
    //   ctx.strokeStyle = getPattern();
    // };
    // img.src = 'https://i.imgur.com/huy6X9t.png';

    // var isDrawing, points = [ ];

    // el.onmousedown = function(e) {
    //   isDrawing = true;
    //   points.push({ x: e.clientX, y: e.clientY });
    // };

    // el.onmousemove = function(e) {
    //   if (!isDrawing) return;

    //   points.push({ x: e.clientX, y: e.clientY });

    //   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    //   var p1 = points[0];
    //   var p2 = points[1];

    //   ctx.beginPath();
    //   ctx.moveTo(p1.x, p1.y);

    //   for (var i = 1, len = points.length; i < len; i++) {
    //     var midPoint = midPointBtw(p1, p2);
    //     ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
    //     p1 = points[i];
    //     p2 = points[i+1];
    //   }
    //   ctx.lineTo(p1.x, p1.y);
    //   ctx.stroke();
    // };

    // el.onmouseup = function() {
    //   isDrawing = false;
    //   points.length = 0;
    // };
}
