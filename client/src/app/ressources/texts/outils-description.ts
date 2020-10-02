import { Feature } from './feature';

export interface GroupFeature extends Feature {
    dependance: Feature[];
}

export const OTHER_FEATURES: Feature[] = [
    // { name: 'Grille et magnétisme', description: '..', picture: './../../../assets/img/picture_test.jpg' },
    // { name: 'Annuler-refaire', description: '..', picture: './../../../assets/img/picture_test.jpg' },
    {
        name: 'Palette de couleur',
        description:
            'Cet outil permet de définir la couleur de tous les outils. Vous pouvez définir deux couleurs : principale et secondaire. Ces deux couleurs peuvent intéragir entre eux. Vous pouvez choisir la couleur avec le panneau de couleur contenant toutes les couleurs. En changeant de couleur, l ancienne couleur est enregistré pour vous permettre de la récupérer au besoin. ',
        picture: './../../../assets/video/couleur.gif',
    },
];

export const BASIC_TOOLS: Feature[] = [
    // { name: 'Texte', description: 'texte ...', picture: './../../../assets/img/picture_test.jpg' },
    {
        name: 'Efface',
        description:
            'Cet outil permet d effacer tout ce qui se trouve sur la surface de dessin. Il peut avoir différente taille ce qui permet d effacer plus rapidement. ',
        picture: './../../../assets/video/efface.gif',
    },
    {
        name: 'Ligne',
        description:
            "Cet outil permet de tracer une ligne composée d'un ou plusieurs segments. Un premier clic définit la position de départ de la ligne. Ensuite, chaque clic qui suit « connecte » avec le clic qui le précède pour former un segment de la ligne. Un double clic permet de terminer le segment. Si le double clic est fait près du point initial de la ligne, le segment se fusionnera au point initial. \nLa commande shifth permet de mettre la ligne a 90° ou 45°  de celle tracé précédemment. Il est possible d'afficher un point de jonction entre les segments en cliquant dans la boîte «Afficher jonction». La couleur des points de jonction est déterminée par la couleur secondaire.   ",
        picture: './../../../assets/video/ligne.gif',
    },
    // { name: 'Étampe', description: 'etampe ...', picture: './../../../assets/img/picture_test.jpg' },
    // { name: 'Pipette', description: 'pipette ...', picture: './../../../assets/img/picture_test.jpg' },
    // { name: 'Baguette magique', description: '...', picture: './../../../assets/img/picture_test.jpg' },
];

export const DRAWING_TOOLS: Feature[] = [
    {
        name: 'Crayon',
        description:
            'Le crayon vous permet de tracer des traits simple. Il peut être de différente épaisseur. Vous pouvez changer la taille avec les boutons dans la barre a gauche',
        picture: './../../../assets/video/crayon.gif',
    },
    {
        name: 'Pinceau',
        description:
            "Le pinceau permet de faire des traits de différente texture. Vous pouvez changer de texture en sélectionnant l'image correspondant à la texture désirée.",
        picture: './../../../assets/video/brush.gif',
    },
    // { name: 'Plume', description: 'plume ...', picture: './../../../assets/img/picture_test.jpg' },
    // { name: 'Aréosol', description: 'aérosol ...', picture: './../../../assets/img/picture_test.jpg' },
];

export const SHAPES: Feature[] = [
    {
        name: 'Rectangle',
        description:
            'Cet outil permet de dessiner des rectangles de différente taille. Le rectangle tracé peut avoir un remplissage uni, juste un contour ou les deux. La couleur du remplissage est la couleur primaire et la couleur du contour est la coleur secondaire. Il est possible de faire un carré avec la commande shift.',
        picture: './../../../assets/video/rectangle.gif',
    },
    {
        name: 'Ellipse',
        description:
            "Cet outil permet de dessiner des ellipses de différente taille. L'ellipse tracé peut avoir un remplissage complet et uni, juste un contour ou les deux. La couleur du remplissage est la couleur primaire et la couleur du contour est la coleur secondaire. Il est possible de faire un cercle parfait avec la commande shift.",
        picture: './../../../assets/video/ellipse.jpg',
    },
    // { name: 'Polygone', description: 'polygone ...', picture: './../../../assets/img/picture_test.jpg' },
];

/*export const FILL: Feature[] = [
    { name: 'Pixels contigus', description: 'pixels contigus', picture: './../../../assets/img/picture_test.jpg' },
    { name: 'Pixels non contigus', description: 'pixels non contigus', picture: './../../../assets/img/picture_test.jpg' },
];*/

export const TRANSFORMATIONS: Feature[] = [
    // { name: 'Déplacement', description: '', picture: './../../../assets/img/picture_test.jpg' },
    // { name: 'Redimensionnement', description: '', picture: './../../../assets/video/resizing.gif' },
    // { name: 'Rotation', description: '...', picture: './../../../assets/img/picture_test.jpg' },
    // { name: 'Presse-papier', description: '...', picture: './../../../assets/img/picture_test.jpg' },
];
