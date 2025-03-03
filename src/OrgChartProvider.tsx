import { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { CollapsibleTree } from './core/CollapsibleTree'
import type { GraphComponent, INode } from '@yfiles/yfiles'
import { useGraphComponent, withGraphComponentProvider } from '@yworks/react-yfiles-core'
import { createOrgChartModel, OrgChartModel } from './OrgChartModel'

const OrgChartContext = createContext<OrgChartModel | null>(null)

export function useOrgChartContextInternal(): OrgChartModel | null {
  return useContext(OrgChartContext)
}

/**
 * A hook that provides access to the {@link OrgChartModel} which has various functions that can be used to interact with the {@link OrgChart}.
 * It can only be used inside an {@link OrgChart} component or an {@link OrgChartProvider}.
 * @returns the {@link OrgChartModel} used in this context.
 *
 * ```tsx
 * function OrgChartWrapper() {
 *   const { fitContent, zoomToItem } = useOrgChartContext()
 *
 *   return (
 *     <>
 *       <OrgChart data={data} contextMenuItems={(item: CustomOrgChartItem | null) => {
 *           if (item) {
 *             return [{ title: 'Zoom to Item', action: () => item && zoomToItem(item) }]
 *           }
 *           return []
 *         }}>
 *       </OrgChart>
 *       <Sidebar>
 *         <button onClick={fitContent}>Fit Content</button>
 *       </Sidebar>
 *     </>
 *   )
 * }
 *
 * function OrganizationChart () {
 *   return (
 *     <OrgChartProvider>
 *       <OrgChartWrapper></OrgChartWrapper>
 *     </OrgChartProvider>
 *   )
 * }
 * ```
 */
export function useOrgChartContext(): OrgChartModel {
  const context = useContext(OrgChartContext)
  if (context === null) {
    throw new Error(
      'This method can only be used inside an OrgChart component or OrgChartProvider.'
    )
  }
  return context
}

const gcToModel = new WeakMap<GraphComponent, OrgChartModel>()

/**
 * The OrgChartProvider component is a [context provider]{@link https://react.dev/learn/passing-data-deeply-with-context},
 * granting external access to the organization chart beyond the {@link OrgChart} component itself.
 *
 * This functionality proves particularly valuable when there's a toolbar or sidebar housing elements that require
 * interaction with the organization chart. Examples would include buttons for zooming in and out or fitting the graph into the viewport.
 *
 * The snippet below illustrates how to leverage the OrgChartProvider, enabling a component featuring both an {@link OrgChart}
 * and a sidebar to utilize the {@link useOrgChartContext} hook.
 *
 * ```tsx
 * function OrgChartWrapper() {
 *   const { fitContent, zoomToItem } = useOrgChartContext()
 *
 *   return (
 *     <>
 *       <OrgChart data={data} contextMenuItems={(item: CustomOrgChartItem | null) => {
 *           if (item) {
 *             return [{ title: 'Zoom to Item', action: () => item && zoomToItem(item) }]
 *           }
 *           return []
 *         }}>
 *       </OrgChart>
 *       <Sidebar>
 *         <button onClick={fitContent}>Fit Content</button>
 *       </Sidebar>
 *     </>
 *   )
 * }
 *
 * function OrganizationChart () {
 *   return (
 *     <OrgChartProvider>
 *       <OrgChartWrapper></OrgChartWrapper>
 *     </OrgChartProvider>
 *   )
 * }
 * ```
 */
export const OrgChartProvider = withGraphComponentProvider(({ children }: PropsWithChildren) => {
  const graphComponent = useGraphComponent()

  if (!graphComponent) {
    return children
  }

  const orgChart = useMemo(() => {
    if (gcToModel.has(graphComponent)) {
      return gcToModel.get(graphComponent)!
    }
    const collapsibleTree = new CollapsibleTree(graphComponent)
    graphComponent.graph = collapsibleTree.filteredGraph
    collapsibleTree.isAssistantNode = (node: INode): boolean => node.tag?.assistant ?? false
    // TODO provide customizable out-edge comparer
    const orgChartModel = createOrgChartModel(collapsibleTree, graphComponent)
    gcToModel.set(graphComponent, orgChartModel)
    return orgChartModel
  }, [graphComponent])

  return <OrgChartContext.Provider value={orgChart}>{children}</OrgChartContext.Provider>
})
