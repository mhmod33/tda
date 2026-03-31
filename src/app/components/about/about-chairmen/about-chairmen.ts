import { Component, AfterViewInit, OnDestroy, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Chairman {
  name: string;
  title: string;
  duration: string;
  image: string;
  isCurrent?: boolean;
  description?: string;
}

@Component({
  selector: 'app-about-chairmen',
  imports: [CommonModule],
  templateUrl: './about-chairmen.html',
  styleUrl: './about-chairmen.css',
})
export class AboutChairmen implements AfterViewInit, OnDestroy {
  @ViewChildren('animCard') animCards!: QueryList<ElementRef<HTMLElement>>;
  private observer: IntersectionObserver | null = null;

  currentChairman: Chairman = {
    name: 'أ. د/ مصطفى منير',
    title: 'رئيس الهيئة العامة للتنمية السياحية',
    duration: 'أبريل 2024 – حتى الآن',
    image: '/assets/images/DRMoustafaMounir.png',
    isCurrent: true,
    description:
      'يقود مسيرة التحول الشامل للهيئة نحو تحقيق أهداف التنمية السياحية الوطنية، مع التركيز على الاستدامة والابتكار في القطاع السياحي وجذب الاستثمارات النوعية.',
  };

  formerChairmens: Chairman[] = [
    {
      name: 'السيد المهندس / خالد مخلوف',
      title: 'رئيس الهيئة السابق',
      duration: 'يناير 2006 – مايو 2011',
      image: '/assets/images/chairmen/khaled.jpg',
    },
    {
      name: 'السيد المهندس / مجدي القبيصى',
      title: 'رئيس الهيئة السابق',
      duration: 'يوليو 2002 – ديسمبر 2005',
      image: '/assets/images/chairmen/Magdy.jpg',
    },
    {
      name: 'السيد الدكتور المهندس / عادل راضي',
      title: 'رئيس الهيئة السابق',
      duration: 'يونيو 1996 – أبريل 2002',
      image: '/assets/images/chairmen/dr.adel.jpg',
    },
    {
      name: 'السيد الأستاذ / حسين بدران',
      title: 'رئيس الهيئة السابق',
      duration: 'فبراير 1991 – مايو 1996',
      image: '/assets/images/chairmen/Hessin.jpg',
    },
    {
      name: 'السيد الأستاذ / سراج الدين سعد',
      title: 'رئيس الهيئة السابق',
      duration: 'أغسطس 2013 – مارس 2024',
      image: '/assets/images/chairmen/serag.jpg',
    },
    {
      name: 'السيد المهندس / طارق سعد الدين',
      title: 'رئيس الهيئة السابق',
      duration: 'مايو 2011 – أغسطس 2013',
      image: '/assets/images/chairmen/Tariek.jpg',
    },
  ];

  private observeAll(): void {
    this.animCards.forEach((item) => {
      const el = item.nativeElement;
      // If already visible in viewport, show immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');
      } else {
        this.observer?.observe(el);
      }
    });
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    // Defer by one tick so @for block items are in the DOM
    setTimeout(() => {
      this.observeAll();
      // Also watch for any items added later
      this.animCards.changes.subscribe(() => this.observeAll());
    }, 0);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
