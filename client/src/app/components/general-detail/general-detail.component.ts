import { Component, OnInit } from '@angular/core';
import { general, GENERALS } from './general_description';

@Component({
    selector: 'app-general-detail',
    templateUrl: './general-detail.component.html',
    styleUrls: ['./general-detail.component.scss'],
})
export class GeneralDetailComponent implements OnInit {
    Informations = GENERALS;
    selectedinfo: general;

    constructor() {}

    ngOnInit(): void {}
}
