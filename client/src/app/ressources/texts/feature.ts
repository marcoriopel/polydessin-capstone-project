// tslint:disable-next-line: class-name
export interface feature {
    name: string;
    description: string;
    picture: string;
}

export const GENERALS_FEATURE: feature[] = [
    { name: 'Créer ou continuer un dessin', description: '...', picture: '@app/ressources/image/create_drawing.jpg' },
    { name: 'Carrousel de dessin', description: '...', picture: '@app/ressources/image/picture_test.jpg' },
    { name: 'Sauvegarde automatique et manuelle', description: '...', picture: '@app/ressources/image/picture_test.jpg' },
    { name: 'Exportation', description: '...', picture: '@app/ressources/image/picture_test.jpg' },
];
