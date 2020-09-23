import { Component } from '@angular/core';
import { feature, GENERALS_FEATURE } from '@app/ressources/texts/feature';

@Component({
    selector: 'app-general-detail',
    templateUrl: './general-detail.component.html',
    styleUrls: ['./general-detail.component.scss'],
})
export class GeneralDetailComponent {
    informations: feature[] = GENERALS_FEATURE;
    selectedinfo: feature;
}
