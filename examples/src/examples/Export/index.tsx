import { FC } from 'react'
import {
  type ExportSettings,
  OrgChart,
  RenderOrgChartItem,
  OrgChartProvider,
  type PrintSettings,
  useOrgChartContext
} from '@yworks/react-yfiles-orgchart'
import largeOrgchartData from '../../data/styled-orgchart-data.ts'

import './style.css'

function getExportSettings(): ExportSettings {
  const margins = parseFloat(document.querySelector<HTMLInputElement>('#export-margin')!.value)
  const scale = parseFloat(document.querySelector<HTMLInputElement>('#export-scale')!.value)
  const zoom = parseFloat(document.querySelector<HTMLInputElement>('#export-zoom')!.value)
  const background = document.querySelector<HTMLInputElement>('#export-bg')!.value
  const clipX = parseFloat(document.querySelector<HTMLInputElement>('#export-clip-x')!.value)
  const clipY = parseFloat(document.querySelector<HTMLInputElement>('#export-clip-y')!.value)
  const clipW = parseFloat(document.querySelector<HTMLInputElement>('#export-clip-w')!.value)
  const clipH = parseFloat(document.querySelector<HTMLInputElement>('#export-clip-h')!.value)
  const inlineImages = document.querySelector<HTMLInputElement>('#export-inline')!.checked

  let bounds
  if (!isNaN(clipX) && !isNaN(clipY) && !isNaN(clipW) && !isNaN(clipH)) {
    bounds = {
      x: clipX,
      y: clipY,
      width: clipW,
      height: clipH
    }
  }

  return {
    scale,
    zoom,
    bounds,
    margins: {
      top: margins,
      left: margins,
      right: margins,
      bottom: margins
    },
    background,
    inlineImages
  }
}

function getPrintSettings(): PrintSettings {
  const margins = parseFloat(document.querySelector<HTMLInputElement>('#print-margin')!.value)
  const scale = parseFloat(document.querySelector<HTMLInputElement>('#print-scale')!.value)
  const clipX = parseFloat(document.querySelector<HTMLInputElement>('#print-clip-x')!.value)
  const clipY = parseFloat(document.querySelector<HTMLInputElement>('#print-clip-y')!.value)
  const clipW = parseFloat(document.querySelector<HTMLInputElement>('#print-clip-w')!.value)
  const clipH = parseFloat(document.querySelector<HTMLInputElement>('#print-clip-h')!.value)
  const tiledPrinting = document.querySelector<HTMLInputElement>('#print-tiles')!.checked
  const tileWidth = parseFloat(
    document.querySelector<HTMLInputElement>('#print-tiles-width')!.value
  )
  const tileHeight = parseFloat(
    document.querySelector<HTMLInputElement>('#print-tiles-height')!.value
  )

  let bounds
  if (!isNaN(clipX) && !isNaN(clipY) && !isNaN(clipW) && !isNaN(clipH)) {
    bounds = {
      x: clipX,
      y: clipY,
      width: clipW,
      height: clipH
    }
  }

  return {
    scale,
    bounds,
    margins: {
      top: margins,
      left: margins,
      right: margins,
      bottom: margins
    },
    tiledPrinting,
    tileWidth,
    tileHeight
  }
}

function OrgChartWithExport() {
  const { print, exportToSvg, exportToPng } = useOrgChartContext()!

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      <div style={{ width: '100%' }}>
        <OrgChart data={largeOrgchartData} renderItem={RenderOrgChartItem}></OrgChart>
      </div>
      <div className={'sidebar'}>
        <div style={{ border: '1px solid black', padding: 5 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              margin: 10,
              justifyContent: 'space-between'
            }}
          >
            <button
              onClick={async () => {
                try {
                  await print(getPrintSettings())
                } catch (e) {
                  console.log('Print failed.')
                }
              }}
            >
              Print
            </button>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 3fr',
              rowGap: '0.5em',
              columnGap: '0.5em',
              justifyItems: 'start'
            }}
          >
            <label htmlFor="print-margin">Margin</label>
            <input id="print-margin" type="number" defaultValue="5" />
            <label htmlFor="print-scale">Scale</label>
            <input id="print-scale" type="number" defaultValue="0.29" />
            <label htmlFor="print-clip" style={{ gridRow: 'span 4' }}>
              Clip
            </label>
            <input id="print-clip-x" type="number" placeholder="x" />
            <input id="print-clip-y" type="number" placeholder="y" />
            <input id="print-clip-w" type="number" placeholder="w" />
            <input id="print-clip-h" type="number" placeholder="h" />

            <label htmlFor="print-tiles">Tile Printing</label>
            <input id="print-tiles" type="checkbox" defaultValue="false" />
            <label htmlFor="print-tiles-width">Width</label>
            <input id="print-tiles-width" type="number" placeholder="595" />
            <label htmlFor="print-tiles-width">Height</label>
            <input id="print-tiles-height" type="number" placeholder="842" />
          </div>
        </div>

        <div style={{ border: '1px solid black', padding: 5 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              margin: 10,
              justifyContent: 'space-between'
            }}
          >
            <button
              onClick={async () => {
                try {
                  await exportToSvg(getExportSettings())
                } catch (e) {
                  console.log('Export failed.')
                }
              }}
            >
              Export to Svg
            </button>
            <button
              onClick={async () => {
                try {
                  await exportToPng(getExportSettings())
                } catch (e) {
                  console.log('Export failed.')
                }
              }}
            >
              Export to Png
            </button>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 3fr',
              rowGap: '0.5em',
              columnGap: '0.5em',
              justifyItems: 'start'
            }}
          >
            <label htmlFor="export-margin">Margin</label>
            <input id="export-margin" type="number" defaultValue="15" />
            <label htmlFor="export-scale">Scale</label>
            <input id="export-scale" type="number" defaultValue="1.0" />
            <label htmlFor="export-zoom">Zoom</label>
            <input id="export-zoom" type="number" defaultValue="1.0" />
            <label htmlFor="export-bg">Background</label>
            <input id="export-bg" type="color" defaultValue="#ffffff" />
            <label htmlFor="export-clip" style={{ gridRow: 'span 4' }}>
              Clip
            </label>
            <input id="export-clip-x" type="number" placeholder="x" />
            <input id="export-clip-y" type="number" placeholder="y" />
            <input id="export-clip-w" type="number" placeholder="w" />
            <input id="export-clip-h" type="number" placeholder="h" />

            <label htmlFor="export-inline">Inline Images</label>
            <input id="export-inline" type="checkbox" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  )
}

const Export: FC = () => (
  <OrgChartProvider>
    <OrgChartWithExport></OrgChartWithExport>
  </OrgChartProvider>
)

export default Export
