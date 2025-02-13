import {
  type ICanvasContext,
  type IPort,
  type IRenderContext,
  PortStyleBase,
  Rect,
  type Size,
  SvgVisual,
  type TaggedSvgVisual
} from '@yfiles/yfiles'

type CollapseState = { collapsed: boolean }

type CollapseExpandVisual = TaggedSvgVisual<SVGGElement, CollapseState>

export class CollapseExpandPortStyle extends PortStyleBase<CollapseExpandVisual> {
  constructor(
    public renderSize: Size,
    public isCollapsed: (port: IPort) => boolean
  ) {
    super()
  }

  protected createVisual(_context: IRenderContext, port: IPort): CollapseExpandVisual | null {
    const halfWidth = this.renderSize.width * 0.5
    const halfHeight = this.renderSize.height * 0.5
    const collapsed = this.isCollapsed(port)

    const container = document.createElementNS('http://www.w3.org/2000/svg', 'g') as SVGGElement
    const portElement = document.createElementNS('http://www.w3.org/2000/svg', 'g') as SVGGElement
    portElement.classList.add('yfiles-react-port')
    container.appendChild(portElement)
    const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse')
    ellipse.setAttribute('rx', String(halfWidth - 2))
    ellipse.setAttribute('ry', String(halfHeight - 2))
    portElement.appendChild(ellipse)
    const horizontalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    horizontalLine.classList.add('yfiles-react-port__icon')
    horizontalLine.setAttribute('x1', String(-(halfWidth - 4)))
    horizontalLine.setAttribute('y1', '0')
    horizontalLine.setAttribute('x2', String(+(halfWidth - 4)))
    horizontalLine.setAttribute('y2', '0')
    portElement.appendChild(horizontalLine)
    const verticalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    verticalLine.setAttribute(
      'class',
      `yfiles-react-port__icon ${collapsed ? 'yfiles-react-port__icon--expand' : 'yfiles-react-port__icon--collapse'}`
    )
    verticalLine.setAttribute('x1', '0')
    verticalLine.setAttribute('y1', '-1')
    verticalLine.setAttribute('x2', '0')
    verticalLine.setAttribute('y2', '1')
    portElement.appendChild(verticalLine)

    SvgVisual.setTranslate(container, port.location.x, port.location.y)

    return SvgVisual.from(container, {
      collapsed: collapsed
    })
  }

  protected updateVisual(
    _context: IRenderContext,
    oldVisual: CollapseExpandVisual,
    port: IPort
  ): CollapseExpandVisual {
    const container = oldVisual.svgElement
    const collapsed = this.isCollapsed(port)
    if (oldVisual.tag.collapsed !== collapsed) {
      container.lastElementChild!.lastElementChild!.setAttribute(
        'class',
        `yfiles-react-port__icon ${collapsed ? 'yfiles-react-port__icon--expand' : 'yfiles-react-port__icon--collapse'}`
      )
      oldVisual.tag.collapsed = collapsed
    }
    SvgVisual.setTranslate(container, port.location.x, port.location.y)
    return oldVisual
  }

  protected getBounds(_context: ICanvasContext, port: IPort): Rect {
    const { width, height } = this.renderSize
    return new Rect(port.location.x - width * 0.5, port.location.y - height * 0.5, width, height)
  }
}
