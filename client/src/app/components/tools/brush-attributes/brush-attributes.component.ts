import { Component, OnInit } from '@angular/core';
import { BrushService } from '@app/services/tools/brush.service';

@Component({
  selector: 'app-brush-attributes',
  templateUrl: './brush-attributes.component.html',
  styleUrls: ['./brush-attributes.component.scss']
})
export class BrushAttributesComponent implements OnInit {
  toolWidth = 1;

  constructor(public brushService: BrushService) { }

  ngOnInit(): void {
  }

}