import {
  type GraphComponent,
  GraphItemTypes,
  GraphViewerInputMode,
  IGraph,
  INode,
  IPort,
  type KeyboardInputMode,
  ModifierKeys,
  IPortStyle,
  HoveredItemChangedEventArgs
} from '@yfiles/yfiles'
import type { OrgChartItem } from '../OrgChart'
import { getOrgChartItem } from './data-loading'
import { OrgChartModel } from '../OrgChartModel'
import { enableSingleSelection } from './SingleSelectionHelper.ts'

/**
 * Set up the graph viewer input mode to and enables interactivity to expand and collapse subtrees.
 */
export function initializeInputMode(graphComponent: GraphComponent, orgChart: OrgChartModel): void {
  const graphViewerInputMode = new GraphViewerInputMode({
    clickableItems: GraphItemTypes.NODE | GraphItemTypes.PORT,
    selectableItems: GraphItemTypes.NODE,
    marqueeSelectableItems: GraphItemTypes.NONE,
    toolTipItems: GraphItemTypes.NONE,
    contextMenuItems: GraphItemTypes.NODE | GraphItemTypes.EDGE,
    focusableItems: GraphItemTypes.NODE,
    clickHitTestOrder: [GraphItemTypes.PORT, GraphItemTypes.NODE]
  })
  graphViewerInputMode.addEventListener('item-double-clicked', evt => {
    const item = evt.item
    if (item instanceof INode) {
      orgChart.zoomToItem(getOrgChartItem(item))
    }
  })

  initializeHighlights(graphComponent)

  graphComponent.inputMode = graphViewerInputMode

  enableSingleSelection(graphComponent)
}

export function initializeHover<TOrgChartItem extends OrgChartItem>(
  onHover: ((item: TOrgChartItem | null, oldItem?: TOrgChartItem | null) => void) | undefined,
  graphComponent: GraphComponent
) {
  const inputMode = graphComponent.inputMode as GraphViewerInputMode
  inputMode.itemHoverInputMode.hoverItems = GraphItemTypes.NODE
  const hoverItemChangedListener = (evt: HoveredItemChangedEventArgs): void => {
    // we use the highlight manager to highlight hovered items
    const manager = graphComponent.highlightIndicatorManager
    if (evt.oldItem) {
      manager.items?.remove(evt.oldItem)
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition,@typescript-eslint/strict-boolean-expressions
    if (evt.item) {
      manager.items?.add(evt.item)
    }

    if (onHover) {
      onHover(evt.item?.tag, evt.oldItem?.tag)
    }
  }
  inputMode.itemHoverInputMode.addEventListener('hovered-item-changed', hoverItemChangedListener)
  return hoverItemChangedListener
}

/**
 * Enables collapsing and expanding nodes by clicking on node ports and with keyboard commands.
 */
export function initializeInteractivity(
  graphComponent: GraphComponent,
  orgChartGraph: OrgChartModel,
  completeGraph: IGraph
): void {
  const graphViewerInputMode = graphComponent.inputMode as GraphViewerInputMode
  initializeClickablePorts(graphViewerInputMode, orgChartGraph, completeGraph)
  initializeKeyboardInputMode(graphViewerInputMode.keyboardInputMode, graphComponent, orgChartGraph)
}

/**
 * Adds and returns the listener when the currentItem changes. The return is needed so that the listener
 * can be removed from the graph.
 */
export function initializeFocus<TOrgChartItem extends OrgChartItem>(
  onFocus: ((item: TOrgChartItem | null) => void) | undefined,
  graphComponent: GraphComponent
) {
  let currentItemChangedListener = () => {}
  if (onFocus) {
    // display information about the current employee
    currentItemChangedListener = () => {
      const currentItem = graphComponent.currentItem
      if (currentItem instanceof INode) {
        onFocus(getOrgChartItem<TOrgChartItem>(currentItem))
      } else {
        onFocus(null)
      }
    }
  }
  graphComponent.addEventListener('current-item-changed', currentItemChangedListener)
  return currentItemChangedListener
}

/**
 * Adds and returns the listener when the selected item changes. The return is needed so that the listener
 * can be removed from the graph.
 */
export function initializeSelection<TOrgChartItem extends OrgChartItem>(
  onSelect: ((selectedItems: TOrgChartItem[]) => void) | undefined,
  graphComponent: GraphComponent
) {
  let itemSelectionChangedListener = () => {}
  if (onSelect) {
    // display information about the current employee
    itemSelectionChangedListener = () => {
      const selectedItems = graphComponent.selection.nodes
        .map(node => getOrgChartItem<TOrgChartItem>(node))
        .toArray()
      onSelect(selectedItems)
    }
  }
  graphComponent.selection.addEventListener('item-added', itemSelectionChangedListener)
  graphComponent.selection.addEventListener('item-removed', itemSelectionChangedListener)
  return itemSelectionChangedListener
}

/**
 * Initializes the highlights for selected or focused elements.
 */
function initializeHighlights(graphComponent: GraphComponent): void {
  graphComponent.graph.decorator.nodes.selectionRenderer.hide()
  graphComponent.graph.decorator.nodes.focusRenderer.hide()
}

/**
 * Modifies the given input mode to support the collapse/expand functionality on port clicks.
 */
function initializeClickablePorts(
  graphViewerInputMode: GraphViewerInputMode,
  orgChartGraph: OrgChartModel,
  completeGraph: IGraph
): void {
  // add ports to the clickable items
  graphViewerInputMode.clickableItems = GraphItemTypes.NODE | GraphItemTypes.PORT
  graphViewerInputMode.clickHitTestOrder = [GraphItemTypes.PORT, GraphItemTypes.NODE]

  // listen to clicks on items
  graphViewerInputMode.addEventListener('item-clicked', evt => {
    const port = evt.item
    if (
      port instanceof IPort &&
      completeGraph.inEdgesAt(port).size === 0 &&
      port.style !== IPortStyle.VOID_PORT_STYLE
    ) {
      // if the item is a port, and it has not incoming edges expand or collapse the subtree
      const node = port.owner
      if (node instanceof INode) {
        const item = getOrgChartItem(node)
        if (orgChartGraph.canShowSubordinates(item)) {
          void orgChartGraph.showSubordinates(item)
        } else {
          if (orgChartGraph.canHideSubordinates(item)) {
            void orgChartGraph.hideSubordinates(item)
          }
        }
      }
      evt.handled = true
    }
  })
}

/**
 * Adds key bindings for collapse/expand subtrees
 */
function initializeKeyboardInputMode(
  keyboardInputMode: KeyboardInputMode,
  graphComponent: GraphComponent,
  orgChartGraph: OrgChartModel
): void {
  keyboardInputMode.addKeyBinding('*', ModifierKeys.NONE, () => {
    if (orgChartGraph.canShowAll()) {
      void orgChartGraph.showAll()
    }
  })

  keyboardInputMode.addKeyBinding('-', ModifierKeys.NONE, () => {
    if (
      graphComponent.currentItem instanceof INode &&
      orgChartGraph.canHideSubordinates(getOrgChartItem(graphComponent.currentItem))
    ) {
      void orgChartGraph.hideSubordinates(getOrgChartItem(graphComponent.currentItem))
      return true
    }
    return false
  })
  keyboardInputMode.addKeyBinding('+', ModifierKeys.NONE, () => {
    if (
      graphComponent.currentItem instanceof INode &&
      orgChartGraph.canShowSubordinates(getOrgChartItem(graphComponent.currentItem))
    ) {
      void orgChartGraph.showSubordinates(getOrgChartItem(graphComponent.currentItem))
      return true
    }
    return false
  })
  keyboardInputMode.addKeyBinding('PageDown', ModifierKeys.NONE, () => {
    if (
      graphComponent.currentItem instanceof INode &&
      orgChartGraph.canHideSuperior(getOrgChartItem(graphComponent.currentItem))
    ) {
      void orgChartGraph.hideSuperior(getOrgChartItem(graphComponent.currentItem))
      return true
    }
    return false
  })
  keyboardInputMode.addKeyBinding('PageUp', ModifierKeys.NONE, () => {
    if (
      graphComponent.currentItem instanceof INode &&
      orgChartGraph.canShowSuperior(getOrgChartItem(graphComponent.currentItem))
    ) {
      void orgChartGraph.showSuperior(getOrgChartItem(graphComponent.currentItem))
      return true
    }
    return false
  })
}
