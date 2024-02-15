import {
  type GraphComponent,
  GraphFocusIndicatorManager,
  GraphItemTypes,
  GraphViewerInputMode,
  HoveredItemChangedEventArgs,
  ICommand,
  IGraph,
  INode,
  IPort,
  ItemHoverInputMode,
  Key,
  type KeyboardInputMode,
  ModifierKeys,
  ShowFocusPolicy,
  VoidNodeStyle,
  VoidPortStyle
} from 'yfiles'
import { initializePortStyle } from '../styles/orgchart-port-style'
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
  graphViewerInputMode.addItemDoubleClickedListener((_, evt) => {
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
  let hoverItemChangedListener = (
    sender: ItemHoverInputMode,
    evt: HoveredItemChangedEventArgs
  ) => {}
  inputMode.itemHoverInputMode.hoverItems = GraphItemTypes.NODE
  hoverItemChangedListener = (_, evt): void => {
    // we use the highlight manager to highlight hovered items
    const manager = graphComponent.highlightIndicatorManager
    if (evt.oldItem) {
      manager.removeHighlight(evt.oldItem)
    }
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition,@typescript-eslint/strict-boolean-expressions
    if (evt.item) {
      manager.addHighlight(evt.item)
    }

    if (onHover) {
      onHover(evt.item?.tag, evt.oldItem?.tag)
    }
  }
  inputMode.itemHoverInputMode.addHoveredItemChangedListener(hoverItemChangedListener)
  inputMode.itemHoverInputMode.hoverItems = GraphItemTypes.NODE
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
  // set the port style after the graph is built, since we need to know the graph structure
  initializePortStyle()
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
  graphComponent.addCurrentItemChangedListener(currentItemChangedListener)
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
      const selectedItems = graphComponent.selection.selectedNodes
        .map(node => getOrgChartItem<TOrgChartItem>(node))
        .toArray()
      onSelect(selectedItems)
    }
  }
  graphComponent.selection.addItemSelectionChangedListener(itemSelectionChangedListener)
  return itemSelectionChangedListener
}

/**
 * Initializes the highlights for selected or focused elements.
 */
function initializeHighlights(graphComponent: GraphComponent): void {
  graphComponent.selectionIndicatorManager.enabled = false

  // Hide the default focus highlight in favor of the CSS highlighting from the template styles
  graphComponent.focusIndicatorManager = new GraphFocusIndicatorManager({
    showFocusPolicy: ShowFocusPolicy.ALWAYS,
    nodeStyle: VoidNodeStyle.INSTANCE
  })
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
  graphViewerInputMode.addItemClickedListener((_, evt) => {
    const port = evt.item
    if (
      port instanceof IPort &&
      completeGraph.inEdgesAt(port).size === 0 &&
      port.style !== VoidPortStyle.INSTANCE
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
  const showAllCommand = ICommand.createCommand()

  keyboardInputMode.addCommandBinding(
    showAllCommand,
    () => {
      void orgChartGraph.showAll()
      return true
    },
    () => orgChartGraph.canShowAll()
  )
  keyboardInputMode.addKeyBinding(Key.MULTIPLY, ModifierKeys.NONE, showAllCommand)

  keyboardInputMode.addKeyBinding({
    key: Key.SUBTRACT,
    execute: () => {
      if (graphComponent.currentItem instanceof INode) {
        void orgChartGraph.hideSubordinates(getOrgChartItem(graphComponent.currentItem))
        return true
      }
      return false
    },
    canExecute: () =>
      graphComponent.currentItem instanceof INode &&
      orgChartGraph.canHideSubordinates(getOrgChartItem(graphComponent.currentItem))
  })
  keyboardInputMode.addKeyBinding({
    key: Key.ADD,
    execute: () => {
      if (graphComponent.currentItem instanceof INode) {
        void orgChartGraph.showSubordinates(getOrgChartItem(graphComponent.currentItem))
        return true
      }
      return false
    },
    canExecute: () =>
      graphComponent.currentItem instanceof INode &&
      orgChartGraph.canShowSubordinates(getOrgChartItem(graphComponent.currentItem))
  })
  keyboardInputMode.addKeyBinding({
    key: Key.PAGE_DOWN,
    execute: () => {
      if (graphComponent.currentItem instanceof INode) {
        void orgChartGraph.hideSuperior(getOrgChartItem(graphComponent.currentItem))
        return true
      }
      return false
    },
    canExecute: () =>
      graphComponent.currentItem instanceof INode &&
      orgChartGraph.canHideSuperior(getOrgChartItem(graphComponent.currentItem))
  })
  keyboardInputMode.addKeyBinding({
    key: Key.PAGE_UP,
    execute: () => {
      if (graphComponent.currentItem instanceof INode) {
        void orgChartGraph.showSuperior(getOrgChartItem(graphComponent.currentItem))
        return true
      }
      return false
    },
    canExecute: () =>
      graphComponent.currentItem instanceof INode &&
      orgChartGraph.canShowSuperior(getOrgChartItem(graphComponent.currentItem))
  })
}
