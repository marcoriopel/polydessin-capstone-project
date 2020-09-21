import { Component, OnInit } from '@angular/core';
import { AutreAffichage, BaseOUTILS, Manipulation, Outilplus } from './outils-description';

@Component({
    selector: 'app-drawing-detail',
    templateUrl: './drawing-detail.component.html',
    styleUrls: ['./drawing-detail.component.scss'],
})
export class DrawingDetailComponent implements OnInit {
    baseOutils = BaseOUTILS;

    OutilsPlus = Outilplus;

    Autres = AutreAffichage;

    Manipulations = Manipulation;

    constructor() {}

    ngOnInit(): void {}
}
