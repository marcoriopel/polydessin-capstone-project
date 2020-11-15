import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/ressources/global-variables/global-variables';
import { ColorSelectionService } from '@app/services/color-selection/color-selection.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class SprayService extends Tool {
    density: number = 40;
    timeoutId: ReturnType<typeof setTimeout>;
    mouseCoord: Vec2;

    constructor(drawingService: DrawingService, public colorSelectionService: ColorSelectionService) {
        super(drawingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.drawingService.baseCtx.filter = 'none';
        this.drawingService.previewCtx.filter = 'none';
        if (event.button !== MouseButton.LEFT) {
            return;
        } else {
            this.mouseDown = true;
            this.mouseCoord = this.getPositionFromMouse(event);
            this.timeoutId = setTimeout(this.drawSpray, 50, this, this.drawingService.previewCtx);
            this.drawingService.setIsToolInUse(true);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            clearTimeout(this.timeoutId);
            this.drawingService.applyPreview();
            this.drawingService.setIsToolInUse(false);
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseCoord = this.getPositionFromMouse(event);
        }
    }

    drawSpray(self: SprayService, ctx: CanvasRenderingContext2D): void {
        for (let i = self.density; i--; ) {
            const angle = self.getRandomFloat(0, Math.PI * 2);
            const radius = self.getRandomFloat(0, 30);
            ctx.globalAlpha = Math.random();
            ctx.fillStyle = self.colorSelectionService.primaryColor;
            ctx.fillRect(
                self.mouseCoord.x + radius * Math.cos(angle),
                self.mouseCoord.y + radius * Math.sin(angle),
                self.getRandomFloat(1, 2),
                self.getRandomFloat(1, 2),
            );
        }
        if (!self.timeoutId) return;
        self.timeoutId = setTimeout(self.drawSpray, 50, self, ctx);
    }

    getRandomFloat(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    reset(): void {
        this.drawingService.previewCtx.globalAlpha = 1;
    }
}
