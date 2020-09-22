import { feature } from './feature';

export interface GroupFeature extends feature {
    dependance: feature[];
}

export const OTHER_FEATURES: feature[] = [
    { name: 'Grille et magnétisme', description: '..' },
    { name: 'Annuler-refaire', description: '..' },
    { name: 'Palette de couleur', description: 'couleur .. ' },
];

export const BASIC_TOOLS: feature[] = [
    { name: 'Ligne', description: 'Ligen ...' },
    { name: 'Texte', description: 'texte ...' },
    { name: 'Efface', description: 'efface ...' },
    { name: 'Étampe', description: 'etampe ...' },
    { name: 'Pipette', description: 'pipette ...' },
    { name: 'Baguette magique', description: '...' },
];

export const DRAWING_TOOLS: feature[] = [
    { name: 'Crayon', description: 'cayon ...' },
    { name: 'Pinceau', description: 'pinceau ...' },
    { name: 'Plume', description: 'plume ...' },
    { name: 'Aréosol', description: 'aérosol ...' },
];

export const SHAPES: feature[] = [
    { name: 'Rectangle', description: 'rectangle ...' },
    { name: 'Ellipse', description: 'ellipse' },
    { name: 'Polygone', description: 'polygone ...' },
];

export const FILL: feature[] = [
    { name: 'Pixels contigus', description: 'pixels contigus' },
    { name: 'Pixels non contigus', description: 'pixels non contigus' },
];

export const TRANSFORMATIONS: feature[] = [
    { name: 'Déplacement', description: '...' },
    { name: 'Redimensionnement', description: '...' },
    { name: 'Rotation', description: '...' },
    { name: 'Presse-papier', description: '...' },
];

export const TOOL_GROUPS: GroupFeature[] = [
    { name: 'Forme', description: 'Rectangle ...', dependance: SHAPES },
    { name: 'Sceau de peinture', description: 'pixels ...', dependance: FILL },
    { name: 'Outils de tracage', description: 'crayon ...', dependance: DRAWING_TOOLS },
];
