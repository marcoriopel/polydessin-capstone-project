import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
})
export class SliderComponent {
    @Input() min: number;
    @Input() max: number;
    @Input() step: number;
    @Input() value: number;

    @Output() valueChange: EventEmitter<number> = new EventEmitter();

    decrementToolWidth(): void {
        if (this.value > this.min) {
            --this.value;
        }
        this.handleValueChange();
    }

    incrementToolWidth(): void {
        if (this.value < this.max) {
            ++this.value;
        }
        this.handleValueChange();
    }

    handleValueChange(): void {
        this.valueChange.emit(this.value);
    }
}
