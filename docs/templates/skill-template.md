---
name: react-yfiles-orgchart

description: Use this skill when working with the yFiles React OrgChart component in a React application. This includes creating, integrating, configuring, troubleshooting, or extending organization charts, employee hierarchies, reporting relationships, assistants, custom rendering, context menus, selection, search, zooming, layout, or export, including requests that do not mention yFiles or the package name explicitly.
---

# yFiles React OrgChart

Use `@yworks/react-yfiles-orgchart` with organization data whose subordinate IDs refer to items in the same `data` array. Ensure the yFiles license is registered, the stylesheet is imported, and the component API is used correctly.

## Data preparation

Convert source data to this shape before passing it to `OrgChart`:

```ts
type OrgChartItem = {
  id: string | number // unique identifier for the item
  subordinates?: (string | number)[] // identifiers of items reporting to this item
  assistant?: boolean // whether the item is an assistant to its parent
  width?: number // item width
  height?: number // item height
  className?: string // CSS class name for the item
  style?: React.CSSProperties // inline style for the item
}
```

## Minimal react example

Register the license and import the stylesheet; both are required.

```tsx
import {
  OrgChart,
  registerLicense,
  type CustomOrgChartItem
} from '@yworks/react-yfiles-orgchart'

import '@yworks/react-yfiles-orgchart/dist/index.css'
import yFilesLicense from '<yFiles package path>/lib/license.json'

registerLicense(yFilesLicense)

type Employee = CustomOrgChartItem<{
  name: string
  position: string
}>

const data: Employee[] = [
  { id: 'ceo', name: 'Alex Morgan', position: 'CEO', subordinates: ['vp'] },
  { id: 'vp', name: 'Jamie Lee', position: 'VP Engineering', subordinates: [] }
]

export default function App() {
  return <OrgChart data={data} />
}
```

Replace `data` with suitable application data and `<yFiles package path>` with the actual downloaded package directory.

## References

- Use the [component feature overview](references/features.md) to choose appropriate capabilities.
- Use the [complete API documentation](references/api.md) for exact props, types, and configuration.