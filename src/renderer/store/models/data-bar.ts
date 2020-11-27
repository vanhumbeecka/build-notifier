import { Build } from './build'
import SeriesBar = echarts.EChartOption.SeriesBar

export interface DataBar {
  seriesData: SeriesBar.DataObject | undefined
  build: Build | undefined
}

export const EmptyDataBar = {
  seriesData: undefined,
  build: undefined
}

export const isEmptyDataBar = (dataBar: DataBar): boolean => {
  return dataBar.seriesData === undefined && dataBar.build === undefined
}
