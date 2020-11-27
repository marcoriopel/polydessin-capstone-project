import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ALIGNMENT_NAMES } from '@app/ressources/global-variables/alignment-names';
import { MAGNETISM_NAME } from '@app/ressources/global-variables/global-variables';
import { HotkeyService } from '@app/services/hotkey/hotkey.service';
import { SquareSelectionService } from '@app/services/tools/selection-services/square-selection.service';
import { Subject } from 'rxjs';
import { SquareSelectionAttributesComponent } from './square-selection-attributes.component';
import SpyObj = jasmine.SpyObj;

describe('SqareSelectionAttributesComponent', () => {
    let component: SquareSelectionAttributesComponent;
    let fixture: ComponentFixture<SquareSelectionAttributesComponent>;
    let squareSelectionServiceSpy: jasmine.SpyObj<SquareSelectionService>;
    let hotkeyServiceSpy: SpyObj<HotkeyService>;
    let obs: Subject<string>;

    beforeEach(async(() => {
        squareSelectionServiceSpy = jasmine.createSpyObj('SquareSelectionService', ['enableMagnetism', 'setMagnetismAlignment']);
        hotkeyServiceSpy = jasmine.createSpyObj('HotkeyService', ['getKey']);
        obs = new Subject<string>();
        hotkeyServiceSpy.getKey.and.returnValue(obs.asObservable());

        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            declarations: [SquareSelectionAttributesComponent],
            providers: [
                { provide: SquareSelectionService, useValue: squareSelectionServiceSpy },
                { provide: HotkeyService, useValue: hotkeyServiceSpy },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SquareSelectionAttributesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should should enable magnetism on valid hotkey if it was not enabled', () => {
        component.isMagnetismEnabled = false;
        const enableGridMagnetismSpy = spyOn(component, 'enableGridMagnetism');
        hotkeyServiceSpy.getKey.and.returnValue(obs.asObservable());
        obs.next(MAGNETISM_NAME);
        expect(enableGridMagnetismSpy).toHaveBeenCalledWith(true);
    });

    it('should should disable magnetism on valid hotkey if it was enabled', () => {
        component.isMagnetismEnabled = true;
        const enableGridMagnetismSpy = spyOn(component, 'enableGridMagnetism');
        hotkeyServiceSpy.getKey.and.returnValue(obs.asObservable());
        obs.next(MAGNETISM_NAME);
        expect(enableGridMagnetismSpy).toHaveBeenCalledWith(false);
    });

    it('should not change magnetism if hotkey is invalid', () => {
        const enableGridMagnetismSpy = spyOn(component, 'enableGridMagnetism');
        hotkeyServiceSpy.getKey.and.returnValue(obs.asObservable());
        obs.next('invalid hotkey');
        expect(enableGridMagnetismSpy).not.toHaveBeenCalled();
    });

    it('should call circleSelection service enableMagnetism on enableMagnetism call', () => {
        component.enableGridMagnetism(true);
        expect(squareSelectionServiceSpy.enableMagnetism).toHaveBeenCalledWith(true);
    });

    it('should call circleSelection service enableMagnetism on enableMagnetism call', () => {
        component.enableGridMagnetism(true);
        expect(squareSelectionServiceSpy.enableMagnetism).toHaveBeenCalledWith(true);
    });

    it('should not change alignment an invalid event', () => {
        const value = undefined;
        const target = ({
            value,
        } as unknown) as HTMLInputElement;
        const event = ({
            target,
        } as unknown) as InputEvent;
        component.onAlignmentChange(event);
        expect(squareSelectionServiceSpy.setMagnetismAlignment).not.toHaveBeenCalled();
    });

    it('should change alignment a valid event', () => {
        const value = ALIGNMENT_NAMES.ALIGN_TOP_CENTER_NAME;
        const target = ({
            value,
        } as unknown) as HTMLInputElement;
        const event = ({
            target,
        } as unknown) as InputEvent;
        component.onAlignmentChange(event);
        expect(squareSelectionServiceSpy.setMagnetismAlignment).toHaveBeenCalled();
    });
});
