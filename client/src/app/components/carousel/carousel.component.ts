import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { LoadSelectedDrawingAlertComponent } from '@app/components/load-selected-drawing-alert/load-selected-drawing-alert.component';
import { MAX_NUMBER_VISIBLE_DRAWINGS } from '@app/ressources/global-variables/global-variables';
import { CarouselService } from '@app/services/carousel/carousel.service';
import { DatabaseService } from '@app/services/database/database.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DBData } from '@common/communication/drawing-data';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent {
    databaseMetadata: DBData[] = [];
    gotImages: boolean = false;
    isOpenButtonDisabled: boolean = false;
    visibleDrawingsIndexes: number[] = [];
    visible: boolean = true;
    name: string = '';
    drawingOfInterest: number = 0;
    selectable: boolean = true;
    removable: boolean = true;
    addOnBlur: boolean = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    tags: string[] = [];
    IMAGE_BASE_PATH: string = 'http://localhost:3000/api/database/getDrawingPng/';

    constructor(
        public databaseService: DatabaseService,
        public dialog: MatDialog,
        public carouselService: CarouselService,
        public drawingService: DrawingService,
    ) {
        this.loadDBData();
    }

    loadDBData(): void {
        this.gotImages = false;
        this.databaseMetadata = [];
        this.visibleDrawingsIndexes = [];
        this.databaseService.getAllDBData().subscribe((dBData: DBData[]) => {
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
        if (!this.drawingService.isCanvasBlank(this.drawingService.baseCtx)) {
            const test = this.dialog.open(LoadSelectedDrawingAlertComponent);
            test.afterClosed().subscribe((optionChosen: string) => {
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

    applySelectedDrawing(index: number): void {
        this.databaseService.getDrawingPng(this.databaseMetadata[index].fileName).subscribe((image: Blob) => {
            const img = URL.createObjectURL(image);
            const drawing = new Image();
            drawing.src = img;
            drawing.onload = () => {
                this.drawingService.canvas.width = drawing.width;
                this.drawingService.canvas.height = drawing.height;
                this.drawingService.baseCtx.drawImage(drawing, 0, 0, drawing.width, drawing.height);
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
        this.databaseService.deleteDrawing(fileName).subscribe(
            () => {
                this.loadDBData();
            },
            () => {
                // this.dialog.open(ErrorAlertComponent);
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
}
