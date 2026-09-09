import { ChartDataset } from 'chart.js';

const CHART_COLORS = ['#f44336', '#ffeb3b', '#357a38', '#3f51b5', '#673ab7', '#9c27b0', '#795548', '#212121'];

export const getBarChartData = (label: string, datas: number[], colorIdx: number): ChartDataset<'bar'> => {
  return {
    label: label,
    data: datas,
    backgroundColor: CHART_COLORS[colorIdx],
  };
};
