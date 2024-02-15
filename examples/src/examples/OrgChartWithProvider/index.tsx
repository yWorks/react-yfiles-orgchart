import { useCallback, useMemo, useState } from 'react'
import {
  Controls,
  CustomOrgChartItem,
  OrgChart,
  OrgChartContextMenuItems,
  OrgChartControlButtons,
  OrgChartProvider,
  Overview,
  RenderItemProps,
  RenderOrgChartItem,
  useOrgChartContext
} from '@yworks/react-yfiles-orgchart'
import largeOrgchartData from '../../data/large-orgchart-data.ts'
import TooltipTemplate from './TooltipTemplate.tsx'

let id = 100

function OrgChartWithExternalControls() {
  const { showAll, zoomToItem, fitContent, getVisibleItems } = useOrgChartContext()!

  const onFocus = useCallback((item: CustomOrgChartItem | null) => {
    setFocusedItem(item)
  }, [])

  const onSelect = useCallback((items: CustomOrgChartItem[]) => {
    setSelectedItem(items.length ? items[0] : null)
  }, [])

  const onHover = useCallback((item: CustomOrgChartItem | null) => {
    setHoveredItem(item)
  }, [])

  const [searchQuery, setSearchQuery] = useState('')
  const [focusedItem, setFocusedItem] = useState<CustomOrgChartItem | null>(null)
  const [selectedItem, setSelectedItem] = useState<CustomOrgChartItem | null>(null)
  const [hoveredItem, setHoveredItem] = useState<CustomOrgChartItem | null>(null)
  function search(data: CustomOrgChartItem, searchQuery: string): boolean {
    return !!data.email && data.email.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
  }

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

  const [reactiveData, setReactiveData] = useState<CustomOrgChartItem[]>(largeOrgchartData)

  const [interactiveCollapse, setInteractiveCollapse] = useState<boolean>(true)

  const renderItem = useMemo(
    () => (props: RenderItemProps<CustomOrgChartItem>) => {
      const { dataItem } = props
      if (dataItem && dataItem.name?.includes('Eric')) {
        return (
          <>
            <div
              style={{
                backgroundColor: props.selected ? 'gold' : 'red',
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
              <div>{dataItem.name}</div>
            </div>
          </>
        )
      } else {
        return <RenderOrgChartItem {...props}></RenderOrgChartItem>
      }
    },
    []
  )

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      <div style={{ width: '100%' }}>
        <OrgChart
          data={reactiveData}
          interactive={interactiveCollapse}
          onItemHover={onHover}
          onItemFocus={onFocus}
          onItemSelect={onSelect}
          searchNeedle={searchQuery}
          onSearch={search}
          renderItem={renderItem}
          contextMenuItems={(item: CustomOrgChartItem | null) => {
            const menuItems = [...OrgChartContextMenuItems(item)]
            if (item) {
              menuItems.push({
                title: 'Zoom to Item',
                action: () => {
                  item && zoomToItem(item)
                }
              })
            }
            return menuItems
          }}
          renderTooltip={TooltipTemplate}
        ></OrgChart>
      </div>
      <div className={'sidebar'}>
        <Overview className="sidebar-overview" position={'custom'}></Overview>
        <Controls
          className="sidebar-controls"
          orientation={'horizontal'}
          position={'custom'}
          buttons={() => {
            const buttons = [
              ...OrgChartControlButtons().filter(button => button.className !== 'zoom-original')
            ]
            buttons.push({
              className: 'zoom-to-item',
              action: () => {
                focusedItem && zoomToItem(focusedItem)
              },
              disabled: !focusedItem,
              tooltip: 'Zoom To Item'
            })
            return buttons
          }}
        ></Controls>
        <button onClick={() => showAll()}>Show All</button>
        <button
          onClick={() => {
            fitContent()
          }}
        >
          Fit Graph Bounds
        </button>
        <button
          onClick={() => {
            addRandomNode()
          }}
        >
          Add random node
        </button>
        <div className="info-panel">
          <div>
            <span>Focused: </span>
            <span>{focusedItem?.name ?? 'No item clicked'}</span>
          </div>
          <div>
            <span>Selected: </span>
            <span>{selectedItem?.name ?? 'No item selected'}</span>
          </div>
          <div>
            <span>Hovered: </span>
            <span>{hoveredItem?.name ?? 'No item hovered'}</span>
          </div>
        </div>
        <p>
          <input
            id="editableInput"
            checked={interactiveCollapse}
            type="checkbox"
            onChange={() => {
              setInteractiveCollapse(!interactiveCollapse)
            }}
          ></input>
          <label htmlFor="editableInput">&nbsp;Interactive</label>{' '}
        </p>
        <p>
          <label htmlFor="searchInput">Search Email:&nbsp;</label>
          <input
            id="searchInput"
            type="search"
            onChange={i => {
              setSearchQuery(i.target.value)
            }}
          />
        </p>
      </div>
    </div>
  )
}

/**
 * Organization charts with different item size settings to test the default item visualization
 */
export default function OrgChartWithTemplates() {
  return (
    <OrgChartProvider>
      <OrgChartWithExternalControls></OrgChartWithExternalControls>
    </OrgChartProvider>
  )
}
