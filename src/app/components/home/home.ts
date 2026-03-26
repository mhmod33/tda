import { Component } from '@angular/core';
import { Navigation } from '../navigation/navigation';
import { Hero } from '../hero/hero';
import { ChairmanMessage } from '../chairman-message/chairman-message';

@Component({
  selector: 'app-home',
  imports: [ Hero, ChairmanMessage],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
