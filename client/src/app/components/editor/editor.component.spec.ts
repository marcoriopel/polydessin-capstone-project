import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { ResizeDrawingService } from '@app/services/resize-drawing/resize-drawing.service';
import { EditorComponent } from './editor.component';

describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let resizeDrawingStub: ResizeDrawingService;
    let style: CSSStyleDeclaration;

    beforeEach(async(() => {
        resizeDrawingStub = new ResizeDrawingService();

        TestBed.configureTestingModule({
            declarations: [EditorComponent, DrawingComponent, SidebarComponent],
            providers: [{ provide: ResizeDrawingService, useValue: resizeDrawingStub }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        style = {
            display: 'none',
        } as CSSStyleDeclaration;

        component.previewDiv = {
            style,
        } as HTMLDivElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set previewDiv display to block', () => {
        const canvasResizePoint = fixture.debugElement.nativeElement.querySelector('.canvasResizePoint');
        canvasResizePoint.dispatchEvent(new Event('mousedown'));
        expect(component.previewDiv.style.display).toEqual('block');
    });

    it('should call resizeDrawingService.onMouseDown', () => {
        const mouseEvent = {} as MouseEvent;
        const spy = spyOn(component.resizeDrawingService, 'onMouseDown');
        component.onMouseDown(mouseEvent);
        expect(spy).toHaveBeenCalledWith(mouseEvent);
    });

    it('should call resizeDrawingService.resizeCanvas on mousemove', () => {
        const spy = spyOn(component.resizeDrawingService, 'resizeCanvas');
        fixture.debugElement.nativeElement.dispatchEvent(new Event('mousemove'));
        expect(spy).toHaveBeenCalled();
    });
});
