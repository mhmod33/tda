import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgFor],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  logoPath = 'assets/images/logo (2).png'; // Correct footer logo
  vision2030 = 'assets/images/2030.png'; // Egypt Vision 2030 logo
  bgImage = 'assets/images/Rectangle4.jpg';

  quickLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'فرص الاستثمار', path: '/opportunities' },
    { name: 'الضوابط والاشتراطات', path: '/regulations' },
    { name: 'مشروعات الدعم', path: '/support-projects' },
    { name: 'عن الهيئة', path: '/about' },
    { name: 'رؤية 2030', path: '/vision' },
  ];

  contactInfo = [
    { icon: 'fas fa-map-marker-alt', text: 'القاهرة، مصر' },
    { icon: 'fas fa-phone-alt', text: '19000' },
    { icon: 'fas fa-envelope', text: 'info@tda.gov.eg' },
  ];

  socialLinks = [
    { icon: 'fab fa-facebook-f', path: '#' },
    { icon: 'fab fa-twitter', path: '#' },
    { icon: 'fab fa-instagram', path: '#' },
    { icon: 'fab fa-linkedin-in', path: '#' },
  ];
}
