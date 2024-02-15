import {
  CustomOrgChartItem,
  OrgChart,
  RenderOrgChartTooltip,
  useOrgChartContext
} from '@yworks/react-yfiles-orgchart'
import { useEffect, useRef, useState } from 'react'
import orgChartData from '../../data/small-orgchart-data.ts'
import { RenderPopupProps } from '@yworks/react-yfiles-core'
import { Status } from '../../data/Employee.ts'

export function OrgChartRenderPopup({ item, onClose }: RenderPopupProps<CustomOrgChartItem>) {
  const orgChartContext = useOrgChartContext()

  const [status, setStatus] = useState<Status | undefined>(item?.status)
  const select = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    const initialStatus = item?.status ?? 'present'
    select.current!.value = initialStatus
    setStatus(initialStatus)
  }, [item])

  useEffect(() => {
    item.status = status
    orgChartContext.refresh()
  }, [status])

  return (
    item && (
      <div
        style={{
          border: '1px solid steelblue',
          borderRadius: 10,
          padding: 10,
          overflow: 'hidden',
          backgroundColor: 'white'
        }}
      >
        <div className="popup-title">
          <span>Update Employee Status</span>
          <button className="popup-close-button" onClick={() => onClose()}></button>
        </div>

        <select
          className="popup-select"
          ref={select}
          onChange={evt => setStatus(evt.target.value as Status)}
        >
          <option value="present">Present</option>
          <option value="busy">Busy</option>
          <option value="travel">Travel</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>
    )
  )
}

/**
 * Organization chart with popups to change the business data of an item.
 * This is a test for the default tooltip template and the default popup.
 */
export default function EditablePopup() {
  return (
    <OrgChart
      data={orgChartData}
      renderTooltip={RenderOrgChartTooltip}
      popupPosition="north"
      renderPopup={OrgChartRenderPopup}
    ></OrgChart>
  )
}
