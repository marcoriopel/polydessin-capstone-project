import { SidebarElementDescriptions } from '@app/classes/sidebar-element-descriptions';
import { ToolNames } from '@app/classes/tool-names';

// Global variables are stored here
export const MINIMUM_CANVAS_WIDTH = 250;
export const MINIMUM_CANVAS_HEIGHT = 250;
export const MINIMUM_WORKSPACE_WIDTH = 500;
export const MINIMUM_WORKSPACE_HEIGHT = 500;
export const HALF_RATIO = 0.5;
export const TOOLTIP_DELAY = 1000;

export const TOOL_NAMES: ToolNames = {
    PENCIL_TOOL_NAME: 'Crayon',
    BRUSH_TOOL_NAME: 'Pinceau',
    SQUARE_TOOL_NAME: 'Rectangle',
    CIRCLE_TOOL_NAME: 'Ellipse',
    LINE_TOOL_NAME: 'Ligne',
    ERASER_TOOL_NAME: 'Efface',
};

export const SIDEBAR_ELEMENT_DESCRIPTIONS: SidebarElementDescriptions = {
    NEW_DRAWING_DESCRIPTION: 'Nouveau Dessin (Ctrl-O)',
    PENCIL_TOOL_DESCRIPTION: 'Crayon (C)',
    BRUSH_TOOL_DESCRIPTION: 'Pinceau (W)',
    SQUARE_TOOL_DESCRIPTION: 'Rectangle (1)',
    CIRCLE_TOOL_DESCRIPTION: 'Ellipse (2)',
    LINE_TOOL_DESCRIPTION: 'Ligne (L)',
    ERASER_TOOL_DESCRIPTION: 'Efface (E)',
    HELP_DESCRIPTION: "Guide d'utilisation",
    UNDO_DESCRIPTION: 'Annuler (Ctrl-Z)',
    REDO_DESCRIPTION: 'Refaire (Ctrl-Shift-Z)',
};

export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
};
