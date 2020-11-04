/* tslint:disable:no-unused-variable */
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { CarouselComponent } from '@app/components//carousel/carousel.component';
import { LoadSelectedDrawingAlertComponent } from '@app/components/load-selected-drawing-alert/load-selected-drawing-alert.component';
import { DatabaseService } from '@app/services/database/database.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { HotkeyService } from '@app/services/hotkey/hotkey.service';
import { ResizeDrawingService } from '@app/services/resize-drawing/resize-drawing.service';
import { ServerResponseService } from '@app/services/server-response/server-response.service';
import { DBData } from '@common/communication/drawing-data';
import { of, Subject } from 'rxjs';

import SpyObj = jasmine.SpyObj;

describe('CarouselComponent', () => {
    let component: CarouselComponent;
    let fixture: ComponentFixture<CarouselComponent>;
    let resizeDrawingServiceSpy: SpyObj<ResizeDrawingService>;
    let databaseServiceSpy: SpyObj<DatabaseService>;
    let matDialogSpy: SpyObj<MatDialog>;
    let hotkeyServiceSpy: SpyObj<HotkeyService>;
    let drawingServiceSpy: SpyObj<DrawingService>;
    let dBDataObservable: Subject<DBData[]>;
    let keyboardEvent: KeyboardEvent;
    let imageObservable: Subject<Blob>;
    let deleteDrawingObservable: Subject<void>;
    let baseCtxSpy: SpyObj<CanvasRenderingContext2D>;
    let serverResponseServiceSpy: SpyObj<ServerResponseService>;
    let routerSpy: SpyObj<RouterTestingModule>;
    beforeEach(async(() => {
        serverResponseServiceSpy = jasmine.createSpyObj('ServerResponseService', ['deleteErrorSnackBar', 'loadErrorSnackBar']);
        resizeDrawingServiceSpy = jasmine.createSpyObj('ResizeDrawingService', ['resizeCanvasSize']);
        hotkeyServiceSpy = jasmine.createSpyObj('HotkeyService', ['onKeyDown', 'getKey']);
        matDialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll', 'open']);
        databaseServiceSpy = jasmine.createSpyObj('DatabaseService', ['getAllDBData', 'getDrawingPng', 'deleteDrawing']);
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['isCanvasBlank']);
        dBDataObservable = new Subject<DBData[]>();
        imageObservable = new Subject<Blob>();
        deleteDrawingObservable = new Subject<void>();
        baseCtxSpy = jasmine.createSpyObj('CanvasRenderingContext2D', ['drawImage']);
        drawingServiceSpy.baseCtx = baseCtxSpy;
        databaseServiceSpy.getAllDBData.and.returnValue(dBDataObservable.asObservable());
        databaseServiceSpy.getDrawingPng.and.returnValue(imageObservable.asObservable());
        databaseServiceSpy.deleteDrawing.and.returnValue(deleteDrawingObservable.asObservable());
        TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            declarations: [CarouselComponent],
            imports: [HttpClientModule, MatDialogModule, RouterTestingModule],
            providers: [
                { provide: ServerResponseService, useValue: serverResponseServiceSpy },
                { provide: HotkeyService, useValue: hotkeyServiceSpy },
                { provide: DatabaseService, useValue: databaseServiceSpy },
                { provide: ResizeDrawingService, useValue: resizeDrawingServiceSpy },
                { provide: MatDialog, useValue: matDialogSpy },
                { provide: DrawingService, useValue: drawingServiceSpy },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CarouselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        routerSpy = spyOn(component.router, 'navigateByUrl');
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should disable the check of arrow presses on disableEvents call', () => {
        component.isArrowEventsChecked = true;
        component.disableEvents();
        expect(component.isArrowEventsChecked).toEqual(false);
    });

    it('should enable the check of arrow presses on enableEvents call', () => {
        component.isArrowEventsChecked = false;
        component.enableEvents();
        expect(component.isArrowEventsChecked).toEqual(true);
    });

    it('should call previous click with arrow event activated and left arrow press', () => {
        component.isArrowEventsChecked = true;
        keyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        const previousSpy = spyOn(component, 'onPreviousClick');
        component.onKeyDown(keyboardEvent);
        expect(previousSpy).toHaveBeenCalled();
    });

    it('should call next click with arrow event activated and right arrow press', () => {
        component.isArrowEventsChecked = true;
        keyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        const nextSpy = spyOn(component, 'onNextClick');
        component.onKeyDown(keyboardEvent);
        expect(nextSpy).toHaveBeenCalled();
    });

    it('should not call arrow event if arrow event is false', () => {
        component.isArrowEventsChecked = false;
        keyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        const nextSpy = spyOn(component, 'onNextClick');
        component.onKeyDown(keyboardEvent);
        expect(nextSpy).not.toHaveBeenCalled();
    });

    it('should manage drawings after dbdata load', () => {
        const DBDATA: DBData = { id: 'test', name: 'meta', tags: ['tag'], fileName: 'filename' };
        const manageSpy = spyOn(component, 'manageShownDrawings');
        dBDataObservable.next([DBDATA, DBDATA]);
        expect(manageSpy).toHaveBeenCalled();
        expect(component.databaseMetadata).toEqual([DBDATA, DBDATA]);
    });

    it('should return true if dbdata tags is array', () => {
        const DBDATA: DBData = { id: 'test', name: 'meta', tags: ['tag', 'tag2'], fileName: 'filename' };
        const answer = component.isArray(DBDATA);
        expect(answer).toEqual(true);
    });

    it('should return false if dbdata tags is not an array', () => {
        const DBDATA: DBData = { id: 'test', name: 'meta', tags: {} as string[], fileName: 'filename' };
        const answer = component.isArray(DBDATA);
        expect(answer).toEqual(false);
    });

    it('should add only 3 drawings visible even if there is more available', () => {
        const DBDATA: DBData = { id: 'test', name: 'meta', tags: ['tag', 'tag2'], fileName: 'filename' };
        component.databaseMetadata = [DBDATA, DBDATA, DBDATA, DBDATA, DBDATA];
        component.manageShownDrawings();
        // tslint:disable-next-line: no-magic-numbers
        expect(component.visibleDrawingsIndexes.length).toEqual(3);
    });

    it('should load drawing if there are 2 visible drawings and we click on interest', () => {
        const DBDATA: DBData = { id: 'test', name: 'meta', tags: ['tag', 'tag2'], fileName: 'filename' };
        const loadSpy = spyOn(component, 'loadSelectedDrawing');
        component.drawingOfInterest = 1;
        component.databaseMetadata = [DBDATA, DBDATA];
        component.onPreviewClick(1);
        expect(loadSpy).toHaveBeenCalled();
    });

    it('should call onClickTwoDrawings drawing if there are 2 visible drawings and we click other drawing', () => {
        const DBDATA: DBData = { id: 'test', name: 'meta', tags: ['tag', 'tag2'], fileName: 'filename' };
        const clickSpy = spyOn(component, 'onClickTwoDrawings');
        component.drawingOfInterest = 0;
        component.databaseMetadata = [DBDATA, DBDATA];
        component.onPreviewClick(1);
        expect(clickSpy).toHaveBeenCalled();
    });

    it('should call onPreviousClick drawing if there are 3 visible drawings and we click on first drawing', () => {
        const DBDATA: DBData = { id: 'test', name: 'meta', tags: ['tag', 'tag2'], fileName: 'filename' };
        const clickSpy = spyOn(component, 'onPreviousClick');
        component.drawingOfInterest = 1;
        component.databaseMetadata = [DBDATA, DBDATA, DBDATA];
        component.onPreviewClick(0);
        expect(clickSpy).toHaveBeenCalled();
    });

    it('should call onNextClick drawing if there are 3 visible drawings and we click on third drawing', () => {
        const DBDATA: DBData = { id: 'test', name: 'meta', tags: ['tag', 'tag2'], fileName: 'filename' };
        const clickSpy = spyOn(component, 'onNextClick');
        component.drawingOfInterest = 1;
        component.databaseMetadata = [DBDATA, DBDATA, DBDATA];
        component.onPreviewClick(2);
        expect(clickSpy).toHaveBeenCalled();
    });

    it('should load drawing if there are 3 visible drawings and we click on interest', () => {
        const DBDATA: DBData = { id: 'test', name: 'meta', tags: ['tag', 'tag2'], fileName: 'filename' };
        const loadSpy = spyOn(component, 'loadSelectedDrawing');
        component.drawingOfInterest = 1;
        component.databaseMetadata = [DBDATA, DBDATA, DBDATA];
        component.onPreviewClick(1);
        expect(loadSpy).toHaveBeenCalled();
    });

    it('should apply drawing if canvas is empty', () => {
        drawingServiceSpy.isCanvasBlank.and.returnValue(true);
        const applySpy = spyOn(component, 'applySelectedDrawing');
        component.loadSelectedDrawing(1);
        expect(applySpy).toHaveBeenCalled();
    });

    it('should apply drawing if canvas is not empty and user overwrites', () => {
        drawingServiceSpy.isCanvasBlank.and.returnValue(false);
        const applySpy = spyOn(component, 'applySelectedDrawing');
        const loadAlertSpy = matDialogSpy.open.and.returnValue({ afterClosed: () => of('Oui') } as MatDialogRef<LoadSelectedDrawingAlertComponent>);
        component.loadSelectedDrawing(1);

        expect(loadAlertSpy).toHaveBeenCalled();
        expect(applySpy).toHaveBeenCalled();
    });

    it('should draw drawing', () => {
        const DBDATA: DBData = { id: 'test', name: 'meta', tags: ['tag', 'tag2'], fileName: 'filename' };
        const drawSpy = spyOn(component, 'drawImageOnCanvas');
        component.drawingOfInterest = 1;
        component.databaseMetadata = [DBDATA, DBDATA, DBDATA];
        const image = new Blob();
        component.applySelectedDrawing(1);
        imageObservable.next(image);

        expect(drawSpy).toHaveBeenCalled();
    });

    it('should load error snackbar on error', () => {
        const DBDATA: DBData = { id: 'test', name: 'meta', tags: ['tag', 'tag2'], fileName: 'filename' };
        component.drawingOfInterest = 1;
        component.databaseMetadata = [DBDATA, DBDATA, DBDATA];
        component.applySelectedDrawing(1);
        imageObservable.error('Error');
        expect(serverResponseServiceSpy.loadErrorSnackBar).toHaveBeenCalled();
    });

    it('should set route to editor if called from home', () => {
        component.currentRoute = '/home';
        const DBDATA: DBData = { id: 'test', name: 'meta', tags: ['tag', 'tag2'], fileName: 'filename' };
        component.drawingOfInterest = 1;
        component.databaseMetadata = [DBDATA, DBDATA, DBDATA];
        component.applySelectedDrawing(1);
        imageObservable.error('Error');
        expect(serverResponseServiceSpy.loadErrorSnackBar).toHaveBeenCalled();
        expect(routerSpy).toHaveBeenCalled();
    });

    // it('should drawImageOnCanvas', async (done) => {
    //     // const spy = spyOn(component, 'drawImageOnCanvas').and.callThrough();
    //     // const DBDATA: DBData = { id: 'test', name: 'meta', tags: ['tag', 'tag2'], fileName: 'filename' };
    //     // component.drawingOfInterest = 1;
    //     // component.databaseMetadata = [DBDATA, DBDATA, DBDATA];
    //     // const image = new Blob();
    //     // component.applySelectedDrawing(1);
    //     // imageObservable.next(image);
    //     // expect(spy).toHaveBeenCalled();
    //     // expect(baseCtxSpy.drawImage).toHaveBeenCalled();
    //     const image = new Image();
    //     const img = URL.createObjectURL(image);
    //     const spy = spyOn(component, 'drawImageOnCanvas').and.callThrough();
    //     await component.drawImageOnCanvas(img).then(() => {
    //         done();
    //     });
    //     expect(baseCtxSpy.drawImage).toHaveBeenCalled();
    //     expect(spy).toHaveBeenCalled();
    // });

    it('should delete drawing on delete call', () => {
        const DBDATA: DBData = { id: 'test', name: 'meta', tags: ['tag', 'tag2'], fileName: 'filename' };
        const loadDBSpy = spyOn(component, 'loadDBData');
        component.drawingOfInterest = 1;
        component.visibleDrawingsIndexes.push(1);
        component.visibleDrawingsIndexes.push(1);
        component.databaseMetadata = [DBDATA, DBDATA, DBDATA];
        component.deleteDrawing();
        deleteDrawingObservable.next();
        expect(loadDBSpy).toHaveBeenCalled();
    });

    it('should send delete snackBar on bad delete call', () => {
        const DBDATA: DBData = { id: 'test', name: 'meta', tags: ['tag', 'tag2'], fileName: 'filename' };
        component.drawingOfInterest = 1;
        component.visibleDrawingsIndexes.push(1);
        component.visibleDrawingsIndexes.push(1);
        component.databaseMetadata = [DBDATA, DBDATA, DBDATA];
        component.deleteDrawing();
        deleteDrawingObservable.error('err');
        expect(serverResponseServiceSpy.deleteErrorSnackBar).toHaveBeenCalled();
    });

    it('should switch target drawing to second on second click', () => {
        const DBDATA: DBData = { id: 'test', name: 'meta', tags: ['tag', 'tag2'], fileName: 'filename' };
        component.drawingOfInterest = 0;
        component.databaseMetadata = [DBDATA, DBDATA];
        component.onClickTwoDrawings();
        expect(component.drawingOfInterest).toEqual(1);
    });

    it('should switch target drawing to first on first click', () => {
        const DBDATA: DBData = { id: 'test', name: 'meta', tags: ['tag', 'tag2'], fileName: 'filename' };
        component.drawingOfInterest = 1;
        component.databaseMetadata = [DBDATA, DBDATA];
        component.onClickTwoDrawings();
        expect(component.drawingOfInterest).toEqual(0);
    });

    it('should switch drawings left on previous click with 4 drawings', () => {
        const DBDATA: DBData = { id: 'test', name: 'meta', tags: ['tag', 'tag2'], fileName: 'filename' };
        component.drawingOfInterest = 1;
        component.databaseMetadata = [DBDATA, DBDATA, DBDATA, DBDATA];
        // tslint:disable-next-line: no-magic-numbers
        component.visibleDrawingsIndexes = [1, 2, 3];
        component.onPreviousClick();
        expect(component.visibleDrawingsIndexes).toEqual([0, 1, 2]);
    });

    it('should switch drawings left on previous click with 3 drawings', () => {
        const DBDATA: DBData = { id: 'test', name: 'meta', tags: ['tag', 'tag2'], fileName: 'filename' };
        component.drawingOfInterest = 1;
        component.databaseMetadata = [DBDATA, DBDATA, DBDATA];
        component.visibleDrawingsIndexes = [0, 1, 2];
        component.onPreviousClick();
        expect(component.visibleDrawingsIndexes).toEqual([2, 0, 1]);
    });

    it('should switch drawings right on next click', () => {
        const DBDATA: DBData = { id: 'test', name: 'meta', tags: ['tag', 'tag2'], fileName: 'filename' };
        component.drawingOfInterest = 1;
        component.databaseMetadata = [DBDATA, DBDATA, DBDATA];
        component.visibleDrawingsIndexes = [0, 1, 2];
        component.onNextClick();
        expect(component.visibleDrawingsIndexes).toEqual([1, 2, 0]);
    });

    it('should switch drawings right on next click with 4 drawings', () => {
        const DBDATA: DBData = { id: 'test', name: 'meta', tags: ['tag', 'tag2'], fileName: 'filename' };
        component.drawingOfInterest = 1;
        component.databaseMetadata = [DBDATA, DBDATA, DBDATA, DBDATA];
        component.visibleDrawingsIndexes = [0, 1, 2];
        component.onNextClick();
        // tslint:disable-next-line: no-magic-numbers
        expect(component.visibleDrawingsIndexes).toEqual([1, 2, 3]);
    });
});
