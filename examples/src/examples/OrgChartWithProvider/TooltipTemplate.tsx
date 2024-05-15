import { RenderTooltipProps } from '@yworks/react-yfiles-core'
import { CustomOrgChartItem, OrgChartConnection } from '@yworks/react-yfiles-orgchart'

export default function TooltipTemplate({
  data
}: RenderTooltipProps<CustomOrgChartItem | OrgChartConnection<CustomOrgChartItem>>) {
  if ('name' in data) {
    return (
      <div className={'node-background'}>
        {
          <div className={'detail-node'}>
            <div className={'node-right'}>
              <div className={'node-name'}>{data.name}</div>
              <div className={'node-position'}>{data.position}</div>
              <div className={'node-email'}>{data.email}</div>
              <div className={'node-phone'}>{data.name}</div>
            </div>
          </div>
        }
      </div>
    )
  }
}
