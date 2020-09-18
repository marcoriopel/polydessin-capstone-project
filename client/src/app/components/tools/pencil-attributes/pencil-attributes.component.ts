import { Component, OnInit } from '@angular/core';
import { PencilService } from '@app/services/tools/pencil-service';

@Component({
  selector: 'app-pencil-attributes',
  templateUrl: './pencil-attributes.component.html',
  styleUrls: ['./pencil-attributes.component.scss']
})
export class PencilAttributesComponent implements OnInit {

  constructor(public pencilService: PencilService) { }

  ngOnInit(): void {
  }

}
