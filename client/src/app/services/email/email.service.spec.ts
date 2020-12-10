/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { EmailService } from './email.service';

describe('Service: EmailService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EmailService],
        });
    });

    it('should ...', inject([EmailService], (service: EmailService) => {
        expect(service).toBeTruthy();
    }));
});
