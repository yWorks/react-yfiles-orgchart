import { GraphComponent, ICommand, IEdge, IGraph, INode } from 'yfiles'
import { OrgChartConnection, OrgChartItem } from './OrgChart'
import { CollapsibleTree } from './core/CollapsibleTree'
import {
  exportImageAndSave,
  type ExportSettings,
  exportSvgAndSave,
  printDiagram,
  type PrintSettings
} from '@yworks/react-yfiles-core'

/**
 * The OrgChartModel provides common functionality to interact with the {@link OrgChart} component.
 */
export interface OrgChartModel {
  /**
   * The [yFiles GraphComponent]{@link http://docs.yworks.com/yfileshtml/#/api/GraphComponent} used
   * by the {@link OrgChart} component to display the graph.
   *
   * This property is intended for advanced users who have a familiarity with the
   * [yFiles for HTML]{@link https://www.yworks.com/products/yfiles-for-html} library.
   */
  graphComponent: GraphComponent

  /**
   * Shows all items in the organization chart.
   */
  showAll(): Promise<void>
  /**
   * Whether there are any hidden organization chart items to show.
   */
  canShowAll(): boolean

  /**
   * Shows the superior of the given item.
   */
  showSuperior(item: OrgChartItem): Promise<void>
  /**
   * Whether the superior of the given item is hidden.
   */
  canShowSuperior(item: OrgChartItem): boolean

  /**
   * Hides the superior of the given item.
   */
  hideSuperior(item: OrgChartItem): Promise<void>
  /**
   * Whether the superior of the given item is visible.
   */
  canHideSuperior(item: OrgChartItem): boolean

  /**
   * Shows the subordinates of the given item.
   */
  showSubordinates(item: OrgChartItem): Promise<void>
  /**
   * Whether the subordinates of the given item are hidden.
   */
  canShowSubordinates(item: OrgChartItem): boolean

  /**
   * Hides the subordinates of the given item.
   */
  hideSubordinates(item: OrgChartItem): Promise<void>
  /**
   * Whether the subordinates of the given item are visible.
   */
  canHideSubordinates(item: OrgChartItem): boolean

  /**
   * Refreshes the organization chart layout.
   * If the incremental parameter is set to true, the layout considers certain
   * items as fixed and arranges only the items contained in the incrementalItems array.
   */
  applyLayout(incremental?: boolean, incrementalItems?: OrgChartItem[]): void
  /**
   * Retrieves the items that match the search currently.
   */
  getSearchHits: () => OrgChartItem[]
  /**
   * Pans the viewport to the center of the given items.
   */
  zoomTo(items: (OrgChartItem | OrgChartConnection<OrgChartItem>)[]): void
  /**
   * Pans the viewport to center the given item.
   */
  zoomToItem(item: OrgChartItem | OrgChartConnection<OrgChartItem>): void
  /**
   * Increases the zoom level.
   */
  zoomIn(): void
  /**
   * Decreases the zoom level.
   */
  zoomOut(): void
  /**
   * Fits the organization chart inside the viewport.
   */
  fitContent(): void
  /**
   * Resets the zoom level to 1.
   */
  zoomToOriginal(): void

  /**
   * Adds a listener called whenever organization chart items are shown or hidden.
   */
  addGraphUpdatedListener(listener: () => void): void
  /**
   * Removes a listener added in {@link OrgChartModel.addGraphUpdatedListener}.
   */
  removeGraphUpdatedListener(listener: () => void): void

  /**
   * Returns the currently visible items of the organization chart.
   */
  getVisibleItems(): OrgChartItem[]

  /**
   * Exports the organization chart to an SVG file.
   * @throws Exception if the diagram cannot be exported.
   * The exception may occur when the diagram contains images from cross-origin sources.
   * In this case, disable {@link ExportSettings.inlineImages} and encode the icons manually to base64.
   */
  exportToSvg(exportSettings?: ExportSettings): Promise<void>

  /**
   * Exports the organization chart to a PNG Image.
   * @throws Exception if the diagram cannot be exported.
   * The exception may occur when the diagram contains images from cross-origin sources.
   * In this case, disable {@link ExportSettings.inlineImages} and encode the icons manually to base64.
   */
  exportToPng(exportSettings?: ExportSettings): Promise<void>

  /**
   * Exports and prints the organization chart.
   */
  print(printSettings?: PrintSettings): Promise<void>

  /**
   * Triggers a re-rendering of the chart. This may become useful if properties in the data change and the visualization
   * should update accordingly.
   */
  refresh(): void
}

export interface OrgChartModelInternal extends OrgChartModel {
  onRendered: () => void
}

const defaultMargins = { top: 5, right: 5, left: 5, bottom: 5 }

/**
 * Creates the {@link OrgChartModel}.
 */
export function createOrgChartModel(
  collapsibleTree: CollapsibleTree,
  graphComponent: GraphComponent
): OrgChartModelInternal {
  let onRenderedCallback: null | (() => void) = null

  // this is a hack so we have something like `await nextTick()`
  // that we can use instead of `setTimeout()`
  const setRenderedCallback = (cb: () => void) => {
    onRenderedCallback = cb
  }
  const onRendered = () => {
    onRenderedCallback?.()
    onRenderedCallback = null
  }

  function zoomTo(items: (OrgChartItem | OrgChartConnection<OrgChartItem>)[]) {
    if (items.length === 0) {
      return
    }
    const graph = graphComponent.graph
    const modelItems: (INode | IEdge)[] = []
    items.forEach(item => {
      if ('source' in item && 'target' in item) {
        const source = getNode(item.source, graph)!
        const target = getNode(item.target, graph)!

        const edge = graph.getEdge(source, target)
        if (edge) {
          // collapsibleTree.zoomToItem(edge)
          modelItems.push(edge)
        }
      } else {
        const node = getNode(item, graph)!
        // collapsibleTree.zoomToItem(node)
        modelItems.push(node)
      }
    })
    collapsibleTree.zoomTo(modelItems)
  }

  return {
    graphComponent,

    async showAll() {
      await collapsibleTree.executeShowAll()
    },

    canShowAll(): boolean {
      return collapsibleTree.canExecuteShowAll()
    },

    async showSuperior(item: OrgChartItem) {
      const node = getNode(item, graphComponent.graph)
      if (node) {
        await collapsibleTree.executeShowParent(node)
      }
    },

    canShowSuperior(item: OrgChartItem): boolean {
      const node = getNode(item, graphComponent.graph)
      if (node) {
        return collapsibleTree.canExecuteShowParent(node)
      }
      return false
    },

    async hideSuperior(item: OrgChartItem) {
      const node = getNode(item, graphComponent.graph)
      if (node) {
        await collapsibleTree.executeHideParent(node)
      }
    },

    canHideSuperior(item: OrgChartItem): boolean {
      const node = getNode(item, graphComponent.graph)
      if (node) {
        return collapsibleTree.canExecuteHideParent(node)
      }
      return false
    },

    async showSubordinates(item: OrgChartItem) {
      const node = getNode(item, graphComponent.graph)
      if (node) {
        await collapsibleTree.executeShowChildren(node)
      }
    },

    canShowSubordinates(item: OrgChartItem): boolean {
      const node = getNode(item, graphComponent.graph)
      if (node) {
        return collapsibleTree.canExecuteShowChildren(node)
      }
      return false
    },

    async hideSubordinates(item: OrgChartItem) {
      const node = getNode(item, graphComponent.graph)
      if (node) {
        await collapsibleTree.executeHideChildren(node)
      }
    },

    canHideSubordinates(item: OrgChartItem): boolean {
      const node = getNode(item, graphComponent.graph)
      if (node) {
        return collapsibleTree.canExecuteHideChildren(node)
      }
      return false
    },

    applyLayout(incremental?: boolean, incrementalItems?: OrgChartItem[]) {
      const incrementalNodes: INode[] = []
      incrementalItems?.forEach(item => {
        const node = getNode(item, graphComponent.graph)
        if (node) {
          incrementalNodes.push(node)
        }
      })

      return collapsibleTree.applyInitialLayout(incremental ?? false, incrementalNodes)
    },

    zoomToItem(item: OrgChartItem | OrgChartConnection<OrgChartItem>) {
      zoomTo([item])
    },

    zoomTo,

    zoomIn() {
      ICommand.INCREASE_ZOOM.execute(null, graphComponent)
    },

    zoomOut() {
      ICommand.DECREASE_ZOOM.execute(null, graphComponent)
    },

    zoomToOriginal() {
      ICommand.ZOOM.execute(1.0, graphComponent)
    },

    fitContent() {
      ICommand.FIT_GRAPH_BOUNDS.execute(null, graphComponent)
    },

    addGraphUpdatedListener(listener: () => void) {
      collapsibleTree.addGraphUpdatedListener(listener)
    },

    removeGraphUpdatedListener(listener: () => void) {
      collapsibleTree.removeGraphUpdatedListener(listener)
    },

    getVisibleItems(): OrgChartItem[] {
      return collapsibleTree.graphComponent.graph.nodes.map(item => item.tag).toArray()
    },

    async exportToSvg(exportSettings: ExportSettings) {
      const settings = exportSettings ?? {
        zoom: graphComponent.zoom,
        scale: graphComponent.zoom,
        margins: defaultMargins,
        inlineImages: true
      }
      await exportSvgAndSave(settings, graphComponent, setRenderedCallback)
    },

    async exportToPng(exportSettings: ExportSettings) {
      const settings = exportSettings ?? {
        zoom: graphComponent.zoom,
        scale: 1.0,
        margins: defaultMargins
      }
      await exportImageAndSave(settings, graphComponent, setRenderedCallback)
    },

    async print(printSettings: PrintSettings) {
      const settings = printSettings ?? {
        zoom: graphComponent.zoom,
        scale: 1.0,
        margins: defaultMargins
      }
      await printDiagram(settings, graphComponent)
    },

    refresh() {
      graphComponent.invalidate()
    },
    getSearchHits: () => [], // will be replaced during initialization
    onRendered
  }
}

export function getNode(item: OrgChartItem, graph: IGraph): INode | null {
  return item ? graph.nodes.find(node => node.tag.id === item.id) : null
}
