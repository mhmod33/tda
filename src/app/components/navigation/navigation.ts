import { Component, HostListener, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterLink, RouterLinkActive } from '@angular/router';

type DropdownItem = {
  label: string;
  icon: string;
};

type NavItem = {
  id: string;
  label: string;
  icon: string;
  route: string;
  active?: boolean;
  dropdown: DropdownItem[];
};

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css',
})
export class Navigation {
  protected readonly openMenuId = signal<string | null>(null);

  constructor(private sanitizer: DomSanitizer) {}

  protected readonly menuItems: NavItem[] = [
    {
      id: 'home',
      label: 'الرئيسية',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><g clip-path="url(#clip0_4418_7372)"><path d="M17.79 22.75H6.21C3.47 22.75 1.25 20.52 1.25 17.78V10.37C1.25 9.00997 2.09 7.29997 3.17 6.45997L8.56 2.25997C10.18 0.999974 12.77 0.939974 14.45 2.11997L20.63 6.44997C21.82 7.27997 22.75 9.05997 22.75 10.51V17.79C22.75 20.52 20.53 22.75 17.79 22.75ZM9.48 3.43997L4.09 7.63997C3.38 8.19997 2.75 9.46997 2.75 10.37V17.78C2.75 19.69 4.3 21.25 6.21 21.25H17.79C19.7 21.25 21.25 19.7 21.25 17.79V10.51C21.25 9.54997 20.56 8.21997 19.77 7.67997L13.59 3.34997C12.45 2.54997 10.57 2.58997 9.48 3.43997Z" fill="white" style="fill: var(--fillg);"/><path d="M12 18.75C11.59 18.75 11.25 18.41 11.25 18V15C11.25 14.59 11.59 14.25 12 14.25C12.41 14.25 12.75 14.59 12.75 15V18C12.75 18.41 12.41 18.75 12 18.75Z" fill="white" style="fill: var(--fillg);"/></g><defs><clipPath id="clip0_4418_7372"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>',
      route: '/',
      active: true,
      dropdown: [
        { label: 'الرئيسية', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><g clip-path="url(#clip0_4418_7372)"><path d="M17.79 22.75H6.21C3.47 22.75 1.25 20.52 1.25 17.78V10.37C1.25 9.00997 2.09 7.29997 3.17 6.45997L8.56 2.25997C10.18 0.999974 12.77 0.939974 14.45 2.11997L20.63 6.44997C21.82 7.27997 22.75 9.05997 22.75 10.51V17.79C22.75 20.52 20.53 22.75 17.79 22.75ZM9.48 3.43997L4.09 7.63997C3.38 8.19997 2.75 9.46997 2.75 10.37V17.78C2.75 19.69 4.3 21.25 6.21 21.25H17.79C19.7 21.25 21.25 19.7 21.25 17.79V10.51C21.25 9.54997 20.56 8.21997 19.77 7.67997L13.59 3.34997C12.45 2.54997 10.57 2.58997 9.48 3.43997Z" fill="white" style="fill: var(--fillg);"/><path d="M12 18.75C11.59 18.75 11.25 18.41 11.25 18V15C11.25 14.59 11.59 14.25 12 14.25C12.41 14.25 12.75 14.59 12.75 15V18C12.75 18.41 12.41 18.75 12 18.75Z" fill="white" style="fill: var(--fillg);"/></g><defs><clipPath id="clip0_4418_7372"><rect width="24" height="24" fill="none"/></clipPath></defs></svg>' },
      ],
    },
    {
      id: 'zones',
      label: 'مناطق التنمية',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fff"><g clip-path="url(#clip0_4418_7637)"><path d="M7.49994 15.2495C7.30994 15.2495 7.11994 15.1795 6.96994 15.0295C6.67994 14.7395 6.67994 14.2595 6.96994 13.9695L10.1699 10.7695C10.3299 10.6095 10.5399 10.5295 10.7699 10.5495C10.9899 10.5695 11.1899 10.6895 11.3199 10.8795L12.4099 12.5195L15.9599 8.96945C16.2499 8.67945 16.7299 8.67945 17.0199 8.96945C17.3099 9.25945 17.3099 9.73945 17.0199 10.0295L12.8199 14.2295C12.6599 14.3895 12.4499 14.4695 12.2199 14.4495C11.9999 14.4295 11.7999 14.3095 11.6699 14.1195L10.5799 12.4795L8.02994 15.0295C7.87994 15.1795 7.68994 15.2495 7.49994 15.2495Z" fill="white" style="fill: var(--fillg);"/><path d="M16.5 12.25C16.09 12.25 15.75 11.91 15.75 11.5V10.25H14.5C14.09 10.25 13.75 9.91 13.75 9.5C13.75 9.09 14.09 8.75 14.5 8.75H16.5C16.91 8.75 17.25 9.09 17.25 9.5V11.5C17.25 11.91 16.91 12.25 16.5 12.25Z" fill="white" style="fill: var(--fillg);"/><path d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z" fill="white" style="fill: var(--fillg);"/></g><defs><clipPath id="clip0_4418_7637"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>',
      route: '/zones',
      dropdown: [
        { label: 'المنطقة الشمالية', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22S22 17.52 22 12S17.52 2 12 2Z" fill="currentColor"/></svg>' },
        { label: 'المنطقة الوسطى', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22S22 17.52 22 12S17.52 2 12 2Z" fill="currentColor"/></svg>' },
        { label: 'المنطقة الجنوبية', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22S22 17.52 22 12S17.52 2 12 2Z" fill="currentColor"/></svg>' },
      ],
    },
    {
      id: 'vision',
      label: 'رؤية مصر 2030',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fff"><g clip-path="url(#clip0_4418_7081)"><path d="M11.9999 16.3299C9.60992 16.3299 7.66992 14.3899 7.66992 11.9999C7.66992 9.60992 9.60992 7.66992 11.9999 7.66992C14.3899 7.66992 16.3299 9.60992 16.3299 11.9999C16.3299 14.3899 14.3899 16.3299 11.9999 16.3299ZM11.9999 9.16992C10.4399 9.16992 9.16992 10.4399 9.16992 11.9999C9.16992 13.5599 10.4399 14.8299 11.9999 14.8299C13.5599 14.8299 14.8299 13.5599 14.8299 11.9999C14.8299 10.4399 13.5599 9.16992 11.9999 9.16992Z" fill="white" style="fill: var(--fillg);"/><path d="M12.0001 21.0205C8.24008 21.0205 4.69008 18.8205 2.25008 15.0005C1.19008 13.3505 1.19008 10.6605 2.25008 9.00047C4.70008 5.18047 8.25008 2.98047 12.0001 2.98047C15.7501 2.98047 19.3001 5.18047 21.7401 9.00047C22.8001 10.6505 22.8001 13.3405 21.7401 15.0005C19.3001 18.8205 15.7501 21.0205 12.0001 21.0205ZM12.0001 4.48047C8.77008 4.48047 5.68008 6.42047 3.52008 9.81047C2.77008 10.9805 2.77008 13.0205 3.52008 14.1905C5.68008 17.5805 8.77008 19.5205 12.0001 19.5205C15.2301 19.5205 18.3201 17.5805 20.4801 14.1905C21.2301 13.0205 21.2301 10.9805 20.4801 9.81047C18.3201 6.42047 15.2301 4.48047 12.0001 4.48047Z" fill="white" style="fill: var(--fillg);"/></g><defs><clipPath id="clip0_4418_7081"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>',
      route: '/vision',
      dropdown: [
        { label: 'أهداف الرؤية', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 6L18.29 8.29L16 10.58L17.41 12L19.71 9.71L22 12V6Z" fill="currentColor"/></svg>' },
        { label: 'مؤشرات الأداء', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 9.2H3V21H5V9.2ZM19.3 5H17.5V21H19.3V5ZM12.15 13H10.35V21H12.15V13Z" fill="currentColor"/></svg>' },
        { label: 'المشروعات الداعمة', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6H20V4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20V18H4V6Z" fill="currentColor"/></svg>' },
      ],
    },
    {
      id: 'opportunities',
      label: 'فرص للاستثمار',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fff"><g clip-path="url(#clip0_4418_169652)"><path d="M14.8902 18.2197H6.10019C5.58019 18.2197 5.09018 18.1698 4.65018 18.0698C4.42018 18.0398 4.14019 17.9597 3.85019 17.8497C2.52019 17.3497 0.950195 16.1198 0.950195 13.0598V7.90973C0.950195 4.63973 2.83019 2.75977 6.10019 2.75977H14.8902C17.6502 2.75977 19.4302 4.07974 19.9102 6.47974C20.0002 6.91974 20.0402 7.38973 20.0402 7.90973V13.0598C20.0402 16.3498 18.1702 18.2197 14.8902 18.2197ZM6.11017 4.27979C3.65017 4.27979 2.46017 5.46975 2.46017 7.92975V13.0798C2.46017 14.8698 3.09019 15.9698 4.38019 16.4598C4.58019 16.5298 4.7702 16.5797 4.9502 16.6097C5.3302 16.6897 5.70017 16.7297 6.11017 16.7297H14.9002C17.3602 16.7297 18.5502 15.5398 18.5502 13.0798V7.92975C18.5502 7.50975 18.5202 7.13974 18.4502 6.79974C18.1102 5.09974 16.9502 4.27979 14.9002 4.27979H6.11017Z" fill="white" style="fill: var(--fillg);"/><path d="M17.8901 21.2203H9.10009C8.25009 21.2203 7.49008 21.1003 6.84008 20.8503C5.37008 20.3003 4.41007 19.1403 4.08007 17.4803C4.03007 17.2303 4.11009 16.9703 4.29009 16.8003C4.47009 16.6203 4.7301 16.5503 4.9801 16.6103C5.3101 16.6803 5.68009 16.7203 6.10009 16.7203H14.8901C17.3501 16.7203 18.5401 15.5304 18.5401 13.0704V7.92033C18.5401 7.50033 18.5101 7.13033 18.4401 6.79033C18.3901 6.54033 18.4701 6.29033 18.6401 6.11033C18.8201 5.93033 19.0701 5.85032 19.3201 5.91032C21.7201 6.40032 23.0401 8.18033 23.0401 10.9203V16.0704C23.0401 19.3504 21.1701 21.2203 17.8901 21.2203ZM5.9201 18.2203C6.2401 18.8003 6.72009 19.2104 7.38009 19.4504C7.86009 19.6304 8.44007 19.7203 9.11007 19.7203H17.9001C20.3601 19.7203 21.5501 18.5304 21.5501 16.0704V10.9203C21.5501 9.34033 21.0601 8.29034 20.0501 7.74034C20.0501 7.80034 20.0501 7.86033 20.0501 7.92033V13.0704C20.0501 16.3404 18.1701 18.2203 14.9001 18.2203H6.11007C6.04007 18.2203 5.9801 18.2203 5.9201 18.2203Z" fill="white" style="fill: var(--fillg);"/><path d="M10.4999 13.8904C8.62988 13.8904 7.10986 12.3704 7.10986 10.5004C7.10986 8.63037 8.62988 7.11035 10.4999 7.11035C12.3699 7.11035 13.8899 8.63037 13.8899 10.5004C13.8899 12.3704 12.3699 13.8904 10.4999 13.8904ZM10.4999 8.61035C9.45988 8.61035 8.60986 9.46037 8.60986 10.5004C8.60986 11.5404 9.45988 12.3904 10.4999 12.3904C11.5399 12.3904 12.3899 11.5404 12.3899 10.5004C12.3899 9.46037 11.5399 8.61035 10.4999 8.61035Z" fill="white" style="fill: var(--fillg);"/><path d="M4.78027 13.4498C4.37027 13.4498 4.03027 13.1098 4.03027 12.6998V8.2998C4.03027 7.8898 4.37027 7.5498 4.78027 7.5498C5.19027 7.5498 5.53027 7.8898 5.53027 8.2998V12.6998C5.53027 13.1098 5.20027 13.4498 4.78027 13.4498Z" fill="white" style="fill: var(--fillg);"/><path d="M16.21 13.4498C15.8 13.4498 15.46 13.1098 15.46 12.6998V8.2998C15.46 7.8898 15.8 7.5498 16.21 7.5498C16.62 7.5498 16.96 7.8898 16.96 8.2998V12.6998C16.96 13.1098 16.63 13.4498 16.21 13.4498Z" fill="white" style="fill: var(--fillg);"/></g><defs><clipPath id="clip0_4418_169652"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>',
      route: '/opportunities',
      dropdown: [
        { label: 'فرص صناعية', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 9V5H19V9M6 7V6H18V7H6Z" fill="currentColor"/></svg>' },
        { label: 'فرص سياحية', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22S22 17.52 22 12S17.52 2 12 2Z" fill="currentColor"/></svg>' },
        { label: 'فرص لوجستية', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6C4.9 5 4 5.9 4 7V17C4 18.1 4.9 19 6 19H17.5C18.16 19 18.72 18.58 18.92 17.99L20 13L18.92 6.01Z" fill="currentColor"/></svg>' },
      ],
    },
    {
      id: 'permits',
      label: 'التراخيص',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2M18 20H6V4H13V9H18V20Z" fill="currentColor"/></svg>',
      route: '/permits',
      dropdown: [
        { label: 'إصدار ترخيص جديد', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/></svg>' },
        { label: 'تجديد الترخيص', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 10C5.9 10 5 10.9 5 12S5.9 14 7 14 9 13.1 9 12 8.1 10 7 10M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M19 15C19 12.24 16.13 10 12.5 10C8.87 10 6 12.24 6 15V19H19V15Z" fill="currentColor"/></svg>' },
        { label: 'متابعة الطلب', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 1H4C2.9 1 2 1.9 2 3V21C2 22.1 2.9 23 4 23H20C21.1 23 22 22.1 22 21V8.5L15.5 1ZM12 19C10.34 19 9 17.66 9 16C9 14.34 10.34 13 12 13C13.66 13 15 14.34 15 16C15 17.66 13.66 19 12 19ZM15 9H4V3H15V9Z" fill="currentColor"/></svg>' },
      ],
    },
    {
      id: 'contracts',
      route: '/contracts',
      label: 'العقود',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2M18 20H6V4H13V9H18V20Z" fill="currentColor"/></svg>',
      dropdown: [
        { label: 'نماذج العقود', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 8C7.58 8 4 9.79 4 12C4 14.21 7.58 16 12 16C16.42 16 20 14.21 20 12C20 9.79 16.42 8 12 8Z" fill="currentColor"/></svg>' },
        { label: 'توثيق رقمي', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 1C5.93 1 1 5.93 1 12C1 18.07 5.93 23 12 23C18.07 23 23 18.07 23 12C23 5.93 18.07 1 12 1ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="currentColor"/></svg>' },
        { label: 'دليل الإجراءات', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="currentColor"/></svg>' },
      ],
    },
    {
      id: 'about',
      route: '/about',
      label: 'عن الهيئة',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22S22 17.52 22 12S17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/></svg>',
      dropdown: [
        { label: 'من نحن', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.67 14 5 15.17 5 17.5V20H19V17.5C19 15.17 14.33 14 12 14Z" fill="currentColor"/></svg>' },
        { label: 'الهيكل التنظيمي', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 11H13V5H16M8 11H5V5H8M16 18H13V13H16M8 18H5V13H8" fill="currentColor"/></svg>' },
        { label: 'تواصل معنا', icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/></svg>' },
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

  protected getSafeIcon(iconSvg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(iconSvg);
  }
}
