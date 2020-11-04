export interface Feature {
    name: string;
    description: string;
    picture: string;
}

export const GENERALS_FEATURE: Feature[] = [
    {
        name: 'Créer ou continuer un dessin',
        description:
            "Le bouton «Nouveau Dessin» permet d'effacer le dessin sur la surface de dessin et d'en créer un nouveau. S'il y a un dessin sur la surface de dessin, une fenêtre va apparaître pour s'assurer que vous voulez vraiment effacer le dessin present sur la surface. ",
        picture: './../../../assets/img/nouveau-dessin.PNG',
    },
    // { name: 'Carrousel de dessin', description: '...', picture: './../../../assets/img/picture_test.jpg' },
    // { name: 'Sauvegarde automatique et manuelle', description: '...', picture: './../../../assets/img/picture_test.jpg' },
    // { name: 'Exportation', description: '...', picture: './../../../assets/img/picture_test.jpg' },
];
