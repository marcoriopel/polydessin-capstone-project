import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoadSelectedDrawingAlertComponent } from '@app/components/load-selected-drawing-alert/load-selected-drawing-alert.component';
import { MAX_NUMBER_VISIBLE_DRAWINGS } from '@app/ressources/global-variables/global-variables';
import { DatabaseService } from '@app/services/database/database.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { HotkeyService } from '@app/services/hotkey/hotkey.service';
import { ResizeDrawingService } from '@app/services/resize-drawing/resize-drawing.service';
import { ServerResponseService } from '@app/services/server-response/server-response.service';
import { DBData } from '@common/communication/drawing-data';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit, OnDestroy {
    destroy$: Subject<boolean> = new Subject<boolean>();
    databaseMetadata: DBData[] = [];
    isArrowEventsChecked: boolean = true;
    gotImages: boolean = false;
    isOpenButtonDisabled: boolean = false;
    visibleDrawingsIndexes: number[] = [];
    name: string = '';
    drawingOfInterest: number = 0;
    selectable: boolean = true;
    removable: boolean = true;
    addOnBlur: boolean = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    tags: string[] = [];
    currentRoute: string;
    IMAGE_BASE_PATH: string = 'http://localhost:3000/api/database/getDrawingPng/';

    constructor(
        public router: Router,
        public hotkeyService: HotkeyService,
        public serverResponseService: ServerResponseService,
        public databaseService: DatabaseService,
        public dialog: MatDialog,
        public drawingService: DrawingService,
        public resizeDrawingService: ResizeDrawingService,
    ) {}

    ngOnInit(): void {
        this.hotkeyService.isHotkeyEnabled = false;
        this.loadDBData();
        this.currentRoute = this.router.url;
    }

    disableEvents(): void {
        this.isArrowEventsChecked = false;
    }

    enableEvents(): void {
        this.isArrowEventsChecked = true;
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (!this.isArrowEventsChecked) return;
        if (event.key === 'ArrowLeft') {
            this.onPreviousClick();
        } else if (event.key === 'ArrowRight') {
            this.onNextClick();
        }
    }

    loadDBData(): void {
        this.gotImages = false;
        this.databaseMetadata = [];
        this.visibleDrawingsIndexes = [];
        this.databaseService
            .getAllDBData()
            .pipe(takeUntil(this.destroy$))
            .subscribe((dBData: DBData[]) => {
                this.databaseMetadata = dBData;
                this.manageShownDrawings();
                this.gotImages = true;
            });
    }

    isArray(object: DBData): boolean {
        return Array.isArray(object.tags);
    }

    manageShownDrawings(): void {
        for (let i = 0; i < this.databaseMetadata.length; i++) {
            if (i >= MAX_NUMBER_VISIBLE_DRAWINGS) {
                break;
            }
            if (i === 1) {
                this.drawingOfInterest = i;
            }
            this.visibleDrawingsIndexes.push(i);
        }
    }
    onPreviewClick(positionIndex: number): void {
        if (this.databaseMetadata.length === 2) {
            if (positionIndex === this.drawingOfInterest) this.loadSelectedDrawing(positionIndex);
            else this.onClickTwoDrawings();
        } else {
            if (positionIndex < 1) {
                this.onPreviousClick();
            } else if (positionIndex > 1) {
                this.onNextClick();
            } else {
                this.loadSelectedDrawing(positionIndex);
            }
        }
    }

    loadSelectedDrawing(positionIndex: number): void {
        if (this.currentRoute !== '/home' && !this.drawingService.isCanvasBlank(this.drawingService.baseCtx)) {
            const loadDrawingAlert = this.dialog.open(LoadSelectedDrawingAlertComponent);
            loadDrawingAlert
                .afterClosed()
                .pipe(takeUntil(this.destroy$))
                .subscribe((optionChosen: string) => {
                    if (optionChosen === 'Oui') {
                        this.applySelectedDrawing(this.visibleDrawingsIndexes[positionIndex]);
                        this.dialog.closeAll();
                    }
                });
        } else {
            this.applySelectedDrawing(this.visibleDrawingsIndexes[positionIndex]);
            this.dialog.closeAll();
        }
    }

    async applySelectedDrawing(index: number): Promise<void> {
        if (this.currentRoute === '/home') {
            this.router.navigateByUrl('/editor');
            this.currentRoute = '/editor';
        }
        this.databaseService
            .getDrawingPng(this.databaseMetadata[index].fileName)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (image: Blob) => {
                    const img = URL.createObjectURL(image);
                    this.drawImageOnCanvas(img);
                },
                (error) => {
                    this.serverResponseService.loadErrorSnackBar();
                },
            );
    }

    async drawImageOnCanvas(image: string): Promise<void> {
        return new Promise<void>((resolve) => {
            const drawing = new Image();
            drawing.src = image;
            drawing.onload = () => {
                this.resizeDrawingService.resizeCanvasSize(drawing.width, drawing.height);
                this.drawingService.baseCtx.drawImage(drawing, 0, 0, drawing.width, drawing.height);
                resolve();
            };
        });
    }

    addTag(event: MatChipInputEvent): void {
        console.log('hi');
    }

    removeTag(tags: string): void {
        console.log('bye');
    }

    deleteDrawing(): void {
        this.gotImages = false;
        let fileName: string = this.databaseMetadata[this.visibleDrawingsIndexes[0]].fileName;
        if (this.databaseMetadata.length > 1) {
            fileName = this.databaseMetadata[this.visibleDrawingsIndexes[this.drawingOfInterest]].fileName;
        }
        this.databaseService
            .deleteDrawing(fileName)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (data) => {
                    this.loadDBData();
                },
                (error) => {
                    this.serverResponseService.deleteErrorSnackBar(error.error);
                    this.gotImages = true;
                },
            );
    }

    onClickTwoDrawings(): void {
        if (this.drawingOfInterest === 1) {
            this.drawingOfInterest = 0;
        } else {
            this.drawingOfInterest = 1;
        }
    }

    onPreviousClick(): void {
        if (this.databaseMetadata.length > 2) {
            this.visibleDrawingsIndexes[2] = this.visibleDrawingsIndexes[1];
        }
        this.visibleDrawingsIndexes[1] = this.visibleDrawingsIndexes[0];
        if (this.visibleDrawingsIndexes[0] === 0) {
            this.visibleDrawingsIndexes[0] = this.databaseMetadata.length - 1;
        } else {
            this.visibleDrawingsIndexes[0]--;
        }
    }

    onNextClick(): void {
        if (this.databaseMetadata.length > 2) {
            this.visibleDrawingsIndexes[0] = this.visibleDrawingsIndexes[1];
        }
        this.visibleDrawingsIndexes[1] = this.visibleDrawingsIndexes[2];
        if (this.visibleDrawingsIndexes[2] === this.databaseMetadata.length - 1) {
            this.visibleDrawingsIndexes[2] = 0;
        } else {
            this.visibleDrawingsIndexes[2]++;
        }
    }

    ngOnDestroy(): void {
        this.hotkeyService.isHotkeyEnabled = true;
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
