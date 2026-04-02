import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
  PLATFORM_ID,
  Input,
} from '@angular/core';
import { isPlatformBrowser, NgIf } from '@angular/common';
import mapboxgl from 'mapbox-gl';
import { PropertyCardComponent } from '../property-card/property-card';
import { Hero } from '../hero/hero';
import { Navigation } from '../navigation/navigation';
import { environment } from '../../../../src/environments/environment';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.html',
  styleUrls: ['./map.css'],
  imports: [PropertyCardComponent, NgIf,Navigation],
})
export class MapComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  private investmentMarker?: mapboxgl.Marker;
  private readonly investmentMarkerMinZoom = 7.5;
  private readonly investmentCoordinates: [number, number] = [
    33.83727853268729, 27.099195240194845,
  ];

  // Controls the "layers" dropdown visibility.
  layersMenuOpen = false;
  @ViewChild('layersMenu', { read: ElementRef }) layersMenuEl!: ElementRef;

  // Filter panel state
  filterPanelOpen = false;
  investmentListOpen = false;
  selectedInvestment: string | null = null;

  investmentCityLng = 33.837; // long
  investmentCityLat = 27.099; // lat
  investmentCityZoom = 16.5;

  selectedPlace: any = null;

  private svgToDataUri(svg: string): string {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  // Inline SVG "images" for dark/light/satelite (50x50 in the template).
  darkIcon = this.svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
      <path d="M31.5 24.2c-4.9-1.6-8.6-5.9-9.3-11.1c-7.2 2.2-11.6 9.7-9.5 17.2c2.1 7.5 9.8 12.1 17.4 10c5.2-1.5 8.9-5.4 10.2-10.2c-2.7 1-5.8 1.1-8.8 0Z"
            fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `);

  lightIcon = this.svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="10" fill="none" stroke="#fff" stroke-width="3"/>
      <path d="M25 6v7" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      <path d="M25 37v7" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      <path d="M6 25h7" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      <path d="M37 25h7" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      <path d="M11.5 11.5l5 5" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      <path d="M33.5 33.5l5 5" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      <path d="M38.5 11.5l-5 5" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      <path d="M16.5 33.5l-5 5" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `);

  sateliteIcon = this.svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
      <circle cx="32" cy="19" r="4" fill="none" stroke="#fff" stroke-width="3"/>
      <path d="M16 34c4-12 19-17 28-20" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      <path d="M9 27c10-3 22-7 31-13" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      <path d="M15 35c-3-1-5-4-5-7c0-5 5-9 11-9" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `);

  styles = {
    dark: 'mapbox://styles/ahmed-mosad/cmn4c1a4y00m201s98s1qc215',
    light: 'mapbox://styles/ahmed-mosad/cmnczji6b000001s5epsxesbr',
    satelite: 'mapbox://styles/ahmed-mosad/cmncyrxsv000901pieabn97qv',
  };

  changeStyle(styleKey: 'dark' | 'light' | 'satelite') {
    const style = this.styles[styleKey];
    this.map.setStyle(style);
    this.map.once('style.load', () => {
      this.addInvestmentMarker();
      this.updateInvestmentMarkerVisibility();
    });
  }

  toggleLayersMenu(): void {
    this.layersMenuOpen = !this.layersMenuOpen;
  }

  selectStyle(styleKey: 'dark' | 'light' | 'satelite'): void {
    this.changeStyle(styleKey);
    this.layersMenuOpen = false;
  }

  toggleFilterPanel(): void {
    this.filterPanelOpen = !this.filterPanelOpen;
    if (!this.filterPanelOpen) {
      this.investmentListOpen = false;
    }
  }

  toggleInvestmentList(): void {
    this.investmentListOpen = !this.investmentListOpen;
  }

  selectInvestment(label: string): void {
    this.selectedInvestment = label;
    this.investmentListOpen = false;
    if (label === 'مدينة للاستثمرات') {
      this.flyToInvestmentCity();
    }
  }

  resetFilters(): void {
    this.selectedInvestment = null;
    this.investmentListOpen = false;
    this.flyToEgypt();
  }

  zoomIn(): void {
    if (!this.map) return;
    this.map.zoomIn();
  }

  zoomOut(): void {
    if (!this.map) return;
    this.map.zoomOut();
  }

  resetNorth(): void {
    if (!this.map) return;
    this.map.easeTo({
      bearing: 0,
      duration: 600,
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.layersMenuOpen) return;
    if (!this.layersMenuEl) return;
    const target = event.target as Node;
    if (!this.layersMenuEl.nativeElement.contains(target)) {
      this.layersMenuOpen = false;
    }
  }

  map!: mapboxgl.Map;

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {


      const status = (mapboxgl as any).getRTLTextPluginStatus();


      if (status === 'unavailable') {

      (mapboxgl as any).setRTLTextPlugin(
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
        (error: any) => {
          if (error) console.error('Error loading Mapbox RTL plugin:', error);
        },
        true // Lazy load
      );
    }
      mapboxgl.accessToken = environment.mapboxToken;

      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/ahmed-mosad/cmncyrxsv000901pieabn97qv',
        zoom: 1.5,
        attributionControl: false,
      });

      this.map.on('load', () => {
        // this.map.setProjection('globe');

        this.map.jumpTo({
          center: [10, 10],
          zoom: 1.5,
          bearing: 0,
          pitch: 0,
        });

        let rotation = 0;

        const rotate = () => {
          rotation -= 0.1;

          this.map.easeTo({
            bearing: rotation,
            duration: 0,
          });

          if (rotation > -4.5) {
            requestAnimationFrame(rotate);
          } else {
            this.flyToEgypt();
          }
        };

        rotate();
        this.addInvestmentMarker();
        this.map.on('zoom', () => this.updateInvestmentMarkerVisibility());
        this.updateInvestmentMarkerVisibility();
      });
      this.map.on('click', (e) => {
       
      });
    }
  }

  flyToEgypt() {
    this.map.flyTo({
      center: [31.2357, 30.0444],
      zoom: 6,
      pitch: 65,
      bearing: 20,
      speed: 0.7,
      curve: 1.8,

      essential: true,
    });

    this.map.once('moveend', () => {
      this.applyconstraints();
    });
  }
  applyconstraints() {
    this.map.setMinZoom(6);
    this.map.setMaxZoom(16.5);
  }

  private flyToInvestmentCity() {
    if (!this.map) return;

    this.map.flyTo({
      center: [this.investmentCityLng, this.investmentCityLat],
      zoom: this.investmentCityZoom,
      pitch: 60,
      bearing: 15,
      speed: 0.7,
      curve: 1.6,
      essential: true,
    });
  }

  private addInvestmentMarker(): void {
    if (!this.map || this.investmentMarker) return;

    const container = document.createElement('div');
    container.className = 'investment-marker';

    // التعديل هنا: تأكد من الـ width والـ Centering
    Object.assign(container.style, {
      width: '100px', // لازم العرض يكون نفس عرض الـ box
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', // ده اللي بيخلي الأيقونة في النص (Column Axis)
      justifyContent: 'center',
      cursor: 'pointer',
      backgroundColor: 'transparent', // عشان تتأكد إن مفيش خلفية مأثرة
    });

    const box = document.createElement('div');
    box.className = 'investment-marker-box';
    Object.assign(box.style, {
      width: '100px',
      height: '60px',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '2px solid white',
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '2px',
    });

    const boxImg = document.createElement('img');
    boxImg.src = 'assets/images/ElGouna2.jpg';
    Object.assign(boxImg.style, {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    });
    box.appendChild(boxImg);
    container.appendChild(box);

    const icon = document.createElement('img');
    icon.src = 'assets/images/location.svg';
    Object.assign(icon.style, {
      width: '30px', // جرب تكبر العرض شوية عشان تبان في النص
      height: '30px',
      display: 'block',
      margin: '0 auto', // تأكيد إضافي للتوسيط
    });
    container.appendChild(icon);

    container.addEventListener('click', (e) => {
      this.onInvestmentMarkerClick();
    });

    this.investmentMarker = new mapboxgl.Marker({
      element: container,
      anchor: 'bottom', // بيخلي السنتر هو نص الأيقونة من تحت
    })
      .setLngLat(this.investmentCoordinates)
      .addTo(this.map);
  }
  private updateInvestmentMarkerVisibility(): void {
    if (!this.map || !this.investmentMarker) return;
    const markerEl = this.investmentMarker.getElement();
    const zoom = this.map.getZoom();
    markerEl.style.display = zoom > this.investmentMarkerMinZoom ? '' : 'none';
  }

  // حط هنا الـ action اللي انت عايزه لما تضغط على الـ marker
  onInvestmentMarkerClick(): void {
    // TODO: implement custom marker action
    this.selectedPlace = {
      image: 'assets/images/ElGouna2.jpg',
      title: 'مدينة للاستثمارات',
      description:
        'يحتوى قطاع شمال الغردقة السياحى بمنطقة البحر الأحمر على عدد 1 مركز سياحية ( الجونة )',
      features: [
        ' يقع مركز الجونه السياحى داخل الحدود الإدارية لمحافظة البحر الأحمر.',
        ' يقع على ساحل البحر الأحمر شمال مدينة الغردقه.',
        ' يقع شمال مطار الغردقه الدولى على مسافة 25 كم.',
        ' يقع على مسافة  220 كم شمال مطار مرسى علم.',
        ' بطول حوالى 14.2 كم وعرض متوسط  7 كم تقريباً.',
        ' إجمالى مساحة المركز 37150036.2 (م2)',
        ' يحتوى المركز على عدد 1 مشروع سياحى (تنمية متكاملة)',
        ' يحتوى المركز على مارينا أبو تيج و المارينا الجديدة (مارينا محلى)',
      ],
    };
  }
}
