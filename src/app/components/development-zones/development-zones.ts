import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-development-zones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './development-zones.html',
  styleUrl: './development-zones.css',
})
export class DevelopmentZones {
  zones = [
    { title: 'الفيوم', image: '/assets/images/الفيوم.jpg' },
    { title: 'العين السخنة', image: '/assets/images/العين السخنه.jpg' },
    { title: 'الساحل الشمالي', image: '/assets/images/الساحل الشمالي.jpg' },
    { title: 'البحر الأحمر', image: '/assets/images/البحر الاحمر.jpg' },
    { title: 'خليج العقبة', image: '/assets/images/خليج العقبة.jpg' },
  ];

  activeIndex = 2; // Default to North Coast

  next() {
    this.activeIndex = (this.activeIndex + 1) % this.zones.length;
  }

  prev() {
    this.activeIndex = (this.activeIndex - 1 + this.zones.length) % this.zones.length;
  }
}
