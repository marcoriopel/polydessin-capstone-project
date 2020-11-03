import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DBData, ID_NAME, MetaData, NAME, TAGS_NAME } from '@common/communication/drawing-data';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class DatabaseService {
    private readonly BASE_URL: string = 'http://localhost:3000/api/database';

    constructor(private http: HttpClient) {}

    addDrawing(meta: MetaData, blob: Blob): Observable<any> {
        const formData = new FormData();
        formData.append(ID_NAME, meta.id);
        formData.append(NAME, meta.name);
        meta.tags.forEach((tag: string) => {
            formData.append(TAGS_NAME, tag);
        });
        formData.append('image', blob);
        return this.http.post<any>(this.BASE_URL + '/addDrawing', formData); // .pipe(catchError(this.handleError<string>('addDrawing')));
    }

    deleteDrawing(fileName: string): Observable<string> {
        return this.http.delete<string>(this.BASE_URL + '/deleteDrawing/' + fileName).pipe(catchError(this.handleError<string>('deleteDrawing')));
    }

    getDrawingData(): Observable<FormData[]> {
        return this.http.get<FormData[]>(this.BASE_URL + '/getDrawingData').pipe(catchError(this.handleError<FormData[]>('getDrawing')));
    }

    getAllDBData(): Observable<DBData[]> {
        return this.http.get<DBData[]>(this.BASE_URL + '/getDBData').pipe(catchError(this.handleError<DBData[]>('getAllDBData')));
    }
    getDrawingPng(filename: string): Observable<Blob> {
        return this.http
            .get<Blob>(this.BASE_URL + '/getDrawingPng/' + filename, { responseType: 'blob' as 'json' })
            .pipe(catchError(this.handleError<Blob>('getDrawingPng')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
