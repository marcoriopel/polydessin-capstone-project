import { Component, OnInit } from '@angular/core';
import { CircleService } from '@app/services/tools/circle.service';

@Component({
  selector: 'app-circle-attributes',
  templateUrl: './circle-attributes.component.html',
  styleUrls: ['./circle-attributes.component.scss']
})
export class CircleAttributesComponent implements OnInit {
  toolWidth = 1;

  constructor(public circleService: CircleService) { }

  ngOnInit(): void {
  }

}
