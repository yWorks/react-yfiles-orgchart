import {
  AdjacencyGraphBuilder,
  AdjacencyNodesSource,
  Cycle,
  EdgeCreator,
  type IGraph,
  type INode
} from '@yfiles/yfiles'
import type { OrgChartItem, OrgChartItemId } from '../OrgChart'
import {
  convertToPolylineEdgeStyle,
  EdgeStyle as ConnectionStyle,
  NodeRenderInfo,
  ReactComponentHtmlNodeStyle,
  RenderNodeProps as RenderItemProps
} from '@yworks/react-yfiles-core'
import { ComponentType, Dispatch, SetStateAction } from 'react'
import { getNode } from '../OrgChartModel.ts'

type OrgChartEdge<TOrgChartItem extends OrgChartItem> = {
  source: TOrgChartItem
  target: TOrgChartItem
}

export class GraphManager<TOrgChartItem extends OrgChartItem> {
  public data: TOrgChartItem[] = []
  public renderItem?: ComponentType<RenderItemProps<TOrgChartItem>> | undefined
  public connectionStyles?: (
    source: TOrgChartItem,
    target: TOrgChartItem
  ) => ConnectionStyle | undefined
  public incrementalElements: TOrgChartItem[] = []
  constructor(
    public graphBuilder?: AdjacencyGraphBuilder,
    public nodesSource?: AdjacencyNodesSource<TOrgChartItem>
  ) {}

  updateGraph(
    data: TOrgChartItem[],
    renderItem?: ComponentType<RenderItemProps<TOrgChartItem>> | undefined,
    connectionStyles?: (source: TOrgChartItem, target: TOrgChartItem) => ConnectionStyle | undefined
  ) {
    // find the new elements and mark them as incremental
    this.incrementalElements = compareData(this.data, data)

    this.data = data
    if (this.nodesSource && this.graphBuilder) {
      if (renderItem) {
        this.renderItem = renderItem
      }
      if (connectionStyles) {
        this.connectionStyles = connectionStyles
      }
      this.graphBuilder.setData(this.nodesSource, data)
      this.graphBuilder.updateGraph()

      // check for cycles in data
      const cycle = new Cycle().run(this.graphBuilder.graph)
      if (cycle.edges.size > 0) {
        throw new Error('Organization Chart data must not contain cycles')
      }
    }
  }
}

/**
 * Creates the orgchart graph.
 */
export function initializeGraphManager<TOrgChartItem extends OrgChartItem>(
  graph: IGraph,
  setNodeInfos: Dispatch<SetStateAction<NodeRenderInfo<TOrgChartItem>[]>>
): GraphManager<TOrgChartItem> {
  graph.clear()
  const graphManager = new GraphManager<TOrgChartItem>()
  const graphBuilder = new AdjacencyGraphBuilder(graph)
  // configure the nodes source
  const nodesSource = graphBuilder.createNodesSource<TOrgChartItem>([], 'id')
  const edgeCreator = new EdgeCreator<OrgChartEdge<TOrgChartItem>>({
    defaults: graphBuilder.graph.edgeDefaults
  })
  nodesSource.addOutEdgesSourceToId(
    (item: TOrgChartItem) =>
      item.subordinates?.map((target: OrgChartItemId): OrgChartEdge<TOrgChartItem> => {
        return {
          source: item,
          target: graphManager.data.find(item => item.id === target)!
        }
      }) ?? [],
    (item: OrgChartEdge<TOrgChartItem>) => item.target?.id,
    edgeCreator
  )
  edgeCreator.styleProvider = (edge: OrgChartEdge<TOrgChartItem>) => {
    if (graphManager.connectionStyles) {
      const edgeStyle = graphManager.connectionStyles(edge.source, edge.target)
      if (edgeStyle) {
        return convertToPolylineEdgeStyle(edgeStyle)
      }
    }
    return null
  }
  nodesSource.nodeCreator.styleProvider = () => {
    if (graphManager.renderItem) {
      return new ReactComponentHtmlNodeStyle(graphManager.renderItem, setNodeInfos)
    }
    return null
  }
  nodesSource.nodeCreator.layoutBindings.addBinding(
    'width',
    (item: TOrgChartItem) => item.width ?? graph.nodeDefaults.size.width
  )
  nodesSource.nodeCreator.layoutBindings.addBinding(
    'height',
    (item: TOrgChartItem) => item.height ?? graph.nodeDefaults.size.height
  )
  nodesSource.nodeCreator.layoutBindings.addBinding(
    'x',
    (item: TOrgChartItem) => getNode(item, graph)?.layout.x ?? 0
  )
  nodesSource.nodeCreator.layoutBindings.addBinding(
    'y',
    (item: TOrgChartItem) => getNode(item, graph)?.layout.y ?? 0
  )

  nodesSource.nodeCreator.addEventListener('node-updated', (evt) => {
    nodesSource!.nodeCreator.updateLayout(evt.graph, evt.item, evt.dataItem)
    nodesSource!.nodeCreator.updateStyle(evt.graph, evt.item, evt.dataItem)
    nodesSource!.nodeCreator.updateTag(evt.graph, evt.item, evt.dataItem)
    nodesSource!.nodeCreator.updateLabels(evt.graph, evt.item, evt.dataItem)
  })

  edgeCreator.addEventListener('edge-updated', (evt) => {
    edgeCreator.updateStyle(evt.graph, evt.item, evt.dataItem)
    edgeCreator.updateTag(evt.graph, evt.item, evt.dataItem)
    edgeCreator.updateLabels(evt.graph, evt.item, evt.dataItem)
  })

  graphManager.graphBuilder = graphBuilder
  graphManager.nodesSource = nodesSource
  return graphManager
}

/**
 * Retrieves the orgchart item from a node's tag.
 */
export function getOrgChartItem<TOrgChartItem extends OrgChartItem>(node: INode): TOrgChartItem {
  return node.tag as TOrgChartItem
}

function compareData<T>(oldData: T[], newData: T[]): T[] {
  const unequalElements: T[] = []
  newData.forEach(obj2 => {
    const matchingObject = oldData.find(obj1 => JSON.stringify(obj1) === JSON.stringify(obj2))
    if (!matchingObject) {
      unequalElements.push(obj2)
    }
  })
  return unequalElements
}
