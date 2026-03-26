import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scroll-to-top.html',
  styleUrl: './scroll-to-top.css'
})
export class ScrollToTop implements OnInit, OnChanges {
  @Input() alwaysVisible = false;
  showButton = false;

  ngOnInit() {
    this.updateVisibility();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['alwaysVisible']) {
      this.updateVisibility();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.updateVisibility();
  }

  private updateVisibility() {
    if (this.alwaysVisible) {
      this.showButton = true;
      return;
    }

    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showButton = scrollPos > 100;
  }



  scrollToTop() {
    // Attempt multiple methods to scroll to top for maximum compatibility
    const options: ScrollToOptions = { top: 0, behavior: 'smooth' };
    
    // Global scrolling contexts
    window.scrollTo(options);
    document.documentElement.scrollTo(options);
    document.body.scrollTo(options);
    
    // Specifically target potential scrollable containers if any component is scrolling its host
    const allContainers = document.querySelectorAll('div, section, main, app-root');
    allContainers.forEach(container => {
      if (container.scrollTop > 0) {
        container.scrollTo(options);
      }
    });

    // Fallback using scrollIntoView
    document.documentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }


}
