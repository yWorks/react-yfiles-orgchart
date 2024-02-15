import { OrgChart } from '@yworks/react-yfiles-orgchart'
import smallOrgchartData from './data/small-orgchart-data.ts'
import smallOrgchartDataWithSize from './data/small-orgchart-data-with-size.ts'
import smallOrgchartDataWithSomeSizes from './data/small-orgchart-data-with-some-sizes.ts'
import './style.css'

/**
 * Organization charts with different item size settings to test the default item visualization in different situations.
 */
export default function OrgChartTemplate() {
  return (
    <div className="app">
      <div className="graph-component-container">
        <h2>No Specified Size</h2>
        <OrgChart data={smallOrgchartData} style={{ border: '1px solid grey' }}></OrgChart>
      </div>
      <div className="graph-component-container">
        <h2>Default Size 30x60</h2>
        <OrgChart
          data={smallOrgchartData}
          itemSize={{ width: 30, height: 60 }}
          style={{ border: '1px solid grey' }}
        ></OrgChart>
      </div>
      <div className="graph-component-container">
        <h2>Size in Data</h2>
        <OrgChart data={smallOrgchartDataWithSize} style={{ border: '1px solid grey' }}></OrgChart>
      </div>
      <div className="graph-component-container">
        <h2>Mixed</h2>
        <OrgChart
          data={smallOrgchartDataWithSomeSizes}
          style={{ border: '1px solid grey' }}
        ></OrgChart>
      </div>
    </div>
  )
}
