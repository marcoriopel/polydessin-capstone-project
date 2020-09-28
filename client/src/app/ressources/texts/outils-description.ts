import { feature } from './feature';

export interface GroupFeature extends feature {
    dependance: feature[];
}

export const OTHER_FEATURES: feature[] = [
    { name: 'Grille et magnétisme', description: '..', picture: './../../../assets/img/picture_test.jpg' },
    { name: 'Annuler-refaire', description: '..', picture: './../../../assets/img/picture_test.jpg' },
    { name: 'Palette de couleur', description: 'couleur .. ', picture: './../../../assets/img/picture_test.jpg' },
];

export const BASIC_TOOLS: feature[] = [
    { name: 'Ligne', description: 'Ligen ...', picture: './../../../assets/img/picture_test.jpg' },
    { name: 'Texte', description: 'texte ...', picture: './../../../assets/img/picture_test.jpg' },
    { name: 'Efface', description: 'efface ...', picture: './../../../assets/img/picture_test.jpg' },
    { name: 'Étampe', description: 'etampe ...', picture: './../../../assets/img/picture_test.jpg' },
    { name: 'Pipette', description: 'pipette ...', picture: './../../../assets/img/picture_test.jpg' },
    { name: 'Baguette magique', description: '...', picture: './../../../assets/img/picture_test.jpg' },
];

export const DRAWING_TOOLS: feature[] = [
    { name: 'Crayon', description: 'cayon ...', picture: './../../../assets/video/crayon.gif' },
    { name: 'Pinceau', description: 'pinceau ...', picture: './../../../assets/img/picture_test.jpg' },
    { name: 'Plume', description: 'plume ...', picture: './../../../assets/img/picture_test.jpg' },
    { name: 'Aréosol', description: 'aérosol ...', picture: './../../../assets/img/picture_test.jpg' },
];

export const SHAPES: feature[] = [
    { name: 'Rectangle', description: 'rectangle ...', picture: './../../../assets/img/picture_test.jpg' },
    { name: 'Ellipse', description: 'ellipse', picture: './../../../assets/img/picture_test.jpg' },
    { name: 'Polygone', description: 'polygone ...', picture: './../../../assets/img/picture_test.jpg' },
];

export const FILL: feature[] = [
    { name: 'Pixels contigus', description: 'pixels contigus', picture: './../../../assets/img/picture_test.jpg' },
    { name: 'Pixels non contigus', description: 'pixels non contigus', picture: './../../../assets/img/picture_test.jpg' },
];

export const TRANSFORMATIONS: feature[] = [
    { name: 'Déplacement', description: '...', picture: './../../../assets/img/picture_test.jpg' },
    { name: 'Redimensionnement', description: '...', picture: './../../../assets/img/picture_test.jpg' },
    { name: 'Rotation', description: '...', picture: './../../../assets/img/picture_test.jpg' },
    { name: 'Presse-papier', description: '...', picture: './../../../assets/img/picture_test.jpg' },
];

export const TOOL_GROUPS: GroupFeature[] = [
    { name: 'Forme', description: 'Rectangle ...', picture: './../../../assets/img/picture_test.jpg', dependance: SHAPES },
    { name: 'Sceau de peinture', description: 'pixels ...', picture: './../../../assets/img/picture_test.jpg', dependance: FILL },
    { name: 'Outils de tracage', description: 'crayon ...', picture: './../../../assets/img/picture_test.jpg', dependance: DRAWING_TOOLS },
];
