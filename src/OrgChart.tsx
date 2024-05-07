import {
  ComponentType,
  CSSProperties,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from 'react'
import {
  FilteredGraphWrapper,
  GraphComponent,
  GraphHighlightIndicatorManager,
  GraphViewerInputMode,
  IArrow,
  IGraph,
  PolylineEdgeStyle,
  Size,
  VoidNodeStyle
} from 'yfiles'
import {
  initializeFocus,
  initializeHover,
  initializeInputMode,
  initializeInteractivity,
  initializeSelection
} from './core/input'
import './styles/orgchart-style.css'
import {
  checkLicense,
  ContextMenu,
  ContextMenuItemProvider,
  EdgeStyle as ConnectionStyle,
  LicenseError,
  NodeRenderInfo,
  Popup,
  ReactComponentHtmlNodeStyle,
  ReactNodeRendering,
  RenderContextMenuProps,
  RenderNodeProps as RenderItemProps,
  RenderPopupProps,
  RenderTooltipProps,
  Tooltip,
  useGraphSearch,
  useReactNodeRendering,
  withGraphComponent
} from '@yworks/react-yfiles-core'
import {
  OrgChartProvider,
  useOrgChartContext,
  useOrgChartContextInternal
} from './OrgChartProvider.tsx'
import { setPortStylesToFirstOutgoingPorts } from './styles/orgchart-port-style.ts'
import { RenderOrgChartItem } from './styles/Templates.tsx'
import { initializeGraphManager } from './core/data-loading.ts'
import { OrgChartModel, OrgChartModelInternal } from './OrgChartModel.ts'

/**
 * The item's unique id.
 */
export type OrgChartItemId = string | number

/**
 * The basic data type for the data items visualized by the {@link OrgChart} component.
 */
export interface OrgChartItem {
  /**
   * The item's unique id.
   */
  id: OrgChartItemId
  /**
   * Specifies the subordinates of this item.
   * This array should contain ids of items from the {@link OrgChartProps.data}.
   */
  subordinates?: OrgChartItemId[]
  /**
   * Whether this item is an assistant. Assistants are placed on a separate layer between their superior
   * and their non-assistant subordinates.
   */
  assistant?: boolean
  /**
   * The optional render width of this item. If the width is not specified, it is determined by measuring the
   * item visualization unless a default size is defined by {@link OrgChartProps.nodeSize}.
   */
  width?: number
  /**
   * The optional render height of this item. If the height is not specified, it is determined by measuring the
   * item visualization unless a default size is defined by {@link OrgChartProps.nodeSize}.
   */
  height?: number
  /**
   * The optional CSS class name that can be accessed in a custom component that renders the item.
   */
  className?: string
  /**
   * The optional CSS style that can be accessed in a custom component that renders the item.
   */
  style?: CSSProperties
}

/**
 * A data type that combines custom data props with the {@link OrgChartItem}. Data needs to fit in
 * this type so the component can handle the structure of the organizational chart correctly.
 */
export type CustomOrgChartItem<
  TCustomProps = {
    status?: 'present' | 'busy' | 'travel' | 'unavailable'
    position?: string
    name?: string
    email?: string
    phone?: string
    fax?: string
    businessUnit?: string
    icon?: string
  }
> = TCustomProps & OrgChartItem

/**
 * A type that consists of a list of custom data. It can be used to ensure that the input data has the
 * correct format and to adjust custom components that visualize items or context menus.
 */
export type CustomOrgChartData<TCustomProps> = CustomOrgChartItem<TCustomProps>[]

/**
 * The basic data type for the connections between data items visualized by the {@link OrgChart} component.
 */
export interface OrgChartConnection {
  source: OrgChartItem
  target: OrgChartItem
}

/**
 * A function type that provides connection styles between two items in an organization chart.
 * The source/target represents the start/end item of the connection, respectively.
 */
export type ConnectionStyleProvider<TOrgChartItem extends OrgChartItem> = (
  source: TOrgChartItem,
  target: TOrgChartItem
) => ConnectionStyle | undefined

/**
 * A callback type invoked when an item has been focused.
 */
export type ItemFocusedListener<TOrgChartItem extends OrgChartItem> = (
  item: TOrgChartItem | null
) => void

/**
 * A callback type invoked when an item has been selected or deselected.
 */
export type ItemSelectedListener<TOrgChartItem extends OrgChartItem> = (
  selectedItems: TOrgChartItem[]
) => void

/**
 * A callback type invoked when the hovered item has changed.
 */
export type ItemHoveredListener<TOrgChartItem extends OrgChartItem> = (
  item: TOrgChartItem | null,
  oldItem?: TOrgChartItem | null
) => void

/**
 * A function that returns whether the given item matches the search needle.
 */
export type SearchFunction<TOrgChartItem extends OrgChartItem, TNeedle = string> = (
  item: TOrgChartItem,
  needle: TNeedle
) => boolean

/**
 * The props for the {@link OrgChart} component.
 */
export interface OrgChartProps<TOrgChartItem extends OrgChartItem, TNeedle> {
  /**
   * The data items visualized by the organization chart.
   */
  data: TOrgChartItem[]
  /**
   * An optional callback that's called when an item is focused.
   *
   * Note that the focused item is not changed if the empty canvas is clicked.
   */
  onItemFocus?: ItemFocusedListener<TOrgChartItem>
  /**
   * An optional callback that's called when an item is selected or deselected.
   */
  onItemSelect?: ItemSelectedListener<TOrgChartItem>
  /**
   * An optional callback that's called when the hovered item has changed.
   */
  onItemHover?: ItemHoveredListener<TOrgChartItem>
  /**
   * A string or a complex object to search for.
   *
   * The default search implementation can only handle strings and searches on the properties of the
   * data item. For more complex search logic, provide an {@link OrgChart.onSearch} callback.
   */
  searchNeedle?: TNeedle
  /**
   * An optional callback that returns whether the given item matches the search needle.
   *
   * The default search implementation only supports string needles and searches all properties of the data item.
   * Provide this callback to implement custom search logic.
   */
  onSearch?: SearchFunction<TOrgChartItem, TNeedle>
  /**
   * A custom render component used for rendering the given data item.
   */
  renderItem?: ComponentType<RenderItemProps<TOrgChartItem>> | undefined
  /**
   * A function that provides a style configuration for the given connection.
   */
  connectionStyles?: ConnectionStyleProvider<TOrgChartItem>
  /**
   * Specifies the CSS class used for the {@link OrgChart} component.
   */
  className?: string
  /**
   * Specifies whether the interactive collapse and expand buttons on the orgchart nodes are visible.
   * The default is true.
   */
  interactive?: boolean
  /**
   * Specifies the CSS style used for the {@link OrgChart} component.
   */
  style?: CSSProperties
  /**
   * Specifies the default item size used when no explicit width and height are provided.
   */
  itemSize?: { width: number; height: number }
  /**
   * An optional component that can be used for rendering a custom tooltip.
   */
  renderTooltip?: ComponentType<RenderTooltipProps<TOrgChartItem>>
  /**
   * An optional function specifying the context menu items for a data item.
   */
  contextMenuItems?: ContextMenuItemProvider<TOrgChartItem>
  /**
   * An optional component that renders a custom context menu.
   */
  renderContextMenu?: ComponentType<RenderContextMenuProps<TOrgChartItem>>
  /**
   * The optional position of the popup. The default is 'north'.
   */
  popupPosition?:
    | 'east'
    | 'north'
    | 'north-east'
    | 'north-west'
    | 'south'
    | 'south-east'
    | 'south-west'
    | 'west'
  /**
   * An optional component used for rendering a custom popup.
   */
  renderPopup?: ComponentType<RenderPopupProps<TOrgChartItem>>
  /**
   * Specifies whether the layout algorithm should consider the existing elements as fixed.
   * True if the layout should only place newly added items, false otherwise.
   */
  incrementalLayout?: boolean
}

function checkStylesLoaded(root: HTMLElement | null) {
  const dummy = document.createElement('div')
  dummy.id = 'yfiles-react-stylesheet-detection'
  const rootNode = root?.getRootNode() ?? document
  const parent = rootNode === document ? document.body : rootNode
  parent.appendChild(dummy)
  const computedStyle = getComputedStyle(dummy)
  const hasStyle = computedStyle.fontSize === '1px'

  if (!hasStyle) {
    console.warn(
      "Stylesheet not loaded! Please import 'dist/index.css' from the @yworks/react-yfiles-orgchart package."
    )
  }
  dummy.remove()
}

const licenseErrorCodeSample = `import {OrgChart, registerLicense} from '@yworks/react-yfiles-orgchart' 
import '@yworks/react-yfiles-orgchart/dist/index.css'
import yFilesLicense from './license.json'

function App() {
  registerLicense(yFilesLicense)
            
  const data = [
    {id: 0, name: 'Eric Joplin', subordinates: [1, 2]},
    {id: 1, name: 'Amy Kain'},
    {id: 2, name: 'David Kerry'}
  ]

  return <OrgChart data={data}></OrgChart>
}`

/**
 * The OrgChart component visualizes the given data as an organization chart.
 * All data items have to be included in the [data]{@link OrgChartProps.data}. The relationship between an item
 * and its subordinates is specified in the [subordinates]{@link OrgChartItem.subordinates}.
 *
 * ```tsx
 * function OrganizationChart() {
 *   return (
 *     <OrgChart data={data}> </OrgChart>
 *   )
 * }
 * ```
 */
export function OrgChart<TOrgChartItem extends OrgChartItem = CustomOrgChartItem, TNeedle = string>(
  props: OrgChartProps<TOrgChartItem, TNeedle> & PropsWithChildren
) {
  if (!checkLicense()) {
    return (
      <LicenseError
        componentName={'yFiles React Organization Chart Component'}
        codeSample={licenseErrorCodeSample}
      />
    )
  }

  const isWrapped = useOrgChartContextInternal()
  if (isWrapped) {
    return <OrgChartCore {...props}>{props.children}</OrgChartCore>
  }

  return (
    <OrgChartProvider>
      <OrgChartCore {...props}>{props.children}</OrgChartCore>
    </OrgChartProvider>
  )
}

const OrgChartCore = withGraphComponent(
  <TOrgChartItem extends OrgChartItem, TNeedle>({
    children,
    interactive = true,
    renderItem,
    connectionStyles,
    onItemHover,
    onSearch,
    onItemFocus,
    onItemSelect,
    data,
    searchNeedle,
    itemSize,
    renderTooltip,
    contextMenuItems,
    renderContextMenu,
    popupPosition,
    renderPopup,
    incrementalLayout
  }: OrgChartProps<TOrgChartItem, TNeedle> & PropsWithChildren) => {
    // the orgchart graph supports expanding collapsing subtrees
    const orgChartGraph = useOrgChartContext()

    const graphComponent = orgChartGraph.graphComponent

    const { nodeInfos, setNodeInfos } = useReactNodeRendering<TOrgChartItem>()

    const { graphManager } = useMemo(() => {
      const filteredGraph = graphComponent.graph as FilteredGraphWrapper
      const completeGraph = filteredGraph.wrappedGraph!

      initializeDefaultStyle(graphComponent, completeGraph, setNodeInfos, itemSize)

      // populate the graph with the sample data and set default styles
      const graphManager = initializeGraphManager<TOrgChartItem>(completeGraph, setNodeInfos)

      // initializes basic interaction with the graph including the properties panel
      initializeInputMode(graphComponent, orgChartGraph)

      return {
        graphManager
      }
    }, [])

    useEffect(() => {
      checkStylesLoaded(graphComponent.div)
    }, [])

    useEffect(() => {
      initializeDefaultStyle(
        graphComponent,
        (graphComponent.graph as FilteredGraphWrapper).wrappedGraph!,
        setNodeInfos,
        itemSize
      )
    }, [data, itemSize, connectionStyles, renderItem])

    useEffect(() => {
      const hoverItemChangedListener = initializeHover(onItemHover, graphComponent)

      return () => {
        // clean up
        hoverItemChangedListener &&
          (
            graphComponent.inputMode as GraphViewerInputMode
          ).itemHoverInputMode.removeHoveredItemChangedListener(hoverItemChangedListener)
      }
    }, [onItemHover])

    useEffect(() => {
      // initialize the focus and selection to display the information of the selected element
      const currentItemChangedListener = initializeFocus(onItemFocus, graphComponent)
      const selectedItemChangedListener = initializeSelection(onItemSelect, graphComponent)

      // prepares the graph component and the graph to interactively collapse/expand subtrees
      initializeInteractivity(
        graphComponent,
        orgChartGraph,
        (graphComponent.graph as FilteredGraphWrapper).wrappedGraph!
      )

      return () => {
        // clean up the listeners
        currentItemChangedListener &&
          graphComponent.removeCurrentItemChangedListener(currentItemChangedListener)
        selectedItemChangedListener &&
          graphComponent.selection.removeItemSelectionChangedListener(selectedItemChangedListener)
      }
    }, [onItemFocus, onItemSelect])

    useEffect(() => {
      graphManager.updateGraph(data, renderItem, connectionStyles)
    }, [data, itemSize?.width, itemSize?.height, connectionStyles, renderItem])

    useEffect(() => {
      setPortStylesToFirstOutgoingPorts(graphComponent.graph, interactive)
    }, [interactive, data])

    const graphSearch = useGraphSearch(graphComponent, searchNeedle, onSearch)
    // provide search hits on the context
    orgChartGraph.getSearchHits = () => graphSearch.matchingNodes.map(n => n.tag)

    // fit graph after initial measurement
    const [finishedInitialMeasurement, setFinishedInitialMeasurement] = useState(false)
    useLayoutEffect(() => {
      graphComponent.fitGraphBounds()
    }, [finishedInitialMeasurement])

    // trigger node measuring on data change
    const [nodeData, setNodeData] = useState<TOrgChartItem[]>([])
    useEffect(() => {
      setFinishedInitialMeasurement(false) // re-trigger initial finish handler when data was replaced
      setNodeData(data)
    }, [data])

    return (
      <>
        <ReactNodeRendering
          nodeData={nodeData}
          nodeInfos={nodeInfos}
          nodeSize={itemSize}
          onMeasured={() => {
            orgChartGraph.applyLayout(incrementalLayout, graphManager.incrementalElements)
            setFinishedInitialMeasurement(true)
          }}
          onRendered={isInternalOrgchartModel(orgChartGraph) ? orgChartGraph.onRendered : undefined}
        />
        {renderTooltip && <Tooltip renderTooltip={renderTooltip}></Tooltip>}
        {(contextMenuItems || renderContextMenu) && (
          <ContextMenu menuItems={contextMenuItems} renderMenu={renderContextMenu}></ContextMenu>
        )}
        {renderPopup && <Popup position={popupPosition} renderPopup={renderPopup}></Popup>}
        {children}
      </>
    )
  }
)

function isInternalOrgchartModel(model: OrgChartModel): model is OrgChartModelInternal {
  return 'onRendered' in model
}

/**
 * Sets style defaults for nodes and edges.
 */
function initializeDefaultStyle<TOrgChartItem extends OrgChartItem>(
  graphComponent: GraphComponent,
  graph: IGraph,
  setNodeInfos: Dispatch<SetStateAction<NodeRenderInfo<TOrgChartItem>[]>>,
  nodeSize?: { width: number; height: number }
): void {
  graph.nodeDefaults.style = new ReactComponentHtmlNodeStyle<TOrgChartItem>(
    RenderOrgChartItem,
    setNodeInfos
  )

  if (nodeSize) {
    graph.nodeDefaults.size = new Size(nodeSize.width, nodeSize.height)
  }

  graph.edgeDefaults.style = new PolylineEdgeStyle({
    stroke: '2px rgb(170, 170, 170)',
    targetArrow: IArrow.NONE
  })

  // Hide the default highlight in favor of the CSS highlighting from the template styles
  graphComponent.highlightIndicatorManager = new GraphHighlightIndicatorManager({
    nodeStyle: VoidNodeStyle.INSTANCE
  })
}
