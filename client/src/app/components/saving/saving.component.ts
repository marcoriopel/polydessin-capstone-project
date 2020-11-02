import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { CONFIRM_SAVED_DURATION, MAX_NAME_LENGTH, MAX_NUMBER_TAG, MAX_TAG_LENGTH } from '@app/ressources/global-variables/global-variables';
import { DatabaseService } from '@app/services/database/database.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { HotkeyService } from '@app/services/hotkey/hotkey.service';
import { MetaData } from '@common/communication/drawing-data';

@Component({
    selector: 'app-saving',
    templateUrl: './saving.component.html',
    styleUrls: ['./saving.component.scss'],
})
export class SavingComponent implements AfterViewChecked, OnInit, OnDestroy {
    isSaveButtonDisabled: boolean = false;
    currentTag: string = '';
    name: string = '';
    maxTags: boolean = false;
    isLastTagInvalid: boolean = false;
    addOnBlur: boolean = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
    tags: string[] = [];
    ownerForm: FormGroup;
    constructor(
        public hotkeyService: HotkeyService,
        public databaseService: DatabaseService,
        public drawingService: DrawingService,
        public snackBar: MatSnackBar,
        public dialog: MatDialog,
        private cdRef: ChangeDetectorRef,
    ) {}
    @ViewChild('chipList') chipList: MatChipList;

    ngOnInit(): void {
        this.ownerForm = new FormGroup({
            name: new FormControl(this.name, [Validators.required, Validators.maxLength(MAX_NAME_LENGTH)]),
            tags: new FormControl(this.currentTag, [Validators.maxLength(MAX_NAME_LENGTH)]),
        });
    }

    ngAfterViewChecked(): void {
        this.cdRef.detectChanges();
    }

    currentTagInput(tag: string): void {
        this.currentTag = tag;
        if (tag.length > MAX_TAG_LENGTH) {
            this.chipList.errorState = true;
            this.chipList._markAsTouched();
        } else {
            this.chipList.errorState = false;
        }
    }
    hasError(controlName: string, errorName: string): boolean {
        return this.ownerForm.controls[controlName].hasError(errorName);
    }

    hasTagError(tag: string): boolean {
        return tag.length > MAX_TAG_LENGTH;
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
            if (blob) {
                const ID: string = new Date().getUTCMilliseconds() + '';
                const meta: MetaData = { id: ID, name: this.name, tags: this.tags };
                this.databaseService.addDrawing(meta, blob).subscribe(
                    (data) => {
                        this.isSaveButtonDisabled = false;
                        this.saveConfirmMessage();
                    },
                    (error) => {
                        console.log(error);
                        this.isSaveButtonDisabled = false;
                        this.saveErrorModal();
                    },
                );
            }
        });
    }

    changeName(name: string): void {
        this.name = name;
        this.ownerForm.markAllAsTouched();
    }

    saveErrorModal(): void {
        this.dialog.afterAllClosed.subscribe(() => {
            const config = new MatSnackBarConfig();
            this.snackBar.open('Erreur dans la sauvegarde du dessin', 'Fermer', config);
        });
    }

    saveConfirmMessage(): void {
        this.dialog.afterAllClosed.subscribe(() => {
            const config = new MatSnackBarConfig();
            config.duration = CONFIRM_SAVED_DURATION;
            this.snackBar.open('Le dessin a été sauvegardé', 'Fermer', config);
        });
    }

    ngOnDestroy(): void {
        this.hotkeyService.isHotkeyEnabled = true;
    }
}
