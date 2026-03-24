import { Component, HostListener, signal } from '@angular/core';

type DropdownItem = {
  label: string;
  icon: string;
};

type NavItem = {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
  dropdown: DropdownItem[];
};

@Component({
  selector: 'app-navigation',
  imports: [],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css',
})
export class Navigation {
  protected readonly openMenuId = signal<string | null>(null);

  protected readonly menuItems: NavItem[] = [
    {
      id: 'home',
      label: 'الرئيسية',
      icon: 'fa-solid fa-house',
      active: true,
      dropdown: [
        { label: 'الرئيسية', icon: 'fa-solid fa-house' },
      ],
    },
    {
      id: 'zones',
      label: 'مناطق التنمية',
      icon: 'fa-solid fa-chart-network',
      dropdown: [
        { label: 'المنطقة الشمالية', icon: 'fa-solid fa-location-dot' },
        { label: 'المنطقة الوسطى', icon: 'fa-solid fa-map-location-dot' },
        { label: 'المنطقة الجنوبية', icon: 'fa-solid fa-compass' },
      ],
    },
    {
      id: 'vision',
      label: 'رؤية مصر 2030',
      icon: 'fa-solid fa-eye',
      dropdown: [
        { label: 'أهداف الرؤية', icon: 'fa-solid fa-bullseye-arrow' },
        { label: 'مؤشرات الأداء', icon: 'fa-solid fa-chart-mixed' },
        { label: 'المشروعات الداعمة', icon: 'fa-solid fa-diagram-project' },
      ],
    },
    {
      id: 'opportunities',
      label: 'فرص للاستثمار',
      icon: 'fa-solid fa-lightbulb',
      dropdown: [
        { label: 'فرص صناعية', icon: 'fa-solid fa-industry-windows' },
        { label: 'فرص سياحية', icon: 'fa-solid fa-umbrella-beach' },
        { label: 'فرص لوجستية', icon: 'fa-solid fa-ship' },
      ],
    },
    {
      id: 'permits',
      label: 'التراخيص',
      icon: 'fa-solid fa-clipboard-list',
      dropdown: [
        { label: 'إصدار ترخيص جديد', icon: 'fa-solid fa-file-circle-plus' },
        { label: 'تجديد الترخيص', icon: 'fa-solid fa-rotate' },
        { label: 'متابعة الطلب', icon: 'fa-solid fa-magnifying-glass-chart' },
      ],
    },
    {
      id: 'contracts',
      label: 'العقود',
      icon: 'fa-solid fa-file-contract',
      dropdown: [
        { label: 'نماذج العقود', icon: 'fa-solid fa-file-signature' },
        { label: 'توثيق رقمي', icon: 'fa-solid fa-shield-check' },
        { label: 'دليل الإجراءات', icon: 'fa-solid fa-book-open-reader' },
      ],
    },
    {
      id: 'about',
      label: 'عن الهيئة',
      icon: 'fa-solid fa-circle-info',
      dropdown: [
        { label: 'من نحن', icon: 'fa-solid fa-users-viewfinder' },
        { label: 'الهيكل التنظيمي', icon: 'fa-solid fa-sitemap' },
        { label: 'تواصل معنا', icon: 'fa-solid fa-envelope-open-text' },
      ],
    },
  ];

  protected isOpen(itemId: string): boolean {
    return this.openMenuId() === itemId;
  }

  protected selectMenu(itemId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuId.update((current) => (current === itemId ? null : itemId));
    this.menuItems.forEach((menuItem) => {
      menuItem.active = menuItem.id === itemId;
    });
  }

  protected toggleMenu(itemId: string, event: MouseEvent): void {
    this.selectMenu(itemId, event);
  }

  @HostListener('document:click')
  protected closeOnOutsideClick(): void {
    this.openMenuId.set(null);
  }
}
