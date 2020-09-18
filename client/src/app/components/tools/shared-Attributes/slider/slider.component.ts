import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  @Input() min: number;
  @Input() max: number;
  @Input() step: number;
  @Input() value: number;

  constructor() { }

  ngOnInit(): void {
  }

  decrementToolWidth() {
    if (this.value > this.min) {
      --this.value;
    }
  }

  incrementToolWidth() {
    if (this.value < this.max) {
      ++this.value;
    }
  }
}
