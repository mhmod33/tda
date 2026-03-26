import { Component } from '@angular/core';
import { Hero } from '../hero/hero';
import { ChairmanMessage } from '../chairman-message/chairman-message';
import { ScrollToTop } from '../common/scroll-to-top/scroll-to-top';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, ChairmanMessage, ScrollToTop],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
