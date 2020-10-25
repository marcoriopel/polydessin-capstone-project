import { Vec2 } from './vec2';

export interface LineStroke {
    type: string;
    path: Vec2[];
    lineWidth: number;
    lineCap: string;
    pattern: string;
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
    secondarColor: string;
    mouseClicks: Vec2[];
    lineCap: string;
    lineWidth: number;
    startingPoint: Vec2;
    endingPoint: Vec2;
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
