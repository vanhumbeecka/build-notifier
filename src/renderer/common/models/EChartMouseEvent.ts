export interface EChartMouseEvent {
  // type of the component to which the clicked glyph belongs
  // i.e., 'series', 'markLine', 'markPoint', 'timeLine'
  componentType: string,
  // series type (make sense when componentType is 'series')
  // i.e., 'line', 'bar', 'pie'
  seriesType: string,
  // series index in incoming option.series (make sense when componentType is 'series')
  seriesIndex: number,
  // series name (make sense when componentType is 'series')
  seriesName: string,
  // seriesData name, category name
  name: string,
  // seriesData index in incoming seriesData array
  dataIndex: number,
  // incoming rwa seriesData item
  data: unknown,
  // Some series, such as sankey or graph, maintains more than
  // one types of seriesData (nodeData and edgeData), which can be
  // distinguished from each other by dataType with its value
  // 'node' and 'edge'.
  // On the other hand, most series has only one type of seriesData,
  // where dataType is not needed.
  dataType: string,
  // incoming seriesData value
  value: number | any[],
  // color of component (make sense when componentType is 'series')
  color: string,
  // User info (only available in graphic component
  // and custom series, if element option has info
  // property, e.g., {type: 'circle', info: {some: 123}})
  info: any
}
