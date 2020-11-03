/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ServerResponseService } from './server-response.service';

xdescribe('Service: ServerResponse', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ServerResponseService],
        });
    });

    it('should ...', inject([ServerResponseService], (service: ServerResponseService) => {
        expect(service).toBeTruthy();
    }));
});
