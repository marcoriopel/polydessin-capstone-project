import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { DrawingService } from '../drawing/drawing.service';
import { ResizeDrawingService } from '../resize-drawing/resize-drawing.service';
import { SelectionService } from '../tools/selection-services/selection.service';
import { UndoRedoService } from './undo-redo.service';

fdescribe('UndoRedoService', () => {
    let service: UndoRedoService;
    let changeUndoAvailabilitySpy: jasmine.SpyObj<any>;
    let changeRedoAvailabilitySpy: jasmine.SpyObj<any>;
    // let drawElementSpy: jasmine.SpyObj<any>;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let resizeDrawingSpy: jasmine.SpyObj<ResizeDrawingService>;
    let selectionServiceSpy: jasmine.SpyObj<SelectionService>;
    let obs: Subject<boolean>;

    beforeEach(() => {
        obs = new Subject<boolean>();
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'getIsToolInUse']);
        drawingServiceSpy.getIsToolInUse.and.returnValue(obs.asObservable());
        resizeDrawingSpy = jasmine.createSpyObj('ResizeDrawingService', ['resizeCanvasSize']);
        selectionServiceSpy = jasmine.createSpyObj('SelectionService', ['reset', 'applyPreview', 'updateSelectionData']);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawingServiceSpy },
                { provide: ResizeDrawingService, useValue: resizeDrawingSpy },
                { provide: SelectionService, useValue: selectionServiceSpy },
            ],
        });
        service = TestBed.inject(UndoRedoService);

        changeUndoAvailabilitySpy = spyOn<any>(service, 'changeUndoAvailability');
        changeRedoAvailabilitySpy = spyOn<any>(service, 'changeRedoAvailability');
        // drawElementSpy = spyOn<any>(service, 'drawElement');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return if undo is unavailable', () => {
        service.setUndoAvailability(false);
        service.undo();
        expect(selectionServiceSpy.reset).toHaveBeenCalled();
        expect(changeRedoAvailabilitySpy).toHaveBeenCalled();
        expect(changeUndoAvailabilitySpy).toHaveBeenCalled();
        // expect(drawElementSpy).toHaveBeenCalled();
        // expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(resizeDrawingSpy.resizeCanvasSize).toHaveBeenCalled();
    });
});
