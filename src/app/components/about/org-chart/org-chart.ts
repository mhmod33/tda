import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  HostListener,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { OrgChart } from 'd3-org-chart';
import { Hero } from '../../hero/hero';

interface OrgNode {
  id: string;
  parentId: string | null;
  name: string;
  level: number;
  width?: number;
  height?: number;
}

@Component({
  selector: 'app-org-chart',
  standalone: true,
  imports: [CommonModule, Hero],
  templateUrl: './org-chart.html',
  styleUrl: './org-chart.css',
})
export class OrgChartComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('chartContainer', { static: false })
  chartContainer!: ElementRef<HTMLDivElement>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private chart: any = null;
  private resizeObserver: ResizeObserver | null = null;
  isCompact = false;

  // ─── Hierarchy data matching the attached image ───────────────────────────
  private readonly orgData: OrgNode[] = [
    // ── Root ──
    { id: '0', parentId: null, name: 'رئيس مجلس الإدارة _ السيد الأستاذ الدكتور / وزير الإسكان والمرافق والمجتمعات العمرانية', level: 0 },

    // ── L1 ──
    { id: '1', parentId: '0', name: 'رئيس الجهاز التنفيذي', level: 1 },

    // ── L2 – sides of the executive ──
    { id: '2', parentId: '1', name: 'الإدارة المركزية لشئون القانونية', level: 2 },
    { id: '3', parentId: '1', name: 'إدارة المراجعة الداخلية والحوكمة', level: 2 },
    { id: '4', parentId: '1', name: 'إدارة التخطيط الاستراتيجي والسياسات والأخطة القُرى', level: 2 },
    { id: '5', parentId: '1', name: 'الإدارة العامة لتقنية المعلومات والتحول الرقمي', level: 2 },
    { id: '6', parentId: '1', name: 'الإدارة المركزية برئيسة الجهاز', level: 2 },

    // ── L3 under "شئون القانونية" (id=2) ──
    { id: '2-1', parentId: '2', name: 'إدارة العامة للتظلمات', level: 3 },
    { id: '2-2', parentId: '2', name: 'الإدارة العامة للتطوير والتراخيص والعقود', level: 3 },
    { id: '2-3', parentId: '2', name: 'الإدارة العامة للشكاوى والتظلمات', level: 3 },
    { id: '2-4', parentId: '2', name: 'الإدارة العامة للتحقيقات', level: 3 },

    // ── L3 under "برئيسة الجهاز" (id=6) ──
    { id: '6-1', parentId: '6', name: 'الإدارة العامة للمكتب الفني', level: 3 },
    { id: '6-2', parentId: '6', name: 'الإدارة العامة للعلاقات الدولية والعلاقات العامة', level: 3 },
    { id: '6-3', parentId: '6', name: 'إدارة العامة بلكس', level: 3 },

    // ── L2 – bottom row (main departments under executive) ──
    { id: '10', parentId: '1', name: 'الإدارة المركزية للتنمية لأثمت التنمية', level: 2 },
    { id: '11', parentId: '1', name: 'الإدارة المركزية لشئون البيئة والطاقة الجديدة والمتجددة', level: 2 },
    { id: '12', parentId: '1', name: 'الإدارة المركزية للشئون الاقتصادية والإستثمار', level: 2 },
    { id: '13', parentId: '1', name: 'الإدارة المركزية لشئون المناطق السياحية', level: 2 },
    { id: '14', parentId: '1', name: 'الإدارة المركزية للتنمية المناطق السياحية', level: 2 },

    // ── L3 under "لأثمت التنمية" (id=10) ──
    { id: '10-1', parentId: '10', name: 'إدارة العامة للشئون المالية', level: 3 },
    { id: '10-2', parentId: '10', name: 'الإدارة العامة للشئون الإدارية', level: 3 },
    { id: '10-3', parentId: '10', name: 'الإدارة العامة للموارد البشرية', level: 3 },
    { id: '10-4', parentId: '10', name: 'الإدارة العامة للشئون الهندسية', level: 3 },
    { id: '10-5', parentId: '10', name: 'الإدارة العامة للمتعلقات', level: 3 },

    // ── L3 under "البيئة والطاقة" (id=11) ──
    { id: '11-1', parentId: '11', name: 'الإدارة العامة للتنظيم والرصد البيئي', level: 3 },
    { id: '11-2', parentId: '11', name: 'الإدارة العامة للدراسات والبحوث البيئية', level: 3 },
    { id: '11-3', parentId: '11', name: 'الإدارة العامة لمنطقة الجديدة والمتجددة', level: 3 },

    // ── L3 under "الاقتصادية والإستثمار" (id=12) ──
    { id: '12-1', parentId: '12', name: 'الإدارة العامة لشئون المستثمرين', level: 3 },
    { id: '12-2', parentId: '12', name: 'الإدارة العامة للدراسات الاقتصادية والتمويل', level: 3 },
    { id: '12-3', parentId: '12', name: 'الإدارة العامة لمتابعة شئون العملاء', level: 3 },

    // ── L3 under "المناطق السياحية" (id=13) ──
    { id: '13-1', parentId: '13', name: 'الإدارة العامة لشئون منطق البحر الأحمر', level: 3 },
    { id: '13-2', parentId: '13', name: 'الإدارة العامة لشئون خليج السويس', level: 3 },
    { id: '13-3', parentId: '13', name: 'الإدارة العامة لشئون خليج العقبة', level: 3 },
    { id: '13-4', parentId: '13', name: 'الإدارة العامة لشئون جنوب البحر الأحمر', level: 3 },
    { id: '13-5', parentId: '13', name: 'الإدارة العامة لبحوث ودراسات دعم مشروعات الهيئة', level: 3 },
    { id: '13-6', parentId: '13', name: 'الإدارة العامة لمشروعات الهيئة', level: 3 },

    // ── L3 under "التنمية المناطق السياحية" (id=14) ──
    { id: '14-1', parentId: '14', name: 'الإدارة العامة لتخطيط المناطق', level: 3 },
    { id: '14-2', parentId: '14', name: 'الإدارة العامة الطبية الأساسية', level: 3 },
    { id: '14-3', parentId: '14', name: 'الإدارة العامة لمراجعة مشروعات المستثمرين', level: 3 },
    { id: '14-4', parentId: '14', name: 'الإدارة العامة المناطق المستحقة', level: 3 },
    { id: '14-5', parentId: '14', name: 'الإدارة العامة للتقييم العقاري', level: 3 },
  ];

  // ─── Colors per level – TDA theme: navy #09365F / gold #C8A45D ──────────────
  private readonly levelColors: Record<number, { bg: string; text: string; border: string }> = {
    0: { bg: 'linear-gradient(135deg, #09365F 0%, #0b4478 100%)',  text: '#ffffff',  border: 'rgba(255,255,255,0.22)' },
    1: { bg: 'linear-gradient(135deg, #09365F 0%, #0d4f8a 100%)',  text: '#ffffff',  border: 'rgba(200,164,93,0.55)' },
    2: { bg: 'linear-gradient(135deg, #C8A45D 0%, #b08d44 100%)',  text: '#09365F',  border: 'rgba(9,54,95,0.2)' },
    3: { bg: 'linear-gradient(135deg, #eef3fa 0%, #e0eaf5 100%)', text: '#09365F',  border: 'rgba(9,54,95,0.18)' },
  };

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initChartWhenReady();
  }

  /**
   * Use ResizeObserver so the chart renders only after the container
   * has real pixel dimensions — fixes blank chart on SPA navigation.
   */
  private initChartWhenReady(): void {
    const el = this.chartContainer?.nativeElement;
    if (!el) return;

    // If the container already has dimensions (e.g. hard refresh), render now
    if (el.offsetWidth > 0 && el.offsetHeight > 0) {
      this.renderChart();
      return;
    }

    // Otherwise observe until dimensions appear (SPA navigation case)
    this.resizeObserver = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect && rect.width > 0 && rect.height > 0) {
        this.resizeObserver?.disconnect();
        this.resizeObserver = null;
        this.renderChart();
      }
    });
    this.resizeObserver.observe(el);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.chart = null;
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.chart) {
      this.chart.render().fit();
    }
  }

  private renderChart(): void {
    if (!this.chartContainer) return;

    d3.select(this.chartContainer.nativeElement).selectAll('*').remove();

    this.chart = new OrgChart()
      .nodeHeight(() => 110)
      .nodeWidth(() => 230)
      .childrenMargin(() => 50)
      .compactMarginBetween(() => 20)
      .compactMarginPair(() => 20)
      .neighbourMargin(() => 10)
      .siblingsMargin(() => 10)
      .compact(this.isCompact)
      .nodeContent((d: any) => {
        const levelCfg = this.levelColors[d.data.level] ?? this.levelColors[3];
        const isRoot = d.data.level === 0;
        const isL1 = d.data.level === 1;

        const fontSize = isRoot ? '11px' : d.data.level <= 1 ? '12px' : '11px';
        const fontWeight = isRoot || isL1 ? '700' : '600';
        const padding = isRoot ? '14px 12px' : '12px 10px';

        return `
          <div style="width:${d.width}px;height:${d.height}px;padding:5px;box-sizing:border-box;">
            <div style="
              background:${levelCfg.bg};
              color:${levelCfg.text};
              width:${d.width - 10}px;
              height:${d.height - 10}px;
              border-radius:10px;
              border:1.5px solid ${levelCfg.border};
              box-shadow: ${isRoot ? '0 8px 24px rgba(44,110,106,0.35)' : isL1 ? '0 6px 18px rgba(44,110,106,0.28)' : '0 4px 12px rgba(0,0,0,0.1)'};
              display:flex;
              align-items:center;
              justify-content:center;
              text-align:center;
              padding:${padding};
              font-family:'Tajawal','Cairo',sans-serif;
              font-size:${fontSize};
              font-weight:${fontWeight};
              line-height:1.55;
              direction:rtl;
              cursor:pointer;
              transition:all 0.25s ease;
              box-sizing:border-box;
            "
            onmouseover="this.style.filter='brightness(1.07)';this.style.transform='translateY(-3px)';this.style.boxShadow='0 10px 28px rgba(0,0,0,0.18)';"
            onmouseout="this.style.filter='';this.style.transform='translateY(0)';this.style.boxShadow='';">
              <span style="word-break:break-word;overflow-wrap:break-word;max-width:100%;">${d.data.name}</span>
            </div>
          </div>`;
      })
      .linkUpdate(function (this: any, d: any) {
        d3.select(this)
          .attr('stroke', '#09365F')
          .attr('stroke-width', 1.8)
          .attr('stroke-opacity', 0.35)
          .attr('stroke-dasharray', 'none');
      })
      .container(this.chartContainer.nativeElement)
      .data(this.orgData)
      .render();
  }

  fitToScreen(): void {
    this.chart?.render().fit();
  }

  zoomIn(): void {
    (this.chart as any)?.zoomIn();
  }

  zoomOut(): void {
    (this.chart as any)?.zoomOut();
  }

  expandAll(): void {
    (this.chart as any)?.expandAll();
    setTimeout(() => this.chart?.fit(), 400);
  }

  collapseAll(): void {
    (this.chart as any)?.collapseAll();
    setTimeout(() => this.chart?.fit(), 400);
  }

  toggleCompact(): void {
    this.isCompact = !this.isCompact;
    this.chart?.compact(this.isCompact).render().fit();
  }
}
