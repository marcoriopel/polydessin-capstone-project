import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FILTER_STYLES } from '@app/ressources/global-variables/filter';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportComponent } from './export.component';

describe('ExportComponent', () => {
    let component: ExportComponent;
    let fixture: ComponentFixture<ExportComponent>;
    let drawingServiceStub: DrawingService;
    let canvasStub: HTMLCanvasElement;
    let filterCanvasStud: HTMLCanvasElement;
    let linkStud: HTMLAnchorElement;
    const WIDTH = 100;
    const HEIGHT = 100;

    beforeEach(async(() => {
        drawingServiceStub = {} as DrawingService;
        TestBed.configureTestingModule({
            declarations: [ExportComponent],
            providers: [{ provide: DrawingService, useValue: drawingServiceStub }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        linkStud = document.createElement('a');
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        canvasStub = canvas;

        const filter = document.createElement('canvas') as HTMLCanvasElement;
        filter.width = WIDTH;
        filter.height = HEIGHT;
        filterCanvasStud = filter;

        // tslint:disable-next-line: no-string-literal
        component['drawingService'].canvas = canvasStub;
        component.link = linkStud;
        component.filterCanvas = filterCanvasStud;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should change name', () => {
        const name = 'marie';
        component.changeName(name);
        expect(component.name).toEqual(name);
    });

    it('should change filter when changing the value', () => {
        const value = FILTER_STYLES.BLACK_AND_WHITE;
        const target = ({
            value,
        } as unknown) as HTMLInputElement;

        const event = ({
            target,
        } as unknown) as InputEvent;

        const filterName = component.differentFilter[value];
        const canvasWithFilter = component.drawingService.canvas;
        canvasWithFilter.style.filter = filterName;
        const url = canvasWithFilter.toDataURL();

        component.changeFilter(event);
        expect(component.imagesrc).toEqual(url);
    });

    it('should give the url of the filter canvas', () => {
        const value = 0;
        const target = ({
            value,
        } as unknown) as HTMLInputElement;

        const event = ({
            target,
        } as unknown) as InputEvent;

        const typeOfUrl = component.typeOfFile[value];
        const urlTest = component.filterCanvas.toDataURL(typeOfUrl);

        component.getImageUrl(event);
        expect(component.urlImage).toEqual(urlTest);
    });

    it('should call the function click when to export', () => {
        component.name = 'cercle';
        const clickSpy = spyOn(component.link, 'click');
        component.exportLocally();
        expect(clickSpy).toHaveBeenCalled();
    });
});
