export interface BaseOutil {
    name: string;
    description: string;
}

export interface ExtendOutil extends BaseOutil {
    dependance: BaseOutil[];
}

export const AutreAffichage: BaseOutil[] = [
    { name: 'Grille et magnétisme', description: '..' },
    { name: 'Annuler-refaire', description: '..' },
    { name: 'Palette de couleur', description: 'couleur .. ' },
];

export const BaseOUTILS: BaseOutil[] = [
    { name: 'Ligne', description: 'Ligen ...' },
    { name: 'Texte', description: 'texte ...' },
    { name: 'Efface', description: 'efface ...' },
    { name: 'Étampe', description: 'etampe ...' },
    { name: 'Pipette', description: 'pipette ...' },
    { name: 'Baguette magique', description: '...' },
];

export const OutilDeTracage: BaseOutil[] = [
    { name: 'Crayon', description: 'cayon ...' },
    { name: 'Pinceau', description: 'pinceau ...' },
    { name: 'Plume', description: 'plume ...' },
    { name: 'Aréosol', description: 'aérosol ...' },
];

export const Forme: BaseOutil[] = [
    { name: 'Rectangle', description: 'rectangle ...' },
    { name: 'Ellipse', description: 'ellipse' },
    { name: 'Polygone', description: 'polygone ...' },
];

export const Sceau_peinture: BaseOutil[] = [
    { name: 'Pixels contigus', description: 'pixels contigus' },
    { name: 'Pixels non contigus', description: 'pixels non contigus' },
];

export const Manipulation: BaseOutil[] = [
    { name: 'Déplacement', description: '...' },
    { name: 'Redimensionnement', description: '...' },
    { name: 'Rotation', description: '...' },
    { name: 'Presse-papier', description: '...' },
];

export const Outilplus: ExtendOutil[] = [
    { name: 'Forme', description: 'Rectangle ...', dependance: Forme },
    { name: 'Sceau de peinture', description: 'pixels ...', dependance: Sceau_peinture },
    { name: 'Outils de tracage', description: 'crayon ...', dependance: OutilDeTracage },
];
