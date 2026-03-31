import { Component, AfterViewInit, OnDestroy, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  side: 'right' | 'left';
}

@Component({
  selector: 'app-about-history',
  imports: [CommonModule],
  templateUrl: './about-history.html',
  styleUrl: './about-history.css',
})
export class AboutHistory implements AfterViewInit, OnDestroy {
  @ViewChildren('timelineItem') timelineItems!: QueryList<ElementRef<HTMLElement>>;

  private observer: IntersectionObserver | null = null;

  timelineEvents: TimelineEvent[] = [
    {
      year: '1991',
      title: 'تأسيس الهيئة',
      description:
        'صدر قرار رئيس الجمهورية رقم (374) لسنة 1991 بتنظيم الهيئة العامة للتنمية السياحية، لتكون المظلة الرئيسية لتنظيم وتطوير القطاع السياحي في مصر.',
      side: 'right',
    },
    {
      year: '1995',
      title: 'تعزيز الاختصاصات',
      description:
        'صدر قرار رئيس مجلس الوزراء رقم 2908 لسنة 1995 بشأن القواعد والشروط المنظمة لإدارة واستغلال الأراضي المخصصة للهيئة العامة للتنمية السياحية.',
      side: 'left',
    },
    {
      year: '2005',
      title: 'إطلاق الاستراتيجية الوطنية',
      description:
        'اعتماد الاستراتيجية الوطنية الشاملة للسياحة، وإطلاق مبادرات التنمية المتكاملة في المناطق الساحلية والصحراوية وتطوير البنية التحتية السياحية.',
      side: 'right',
    },
    {
      year: '2015',
      title: 'التحول الرقمي',
      description:
        'إطلاق منظومة متكاملة لخدمة المستثمرين والسياح رقمياً، وتسهيل الإجراءات والتراخيص السياحية إلكترونياً بما يتوافق مع متطلبات التحول الرقمي.',
      side: 'left',
    },
    {
      year: '2021',
      title: 'إعادة الهيكلة والتطوير',
      description:
        'صدر قرار رئيس الجمهورية رقم (534) لسنة 2021 بتعديل بعض أحكام قرار (374) لسنة 1991 بتنظيم الهيئة العامة للتنمية السياحية، لمواكبة التحولات الاقتصادية الكبرى.',
      side: 'right',
    },
    {
      year: 'الآن',
      title: 'الرؤية المستقبلية',
      description:
        'تسعى الهيئة نحو ترسيخ مكانة مصر وجهةً عالمية رائدة، من خلال إطلاق مشاريع عملاقة مستدامة تتماشى مع رؤية التنمية الشاملة وجذب الاستثمارات النوعية.',
      side: 'left',
    },
  ];

  private observeAll(): void {
    this.timelineItems.forEach((item) => {
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
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
    );

    // Two-tick defer: setTimeout → requestAnimationFrame ensures @for items
    // are fully in the DOM and laid out before we compute scroll positions.
    setTimeout(() => {
      requestAnimationFrame(() => {
        this.observeAll();
        // React to future list mutations (e.g. route re-use)
        this.timelineItems.changes.subscribe(() => {
          requestAnimationFrame(() => this.observeAll());
        });
      });
    }, 0);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
