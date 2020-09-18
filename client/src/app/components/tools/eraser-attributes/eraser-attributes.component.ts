import { Component, OnInit } from '@angular/core';
import { EraserService } from '@app/services/tools/eraser.service';

@Component({
  selector: 'app-eraser-attributes',
  templateUrl: './eraser-attributes.component.html',
  styleUrls: ['./eraser-attributes.component.scss']
})
export class EraserAttributesComponent implements OnInit {
  toolWidth = 1;

  constructor(public eraserService: EraserService) { }

  ngOnInit(): void {
  }

}
