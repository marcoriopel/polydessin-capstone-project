/* tslint:disable:no-unused-variable */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MetaData } from '@common/communication/drawing-data';
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

    it('should not return any message when sending a POST request (HttpClient called once)', () => {
        const meta: MetaData = { id: 'test', name: 'test', tags: [] };
        // subscribe to the mocked call
        // tslint:disable-next-line: no-empty
        service.addDrawing(meta, {} as Blob).subscribe(() => {}, fail);
        const req = httpMock.expectOne(baseUrl + '/addDrawing');
        expect(req.request.method).toBe('POST');
        // actually send the request
        req.flush(meta);
    });
});
