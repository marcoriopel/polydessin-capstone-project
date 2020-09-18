import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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

  @Output() valueChange: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  decrementToolWidth() {
    if (this.value > this.min) {
      --this.value;
    }
    this.handleValueChange();
  }

  incrementToolWidth() {
    if (this.value < this.max) {
      ++this.value;
    }
    this.handleValueChange();
  }

  handleValueChange() {
    this.valueChange.emit(this.value);
  }
}
