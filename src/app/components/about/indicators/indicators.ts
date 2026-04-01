import { Component, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as echarts from 'echarts';
import * as d3 from 'd3';
import { Hero } from '../../hero/hero';

@Component({
  selector: 'app-indicators',
  standalone: true,
  imports: [Hero],
  templateUrl: './indicators.html',
  styleUrl: './indicators.css',
})
export class Indicators implements AfterViewInit, OnDestroy {
  chartInstances: echarts.ECharts[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => {
          this.initMainIndicatorsChart();
          this.initD3ProjectsChart();
          this.initBarChartRegions();
          this.initCapacitiesComparisonChart();
          this.initPieCharts();
        }, 100);
        
        window.addEventListener('resize', this.onResize);
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onResize);
      this.chartInstances.forEach(chart => {
        if (chart) chart.dispose();
      });
    }
  }

  onResize = () => {
    this.chartInstances.forEach(chart => {
      if (chart) chart.resize();
    });
  };

  initMainIndicatorsChart() {
    const el = document.getElementById('mainIndicatorsChart');
    if (!el) return;
    const myChart = echarts.init(el);
    this.chartInstances.push(myChart);

    const chartData = [
       { value: 80, exact: '59 مركز سياحي', name: 'المراكز السياحية' },
       { value: 90, exact: '263 مليون م2', name: 'مساحة الارتباطات' },
       { value: 100, exact: '110.9 ألف منفذة / 39.9 ألف تحت التنفيذ', name: 'الإسكان السياحي' },
       { value: 110, exact: '107.9 ألف منفذة / 57.4 ألف تحت التنفيذ', name: 'الطاقات الفندقية' },
       { value: 120, exact: '3.125 تريليون جنيه معتمدة', name: 'التكاليف الاستثمارية' },
       { value: 95, exact: '66 صرف صحي / 186 تحلية', name: 'المعالجة والتحلية' },
       { value: 85, exact: '134 محطة / 616 كم طرق', name: 'الكهرباء والطرق' },
       { value: 70, exact: '7 شركات مساحة 1.57 مليون م2', name: 'إلغاء التخصيصات' }
    ];

    const option = {
       color: ['#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6'],
       tooltip: {
           trigger: 'item',
           backgroundColor: 'rgba(255, 255, 255, 0.95)',
           borderColor: '#e2e8f0',
           textStyle: { fontFamily: 'Tajawal, sans-serif', color: '#1e293b' },
           formatter: function(params: any) {
               return `<div style="text-align: right; direction: rtl;">
                       <strong style="color: ${params.color}; font-size: 14px;">${params.data.name}</strong><br/>
                       <span style="font-size: 13px;">${params.data.exact}</span>
                       </div>`;
           }
       },
       series: [{
           type: 'pie',
           radius: ['20%', '75%'],
           center: ['50%', '50%'],
           roseType: 'area',
           itemStyle: {
               borderRadius: 8,
               borderColor: '#fff',
               borderWidth: 2
           },
           label: {
               show: true,
               fontFamily: 'Tajawal, sans-serif',
               formatter: '{b}',
               fontSize: 13,
               color: '#475569'
           },
           labelLine: {
               length: 15,
               length2: 20,
               smooth: true
           },
           data: chartData
       }]
    };
    myChart.setOption(option);
  }

  initD3ProjectsChart() {
    const el = document.getElementById('d3ProjectsChart');
    if (!el) return;
    
    // Clear any existing svg
    d3.select(el).selectAll('*').remove();

    const width = el.clientWidth || 300;
    const height = el.clientHeight || 300;

    const svg = d3.select(el)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('style', 'max-width: 100%; height: auto; font-family: Tajawal, sans-serif;');

    const data = {
      name: "إجمالي المشروعات",
      value: 1158,
      children: [
        { name: "تنمية محدودة", value: 503, color: "#38bdf8" },
        { name: "تنمية متكاملة", value: 66, color: "#3b82f6" }
      ]
    };

    const root = d3.hierarchy(data).sum((d: any) => d.value);
    
    const pack = d3.pack()
      .size([width - 20, height - 20])
      .padding(15);

    const nodes = pack(root as any).descendants();

    const g = svg.append('g').attr('transform', 'translate(10,10)');

    const node = g.selectAll('.node')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.x},${d.y})`);

    // Add shadow to root
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "drop-shadow").attr("height", "130%");
    filter.append("feDropShadow").attr("dx", "0").attr("dy", "4").attr("stdDeviation", "8").attr("flood-color", "#cbd5e1").attr("flood-opacity", "0.5");

    node.append('circle')
      .attr('r', (d: any) => d.r)
      .style('fill', (d: any) => d.depth === 0 ? '#f8fafc' : (d.data as any).color)
      .style('stroke', (d: any) => d.depth === 0 ? '#e2e8f0' : 'none')
      .style('stroke-width', 2)
      .style('opacity', (d: any) => d.depth === 0 ? 1 : 0.9)
      .style('filter', (d: any) => d.depth === 0 ? 'url(#drop-shadow)' : 'none')
      .on('mouseover', function(this: SVGElement, event: MouseEvent, d: any) {
         if(d.depth > 0) d3.select(this).style('opacity', 1).style('cursor', 'pointer');
      })
      .on('mouseout', function(this: SVGElement, event: MouseEvent, d: any) {
         if(d.depth > 0) d3.select(this).style('opacity', 0.9);
      });

    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', (d: any) => d.depth === 0 ? -d.r + 25 : '-0.2em')
      .style('font-size', (d: any) => d.depth === 0 ? '16px' : '15px')
      .style('font-weight', '700')
      .style('fill', (d: any) => d.depth === 0 ? '#334155' : '#ffffff')
      .text((d: any) => (d.data as any).name);
    
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', (d: any) => d.depth === 0 ? -d.r + 48 : '1.3em')
      .style('font-size', (d: any) => d.depth === 0 ? '14px' : '18px')
      .style('font-weight', '600')
      .style('fill', (d: any) => d.depth === 0 ? '#64748b' : '#ffffff')
      .text((d: any) => d.depth > 0 ? (d.data as any).value : `(١١٥٨ مشروع فرعي)`);
  }

  initBarChartRegions() {
    const el = document.getElementById('barChartRegions');
    if (!el) return;
    const myChart = echarts.init(el);
    this.chartInstances.push(myChart);

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        textStyle: { fontFamily: 'Tajawal, sans-serif' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '8%',
        top: '12%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['البحر الأحمر', 'خليج العقبة', 'العين السخنة', 'رأس سدر'],
          axisTick: { alignWithLabel: true },
          axisLabel: { fontFamily: 'Tajawal, sans-serif', fontSize: 13, color: '#475569' },
          axisLine: { lineStyle: { color: '#cbd5e1' } }
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: { fontFamily: 'Tajawal, sans-serif', color: '#64748b' },
          splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } }
        }
      ],
      series: [
        {
          name: 'طاقات فندقية تحت التنفيذ',
          type: 'bar',
          barWidth: '40%',
          itemStyle: {
              borderRadius: [6, 6, 0, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#3b82f6' },
                  { offset: 1, color: '#1e3a8a' }
              ]),
              shadowColor: 'rgba(59, 130, 246, 0.4)',
              shadowBlur: 10,
              shadowOffsetY: 5
          },
          label: {
              show: true,
              position: 'top',
              fontFamily: 'Tajawal, sans-serif',
              color: '#334155',
              fontWeight: 600
          },
          data: [26848, 13434, 10677, 6478]
        }
      ]
    };
    myChart.setOption(option);
  }

  initCapacitiesComparisonChart() {
    const el = document.getElementById('capacitiesComparisonChart');
    if (!el) return;
    const myChart = echarts.init(el);
    this.chartInstances.push(myChart);

    const option = {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, textStyle: { fontFamily: 'Tajawal, sans-serif' } },
      legend: { 
          data: ['فندقي (تحت التنفيذ)', 'سياحي (تحت التنفيذ)'], 
          textStyle: { fontFamily: 'Tajawal, sans-serif', color: '#475569' }, 
          top: 0 
      },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        axisLabel: { fontFamily: 'Tajawal, sans-serif', color: '#64748b' },
        splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } }
      },
      yAxis: {
        type: 'category',
        data: ['رأس سدر', 'العين السخنة', 'خليج العقبة', 'البحر الأحمر'],
        axisLabel: { fontFamily: 'Tajawal, sans-serif', fontSize: 13, color: '#475569' },
        axisLine: { lineStyle: { color: '#cbd5e1' } }
      },
      series: [
        {
          name: 'فندقي (تحت التنفيذ)',
          type: 'bar',
          itemStyle: { color: '#0ea5e9', borderRadius: [0, 4, 4, 0] },
          label: { show: true, position: 'insideRight', fontFamily: 'Tajawal', color: '#fff' },
          data: [6478, 10677, 13434, 26848]
        },
        {
          name: 'سياحي (تحت التنفيذ)',
          type: 'bar',
          itemStyle: { color: '#f59e0b', borderRadius: [0, 4, 4, 0] },
          label: { show: true, position: 'insideRight', fontFamily: 'Tajawal', color: '#fff' },
          data: [7573, 13610, 4578, 14141]
        }
      ]
    };
    myChart.setOption(option);
  }

  initPieCharts() {
     const createPieOption = (title: string, data: any[], colors: string[]) => ({
         tooltip: { 
             trigger: 'item', 
             formatter: '{b}: {c}%',
             textStyle: { fontFamily: 'Tajawal, sans-serif' }
         },
         legend: { show: false },
         color: colors,
         series: [
             {
                 name: title,
                 type: 'pie',
                 radius: ['45%', '75%'],
                 avoidLabelOverlap: false,
                 itemStyle: {
                     borderRadius: 6,
                     borderColor: '#fff',
                     borderWidth: 3
                 },
                 label: {
                     show: true,
                     formatter: '{b}\n{d}%',
                     fontFamily: 'Tajawal, sans-serif',
                     fontSize: 12,
                     fontWeight: 600,
                     color: '#334155'
                 },
                 labelLine: { 
                     show: true,
                     smooth: true,
                     lineStyle: { width: 2 }
                 },
                 data: data
             }
         ]
     });

     const chartsInfo = [
        { id: 'pieChartCompletedHotels', title: 'طاقة فندقية مكتملة', data: [
            { value: 63, name: 'البحر الأحمر' }, { value: 29, name: 'خليج العقبة' }, { value: 6, name: 'العين السخنة' }, { value: 2, name: 'رأس سدر' }
        ], colors: ['#0284c7', '#f59e0b', '#10b981', '#64748b'] },
        
        { id: 'pieChartCompletedHousing', title: 'إسكان سياحي مكتمل', data: [
             { value: 54, name: 'العين السخنة' }, { value: 26, name: 'رأس سدر' }, { value: 14, name: 'البحر الأحمر' }, { value: 6, name: 'خليج العقبة' }
        ], colors: ['#b45309', '#65a30d', '#0284c7', '#9333ea'] },

        { id: 'pieChartUnderConstHotels', title: 'فندقية تحت التنفيذ', data: [
            { value: 47, name: 'البحر الأحمر' }, { value: 23, name: 'خليج العقبة' }, { value: 19, name: 'العين السخنة' }, { value: 11, name: 'رأس سدر' }
        ], colors: ['#2563eb', '#dc2626', '#d97706', '#4ade80'] },

        { id: 'pieChartUnderConstHousing', title: 'إسكان تحت التنفيذ', data: [
            { value: 35, name: 'البحر الأحمر' }, { value: 34, name: 'العين السخنة' }, { value: 19, name: 'رأس سدر' }, { value: 12, name: 'خليج العقبة' }
        ], colors: ['#0ea5e9', '#c2410c', '#84cc16', '#ea580c'] }
     ];

     chartsInfo.forEach(info => {
         const el = document.getElementById(info.id);
         if (el) {
             const myChart = echarts.init(el);
             this.chartInstances.push(myChart);
             myChart.setOption(createPieOption(info.title, info.data, info.colors));
         }
     });
  }
}
