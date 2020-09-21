import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import {
  HALF_RATIO,
  MINIMUM_CANVAS_HEIGHT,
  MINIMUM_CANVAS_WIDTH,
  MINIMUM_WORKSPACE_HEIGHT,
  MINIMUM_WORKSPACE_WIDTH, MouseButton
} from '@app/ressources/global-variables';

@Injectable({
  providedIn: 'root',
})
export class ResizeDrawingService {
  canvasSize: Vec2;
  mouseDownCoord: Vec2;
  mouseMoveCoord: Vec2;
  mouseDown: boolean = false;

  constructor() {
    this.canvasSize = { x: MINIMUM_CANVAS_WIDTH, y: MINIMUM_CANVAS_HEIGHT };
  }

  setDefaultCanvasSize(workSpaceSize: Vec2): Vec2 {

    if (workSpaceSize.x > MINIMUM_WORKSPACE_WIDTH) {
      this.canvasSize.x = workSpaceSize.x * HALF_RATIO;
    }

    if (workSpaceSize.y > MINIMUM_WORKSPACE_HEIGHT) {
      this.canvasSize.y = workSpaceSize.y * HALF_RATIO;
    }

    return this.canvasSize;
  }


  onMouseDown(event: MouseEvent): void {
    this.mouseDown = event.button === MouseButton.Left;
    if (this.mouseDown) {
      this.mouseDownCoord = this.getPositionFromMouse(event);
      this.mouseMoveCoord = this.mouseDownCoord;
    }
  }

  onMouseUp(): void {
    if (this.mouseDown) {
      this.mouseDown = false;
    }
  }

  getPositionFromMouse(event: MouseEvent): Vec2 {
    return { x: event.clientX, y: event.clientY };
  }

  verticalResize(event: MouseEvent): void {
    if (this.mouseDown) {
      const mousePosition = this.getPositionFromMouse(event);
      const mousePositionChangeY = mousePosition.y - this.mouseMoveCoord.y;
      this.canvasSize.y += mousePositionChangeY;
      this.mouseMoveCoord = this.getPositionFromMouse(event);
    }
  }

  horizontalResize(event: MouseEvent): void {
    if (this.mouseDown) {
      const mousePosition = this.getPositionFromMouse(event);
      const mousePositionChangeY = mousePosition.y - this.mouseMoveCoord.y;
      this.canvasSize.y += mousePositionChangeY;
      const mousePositionChangeX = mousePosition.x - this.mouseMoveCoord.x;
      this.canvasSize.x += mousePositionChangeX;
      this.mouseMoveCoord = this.getPositionFromMouse(event);
    }
  }

  verticalAndHorizontalResize(event: MouseEvent): void {
    if (this.mouseDown) {
      const mousePosition = this.getPositionFromMouse(event);
      const mousePositionChangeX = mousePosition.x - this.mouseMoveCoord.x;
      this.canvasSize.x += mousePositionChangeX;
      this.mouseMoveCoord = this.getPositionFromMouse(event);
    }
  }
}
