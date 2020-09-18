import { Injectable } from '@angular/core';
import { TOOL_NAMES } from '@app/../ressources/global-variables';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
  providedIn: 'root'
})
export class LineService extends Tool {
  name = TOOL_NAMES.LINE_TOOL_NAME;

  constructor(drawingService: DrawingService) {
    super(drawingService);
  }
}