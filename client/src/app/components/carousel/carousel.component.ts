import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ViewChild } from '@angular/core';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { LoadSelectedDrawingAlertComponent } from '@app/components/load-selected-drawing-alert/load-selected-drawing-alert.component';
import { MAX_NAME_LENGTH, MAX_NUMBER_TAG, MAX_NUMBER_VISIBLE_DRAWINGS, MAX_TAG_LENGTH } from '@app/ressources/global-variables/global-variables';
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
    filteredMetadata: DBData[] = [];
    gotImages: boolean = false;
    isOpenButtonDisabled: boolean = false;
    visibleDrawingsIndexes: number[] = [];
    visible: boolean = true;
    currentTag: string = '';
    maxTags: boolean = false;
    name: string = '';
    drawingOfInterest: number = 0;
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
    @ViewChild('chipList') chipList: MatChipList;

    loadDBData(): void {
        this.gotImages = false;
        this.databaseMetadata = [];
        this.visibleDrawingsIndexes = [];
        this.filteredMetadata = [];
        this.databaseService.getAllDBData().subscribe((dBData: DBData[]) => {
            this.databaseMetadata = dBData;
            this.filteredMetadata = dBData;
            this.manageShownDrawings();
            this.gotImages = true;
        });
    }

    isArray(object: DBData): boolean {
        return Array.isArray(object.tags);
    }

    manageShownDrawings(): void {
        for (let i = 0; i < this.filteredMetadata.length; i++) {
            if (i >= MAX_NUMBER_VISIBLE_DRAWINGS) {
                break;
            }
            if (i === 1) {
                this.drawingOfInterest = i;
            }
            this.visibleDrawingsIndexes.push(i);
        }
        this.gotImages = true;
    }
    onPreviewClick(positionIndex: number): void {
        if (this.filteredMetadata.length === 2) {
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
        this.databaseService.getDrawingPng(this.filteredMetadata[index].fileName).subscribe((image: Blob) => {
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
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            if (this.tags.length < MAX_NUMBER_TAG) {
                if (value.length < MAX_TAG_LENGTH) {
                    this.tags.push(value.trim());
                }
            }
            if (this.tags.length === MAX_NUMBER_TAG) {
                this.maxTags = true;
            }
        }
        if (input) {
            input.value = '';
        }
        this.showDrawingsWithFilter();
    }

    removeTag(tags: string): void {
        const index = this.tags.indexOf(tags);
        if (index >= 0) {
            this.tags.splice(index, 1);
        }
        this.showDrawingsWithFilter();
    }

    showDrawingsWithFilter(): void {
        this.gotImages = false;
        this.filteredMetadata = [];
        this.visibleDrawingsIndexes = [];
        if (this.tags.length === 0) {
            this.filteredMetadata = this.databaseMetadata;
        }
        for (const data of this.databaseMetadata) {
            if (data.tags.length > 0) {
                if (Array.isArray(data.tags)) {
                    for (const tag of data.tags) {
                        if (this.tags.includes(tag)) {
                            this.filteredMetadata.push(data);
                            break;
                        }
                    }
                } else {
                    if (this.tags.includes(data.tags)) {
                        this.filteredMetadata.push(data);
                    }
                }
            }
        }
        this.manageShownDrawings();
    }

    deleteDrawing(): void {
        this.gotImages = false;
        let fileName: string = this.filteredMetadata[this.visibleDrawingsIndexes[0]].fileName;
        if (this.filteredMetadata.length > 1) {
            fileName = this.filteredMetadata[this.visibleDrawingsIndexes[this.drawingOfInterest]].fileName;
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
        if (this.filteredMetadata.length > 2) {
            this.visibleDrawingsIndexes[2] = this.visibleDrawingsIndexes[1];
        }
        this.visibleDrawingsIndexes[1] = this.visibleDrawingsIndexes[0];
        if (this.visibleDrawingsIndexes[0] === 0) {
            this.visibleDrawingsIndexes[0] = this.filteredMetadata.length - 1;
        } else {
            this.visibleDrawingsIndexes[0]--;
        }
    }

    onNextClick(): void {
        if (this.filteredMetadata.length > 2) {
            this.visibleDrawingsIndexes[0] = this.visibleDrawingsIndexes[1];
        }
        this.visibleDrawingsIndexes[1] = this.visibleDrawingsIndexes[2];
        if (this.visibleDrawingsIndexes[2] === this.filteredMetadata.length - 1) {
            this.visibleDrawingsIndexes[2] = 0;
        } else {
            this.visibleDrawingsIndexes[2]++;
        }
    }

    hasLengthTagError(tag: string): boolean {
        return tag.length > MAX_NAME_LENGTH;
    }

    hasTagError(tag: string): boolean {
        if (tag.indexOf(' ') < 0) {
            return false;
        } else {
            return true;
        }
    }

    currentTagInput(tag: string): void {
        this.currentTag = tag;
        if (tag.length > MAX_TAG_LENGTH || tag.indexOf(' ') >= 0) {
            this.chipList.errorState = true;
            this.chipList._markAsTouched();
        } else {
            this.chipList.errorState = false;
        }
    }
}
