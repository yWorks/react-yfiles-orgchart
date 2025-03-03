import { FilteredGraphWrapper, FreeNodePortLocationModel, IGraph, IPortStyle, Size } from '@yfiles/yfiles'
import { CollapseExpandPortStyle } from './CollapseExpandPortStyle.ts'

/**
 * Determines the first port with an out-edge and adds the port style indicating the option to
 * collapse expand the subtree.
 */
export function setPortStylesToFirstOutgoingPorts(graph: IGraph, portsVisible: boolean): void {
  const filteredGraph = graph as FilteredGraphWrapper
  const completeGraph = filteredGraph.wrappedGraph!
  for (const node of completeGraph.nodes) {
    const outEdges = completeGraph.outEdgesAt(node)
    if (outEdges.size > 0) {
      const firstOutgoingPort = outEdges.first()!.sourcePort
      const portStyle = portsVisible
        ? new CollapseExpandPortStyle(
            new Size(20, 20),
            port => completeGraph.edgesAt(port).size !== filteredGraph.edgesAt(port).size
          )
        : IPortStyle.VOID_PORT_STYLE
      completeGraph.setStyle(firstOutgoingPort, portStyle)
      completeGraph.setPortLocationParameter(firstOutgoingPort, FreeNodePortLocationModel.BOTTOM)
    }
  }
}
