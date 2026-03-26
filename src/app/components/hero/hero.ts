import { Component, OnDestroy, OnInit } from '@angular/core';
import { Navigation } from '../navigation/navigation';
import { NgFor } from '@angular/common';
@Component({
  selector: 'app-hero',
  imports: [Navigation,NgFor],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements OnInit, OnDestroy {
  slides = [
    { src: '/assets/images/Rectangle1.jpg', label: 'مشروع توسعة كورنيش النيل', caption: 'فرصة استثمارية مميزة وسط العاصمة' },
    { src: '/assets/images/Rectangle2.jpg', label: 'المولات السياحية الجديدة', caption: 'مزيج من الفخامة والترفيه لمستقبل السياحة' },
    { src: '/assets/images/Rectangle3.jpg', label: 'منطقة مطلة على النيل', caption: 'صورة تعكس الروح السياحية لمصر' },
    { src: '/assets/images/Rectangle4.jpg', label: 'منطقة مطلة على النيل', caption: 'صورة تعكس الروح السياحية لمصر' },
  ];

  activeSlideIndex = 0;
  slideIntervalId: number | null = null;

  navPills = [
    'الرئيسية',
    'مناطق التنمية',
    'رؤية مصر 2030',
    'فرص الاستثمار',
    'التراخيص',
    'العقود',
    'عن الهيئة',
  ];

  direction = document.dir || 'rtl';

  ngOnInit(): void {
    this.initAutoPlay();
  }

  ngOnDestroy(): void {
    this.clearAutoPlay();
  }

  initAutoPlay(): void {
    this.slideIntervalId = window.setInterval(() => this.nextSlide(), 6000);
  }

  clearAutoPlay(): void {
    if (this.slideIntervalId !== null) {
      window.clearInterval(this.slideIntervalId);
      this.slideIntervalId = null;
    }
  }

  nextSlide(): void {
    this.activeSlideIndex = (this.activeSlideIndex + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.activeSlideIndex = (this.activeSlideIndex - 1 + this.slides.length) % this.slides.length;
  }

  getPrevIndex(): number {
    return (this.activeSlideIndex - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.activeSlideIndex = index;
  }
}

