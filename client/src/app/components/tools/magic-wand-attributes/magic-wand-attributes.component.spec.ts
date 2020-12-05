/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ALIGNMENT_NAMES } from '@app/ressources/global-variables/alignment-names';
import { MAGNETISM_NAME } from '@app/ressources/global-variables/global-variables';
import { HotkeyService } from '@app/services/hotkey/hotkey.service';
import { MagicWandService } from '@app/services/tools/selection-services/magic-wand.service';
import { Subject } from 'rxjs';
import { MagicWandAttributesComponent } from './magic-wand-attributes.component';
import SpyObj = jasmine.SpyObj;

describe('MagicWandAttributesComponent', () => {
    let component: MagicWandAttributesComponent;
    let fixture: ComponentFixture<MagicWandAttributesComponent>;
    let magicWandServiceSpy: jasmine.SpyObj<MagicWandService>;
    let hotkeyServiceSpy: SpyObj<HotkeyService>;
    let obs: Subject<string>;

    beforeEach(async(() => {
        magicWandServiceSpy = jasmine.createSpyObj('MagicWandService', ['enableMagnetism', 'setMagnetismAlignment']);
        hotkeyServiceSpy = jasmine.createSpyObj('HotkeyService', ['getKey']);
        obs = new Subject<string>();
        hotkeyServiceSpy.getKey.and.returnValue(obs.asObservable());

        TestBed.configureTestingModule({
            declarations: [MagicWandAttributesComponent],
            providers: [
                { provide: MagicWandService, useValue: magicWandServiceSpy },
                { provide: HotkeyService, useValue: hotkeyServiceSpy },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MagicWandAttributesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should enable magnetism on valid hotkey if it was not enabled', () => {
        component.isMagnetismEnabled = false;
        const enableGridMagnetismSpy = spyOn(component, 'enableGridMagnetism');
        hotkeyServiceSpy.getKey.and.returnValue(obs.asObservable());
        obs.next(MAGNETISM_NAME);
        expect(enableGridMagnetismSpy).toHaveBeenCalledWith(true);
    });

    it('should disable magnetism on valid hotkey if it was enabled', () => {
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

    it('should call magicWand service enableMagnetism on enableMagnetism call', () => {
        component.enableGridMagnetism(true);
        expect(magicWandServiceSpy.enableMagnetism).toHaveBeenCalledWith(true);
    });

    it('should call magicWand service enableMagnetism on enableMagnetism call', () => {
        component.enableGridMagnetism(true);
        expect(magicWandServiceSpy.enableMagnetism).toHaveBeenCalledWith(true);
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
        expect(magicWandServiceSpy.setMagnetismAlignment).not.toHaveBeenCalled();
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
        expect(magicWandServiceSpy.setMagnetismAlignment).toHaveBeenCalled();
    });
});
