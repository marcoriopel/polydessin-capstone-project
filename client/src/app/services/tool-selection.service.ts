import { Injectable } from '@angular/core';
import { TOOL_NAMES } from '@app/../ressources/global-variables';
import { Tool } from '@app/classes/tool';
import { ToolNames } from '@app/classes/toolNames';
import { BrushService } from '@app/services/tools/brush.service';
import { CircleService } from '@app/services/tools/circle.service';
import { EraserService } from '@app/services/tools/eraser.service';
import { LineService } from '@app/services/tools/line.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { SquareService } from '@app/services/tools/square.service';

@Injectable({
  providedIn: 'root'
})
export class ToolSelectionService {
  toolNames: ToolNames = TOOL_NAMES;
  private tools: Map<string, Tool>;
  currentTool: Tool;

  constructor(
    pencilService: PencilService,
    brushService: BrushService,
    squareService: SquareService,
    circleService: CircleService,
    lineService: LineService,
    eraserService: EraserService) {
    this.tools = new Map([
      [this.toolNames.PENCIL_TOOL_NAME, pencilService],
      [this.toolNames.BRUSH_TOOL_NAME, brushService],
      [this.toolNames.SQUARE_TOOL_NAME, squareService],
      [this.toolNames.CIRCLE_TOOL_NAME, circleService],
      [this.toolNames.LINE_TOOL_NAME, lineService],
      [this.toolNames.ERASER_TOOL_NAME, eraserService],
    ]);

    this.currentTool = pencilService
  }

  onToolChange(toolName: string): void {
    let selectedTool = this.tools.get(toolName);
    if (selectedTool) {
      this.currentTool = selectedTool;
    }
  }

  getCurrentTool(): string {
    return this.currentTool.name;
  }
}
