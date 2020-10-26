import { StraightLine } from './line';
import { Vec2 } from './vec2';

export interface Pencil {
    type: string;
    path: Vec2[];
    lineWidth: number;
    primaryColor: string;
    lineCap: string;
}

export interface Brush {
    type: string;
    path: Vec2[];
    lineWidth: number;
    lineCap: string;
    pattern: string;
    primaryColor: string;
}

export interface Eraser {
    type: string;
    path: Vec2[];
    lineWidth: number;
    lineCap: string;
    fillStyle: string;
    primaryColor: string;
}

// REFACTOR
export interface Shape {
    type: string;
    numberOfEdges: number;
    primaryColor: string;
    secondaryColor: string;
    lineWidth: number;
}

export interface Line {
    type: string;
    primaryColor: string;
    secondaryColor: string;
    mouseClicks: Vec2[];
    isDot: boolean;
    lineCap: string;
    lineWidth: number;
    line: StraightLine;
    storedLines: StraightLine[];
    isShiftDoubleClick: boolean;
    dotWidth: number;
}

export interface Resize {
    // TODO
    type: string;
    imageData: string;
}

export interface Fill {
    // TODO
    type: string;
    imageData: string;
}
