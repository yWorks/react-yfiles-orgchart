import { CustomOrgChartItem, OrgChart, OrgChartItem } from '@yworks/react-yfiles-orgchart'

export function createRandomTree(maxLayer: number): CustomOrgChartItem[] {
  const items: OrgChartItem[] = []
  let id = 0
  const createNode = (): CustomOrgChartItem => {
    const item = {
      id: id++,
      position: 'Chief Executive Officer',
      name: `Name ${id.toString().padStart(5)}`,
      email: 'ejoplin@yoyodyne.com',
      phone: '555-0100',
      fax: '555-0101',
      businessUnit: 'Executive Unit',
      status: 'present',
      icon: `https://live.yworks.com/demos/showcase/orgchart/resources/usericon_${
        Math.random() > 0.5 ? 'fe' : ''
      }male1.svg`,
      subordinates: []
    } satisfies CustomOrgChartItem
    items.push(item)
    return item
  }

  let preds = [createNode()]
  let newNodes: OrgChartItem[] = []

  for (let l = 1; l <= maxLayer; l++) {
    const count = Math.pow(2, l)
    for (let i = 0; i < count; i++) {
      const newNode = createNode()
      newNodes.push(newNode)
      const predIndex = (Math.random() * preds.length) | 0
      const pred = preds[predIndex]
      // newNode.subordinates?.push(pred.id)
      pred.subordinates!.push(newNode.id)
    }
    preds = newNodes
    newNodes = []
  }
  for (const item of items) {
    if (item.subordinates?.length === 0) {
      delete item.subordinates
    }
  }
  return items
}

const orgChartData = createRandomTree(8)

/**
 * Organisation chart with a large diagram to check the performance of the component.
 */
export default () => <OrgChart data={orgChartData} />
