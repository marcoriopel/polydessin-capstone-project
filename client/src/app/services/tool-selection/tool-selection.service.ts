import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Tool } from '@app/classes/tool';
import { CarouselComponent } from '@app/components/carousel/carousel.component';
import { SavingComponent } from '@app/components/saving/saving.component';
import { SidebarElements, SIDEBAR_ELEMENTS } from '@app/ressources/global-variables/sidebar-elements';
import { TOOL_NAMES } from '@app/ressources/global-variables/tool-names';
import { HotkeyService } from '@app/services/hotkey/hotkey.service';
import { NewDrawingService } from '@app/services/new-drawing/new-drawing.service';
import { BrushService } from '@app/services/tools/brush.service';
import { CircleService } from '@app/services/tools/circle.service';
import { EraserService } from '@app/services/tools/eraser.service';
import { FillService } from '@app/services/tools/fill.service';
import { LineService } from '@app/services/tools/line.service';
import { PencilService } from '@app/services/tools/pencil.service';
import { SquareService } from '@app/services/tools/square.service';

@Injectable({
    providedIn: 'root',
})
export class ToolSelectionService {
    sidebarElements: SidebarElements = SIDEBAR_ELEMENTS;
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
            [TOOL_NAMES.PENCIL_TOOL_NAME, pencilService],
            [TOOL_NAMES.BRUSH_TOOL_NAME, brushService],
            [TOOL_NAMES.SQUARE_TOOL_NAME, squareService],
            [TOOL_NAMES.CIRCLE_TOOL_NAME, circleService],
            [TOOL_NAMES.LINE_TOOL_NAME, lineService],
            [TOOL_NAMES.FILL_TOOL_NAME, fillService],
            [TOOL_NAMES.ERASER_TOOL_NAME, eraserService],
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

    setCurrentToolCursor(): void {
        this.currentTool.setCursor();
    }

    currentToolKeyUp(event: KeyboardEvent): void {
        this.currentTool.onKeyUp(event);
    }

    currentToolKeyDown(event: KeyboardEvent): void {
        this.currentTool.onKeyDown(event);
    }

    currentToolMouseMove(event: MouseEvent): void {
        this.currentTool.onMouseMove(event);
    }

    currentToolMouseDown(event: MouseEvent): void {
        this.currentTool.onMouseDown(event);
    }

    currentToolMouseUp(event: MouseEvent): void {
        this.currentTool.onMouseUp(event);
    }

    currentToolMouseLeave(): void {
        this.currentTool.onMouseLeave();
    }
}
