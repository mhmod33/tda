import { Component, Input, output } from '@angular/core';

@Component({
  selector: 'app-property-card',
  standalone: true,
 
  templateUrl: './property-card.html',
  styleUrls: ['./property-card.css'],
})
export class PropertyCardComponent {
  @Input() image!: string;
  @Input() title!: string;
  @Input() description!: string;
  @Input() features: string[] = [];

  onClose = output<void>();

  closeCard(){
    this.onClose.emit();
  }
}
