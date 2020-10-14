import { Component } from '@angular/core';
import { DatabaseService } from '@app/services/database/database.service';
import { DrawingData } from '@common/communication/drawing-data';

@Component({
    selector: 'app-saving',
    templateUrl: './saving.component.html',
    styleUrls: ['./saving.component.scss'],
})
export class SavingComponent {
    constructor(public databaseService: DatabaseService) {}

    addDrawing(): void {
        const ID: string = new Date().getUTCMilliseconds() + '';
        const drawing: DrawingData = { id: ID, drawingPng: 'string', name: 'string', tags: ['ss', 'sss'] };
        this.databaseService.addDrawing(drawing);
    }
}
