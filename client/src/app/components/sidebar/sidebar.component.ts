import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarouselComponent } from '@app/components/carousel/carousel.component';
import { ExportComponent } from '@app/components/export/export.component';
import { SavingComponent } from '@app/components/saving/saving.component';
import { UserGuideComponent } from '@app/components/userguide/user-guide.component';
import { TOOLTIP_DELAY } from '@app/ressources/global-variables/global-variables';
import { SidebarElementTooltips, SIDEBAR_ELEMENT_TOOLTIPS } from '@app/ressources/global-variables/sidebar-element-tooltips';
import { ToolNames, TOOL_NAMES, TOOL_NAMES_ARRAY } from '@app/ressources/global-variables/tool-names';
import { HotkeyService } from '@app/services/hotkey/hotkey.service';
import { NewDrawingService } from '@app/services/new-drawing/new-drawing.service';
import { ToolSelectionService } from '@app/services/tool-selection/tool-selection.service';
import { SquareSelectionService } from '@app/services/tools/selection-services/square-selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, AfterViewInit {
    @ViewChild('undo', { read: ElementRef }) undoButton: ElementRef;
    @ViewChild('redo', { read: ElementRef }) redoButton: ElementRef;
    elementDescriptions: SidebarElementTooltips = SIDEBAR_ELEMENT_TOOLTIPS;
    tooltipShowDelay: number = TOOLTIP_DELAY;
    toolNames: ToolNames = TOOL_NAMES;
    selectedTool: string = this.toolNames.PENCIL_TOOL_NAME;

    constructor(
        public toolSelectionService: ToolSelectionService,
        public dialog: MatDialog,
        public newDrawingService: NewDrawingService,
        public undoRedoService: UndoRedoService,
        public hotkeyService: HotkeyService,
        public squareSelectionService: SquareSelectionService,
    ) {}

    ngOnInit(): void {
        this.hotkeyService.getKey().subscribe((tool) => {
            if (TOOL_NAMES_ARRAY.includes(tool)) {
                this.selectedTool = tool;
            }
        });
    }

    ngAfterViewInit(): void {
        this.undoRedoService.getUndoAvailability().subscribe((value) => {
            if (value) {
                this.undoButton.nativeElement.style.cursor = 'pointer';
                this.undoButton.nativeElement.style.opacity = '1';
            } else {
                this.undoButton.nativeElement.style.cursor = 'not-allowed';
                this.undoButton.nativeElement.style.opacity = '0.5';
            }
        });

        this.undoRedoService.getRedoAvailability().subscribe((value) => {
            if (value) {
                this.redoButton.nativeElement.style.cursor = 'pointer';
                this.redoButton.nativeElement.style.opacity = '1';
            } else {
                this.redoButton.nativeElement.style.cursor = 'not-allowed';
                this.redoButton.nativeElement.style.opacity = '0.5';
            }
        });
    }

    onToolChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (target.value != undefined) {
            this.toolSelectionService.changeTool(target.value);
        }
    }

    selectAll(): void {
        this.toolSelectionService.selectAll();
    }

    openUserguide(): void {
        this.dialog.open(UserGuideComponent);
    }

    openDialog(): void {
        this.newDrawingService.openWarningModal();
    }

    openSaveWindow(): void {
        this.dialog.open(SavingComponent);
    }
    openCarouselWindow(): void {
        this.dialog.open(CarouselComponent);
    }
    openExportWindow(): void {
        this.dialog.open(ExportComponent);
    }
}
