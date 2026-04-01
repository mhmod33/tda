import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Hero } from '../hero/hero';

@Component({
  selector: 'app-contact-us',
  imports: [Hero],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.css',
})
export class ContactUs implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('animItem', { read: ElementRef }) animItems!: QueryList<ElementRef<HTMLElement>>;

  private observer: IntersectionObserver | null = null;
  isOverlayVisible: boolean = true;

  ngOnInit(): void {
    // Ensure we start at the top of the page when navigating here
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  private observeAll(): void {
    if (!this.animItems) return;
    this.animItems.forEach((item) => {
      const el = item.nativeElement;
      const rect = el.getBoundingClientRect();
      
      // If it's anywhere in the viewport, OR if it's already above the viewport (missed intersection)
      if (rect.top < window.innerHeight) {
        el.classList.add('visible');
      } else {
        this.observer?.observe(el);
      }
    });
  }

  ngAfterViewInit(): void {
    const options = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.observer?.unobserve(entry.target);
        }
      });
    }, options);

    // Initial check after a brief delay to ensure DOM is settled
    setTimeout(() => {
      requestAnimationFrame(() => {
        this.observeAll();
        
        this.animItems?.changes.subscribe(() => {
          requestAnimationFrame(() => this.observeAll());
        });
      });
    }, 150);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;
  }
}

