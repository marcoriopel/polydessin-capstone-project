import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ToolNames, TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { BrushService } from '@app/services/tools/brush.service';
import { CircleService } from '@app/services/tools/circle.service';
import { EraserService } from '@app/services/tools/eraser.service';
import { FillService } from '@app/services/tools/fill.service';
import { LineService } from '@app/services/tools/line.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { SelectionService } from '@app/services/tools/selection.service';
import { SquareService } from '@app/services/tools/square.service';

@Injectable({
    providedIn: 'root',
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
        fillService: FillService,
        eraserService: EraserService,
        selectionService: SelectionService,
    ) {
        this.tools = new Map<string, Tool>([
            [this.toolNames.PENCIL_TOOL_NAME, pencilService],
            [this.toolNames.BRUSH_TOOL_NAME, brushService],
            [this.toolNames.SQUARE_TOOL_NAME, squareService],
            [this.toolNames.CIRCLE_TOOL_NAME, circleService],
            [this.toolNames.LINE_TOOL_NAME, lineService],
            [this.toolNames.FILL_TOOL_NAME, fillService],
            [this.toolNames.ERASER_TOOL_NAME, eraserService],
            [this.toolNames.SELECTION_TOOL_NAME, selectionService],
        ]);

        this.currentTool = pencilService;
    }

    changeTool(toolName: string): void {
        const selectedTool = this.tools.get(toolName);
        if (selectedTool) {
            this.currentTool = selectedTool;
        }
    }

    getCurrentToolName(): string {
        return this.currentTool.name;
    }
}
