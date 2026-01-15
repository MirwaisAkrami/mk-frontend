import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  ChartConfiguration,
  ChartData,
  ChartOptions,
  ChartType as ChartJsType,
  registerables,
} from 'chart.js';

export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut';

export interface ChartDataset {
  label: string;
  data: number[];
  color?: string;
}

@Component({
  selector: 'app-simple-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './simple-chart.component.html',
})
export class SimpleChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() title = '';
  @Input() type: ChartType = 'line';
  @Input() labels: string[] = [];
  @Input() datasets: ChartDataset[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;

  chartData: ChartData = { labels: [], datasets: [] };
  chartOptions: ChartOptions = {};

  private defaultColors = [
    '#3B82F6', // blue
    '#10B981', // emerald
    '#8B5CF6', // purple
    '#F59E0B', // amber
    '#EF4444', // red
    '#06B6D4', // cyan
    '#EC4899', // pink
    '#14B8A6', // teal
  ];

  ngOnInit(): void {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datasets'] || changes['labels'] || changes['type']) {
      this.updateChart();
    }
  }

  ngOnDestroy(): void {}

  hasData(): boolean {
    return this.datasets.length > 0 && this.labels.length > 0;
  }

  private updateChart(): void {
    this.chartData = this.buildChartData();
    this.chartOptions = this.buildChartOptions();
  }

  private buildChartData(): ChartData {
    if (this.type === 'pie' || this.type === 'doughnut') {
      return {
        labels: this.labels,
        datasets: this.datasets.map((ds, idx) => ({
          label: ds.label,
          data: ds.data,
          backgroundColor: this.labels.map((_, i) => this.defaultColors[i % this.defaultColors.length]),
          borderColor: '#ffffff',
          borderWidth: 2,
        })),
      };
    }

    return {
      labels: this.labels,
      datasets: this.datasets.map((ds, idx) => {
        const color = ds.color || this.defaultColors[idx % this.defaultColors.length];
        return {
          label: ds.label,
          data: ds.data,
          backgroundColor: this.type === 'bar' ? color : this.hexToRgba(color, 0.1),
          borderColor: color,
          borderWidth: 2,
          fill: this.type === 'line',
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: color,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
        };
      }),
    };
  }

  private buildChartOptions(): ChartOptions {
    const baseOptions: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: this.type === 'pie' || this.type === 'doughnut' || this.datasets.length > 1,
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 16,
            font: { size: 11 },
          },
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.9)',
          titleFont: { size: 12, weight: 'bold' },
          bodyFont: { size: 11 },
          padding: 10,
          cornerRadius: 6,
          displayColors: true,
        },
      },
    };

    if (this.type === 'pie' || this.type === 'doughnut') {
      return {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
          tooltip: {
            ...baseOptions.plugins?.tooltip,
            callbacks: {
              label: (context) => {
                const value = context.parsed as number;
                const dataArray = context.dataset.data as number[];
                const total = dataArray.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                return `${context.label}: ${value.toLocaleString()} (${percentage}%)`;
              },
            },
          },
        },
      };
    }

    return {
      ...baseOptions,
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            maxRotation: 45,
            minRotation: 0,
            font: { size: 10 },
            color: '#6B7280',
          },
        },
        y: {
          beginAtZero: true,
          grid: { color: '#E5E7EB' },
          ticks: {
            font: { size: 10 },
            color: '#6B7280',
            callback: (value) => this.formatValue(Number(value)),
          },
        },
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
    };
  }

  private formatValue(value: number): string {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return (value / 1000).toFixed(1) + 'K';
    return value.toString();
  }

  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
