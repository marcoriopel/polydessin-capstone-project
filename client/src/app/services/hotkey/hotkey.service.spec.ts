/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { HotkeyService } from './hotkey.service';

describe('Service: Hotkey', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [HotkeyService],
        });
    });

    it('should ...', inject([HotkeyService], (service: HotkeyService) => {
        expect(service).toBeTruthy();
    }));
});
