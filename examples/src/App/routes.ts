import SimpleOrgChart from '../examples/SimpleOrgChart'
import OrgChartWithTemplates from '../examples/OrgChartWithProvider'
import OrgChartWithSize from '../examples/OrgChartWithSize'
import Islands from '../examples/Islands'
import MUIDarkMode from '../examples/MUIDarkMode'
import ManyNodes from '../examples/ManyNodes'
import CustomEdges from '../examples/CustomEdges'
import EditablePopup from '../examples/Popup'
import OrgChartTemplate from '../examples/OrgChartTemplate'
import Export from '../examples/Export'
import NonTreeOrgChart from '../examples/NonTreeOrgChart'
import IncrementalLayout from '../examples/IncrementalLayout'
import StyledOrgChart from '../examples/StyledOrgChart'

export interface IRoute {
  title: string
  description: string
  path: string
  component: React.ComponentType
}

const routes: IRoute[] = [
  {
    title: 'Styled OrgChart',
    description: 'Testing CSS styling',
    path: 'styled-orgchart',
    component: StyledOrgChart
  },
  {
    title: 'Simple OrgChart',
    description:
      'The most basic usage of the organization chart component without any customizations',
    path: 'simple-orgchart',
    component: SimpleOrgChart
  },
  {
    title: 'OrgChart with Provider',
    description:
      'Usage of the OrgChartProvider to access the organization chart component from a side panel',
    path: 'orgchart-with-provider',
    component: OrgChartWithTemplates
  },
  {
    title: 'OrgChart with Size',
    description:
      'Organization chart component with custom item visualizations and a fixed item size',
    path: 'orgchart-with-size',
    component: OrgChartWithSize
  },
  {
    title: 'Islands',
    description:
      'Organization chart with global color state that is accessed in the item visualization, context menu, and tooltip',
    path: 'islands',
    component: Islands
  },
  {
    title: 'MUI Dark Mode',
    description:
      'Organization chart with dark/light mode that uses MUI components in the item visualization, context menu and tooltips',
    path: 'mui-dark-mode',
    component: MUIDarkMode
  },
  {
    title: 'Many Nodes',
    description: 'Organization chart with a large diagram',
    path: 'many-nodes',
    component: ManyNodes
  },
  {
    title: 'Custom Edges',
    description: 'Organization chart with individual styles for some connections',
    path: 'custom-edges',
    component: CustomEdges
  },
  {
    title: 'Popup',
    description: 'Organization chart with popups to change the business data of an item',
    path: 'popup',
    component: EditablePopup
  },
  {
    title: 'OrgChartTemplate',
    description:
      'Organization charts with different item size settings to test the default item visualization',
    path: 'org-chart-template',
    component: OrgChartTemplate
  },
  {
    title: 'Non-Tree OrgChart',
    description: 'Organization chart with items that have multiple parents',
    path: 'non-tree-org-chart',
    component: NonTreeOrgChart
  },
  {
    title: 'Export',
    description: 'Export functionality',
    path: 'export',
    component: Export
  },
  {
    title: 'Incremental Layout',
    description: 'Organization chart with new items and an incremental layout',
    path: 'incremental-layout',
    component: IncrementalLayout
  }
]

export default routes
