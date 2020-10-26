import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { ErrorAlertComponent } from '@app/components/error-alert/error-alert.component';
import { DatabaseService } from '@app/services/database/database.service';
import { DrawingData } from '@common/communication/drawing-data';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent {
    gotImages: boolean = false;
    isOpenButtonDisabled: boolean = false;
    drawings: DrawingData[] = [];
    visibleDrawings: DrawingData[] = [];
    visibleDrawingsIndexes: number[] = [];
    visible: boolean = true;
    name: string = '';
    selectable: boolean = true;
    removable: boolean = true;
    addOnBlur: boolean = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    tags: string[] = [];

    constructor(public databaseService: DatabaseService, public dialog: MatDialog) {
        this.loadExistingDrawings();
    }

    addTag(event: MatChipInputEvent): void {
        console.log('hi');
    }

    removeTag(tags: string): void {
        console.log('bye');
    }

    deleteDrawing(): void {
        this.gotImages = false;
        let id: string = this.visibleDrawings[0].id;
        if (this.visibleDrawings.length > 1) {
            id = this.visibleDrawings[1].id;
        }
        this.databaseService.deleteDrawing(id).subscribe(
            (data) => {
                console.log(data);
                this.loadExistingDrawings();
            },
            (error) => {
                this.dialog.open(ErrorAlertComponent);
            },
        );
    }

    loadExistingDrawings(): void {
        this.gotImages = false;
        this.drawings = [];
        this.visibleDrawings = [];
        this.visibleDrawingsIndexes = [];
        let numberDrawings = 0;
        this.databaseService.getDrawingData().subscribe((drawingData: DrawingData[]) => {
            drawingData.forEach((element: DrawingData) => {
                numberDrawings++;
                this.drawings.push(element);
            });
            this.manageNumberDrawings(numberDrawings);
        });
        this.gotImages = true;
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

    manageNumberDrawings(numberDrawings: number): void {
        if (numberDrawings >= 3) {
            for (let i = 0; i < 3; i++) {
                this.visibleDrawingsIndexes.push(i);
                this.visibleDrawings.push(this.drawings[i]);
            }
        } else if (numberDrawings >= 1) {
            for (let i = 0; i < numberDrawings; i++) {
                this.visibleDrawingsIndexes.push(i);
                this.visibleDrawings.push(this.drawings[i]);
            }
        }
    }
}
