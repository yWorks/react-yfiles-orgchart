import { useState } from 'react'
import {
  CustomOrgChartItem,
  OrgChart,
  OrgChartProvider,
  useOrgChartContext
} from '@yworks/react-yfiles-orgchart'
import orgChartData from '../../data/non-tree-orgchart-data.ts'

let id = 100

function OrgChartWithIncrementalLayout() {
  const { getVisibleItems } = useOrgChartContext()!

  const addRandomNode = () => {
    const newId = id++
    const visibleItems = getVisibleItems()
    const data: CustomOrgChartItem = visibleItems[(Math.random() * (visibleItems.length - 1)) | 0]
    if (data.subordinates) {
      data.subordinates.push(newId)
    } else {
      data.subordinates = [newId]
    }
    setReactiveData([
      ...reactiveData,
      {
        id: newId,
        name: 'New Employee ' + newId,
        assistant: Math.random() > 0.7,
        status: 'unavailable',
        email: `newemployee${newId}@yoyodyne.com`,
        phone: '000-111-222',
        fax: '000-111-222-1',
        position: `assistant ${data.position}`,
        businessUnit: data.businessUnit,
        icon: 'https://live.yworks.com/demos/showcase/orgchart/resources/usericon_female1.svg'
      }
    ])
  }

  const [reactiveData, setReactiveData] = useState<CustomOrgChartItem[]>(orgChartData)
  const [incrementalLayout, setIncrementalLayout] = useState<boolean>(false)
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      <div style={{ width: '100%' }}>
        <OrgChart data={reactiveData} incrementalLayout={incrementalLayout}></OrgChart>
      </div>
      <div className={'sidebar'}>
        <button
          onClick={() => {
            setIncrementalLayout(true)
            addRandomNode()
          }}
        >
          Add random node
        </button>
      </div>
    </div>
  )
}

/**
 * Organization charts with different item size settings to test the default item visualization
 */
export default function IncrementalLayout() {
  return (
    <OrgChartProvider>
      <OrgChartWithIncrementalLayout></OrgChartWithIncrementalLayout>
    </OrgChartProvider>
  )
}
