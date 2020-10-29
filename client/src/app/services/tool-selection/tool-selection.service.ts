import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Tool } from '@app/classes/tool';
import { CarouselComponent } from '@app/components/carousel/carousel.component';
import { SavingComponent } from '@app/components/saving/saving.component';
import { SidebarElements, SIDEBAR_ELEMENTS } from '@app/ressources/global-variables/sidebar-elements';
import { ToolNames, TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { HotkeyService } from '@app/services/hotkey/hotkey.service';
import { NewDrawingService } from '@app/services/new-drawing/new-drawing.service';
import { BrushService } from '@app/services/tools/brush.service';
import { CircleService } from '@app/services/tools/circle.service';
import { EraserService } from '@app/services/tools/eraser.service';
import { FillService } from '@app/services/tools/fill.service';
import { LineService } from '@app/services/tools/line.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { SquareService } from '@app/services/tools/square.service';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionService {
    sidebarElements: SidebarElements = SIDEBAR_ELEMENTS;
    toolNames: ToolNames = TOOL_NAMES;
    private tools: Map<string, Tool>;
    currentTool: Tool;

    constructor(
        public dialog: MatDialog,
        public hotkeyService: HotkeyService,
        pencilService: PencilService,
        brushService: BrushService,
        squareService: SquareService,
        circleService: CircleService,
        lineService: LineService,
        fillService: FillService,
        eraserService: EraserService,
        public newDrawingService: NewDrawingService,
    ) {
        this.tools = new Map<string, Tool>([
            [this.toolNames.PENCIL_TOOL_NAME, pencilService],
            [this.toolNames.BRUSH_TOOL_NAME, brushService],
            [this.toolNames.SQUARE_TOOL_NAME, squareService],
            [this.toolNames.CIRCLE_TOOL_NAME, circleService],
            [this.toolNames.LINE_TOOL_NAME, lineService],
            [this.toolNames.FILL_TOOL_NAME, fillService],
            [this.toolNames.ERASER_TOOL_NAME, eraserService],
        ]);
        this.currentTool = pencilService;
        this.hotkeyService.getKey().subscribe((tool) => {
            if (this.tools.has(tool)) {
                this.changeTool(tool);
            } else {
                this.selectItem(tool);
            }
        });
    }

    changeTool(toolName: string): void {
        const selectedTool = this.tools.get(toolName);
        if (selectedTool) {
            this.currentTool = selectedTool;
        }
    }

    selectItem(toolName: string): void {
        switch (toolName) {
            case this.sidebarElements.NEW_DRAWING_NAME:
                this.newDrawingService.openWarning();
                break;
            case this.sidebarElements.CAROUSEL_NAME:
                this.dialog.open(CarouselComponent);
                break;
            case this.sidebarElements.SAVE_SERVER_NAME:
                this.dialog.open(SavingComponent);
                break;
        }
    }

    getCurrentToolName(): string {
        return this.currentTool.name;
    }
}
