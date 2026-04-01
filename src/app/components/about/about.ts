import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChildren, HostListener, signal } from '@angular/core';
import { Hero } from '../hero/hero';
import { AboutHistory } from './about-history/about-history';
import { AboutChairmen } from './about-chairmen/about-chairmen';
import { OrgChartComponent } from './org-chart/org-chart';

@Component({
  selector: 'app-about',
  imports: [Hero, AboutHistory, AboutChairmen],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements AfterViewInit, OnDestroy {
  @ViewChildren('animItem', { read: ElementRef }) animItems!: QueryList<ElementRef<HTMLElement>>;

  private observer: IntersectionObserver | null = null;
  readonly showScrollTop = signal(false);

  @HostListener('window:scroll')
  onWindowScroll() {
    this.showScrollTop.set(window.scrollY > 400);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngAfterViewInit(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.18,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.observer?.unobserve(entry.target);
        }
      });
    }, options);

    this.animItems.forEach((item) => this.observer?.observe(item.nativeElement));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;
  }
}

