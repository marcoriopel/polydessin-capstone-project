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
    @Input() title: string;

    @Output() valueChange: EventEmitter<number> = new EventEmitter();

    decrement(): void {
        if (this.value > this.min) {
            this.value -= this.step;
            this.value = Math.round((this.value + Number.EPSILON) * 100) / 100;
        }
        this.changeValue();
    }

    increment(): void {
        if (this.value < this.max) {
            this.value += this.step;
            this.value = Math.round((this.value + Number.EPSILON) * 100) / 100;
        }
        this.changeValue();
    }

    changeValue(): void {
        this.valueChange.emit(this.value);
    }
}
