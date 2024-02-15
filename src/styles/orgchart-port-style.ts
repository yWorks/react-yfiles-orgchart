import {
  FilteredGraphWrapper,
  FreeNodePortLocationModel,
  IGraph,
  type IPort,
  Size,
  StringTemplatePortStyle,
  VoidPortStyle
} from 'yfiles'

// Elements stored in the 'global' defs section are copied to the main SVG's defs section
// and can be referenced in the templates. In this case, this happens via converters.
const portStyleTemplate = `<g id="PortStyleTemplate">
  <g class="yfiles-react-port">
    <ellipse rx="8" ry="8"/>
    <line x1="-6" y1="0" x2="6" y2="0" class="yfiles-react-port__icon"/>
    <line x1="0" y1="-1" x2="0" y2="1"
      class="{TemplateBinding styleTag, Converter=orgChartConverters.portIconStateConverter}"/>
  </g>
</g>
`

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
      outEdges.forEach(edge => {
        completeGraph.setStyle(edge.sourcePort!, VoidPortStyle.INSTANCE)
      })
      const firstOutgoingPort = outEdges.first().sourcePort!
      const portStyle = portsVisible ? createStringTemplatePortStyle() : VoidPortStyle.INSTANCE
      completeGraph.setStyle(firstOutgoingPort, portStyle)
      completeGraph.setPortLocationParameter(
        firstOutgoingPort,
        FreeNodePortLocationModel.NODE_BOTTOM_ANCHORED
      )
    }
  }
}

type OrgChartConverters = {
  orgChartConverters: { portIconStateConverter: (val: { collapsed?: boolean }) => string }
}

/**
 * Initializes the expand/collapse style for edge source ports.
 */
export function initializePortStyle(): void {
  ;(StringTemplatePortStyle.CONVERTERS as OrgChartConverters).orgChartConverters = {
    portIconStateConverter: (val: { collapsed?: boolean }): string =>
      'yfiles-react-port__icon ' +
      (val.collapsed ?? false
        ? 'yfiles-react-port__icon--expand'
        : 'yfiles-react-port__icon--collapse')
  }
}

/**
 * Creates a template port style showing a '+' for expand and a '-' for collapse.
 */
function createStringTemplatePortStyle(): StringTemplatePortStyle {
  const portStyle = new StringTemplatePortStyle({
    svgContent: portStyleTemplate,
    renderSize: new Size(20, 20)
  })
  portStyle.styleTag = { collapsed: false }
  return portStyle
}

/**
 * Sets the collapsed state on the {@link StringTemplatePortStyle.styleTag}.
 */
export function setCollapsedState(port: IPort, collapsed: boolean): void {
  const style = port.style
  if (style instanceof StringTemplatePortStyle) {
    style.styleTag = { collapsed }
  }
}
