import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { ErrorAlertComponent } from '@app/components/error-alert/error-alert.component';
import { LoadSelectedDrawingAlertComponent } from '@app/components/load-selected-drawing-alert/load-selected-drawing-alert.component';
import { MAX_NUMBER_VISIBLE_DRAWINGS } from '@app/ressources/global-variables/global-variables';
import { CarouselService } from '@app/services/carousel/carousel.service';
import { DatabaseService } from '@app/services/database/database.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DBData, DrawingData, ImageData } from '@common/communication/drawing-data';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent {
    databaseMetadata: DBData[] = [];
    gotImages: boolean = false;
    isOpenButtonDisabled: boolean = false;
    drawings: DrawingData[] = [];
    visibleDrawings: DrawingData[] = [];
    visibleDrawingsIndexes: number[] = [];
    imageData: ImageData[] = [];
    visible: boolean = true;
    name: string = '';
    selectable: boolean = true;
    removable: boolean = true;
    addOnBlur: boolean = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    tags: string[] = [];

    constructor(
        public databaseService: DatabaseService,
        public dialog: MatDialog,
        public carouselService: CarouselService,
        public drawingService: DrawingService,
    ) {
        this.loadfirstDrawings();
    }

    // code inspired from https://stackoverflow.com/questions/20958078/resize-a-base-64-image-in-javascript-without-using-canvas
    // and https://stackoverflow.com/questions/6501797/resize-image-proportionally-with-maxheight-and-maxwidth-constraints
    async resizedataURL(datas: string, maxWidth: number, maxHeight: number, imageId: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const img = document.createElement('img');

            img.onload = () => {
                const ratioX = maxWidth / img.width;
                const ratioY = maxHeight / img.height;
                const ratio = Math.min(ratioX, ratioY);
                const newWidth = img.width * ratio;
                const newHeight = img.height * ratio;
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

                canvas.width = newWidth;
                canvas.height = newHeight;

                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                const dataURI = canvas.toDataURL();

                resolve(dataURI);
            };

            img.src = datas;
        });
    }

    imageToCanvas(id: number): void {
        const img = new Image();
        img.onload = () => {
            this.drawingService.canvas.width = img.width;
            this.drawingService.canvas.height = img.height;

            this.drawingService.baseCtx.drawImage(img, 0, 0, img.width, img.height);
        };
        for (const image of this.imageData) {
            // need to change hardcode below
            if (image.id === this.visibleDrawings[1].id) {
                img.src = image.drawingPng;
            }
        }
    }

    loadSelectedDrawing(id: number): void {
        // need to change hardcode below
        if (id < 1) {
            this.onPreviousClick();
        } else if (id > 1) {
            this.onNextClick();
        } else {
            if (!this.drawingService.isCanvasBlank(this.drawingService.baseCtx)) {
                const test = this.dialog.open(LoadSelectedDrawingAlertComponent);
                test.afterClosed().subscribe((optionChosen: string) => {
                    if (optionChosen === 'Oui') {
                        this.imageToCanvas(id);
                        this.dialog.closeAll();
                    }
                });
            } else {
                this.imageToCanvas(id);
                this.dialog.closeAll();
            }
        }
    }

    loadfirstDrawings(): void {
        this.drawings = [];
        this.visibleDrawings = [];
        this.visibleDrawingsIndexes = [];
        this.gotImages = false;
        this.databaseService.getAllDBData().subscribe((data: DBData[]) => {
            if (data.length === 0) {
                this.gotImages = true;
            }
            for (const element of data) {
                this.databaseService.getDrawingPng(element.fileName).subscribe((image: Blob) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(image);
                    reader.onload = async () => {
                        let imageURL: string = reader.result as string;
                        imageURL = imageURL.replace('data:application/octet-stream', 'data:image/png');
                        this.imageData.push({ id: element.id, drawingPng: imageURL });
                        const imageResized = await this.resizedataURL(imageURL, 200, 200, element.id);
                        const image2 = new Image();
                        image2.src = imageResized;
                        const drawingElement: DrawingData = {
                            id: element.id,
                            drawingPng: imageResized,
                            name: element.name,
                            tags: element.tags,
                            fileName: element.fileName,
                        };
                        if (this.visibleDrawings.length === MAX_NUMBER_VISIBLE_DRAWINGS) {
                            this.drawings.push(drawingElement);
                        } else {
                            this.visibleDrawings.push(drawingElement);
                            this.visibleDrawingsIndexes.push(this.drawings.length);
                            this.drawings.push(drawingElement);
                        }
                        if (element === data[data.length - 1]) {
                            this.gotImages = true;
                        }
                    };
                });
            }
        });
    }

    loadAllDBData(): Observable<DBData[]> {
        this.databaseService.getAllDBData().subscribe((dBData: DBData[]) => {
            this.databaseMetadata = dBData;
        });
        return this.databaseService.getAllDBData();
    }
    addTag(event: MatChipInputEvent): void {
        console.log('hi');
    }

    removeTag(tags: string): void {
        console.log('bye');
    }

    deleteDrawing(): void {
        this.gotImages = false;
        let fileName: string = this.visibleDrawings[0].fileName;
        if (this.visibleDrawings.length > 1) {
            fileName = this.visibleDrawings[1].fileName;
        }
        this.databaseService.deleteDrawing(fileName).subscribe(
            () => {
                this.loadfirstDrawings();
            },
            () => {
                this.dialog.open(ErrorAlertComponent);
            },
        );
    }

    onPreviousClick(): void {
        if (this.drawings.length > 2) {
            this.visibleDrawings[2] = this.visibleDrawings[1];
            this.visibleDrawingsIndexes[2] = this.visibleDrawingsIndexes[1];
        }
        this.visibleDrawings[1] = this.visibleDrawings[0];
        this.visibleDrawingsIndexes[1] = this.visibleDrawingsIndexes[0];
        if (this.visibleDrawingsIndexes[0] === 0) {
            this.visibleDrawings[0] = this.drawings[this.drawings.length - 1];
            this.visibleDrawingsIndexes[0] = this.drawings.length - 1;
        } else {
            this.visibleDrawings[0] = this.drawings[this.visibleDrawingsIndexes[0] - 1];
            this.visibleDrawingsIndexes[0]--;
        }
    }

    onNextClick(): void {
        const tempdrawing = this.visibleDrawings[0];
        const tempindex = this.visibleDrawingsIndexes[0];
        this.visibleDrawings[0] = this.visibleDrawings[1];
        this.visibleDrawingsIndexes[0] = this.visibleDrawingsIndexes[1];
        if (this.drawings.length === 2) {
            this.visibleDrawings[1] = tempdrawing;
            this.visibleDrawingsIndexes[1] = tempindex;
        } else {
            this.visibleDrawings[1] = this.visibleDrawings[2];
            this.visibleDrawingsIndexes[1] = this.visibleDrawingsIndexes[2];

            if (this.visibleDrawingsIndexes[2] === this.drawings.length - 1) {
                this.visibleDrawings[2] = this.drawings[0];
                this.visibleDrawingsIndexes[2] = 0;
            } else {
                this.visibleDrawings[2] = this.drawings[this.visibleDrawingsIndexes[2] + 1];
                this.visibleDrawingsIndexes[2]++;
            }
        }
    }
}
