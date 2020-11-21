import { Vec2 } from './vec2';

export interface SelectionBox {
    startingPoint: Vec2;
    width: number;
    height: number;
}

export interface SelectionObject {
    selectionBox: SelectionBox;
    selectionImage: HTMLCanvasElement;
}
