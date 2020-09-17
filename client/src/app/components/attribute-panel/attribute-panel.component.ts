import { Component, OnInit } from '@angular/core';
import { ToolSelectionService } from '../../services/tool-selection.service';

@Component({
  selector: 'app-attribute-panel',
  templateUrl: './attribute-panel.component.html',
  styleUrls: ['./attribute-panel.component.scss']
})
export class AttributePanelComponent implements OnInit {

  constructor(public toolSelectionService: ToolSelectionService) { }

  ngOnInit(): void {
  }

}
