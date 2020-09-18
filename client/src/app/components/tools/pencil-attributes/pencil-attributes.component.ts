import { Component, OnInit } from '@angular/core';
import { PencilService } from '@app/services/tools/pencil-service';

@Component({
  selector: 'app-pencil-attributes',
  templateUrl: './pencil-attributes.component.html',
  styleUrls: ['./pencil-attributes.component.scss']
})
export class PencilAttributesComponent implements OnInit {
  toolWidth: number;

  constructor(public pencilService: PencilService) {
    this.toolWidth = pencilService.width;
  }

  ngOnInit(): void {
  }

  handleWidthChange(newWidth: number) {
    this.toolWidth = newWidth;
    this.pencilService.changeWidth(this.toolWidth);
  }
}
