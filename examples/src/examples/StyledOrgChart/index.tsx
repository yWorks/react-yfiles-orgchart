import { OrgChart } from '@yworks/react-yfiles-orgchart'
import orgChartData from '../../data/styled-orgchart-data.ts'
import './style.css'

/**
 * The most basic usage of the organization chart component without any customizations.
 */
export default () => <OrgChart data={orgChartData}></OrgChart>
