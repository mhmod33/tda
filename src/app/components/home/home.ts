import { Component } from '@angular/core';
import { Hero } from '../hero/hero';
import { ChairmanMessage } from '../chairman-message/chairman-message';
import { PerformanceIndicators } from '../performance-indicators/performance-indicators';
import { DevelopmentZones } from '../development-zones/development-zones';
import { ScrollToTop } from '../common/scroll-to-top/scroll-to-top';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, ChairmanMessage, PerformanceIndicators, DevelopmentZones, ScrollToTop, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
