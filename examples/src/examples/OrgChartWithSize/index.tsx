import {
  ConnectionStyle,
  CustomOrgChartItem,
  OrgChart,
  RenderItemProps
} from '@yworks/react-yfiles-orgchart'
import largeOrgchartData from '../../data/large-orgchart-data.ts'

const renderItem = (props: RenderItemProps<CustomOrgChartItem>) => {
  const { name } = props.dataItem
  return (
    <div
      style={{
        backgroundColor: 'gold',
        width: '100%',
        height: '100%',
        textAlign: 'center',
        fontSize: '3em',
        fontFamily: 'roboto, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div>{name}</div>
    </div>
  )
}

function connectionStyle(
  _source?: CustomOrgChartItem,
  target?: CustomOrgChartItem
): ConnectionStyle | undefined {
  if (target?.assistant) {
    return {
      thickness: 10,
      className: 'dashed-edge',
      targetArrow: { type: 'triangle' }
    }
  }
}

/**
 * Organization chart component with custom styles and a fixed item size.
 */
export default function OrgChartWithTemplates() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      <div style={{ width: '100%' }}>
        <OrgChart
          data={largeOrgchartData}
          renderItem={renderItem}
          itemSize={{ width: 300, height: 200 }}
          connectionStyles={connectionStyle}
        ></OrgChart>
      </div>
    </div>
  )
}
