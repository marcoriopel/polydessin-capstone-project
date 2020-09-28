import { Feature } from './feature';

export interface GroupFeature extends Feature {
    dependance: Feature[];
}

export const OTHER_FEATURES: Feature[] = [
    { name: 'Grille et magnétisme', description: '..', picture: './../../../assets/img/picture_test.jpg' },
    { name: 'Annuler-refaire', description: '..', picture: './../../../assets/img/picture_test.jpg' },
    { name: 'Palette de couleur', description: 'couleur .. ', picture: './../../../assets/img/picture_test.jpg' },
];

export const BASIC_TOOLS: Feature[] = [
    { name: 'Texte', description: 'texte ...', picture: './../../../assets/img/picture_test.jpg' },
    { name: 'Efface', description: 'efface ...', picture: './../../../assets/video/efface.gif' },
    { name: 'Ligne', description: 'Ligne ...', picture: './../../../assets/video/ligne.gif' },
    { name: 'Étampe', description: 'etampe ...', picture: './../../../assets/img/picture_test.jpg' },
    { name: 'Pipette', description: 'pipette ...', picture: './../../../assets/img/picture_test.jpg' },
    { name: 'Baguette magique', description: '...', picture: './../../../assets/img/picture_test.jpg' },
];

export const DRAWING_TOOLS: Feature[] = [
    { name: 'Crayon', description: 'cayon ...', picture: './../../../assets/video/crayon.gif' },
    { name: 'Pinceau', description: 'pinceau ...', picture: './../../../assets/video/brush.gif' },
    { name: 'Plume', description: 'plume ...', picture: './../../../assets/img/picture_test.jpg' },
    { name: 'Aréosol', description: 'aérosol ...', picture: './../../../assets/img/picture_test.jpg' },
];

export const SHAPES: Feature[] = [
    { name: 'Rectangle', description: 'rectangle ...', picture: './../../../assets/video/rectangle.gif' },
    { name: 'Ellipse', description: 'ellipse', picture: './../../../assets/img/picture_test.jpg' },
    { name: 'Polygone', description: 'polygone ...', picture: './../../../assets/img/picture_test.jpg' },
];

export const FILL: Feature[] = [
    { name: 'Pixels contigus', description: 'pixels contigus', picture: './../../../assets/img/picture_test.jpg' },
    { name: 'Pixels non contigus', description: 'pixels non contigus', picture: './../../../assets/img/picture_test.jpg' },
];

export const TRANSFORMATIONS: Feature[] = [
    { name: 'Déplacement', description: '...', picture: './../../../assets/img/picture_test.jpg' },
    { name: 'Redimensionnement', description: '...', picture: './../../../assets/video/resizing.gif' },
    { name: 'Rotation', description: '...', picture: './../../../assets/img/picture_test.jpg' },
    { name: 'Presse-papier', description: '...', picture: './../../../assets/img/picture_test.jpg' },
];

export const TOOL_GROUPS: GroupFeature[] = [
    { name: 'Forme', description: 'Rectangle ...', picture: '', dependance: SHAPES },
    { name: 'Sceau de peinture', description: 'pixels ...', picture: '', dependance: FILL },
    { name: 'Outils de tracage', description: 'crayon ...', picture: '', dependance: DRAWING_TOOLS },
];
