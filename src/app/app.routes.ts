import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./components/home/home').then(m => m.Home),
        pathMatch: 'full'
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'zones',
        loadComponent: () => import('./components/zones/zones').then(m => m.Zones),
        pathMatch: 'full'
      },
      {
        path: 'opportunities',
        loadComponent: () => import('./components/opportunities/opportunities').then(m => m.Opportunities),
        pathMatch: 'full'
      },
      {
        path: 'permits',
        loadComponent: () => import('./components/permits/permits').then(m => m.Permits),
        pathMatch: 'full'
      },
      {
        path: 'contracts',
        loadComponent: () => import('./components/contracts/contracts').then(m => m.Contracts),
        pathMatch: 'full'
      },
      {
        path: 'about',
        loadComponent: () => import('./components/about/about').then(m => m.About),
        pathMatch: 'full',
        children: [
          {
            path: 'org-chart',
            loadComponent: () =>
              import('./components/about/org-chart/org-chart').then(m => m.OrgChartComponent),
            pathMatch: 'full'
          },
        ]
      },
      {
        path: 'vision',
        loadComponent: () => import('./components/vision/vision').then(m => m.Vision),
        pathMatch: 'full'
      },
      {
        path: 'map',
        loadComponent:()=> import('./components/map/map').then(m=>m.MapComponent),
        
      },
      {
        path: 'org-chart',
        loadComponent: () =>
          import('./components/about/org-chart/org-chart').then(m => m.OrgChartComponent),
        pathMatch: 'full'
      },
      {
        path: 'indicators',
        loadComponent: () =>
          import('./components/about/indicators/indicators').then(m => m.Indicators),
        pathMatch: 'full'
      },
      {
        path: 'contact-us',
        loadComponent: () =>
          import('./components/contact-us/contact-us').then(m => m.ContactUs),
        pathMatch: 'full'
      },
];
