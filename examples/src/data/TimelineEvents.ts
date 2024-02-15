type Datestring = string

export type TimelineEventNode = {
  id: number
  type: string
  info: string | Record<string, string>
  enter: Datestring[]
  exit: Datestring[]
}

export type TimelineEventEdge = {
  type: string
  from: number
  to: number
}

export type TimelineEvents = {
  nodes: TimelineEventNode[]
  edges: TimelineEventEdge[]
}
