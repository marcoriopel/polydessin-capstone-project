import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
// import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ErrorAlertComponent } from '@app/components/error-alert/error-alert.component';
import { CONFIRM_SAVED_DURATION } from '@app/ressources/global-variables/global-variables';
import { DatabaseService } from '@app/services/database/database.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MetaData } from '@common/communication/drawing-data';

@Component({
    selector: 'app-saving',
    templateUrl: './saving.component.html',
    styleUrls: ['./saving.component.scss'],
})
export class SavingComponent implements AfterViewChecked, OnInit {
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
        // private cdRef: ChangeDetectorRef,
        public databaseService: DatabaseService,
        public drawingService: DrawingService,
        public snackBar: MatSnackBar,
        public dialog: MatDialog,
    ) {}
    @ViewChild('chipList') chipList: any;

    ngOnInit(): void {
        this.ownerForm = new FormGroup({
            name: new FormControl(this.name, [Validators.required, Validators.maxLength(15)]),
        });
    }

    ngAfterViewChecked(): void {
        // this.cdRef.detectChanges();
    }
    currentTagInput(tag: string): void {
        this.chipList.errorState = false;
        if (tag.length > 15) {
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
            if (this.tags.length < 5) {
                if (value.length > 15) {
                    this.isLastTagInvalid = true;
                } else {
                    this.tags.push(value.trim());
                    this.isLastTagInvalid = false;
                }
            }
            if (this.tags.length === 5) {
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
