# **Correction Sprint 3**

# Fonctionnalité

## Outil - Sélection par baguette magique /8

- [x] Il est possible d'activer la baguette magique avec la touche `V`.
- [x] Il est possible d'effectuer une sélection en mode _pixels contigus_ avec le bouton gauche de la souris.
- [x] Il est possible d'effectuer une sélection en mode _pixels non contigus_ avec le bouton droit de la souris.
- [x] Un pixel est sélectionné s'il est voisin d'une région de pixels de même couleur pour le mode _pixels contigus_.
- [x] Un pixel est sélectionné s'il est de la même couleur pour le mode _pixels non contigus_.
- [x] La ou les régions de pixels sélectionnés sont délimitées par un contour de sélection qui sera lui-même encadré par une seule boite englobante.
- [x] Une boite englobante doit être minimale, peu importe son orientation.
- [x] Une boite englobante a 8 points de contrôle.
- [x] La sélection inclut toujours les pixels de l'arrière-plan.
- [x] La ou les régions de sélection ne peut jamais dépasser la zone de dessin, même si la souris dépasse cette zone.
- [x] L'utilisation de la touche d'échappement (`ESC`) annule la sélection en entier.

### Commentaires

La baguette semble prendre trop de pixel entourant (ramasse des pixels de d'autres couleurs sur les bordures)

## Continuer un dessin

- [x] Il est possible de charger le dernier dessin sauvegardé par le système de sauvegarde automatique.
- [x] Il est possible de voir l'option _Continuer un dessin_ dans le point d'entrée de l'application seulement s'il y a un dessin sauvegardé.
- [x] L'utilisateur est amené à la vue de dessin avec le dessin déjà chargé sur la surface de dessin.

### Commentaires

## Sauvegarde automatique

- [x] Il est possible de faire une sauvegarde automatique du dessin pendant son édition.
- [ ] La sauvegarde automatique est déclenchée après le chargement d'un dessin (à partir du serveur ou continuation d'un dessin sauvegardé automatiquement).
- [x] La sauvegarde automatique est déclenchée après toute modification au dessin (création, ouverture de dessin, modification de la surface de dessin).
- [x] La sauvegarde est locale au fureteur seulement.
- [x] La sauvegarde automatique a lieu sans intervention de l'utilisateur.
- [x] Un dessin sauvegardé automatiquement n'a pas de nom ou d'étiquettes.

### Commentaires

Après le chargement d'un dessin, il faut faire des modifications.

## Envoyer le dessin par courriel

- [x] Il est possible d'exporter le dessin et l'envoyer par courriel via une fenêtre d'export de fichier.
- [x] Il est possible d'ouvrir la fenêtre d'export avec le raccourci `CTRL + E`.
- [x] Une seule fenêtre modale parmi: (sauvegarder, carrousel et exporter) peut être affichée en même temps (pas de _stack_ non plus).
- [x] Les différent raccourcis ne sont pas disponibles lorsque cette fenêtre est affichée.
- [x] Il est possible d'envoyer une image en format JPG.
- [x] Il est possible d'envoyer une image en format PNG.
- [x] Il est possible d'appliquer un filtre à l'image exportée.
- [x] Un choix d'au moins 5 filtres _sensiblement_ différents est offert.
- [x] Les différents filtres sont clairement identifiés pour leur sélection.
- [x] Un seul filtre est appliqué à l'image exportée.
- [ ] Il est possible d'entrer un nom pour le fichier exporté.
- [x] Il est possible de définir une addresse de destination _valide_.
- [x] L'envoi du courriel est fait à travers le serveur et non l'application client.
- [x] Il est possible de voir une vignette de prévisualisation de l'image à exporter.
- [x] Un bouton de confirmation doit être présent pour envoyer l'image par courriel.

### Commentaires

On peut envoyer un dessin sans noms !
tests - 0.1 Controller serveur

## Manipulations de sélections et presse-papier

- [x] Il est possible de copier une sélection avec le raccourci `CTRL + C`.
- [x] Le contenu du presse-papier est remplacé par la sélection lors d'un copiage.
- [x] Il est possible de couper une sélection avec le raccourci `CTRL + X`.
- [x] Le contenu du presse-papier est remplacé par la sélection active lors d'un coupage.
- [x] Les pixels de la surface de dessin sous une sélection sont remplacés par des pixels blancs lors d'un coupage.
- [x] Il est possible de coller ce qui se trouve dans le presse-papier avec le raccourci `CTRL + V`.
- [x] Les pixels créés par un collage sont positionés sur le coin suppérieur gauche.
- [x] Les pixels créés par un collage sont automatiquement sélectionnés.
- [x] Le contenu du presse-papier n’est pas affecté par un collage.
- [x] Il est possible de supprimer une sélection avec le raccourci `DELETE`.
- [x] Les pixels de la surface de dessin sous une sélection sont remplacés par des pixels blancs lors d'une suppression.
- [x] Les actions couper, copier, coller et supprimer sont aussi accessibles via la barre latérale à travers des boutons.
- [x] Les actions couper, copier, coller et supprimer ne sont pas disponibles sans une sélection courante.

### Commentaires

Faire un coller avec une selection déjà présente apporte des problème avec la boîte englobante

# QA

## Qualité des classes /14

### La classe n'a qu'une responsabilitée et elle est non triviale.

**2.5/3**  
_Commentaires :_

emaildata.ts unused
vec2ToString devrait aller dans l'interface vec2

### Le nom de la classe est approprié. Utilisation appropriée des suffixes ({..}Component,{..}Controller, {..}Service, etc.). Le format à utiliser est le PascalCase

**2/2**  
_Commentaires :_

<!--  -->

### La classe ne comporte pas d'attributs inutiles (incluant des getter/setter inutiles). Les attributs ne représentent que des états de la classe. Un attribut utilisé seulement dans les tests ne devrait pas exister.

**2/3**  
_Commentaires :_

carousel.component.ts
drawing.component.ts
sidebar.component.ts
continue-drawing.service.ts

### La classe minimise l'accessibilité des membres (public/private/protected)

**0/2**  
_Commentaires :_

carousel.component.ts
color-picker.component.ts
drawing.component.ts
editor.component.ts
export.component.ts
new-drawing-modal.component.ts
saving.component.ts
sidebar.component.ts
...

### Les valeurs par défaut des attributs de la classe sont initialisés de manière consistante (soit dans le constructeur partout, soit à la définition)

**0/4**  
_Commentaires :_

Non consistant

## Qualité des fonctions /13

### Les noms des fonctions sont précis et décrivent les tâches voulues. Le format à utiliser doit être uniforme dans tous les fichiers (camelCase, PascalCase, ...)

**0/2**  
_Commentaires :_

openUserguide openUserGuide
setSelection setSelectionDimension clipboard.service.ts
setLastDrawing setIfThereIsALastDrawing
checkedDrawing checkIfThereIsLastDrawing drawing.service.ts
getCanvasData,getPreviewData getCanvasImageData, getPreviewImageData
getUndoAvailability, getRedoAvailability undo-redo.service.ts retourne observable
insertItemInText insertCharInText
setStratingPointX setStartingPointX
isCorrectKey validateKey
setWand magic-wand.service.ts

### Chaque fonction n'a qu'une seule utilité, elle ne peut pas être fragmentée en plusieurs fonctions et elle est facilement lisible.

**1.5/3**  
_Commentaires :_

checkIf20pxAway, changer cette fonction pour pas être lier au 20 mais prendre en paramètre 20.
grid.component.ts subscribe getKey
drawPolygon polygon.service.ts
onMouseDown line.service.ts
drawShape, drawCircle circle.service.ts
snapOnGrid move.service.ts

### Les fonctions minimisent les paramètres en entrée (pas plus de trois). Utilisation d'interfaces ou de classe pour des paramètres pouvant être regroupé logiquement.

**3/3**  
_Commentaires :_

<!--  -->

### Les fonctions sont pures lorsque possible. Les effets secondaires sont minimisés

**2.75/3**  
_Commentaires :_

grid.component.ts le constructeur modifie avec des constantes extérieur des services

### Tous les paramètres de fonction sont utilisés

**2/2**  
_Commentaires :_

<!--  -->

## Exceptions /4

### Les exceptions sont claires et spécifiques (Pas d'erreurs génériques). Les messages d'erreur affichés à l'utilisateur sont compréhensible pour l'utilisateur moyen (pas de code d'erreur serveur, mais plutôt un message descriptif du genre "Un problème est survenu lors de la sauvegarde du dessin")

**2/2**  
_Commentaires :_

<!--  -->

### Toute fonction doit gérer les valeurs limites de leurs paramètres

**1/1**  
_Commentaires :_

<!--  -->

### Tout code asynchrone (Promise, Observable ou Event) doit être géré adéquatement.

**0/1**  
_Commentaires :_

grid.component.ts
magnetism.component.ts
stamp-attributes.component.ts
email.service.ts catch throw

# QA

## Qualité générale

- L29: trigonometry.ts(129), magnetism.service.ts(58, 69), selection-resize.service.ts(92), rotate.service.ts(64)
- L30: interface (selection-box.ts, selection-points.ts, stamps.ts)
- L35: trigonometry.ts(118), selection-resize.service.ts(224,229,234), seleciton.service.ts(313), line.service.ts(179)

- #39: le dossier userguide devrait être user-guide
- #46: Code dupliqué onKeyUp/onKeyDown circle et square
- #47: max-line-count disable sans justification
- #48: Pas toujours utilisé

# Fonctionnalités

## Plume

- Pas de ligne à la pointe de la souris
