/* tslint:disable:no-unused-variable */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DrawingData } from '@common/communication/drawing-data';
import { DatabaseService } from './database.service';

describe('Service: Database', () => {
    let httpMock: HttpTestingController;
    let service: DatabaseService;
    let baseUrl: string;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(DatabaseService);
        httpMock = TestBed.inject(HttpTestingController);
        // BASE_URL is private so we need to access it with its name as a key
        // Try to avoid this syntax which violates encapsulation
        // tslint:disable: no-string-literal
        baseUrl = service['BASE_URL'];
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should return expected message (HttpClient called once)', () => {
        const expectedMessage: DrawingData[] = [{ id: '5', drawingPng: 'thisisthepng', name: 'drawingtest', tags: ['one'] }];

        // check the content of the mocked call
        service.getDrawingData().subscribe((response: DrawingData[]) => {
            expect(response[0].id).toEqual(expectedMessage[0].id, 'id check');
            expect(response[0].drawingPng).toEqual(expectedMessage[0].drawingPng, 'png check');
            expect(response[0].name).toEqual(expectedMessage[0].name, 'name check');
            expect(response[0].tags).toEqual(expectedMessage[0].tags, 'tags check');
        }, fail);

        const req = httpMock.expectOne(baseUrl + '/getDrawingData');
        expect(req.request.method).toBe('GET');
        // actually send the request
        req.flush(expectedMessage);
    });
});
