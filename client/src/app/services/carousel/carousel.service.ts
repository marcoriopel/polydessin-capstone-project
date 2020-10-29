import { Injectable } from '@angular/core';
import { DatabaseService } from '@app/services/database/database.service';
import { DBData, DrawingData } from '@common/communication/drawing-data';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CarouselService {
    constructor(public databaseService: DatabaseService) {}

    cachedDrawings: DrawingData[] = [];
    databaseMetadata: DBData[] = [];
    shownDrawings: DrawingData[] = [];
    currentlyLoading: boolean = false;

    loadDrawingsInCache(): void {
        this.loadAllDBData().subscribe((data: DBData[]) => {
            data.forEach((element: DBData) => {
                this.loadDrawing(element);
            });
        });
    }

    loadDrawing(element: DBData): void {
        this.databaseService.getDrawingPng(element.fileName).subscribe(
            (file: Blob) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    let imageURL: string = reader.result as string;
                    imageURL = imageURL.replace('data:application/octet-stream', 'data:image/png');
                    const drawingElement: DrawingData = {
                        id: element.id,
                        drawingPng: imageURL,
                        name: element.name,
                        tags: element.tags,
                        fileName: element.fileName,
                    };
                    this.cachedDrawings.push(drawingElement);
                };
            },
            (error) => {
                console.log(error);
            },
        );
    }

    loadAllDBData(): Observable<DBData[]> {
        this.databaseService.getAllDBData().subscribe((dBData: DBData[]) => {
            this.databaseMetadata = dBData;
        });
        return this.databaseService.getAllDBData();
    }
}
