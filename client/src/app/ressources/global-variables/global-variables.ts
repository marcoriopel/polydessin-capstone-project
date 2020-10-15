// Global variables are stored here
export const MINIMUM_CANVAS_WIDTH = 250;
export const MINIMUM_CANVAS_HEIGHT = 250;
export const MINIMUM_WORKSPACE_WIDTH = 500;
export const MINIMUM_WORKSPACE_HEIGHT = 500;
export const HALF_RATIO = 0.5;
export const TOOLTIP_DELAY = 500;
export const MAXIMUM_DISTANCE_LINE_CONNECTION = 20;
export const DEGREES_180 = 180;
export const MAXIMUM_NUMBER_OF_COLORS = 10;
export const MAX_OPACITY = 100;
export const ONE_NEGATIVE_PIXEL = -1;
export const MAX_TOOL_WIDTH = 50;
export const MIN_TOOL_WIDTH = 1;
export const MAX_BORDER = 20;
export const MIN_BORDER = 1;
export const DASH_LENGTH = 5;
export const DASH_SPACE_LENGTH = 3;

export enum Quadrant {
    TOP_RIGHT = 0,
    TOP_LEFT = 1,
    BOTTOM_LEFT = 2,
    BOTTOM_RIGHT = 3,
}

export enum LineAngle {
    DEGREES_0 = 0,
    DEGREES_45 = 1,
    DEGREES_90 = 2,
    DEGREES_135 = 3,
    DEGREES_180 = 4,
    DEGREES_225 = 5,
    DEGREES_270 = 6,
    DEGREES_315 = 7,
}

export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}
