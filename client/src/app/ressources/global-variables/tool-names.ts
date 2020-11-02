export interface ToolNames {
    PENCIL_TOOL_NAME: string;
    BRUSH_TOOL_NAME: string;
    SQUARE_TOOL_NAME: string;
    CIRCLE_TOOL_NAME: string;
    LINE_TOOL_NAME: string;
    FILL_TOOL_NAME: string;
    ERASER_TOOL_NAME: string;
    PIPETTE_TOOL_NAME: string;
    SELECTION_TOOL_NAME: string;
}

export const TOOL_NAMES: ToolNames = {
    PENCIL_TOOL_NAME: 'Crayon',
    BRUSH_TOOL_NAME: 'Pinceau',
    SQUARE_TOOL_NAME: 'Rectangle',
    CIRCLE_TOOL_NAME: 'Ellipse',
    LINE_TOOL_NAME: 'Ligne',
    FILL_TOOL_NAME: 'Sceau',
    ERASER_TOOL_NAME: 'Efface',
    PIPETTE_TOOL_NAME: 'Pipette',
    SELECTION_TOOL_NAME: 'Selection',
};

export const TOOL_NAMES_ARRAY: string[] = [
    TOOL_NAMES.PENCIL_TOOL_NAME,
    TOOL_NAMES.BRUSH_TOOL_NAME,
    TOOL_NAMES.SQUARE_TOOL_NAME,
    TOOL_NAMES.CIRCLE_TOOL_NAME,
    TOOL_NAMES.LINE_TOOL_NAME,
    TOOL_NAMES.FILL_TOOL_NAME,
    TOOL_NAMES.ERASER_TOOL_NAME,
];
