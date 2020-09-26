import { feature } from './feature';

export interface GroupFeature extends feature {
    dependance: feature[];
}

export const OTHER_FEATURES: feature[] = [
    { name: 'Grille et magnétisme', description: '..', picture: '@app/ressources/image/picture_test.jpg' },
    { name: 'Annuler-refaire', description: '..', picture: '@app/ressources/image/picture_test.jpg' },
    { name: 'Palette de couleur', description: 'couleur .. ', picture: '@app/ressources/image/picture_test.jpg' },
];

export const BASIC_TOOLS: feature[] = [
    { name: 'Ligne', description: 'Ligen ...', picture: '@app/ressources/image/picture_test.jpg' },
    { name: 'Texte', description: 'texte ...', picture: '@app/ressources/image/picture_test.jpg' },
    { name: 'Efface', description: 'efface ...', picture: '@app/ressources/image/picture_test.jpg' },
    { name: 'Étampe', description: 'etampe ...', picture: '@app/ressources/image/picture_test.jpg' },
    { name: 'Pipette', description: 'pipette ...', picture: '@app/ressources/image/picture_test.jpg' },
    { name: 'Baguette magique', description: '...', picture: '@app/ressources/image/picture_test.jpg' },
];

export const DRAWING_TOOLS: feature[] = [
    { name: 'Crayon', description: 'cayon ...', picture: '@app/ressources/image/picture_test.jpg' },
    { name: 'Pinceau', description: 'pinceau ...', picture: '@app/ressources/image/picture_test.jpg' },
    { name: 'Plume', description: 'plume ...', picture: '@app/ressources/image/picture_test.jpg' },
    { name: 'Aréosol', description: 'aérosol ...', picture: '@app/ressources/image/picture_test.jpg' },
];

export const SHAPES: feature[] = [
    { name: 'Rectangle', description: 'rectangle ...', picture: '@app/ressources/image/picture_test.jpg' },
    { name: 'Ellipse', description: 'ellipse', picture: '@app/ressources/image/picture_test.jpg' },
    { name: 'Polygone', description: 'polygone ...', picture: '@app/ressources/image/picture_test.jpg' },
];

export const FILL: feature[] = [
    { name: 'Pixels contigus', description: 'pixels contigus', picture: '@app/ressources/image/picture_test.jpg' },
    { name: 'Pixels non contigus', description: 'pixels non contigus', picture: '@app/ressources/image/picture_test.jpg' },
];

export const TRANSFORMATIONS: feature[] = [
    { name: 'Déplacement', description: '...', picture: '@app/ressources/image/picture_test.jpg' },
    { name: 'Redimensionnement', description: '...', picture: '@app/ressources/image/picture_test.jpg' },
    { name: 'Rotation', description: '...', picture: '@app/ressources/image/picture_test.jpg' },
    { name: 'Presse-papier', description: '...', picture: '@app/ressources/image/picture_test.jpg' },
];

export const TOOL_GROUPS: GroupFeature[] = [
    { name: 'Forme', description: 'Rectangle ...', picture: '@app/ressources/image/picture_test.jpg', dependance: SHAPES },
    { name: 'Sceau de peinture', description: 'pixels ...', picture: '@app/ressources/image/picture_test.jpg', dependance: FILL },
    { name: 'Outils de tracage', description: 'crayon ...', picture: '@app/ressources/image/picture_test.jpg', dependance: DRAWING_TOOLS },
];
