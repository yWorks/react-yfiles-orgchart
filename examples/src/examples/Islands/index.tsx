import {
  ContextMenuItem,
  CustomOrgChartItem,
  OrgChart,
  OrgChartConnection,
  RenderItemProps,
  RenderTooltipProps
} from '@yworks/react-yfiles-orgchart'
import largeOrgchartData from '../../data/large-orgchart-data.ts'
import { createContext, useContext, useState } from 'react'

const ColorContext = createContext<string>('green')

export function useColorContext() {
  return useContext(ColorContext)
}

function MyTooltipComponent({
  data
}: RenderTooltipProps<CustomOrgChartItem | OrgChartConnection<CustomOrgChartItem>>) {
  let text = ''
  if ('name' in data) {
    // orgchart item tooltip
    text = data.name!
  } else if ('source' in data) {
    // orgchart connection tooltip
    text = `${data.source.name} → ${data.target.name}`
  }

  return (
    <div style={{ backgroundColor: 'tomato', padding: 5, borderRadius: 10, color: 'white' }}>
      {text}
    </div>
  )
}

function RenderMenu(_: {
  item: CustomOrgChartItem | null
  menuItems: ContextMenuItem<CustomOrgChartItem>[]
  onClose: Function
}) {
  const color = useColorContext()
  return <div style={{ width: '100px', height: '100px', backgroundColor: color }}></div>
}

function RenderItem(props: RenderItemProps<CustomOrgChartItem>) {
  const color = useColorContext()
  const { hovered, dataItem } = props
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: color,
        borderColor: hovered ? 'red' : 'green',
        borderWidth: '1px',
        borderStyle: 'solid'
      }}
    >
      {dataItem?.name}
    </div>
  )
}

/**
 * Organization chart with global color state that is accessed in the item visualization, context menu, and tooltip.
 * This is a test if a global context is passed to the islands created by yFiles.
 */
export default function Islands() {
  const colors = ['lime', 'fuchsia', 'dodgerblue', 'salmon']

  const [color, setColor] = useState('tomato')

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ColorContext.Provider value={color}>
        <button
          style={{ backgroundColor: color }}
          onClick={() => {
            setColor(colors[(Math.random() * 4) | 0])
          }}
        >
          Change Color
        </button>
        <OrgChart
          data={largeOrgchartData}
          renderItem={RenderItem}
          renderTooltip={MyTooltipComponent}
          renderContextMenu={RenderMenu}
        ></OrgChart>
      </ColorContext.Provider>
    </div>
  )
}
