import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { DatabaseService } from '@app/services/database/database.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DrawingData } from '@common/communication/drawing-data';

@Component({
    selector: 'app-saving',
    templateUrl: './saving.component.html',
    styleUrls: ['./saving.component.scss'],
})
export class SavingComponent {
    visible: boolean = true;
    name: string = '';
    selectable: boolean = true;
    removable: boolean = true;
    addOnBlur: boolean = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    tags: string[] = [];
    constructor(public databaseService: DatabaseService, public drawingService: DrawingService) {}

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
        const ID: string = new Date().getUTCMilliseconds() + '';
        const drawingURL: string = this.drawingService.baseCtx.canvas.toDataURL();
        const drawing: DrawingData = { id: ID, drawingPng: drawingURL, name: this.name, tags: this.tags };
        this.databaseService.addDrawing(drawing);
    }

    handleNameChange(name: string): void {
        this.name = name;
    }
}
