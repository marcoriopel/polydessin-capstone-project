import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DrawingData } from '@common/communication/drawing-data';

@Injectable({
    providedIn: 'root',
})
export class DatabaseService {
    private readonly BASE_URL: string = 'http://localhost:3000/api/database';

    constructor(private http: HttpClient) {}

    addDrawing(drawingData: DrawingData): void {
        this.http.post(this.BASE_URL + '/addDrawing', drawingData).subscribe(
            (data) => {},
            (error) => {},
        );
    }
}
