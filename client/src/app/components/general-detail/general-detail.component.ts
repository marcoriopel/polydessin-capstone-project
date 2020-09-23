import { Component } from '@angular/core';
import { general, GENERALS } from '@app/ressources/texts/general-description';

@Component({
    selector: 'app-general-detail',
    templateUrl: './general-detail.component.html',
    styleUrls: ['./general-detail.component.scss'],
})
export class GeneralDetailComponent {
    informations: general[] = GENERALS;
    selectedinfo: general;
}
