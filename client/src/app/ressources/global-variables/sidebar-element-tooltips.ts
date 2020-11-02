export interface SidebarElementTooltips {
    NEW_DRAWING_DESCRIPTION: string;
    PENCIL_TOOL_DESCRIPTION: string;
    BRUSH_TOOL_DESCRIPTION: string;
    SQUARE_TOOL_DESCRIPTION: string;
    CIRCLE_TOOL_DESCRIPTION: string;
    LINE_TOOL_DESCRIPTION: string;
    FILL_TOOL_DESCRIPTION: string;
    ERASER_TOOL_DESCRIPTION: string;
    PIPETTE_TOOL_DESCRIPTION: string;
    HELP_DESCRIPTION: string;
    UNDO_DESCRIPTION: string;
    REDO_DESCRIPTION: string;
    SAVE_DRAWING_DESCRIPTION: string;
    CAROUSEL_DESCRIPTION: string;
}

export const SIDEBAR_ELEMENT_TOOLTIPS: SidebarElementTooltips = {
    CAROUSEL_DESCRIPTION: 'Carroussel de dessin (Ctrl + G)',
    NEW_DRAWING_DESCRIPTION: 'Nouveau Dessin (Ctrl-O)',
    PENCIL_TOOL_DESCRIPTION: 'Crayon (C)',
    BRUSH_TOOL_DESCRIPTION: 'Pinceau (W)',
    SQUARE_TOOL_DESCRIPTION: 'Rectangle (1)',
    CIRCLE_TOOL_DESCRIPTION: 'Ellipse (2)',
    LINE_TOOL_DESCRIPTION: 'Ligne (L)',
    FILL_TOOL_DESCRIPTION: 'Sceau (B)',
    ERASER_TOOL_DESCRIPTION: 'Efface (E)',
    PIPETTE_TOOL_DESCRIPTION: 'Pipette (I)',
    HELP_DESCRIPTION: "Guide d'utilisation",
    UNDO_DESCRIPTION: 'Annuler (Ctrl-Z)',
    REDO_DESCRIPTION: 'Refaire (Ctrl-Shift-Z)',
    SAVE_DRAWING_DESCRIPTION: 'Sauvegarder dessin (Ctrl + S)',
};
