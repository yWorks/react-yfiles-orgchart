import { CustomOrgChartItem, OrgChart, OrgChartConnection, OrgChartItem } from '../OrgChart.tsx'
import {
  ContextMenuItem,
  ControlButton,
  DefaultControlButtons,
  RenderNodeProps as RenderItemProps,
  RenderTooltipProps,
  RenderPopupProps
} from '@yworks/react-yfiles-core'
import { useOrgChartContext } from '../OrgChartProvider.tsx'
import { useMemo, useState } from 'react'
import './orgchart-style.css'

/**
 * A default component that visualizes nodes in the organization chart. It is optimized for data items
 * of the type Employee. However, it will render other properties, too. The component can be adjusted for each item
 * individually or for all items at once by setting {@link OrgChartItem.className} or {@link OrgChartItem.style} in the
 * data.
 *
 * ```ts
 * type Employee = {
 *   status: 'present' | 'busy' | 'travel' | 'unavailable'
 *   position: string
 *   name: string
 *   email: string
 *   phone: string
 *   icon: string
 * }
 * ```
 *
 * The component is already used as a fallback if no render prop is specified on {@link OrgChart}.
 * However, it can be integrated in another component, for example to have different styles for different items.
 *
 * ```tsx
 * function OrganizationChart() {
 *   const MyOrgChartItem = useMemo(
 *     () => (props: RenderItemProps<CustomOrgChartItem<Employee>>) => {
 *       const { dataItem } = props
 *       if (dataItem?.name === 'Eric Joplin') {
 *         return (
 *           <>
 *             <div
 *               style={{
 *                 backgroundColor: 'blue',
 *                 width: '100%',
 *                 height: '100%'
 *               }}
 *             >
 *               <div>{dataItem.name}</div>
 *             </div>
 *           </>
 *         )
 *       } else {
 *         return <RenderOrgChartItem {...props}></RenderOrgChartItem>
 *       }
 *     },
 *     []
 *   )
 *
 *   return (
 *     <OrgChart data={data} renderItem={MyOrgChartItem}></OrgChart>
 *   )
 * }
 * ```
 */
export function RenderOrgChartItem<TOrgChartItem extends OrgChartItem>({
  dataItem,
  detail,
  hovered,
  focused,
  selected
}: RenderItemProps<TOrgChartItem>) {
  const customOrgChartItem = dataItem as CustomOrgChartItem
  const properties = findProperties(customOrgChartItem)

  return (
    <>
      <div
        style={{ width: '100%', height: '100%', overflow: 'hidden' }}
        className={getHighlightClasses(selected, hovered, focused)}
      >
        {detail === 'high' ? (
          <div
            className={`${customOrgChartItem.className ?? ''} yfiles-react-detail-node`.trim()}
            style={customOrgChartItem.style ?? {}}
          >
            {customOrgChartItem.status && (
              <div
                className={`yfiles-react-detail-node__status-bar yfiles-react-${customOrgChartItem.status}`}
              ></div>
            )}
            <div className="yfiles-react-detail-node__content">
              {customOrgChartItem.icon && (
                <div className="yfiles-react-detail-node__icon-container">
                  <img
                    src={customOrgChartItem.icon}
                    alt="icon"
                    className="yfiles-react-detail-node__icon"
                  />
                </div>
              )}
              <div className="yfiles-react-detail-node__data-container">
                {customOrgChartItem.name && (
                  <div className="yfiles-react-detail-node__name">{customOrgChartItem.name}</div>
                )}
                {customOrgChartItem.position && (
                  <div className="yfiles-react-detail-node__position">
                    {customOrgChartItem.position}
                  </div>
                )}
                {customOrgChartItem.email && <div>{customOrgChartItem.email}</div>}
                {customOrgChartItem.phone && <div>{customOrgChartItem.phone}</div>}
                {properties
                  .filter(property =>
                    [
                      'id',
                      'className',
                      'style',
                      'subordinates',
                      'width',
                      'height',
                      'assistant'
                    ].every(key => property !== key)
                  )
                  .map((property, i) => (
                    // @ts-ignore
                    <div key={i}>{stringifyData(customOrgChartItem[property])}</div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`yfiles-react-overview-node yfiles-react-${
              customOrgChartItem.status ?? ''
            } ${customOrgChartItem.className ?? ''}`.trim()}
            style={customOrgChartItem.style ?? {}}
          >
            {customOrgChartItem.name ?? customOrgChartItem.id}
          </div>
        )}
      </div>
    </>
  )
}

function getHighlightClasses(selected: boolean, hovered: boolean, focused: boolean): string {
  const highlights = ['yfiles-react-node-highlight']
  if (focused) {
    highlights.push('yfiles-react-node-highlight--focused')
  }
  if (hovered) {
    highlights.push('yfiles-react-node-highlight--hovered')
  }
  if (selected) {
    highlights.push('yfiles-react-node-highlight--selected')
  }
  return highlights.join(' ')
}

function findProperties(data: CustomOrgChartItem) {
  const defaultProperties = ['position', 'name', 'email', 'phone', 'icon', 'status']
  return Object.keys(data)
    .sort((property1, property2) => {
      const p1 = defaultProperties.indexOf(property1)
      const p2 = defaultProperties.indexOf(property2)

      if (p1 >= 0 && p2 >= 0) {
        return p1 - p2
      } else if (p1 >= 0) {
        return -1
      } else if (p2 >= 0) {
        return 1
      } else {
        return 0
      }
    })
    .slice(0, 6)
    .filter(property => !defaultProperties.includes(property))
}

/**
 * A default template for the organization chart's tooltip that shows the name property of the data item.
 *
 * ```tsx
 * function OrganizationChart() {
 *   return (
 *     <OrgChart data={data} renderTooltip={RenderOrgChartTooltip}></OrgChart>
 *   )
 * }
 * ```
 *
 * @param data - The data item to show the tooltip for.
 */
export function RenderOrgChartTooltip<TOrgChartItem extends OrgChartItem>({
  data
}: RenderTooltipProps<TOrgChartItem | OrgChartConnection<TOrgChartItem>>) {
  // Currently, no tooltips are shown for edges.
  if ('source' in data && 'target' in data) {
    return null
  }

  return (
    <div className="yfiles-react-tooltip">
      {stringifyData('name' in data ? data.name : data.id)}
    </div>
  )
}

/**
 * A default template for the organization chart's popup that shows the name property of the data item.
 *
 * ```tsx
 * function OrganizationChart() {
 *   return (
 *     <OrgChart data={data} renderPopup={RenderOrgChartPopup}></OrgChart>
 *   )
 * }
 * ```
 *
 * @param data - The data item to show the popup for.
 */
export function RenderOrgChartPopup<TOrgChartItem extends OrgChartItem>({
  item,
  onClose
}: RenderPopupProps<TOrgChartItem>) {
  return (
    <div className="yfiles-react-popup__content">
      {stringifyData('name' in item ? item.name : item.id)}
      <button onClick={() => onClose()}>x</button>
    </div>
  )
}

/**
 * Default [buttons]{@link ControlsProps.buttons} for the {@link Controls} component that provide
 * useful actions to interact with the organization chart.
 *
 * This includes the following buttons: zoom in, zoom out, zoom to the original size, fit the graph into the viewport, and expand the whole diagram.
 *
 * @returns an array of [control buttons]{@link ControlsProps.buttons}.
 *
 * ```tsx
 * function OrganizationChart() {
 *   return (
 *     <OrgChart data={data}>
 *       <Controls buttons={OrgChartControlButtons}></Controls>
 *     </OrgChart>
 *   )
 * }
 * ```
 */
export function OrgChartControlButtons(): ControlButton[] {
  const items: ControlButton[] = DefaultControlButtons()

  const orgChart = useOrgChartContext()

  const [showAllDisabled, setShowAllDisabled] = useState(!orgChart.canShowAll())
  useMemo(() => {
    orgChart.addGraphUpdatedListener(() => {
      setShowAllDisabled(!orgChart.canShowAll())
    })
  }, [])

  items.push({
    className: 'yfiles-react-controls__button--show-all',
    action: () => orgChart.showAll(),
    tooltip: 'Show All',
    disabled: showAllDisabled
  })

  return items
}

/**
 * Default [context menu items]{@link ContextMenuProps.menuItems} for the context menu component that include the
 * standard orgchart actions: show/hide superior, show/hide subordinates, and show all items.
 *
 * ```tsx
 * function OrganizationChart() {
 *   return (
 *     <OrgChart data={data} contextMenuItems={OrgChartContextMenuItems}></OrgChart>
 *   )
 * }
 * ```
 *
 * @param item - The item to provide the items for.
 * @returns an array of [context menu items]{@link ContextMenuProps.menuItems}.
 */
export function OrgChartContextMenuItems(
  item: OrgChartItem | OrgChartConnection<OrgChartItem> | null
): ContextMenuItem<OrgChartItem>[] {
  const orgChart = useOrgChartContext()

  const items: ContextMenuItem<OrgChartItem>[] = []
  if (item) {
    const superior = 'source' in item ? item.source : item
    const subordinate = 'target' in item ? item.target : item

    if (orgChart.canHideSuperior(subordinate)) {
      items.push({
        title: 'Hide Superior',
        action: () => {
          void orgChart?.hideSuperior(subordinate)
        }
      })
    }
    if (orgChart.canShowSuperior(subordinate)) {
      items.push({
        title: 'Show Superior',
        action: () => {
          void orgChart?.showSuperior(subordinate)
        }
      })
    }
    if (orgChart.canHideSubordinates(superior)) {
      items.push({
        title: 'Hide Subordinates',
        action: () => {
          void orgChart?.hideSubordinates(superior)
        }
      })
    }
    if (orgChart.canShowSubordinates(superior)) {
      items.push({
        title: 'Show Subordinates',
        action: () => {
          void orgChart?.showSubordinates(superior)
        }
      })
    }
  }
  if (orgChart.canShowAll()) {
    items.push({
      title: 'Show all',
      action: () => {
        void orgChart?.showAll()
      }
    })
  }

  return items
}

function stringifyData(data: any): string {
  return typeof data === 'object' ? JSON.stringify(data) : String(data)
}
