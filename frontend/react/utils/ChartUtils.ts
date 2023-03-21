import { ChartDataset } from 'chart.js';
import { Consts } from '@constants';

export const getBarChartData = (label: string, datas: number[], colorIdx: number): ChartDataset<'bar'> => {
  return {
    label: label,
    data: datas,
    backgroundColor: Consts.CHART_COLORS[colorIdx],
  };
};
