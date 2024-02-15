import { ConnectionStyle, CustomOrgChartItem, OrgChart } from '@yworks/react-yfiles-orgchart'
import largeOrgchartData from '../../data/large-orgchart-data.ts'

function connectionStyles(
  source: CustomOrgChartItem,
  target: CustomOrgChartItem
): ConnectionStyle | undefined {
  if (target.assistant) {
    return {
      thickness: 5,
      className: 'dashed-edge',
      targetArrow: { type: 'triangle' }
    }
  } else if (source.name === 'John Payne') {
    return {
      thickness: 5,
      className: 'rd-edge'
    }
  }
}

/**
 * Organization chart with individual styles for some connections. Usage of the OrgChart prop <em>edgeStyles</em>
 */
export default () => (
  <OrgChart data={largeOrgchartData} connectionStyles={connectionStyles}></OrgChart>
)
