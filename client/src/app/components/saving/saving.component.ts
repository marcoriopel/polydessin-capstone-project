import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ErrorAlertComponent } from '@app/components/error-alert/error-alert.component';
import { DatabaseService } from '@app/services/database/database.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DrawingData } from '@common/communication/drawing-data';

@Component({
    selector: 'app-saving',
    templateUrl: './saving.component.html',
    styleUrls: ['./saving.component.scss'],
})
export class SavingComponent {
    isSaveButtonDisabled: boolean = false;
    visible: boolean = true;
    name: string = '';
    selectable: boolean = true;
    removable: boolean = true;
    addOnBlur: boolean = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    tags: string[] = [];
    constructor(
        public databaseService: DatabaseService,
        public drawingService: DrawingService,
        public snackBar: MatSnackBar,
        public dialog: MatDialog,
    ) {}

    addTag(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            this.tags.push(value.trim());
        }
        if (input) {
            input.value = '';
        }
    }

    removeTag(tags: string): void {
        const index = this.tags.indexOf(tags);

        if (index >= 0) {
            this.tags.splice(index, 1);
        }
    }

    addDrawing(): void {
        this.isSaveButtonDisabled = true;
        const ID: string = new Date().getUTCMilliseconds() + '';
        const drawingURL: string = this.drawingService.baseCtx.canvas.toDataURL();
        const drawing: DrawingData = { id: ID, drawingPng: drawingURL, name: this.name, tags: this.tags };
        this.databaseService.addDrawing(drawing).subscribe(
            (data) => {
                console.log(data);
                this.isSaveButtonDisabled = false;
                this.saveConfirmMessage();
            },
            (error) => {
                this.dialog.open(ErrorAlertComponent);
            },
        );
    }

    handleNameChange(name: string): void {
        this.name = name;
    }

    saveConfirmMessage(): void {
        const config = new MatSnackBarConfig();
        config.duration = 5000;
        this.snackBar.open('Le dessin a été sauvegardé', 'Fermer', config);
    }
}
