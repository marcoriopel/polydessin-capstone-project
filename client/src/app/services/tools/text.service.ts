import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { HotkeyService } from '../hotkey/hotkey.service';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool implements OnDestroy, OnInit {
    text: string[] = [];
    index: number = 0;
    startingPoint: Vec2 = { x: 0, y: 0 };
    constructor(drawingService: DrawingService, public hotkeyService: HotkeyService) {
        super(drawingService);
    }

    ngOnInit(): void {
        this.hotkeyService.isHotkeyEnabled = false;
    }

    ngOnDestroy(): void {
        this.hotkeyService.isHotkeyEnabled = true;
    }

    onMouseDown(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        this.startingPoint = { x: mousePosition.x, y: mousePosition.y };
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'delete') {
        }
        this.text.push(event.key);
        console.log(this.text);
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.key === 'delete') {
            if (this.index !== 0) {
                --this.index;
            }
        } else {
            ++this.index;
        }
    }
}
