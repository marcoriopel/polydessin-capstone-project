import { Component, OnInit } from '@angular/core';
import { PencilService } from '@app/services/tools/pencil-service';

@Component({
  selector: 'app-pencil-attributes',
  templateUrl: './pencil-attributes.component.html',
  styleUrls: ['./pencil-attributes.component.scss']
})
export class PencilAttributesComponent implements OnInit {
  toolWidth = 1;

  constructor(public pencilService: PencilService) { }

  ngOnInit(): void {
  }

  decrementToolWidth() {
    --this.toolWidth;
  }

  incrementToolWidth() {
    ++this.toolWidth;
  }
}
