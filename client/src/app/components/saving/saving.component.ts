import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ErrorAlertComponent } from '@app/components/error-alert/error-alert.component';
import { CONFIRM_SAVED_DURATION, MAX_NAME_LENGTH, MAX_NUMBER_TAG, MAX_TAG_LENGTH } from '@app/ressources/global-variables/global-variables';
import { DatabaseService } from '@app/services/database/database.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MetaData } from '@common/communication/drawing-data';

@Component({
    selector: 'app-saving',
    templateUrl: './saving.component.html',
    styleUrls: ['./saving.component.scss'],
})
export class SavingComponent implements OnInit {
    isSaveButtonDisabled: boolean = false;
    visible: boolean = true;
    currentTag: string = '';
    name: string = '';
    maxTags: boolean = false;
    isLastTagInvalid: boolean = false;
    addOnBlur: boolean = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
    tags: string[] = [];
    ownerForm: FormGroup;
    constructor(
        public databaseService: DatabaseService,
        public drawingService: DrawingService,
        public snackBar: MatSnackBar,
        public dialog: MatDialog,
    ) {}
    @ViewChild('chipList') chipList: MatChipList;

    ngOnInit(): void {
        this.ownerForm = new FormGroup({
            name: new FormControl(this.name, [Validators.required, Validators.maxLength(MAX_NAME_LENGTH)]),
        });
    }
    currentTagInput(tag: string): void {
        this.chipList.errorState = false;
        if (tag.length > MAX_TAG_LENGTH) {
            this.chipList.errorState = true;
        }
        this.currentTag = tag;
        this.ownerForm.markAllAsTouched();
    }
    hasError(controlName: string, errorName: string): boolean {
        return this.ownerForm.controls[controlName].hasError(errorName);
    }

    addTag(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            if (this.tags.length < MAX_NUMBER_TAG) {
                if (value.length > MAX_TAG_LENGTH) {
                    this.isLastTagInvalid = true;
                } else {
                    this.tags.push(value.trim());
                    this.isLastTagInvalid = false;
                }
            }
            if (this.tags.length === MAX_NUMBER_TAG) {
                this.maxTags = true;
            }
        }
        if (input) {
            input.value = '';
        }
    }

    removeTag(tags: string): void {
        const index = this.tags.indexOf(tags);
        if (this.maxTags) this.maxTags = false;
        if (index >= 0) {
            this.tags.splice(index, 1);
        }
    }

    addDrawing(): void {
        this.isSaveButtonDisabled = true;
        this.drawingService.baseCtx.canvas.toBlob(async (blob) => {
            await blob;
            const ID: string = new Date().getUTCMilliseconds() + '';
            if (blob) {
                const meta: MetaData = { id: ID, name: this.name, tags: this.tags };
                this.databaseService.addDrawing(meta, blob).subscribe(
                    (data) => {
                        this.isSaveButtonDisabled = false;
                        this.saveConfirmMessage();
                    },
                    (error) => {
                        this.dialog.open(ErrorAlertComponent);
                    },
                );
            }
        });
    }

    changeName(name: string): void {
        this.name = name;
        this.ownerForm.markAllAsTouched();
    }

    saveConfirmMessage(): void {
        const config = new MatSnackBarConfig();
        config.duration = CONFIRM_SAVED_DURATION;
        this.snackBar.open('Le dessin a été sauvegardé', 'Fermer', config);
    }
}
