# yFiles React Organization Chart Component

[![yFiles React Organization Chart Component](https://raw.githubusercontent.com/yWorks/react-yfiles-orgchart/main/assets/react-orgchart-component.gif)](https://docs.yworks.com/react-yfiles-orgchart)

Welcome to the *yFiles React Organization Chart* component, a powerful and versatile React component based on the [yFiles](https://www.yworks.com/yfiles-overview) library. 
This component enables seamless integration for displaying organization charts in your React applications.

## [Documentation, Examples, and Live Playground](https://docs.yworks.com/react-yfiles-orgchart)

## Getting Started


1. **Installation:**
   Install the component via npm by running the following command in your project directory:
   ```bash
   npm install @yworks/react-yfiles-orgchart
   ```
   
   The organization chart module has certain peer dependencies that must be installed within your project. Since it is a React module, `react` and `react-dom` dependencies are needed.
    
   Additionally, the component relies on the [yFiles](https://www.yworks.com/yfiles-overview) library which is not available on the public npm registry. Instructions on how to work with the yFiles npm module in our [Developer's Guide](https://docs.yworks.com/yfileshtml/#/dguide/yfiles_npm_module).

   Ensure that the dependencies in the `package.json` file resemble the following:
   ```json
   {
     ...
     "dependencies": {
       "@yworks/react-yfiles-orgchart": "^1.0.0",
       "react": "^18.2.0",
       "react-dom": "^18.2.0",
       "yfiles": "<yFiles package path>/lib/yfiles-26.0.0.tgz",
       ...
     }
   }
   ```

2. **License:**
    Before using the component, a valid [yFiles for HTML](https://www.yworks.com/products/yfiles-for-html) version is required. You can evaluate yFiles for 60 days free of charge on [my.yworks.com](https://my.yworks.com/signup?product=YFILES_HTML_EVAL).
    Be sure to invoke the `registerLicense` function to furnish the license file before utilizing the organization chart component.
    
3. **Usage:**
    Utilize the component in your application.
    Make sure to import the CSS stylesheet 'index.css' as the component requires it for correct functionality.

    ```tsx
    import { CustomOrgChartData, OrgChart, registerLicense } from '@yworks/react-yfiles-orgchart'
    import '@yworks/react-yfiles-orgchart/dist/index.css' 
    import yFilesLicense from './license.json'
   
    function App() {
      registerLicense(yFilesLicense)
      
      const data = [
        { id: 0, name: 'Eric Joplin', subordinates: [1, 2] },
        { id: 1, name: 'Amy Kain' },
        { id: 2, name: 'David Kerry' }
      ] satisfies CustomOrgChartData<{name: string}>
     
      return <OrgChart data={data}></OrgChart>
    }
    
    export default App
    ```

    > **Note:** By default, the `OrgChart` component adjusts its size to match the size of its parent element. Therefore, it is necessary to set the dimensions of the containing element or apply styling directly to the `OrgChart` component. This can be achieved by defining a CSS class or applying inline styles.


## Features

### Customization

This component includes styling and options tailored for general organizational charts. The items in the `data` array must satisfy the `OrgChartItem` type. 

```ts
type OrgChartItem = {
  id: any
  subordinates?: any[]
  assistant?: boolean
  width?: number
  height?: number
}
```
* The optional `subordinates` define the parent-child relationships and should only contain ids of other data items.
* If `assistant` is `true`, an item is an assistant to its superior and is placed on a separate layer between the superior and the non-assistant subordinates.
* The optional `width` and `height` define the render size of the item. If no values are given, the size is determined automatically.

The default visualization expects data items of type `CustomOrgChartItem<Employee>` where `Employee` is defined like this:
```ts
type Employee = {
  name?: string
  status?: string
  position?: string
  email?: string
  phone?: string
  icon?: string
}
```

Moreover, the visualization of items is highly customizable. You can specify custom React components to render the items according to your specific requirements.
Note that, to optimize performance and depending on the implementation, it might be necessary to use memoization for these custom components.

```tsx
function MyOrgChartItem(props: RenderItemProps<CustomOrgChartItem<Employee>>) {
  const { dataItem } = props
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'gold',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div>{dataItem.name}</div>
    </div>
  )
}

function OrganizationChart () {
  return (
    <OrgChart
      data={data}
      renderItem={MyOrgChartItem}
      itemSize={{ width: 300, height: 200 }}
    ></OrgChart>
  )
}
```

The background and size of the `OrgChart` component can be adjusted using the properties `className` or `style`.

By default, the organizational chart component offers interactive expanding and collapsing of subordinates and supervisors. If you wish to transform it into a viewer-only component, set the `interactive` property to `false`.

The organizational chart component includes a rendering feature that enables users to customize connection visualizations. It grants control over parameters such as stroke, bend smoothing, thickness, and arrow styles.
The rendering process employs an SVG path element, allowing for the utilization of CSS to customize the stroke or incorporate transitions by defining a `className`. Note that, to optimize performance and depending on the implementation, 
it might be necessary to memoize the rendering function.
  
```tsx
function connectionStyles(
  source: CustomOrgChartItem,
  target: CustomOrgChartItem
): ConnectionStyle | undefined {
  if (source.assistant || target.assistant) {
    return {
      thickness: 10,
      className: 'dashed-line',
      targetArrow: { type: 'triangle' }
    }
  } else {
    return { thickness: 5 }
  }
}

function OrganizationChart() {
  return <OrgChart data={data} connectionStyles={connectionStyles}></OrgChart>
}
```

```html
<style>
  .dashed-line {
    color: #665008;
    stroke-dasharray: 3px;
    stroke-dashoffset: 6px;
  }
</style>
```

### Events

The organization chart component includes event notifications that inform users when an item is focused, selected or hovered over. This functionality provides the flexibility to respond to these state changes, allowing for the dynamic updating of external information panels, among other possibilities.
To optimize performance, it is recommended to cache the corresponding functions.

```tsx
function OrganizationChart() {
  const onItemFocus = useCallback(
    (item: CustomOrgChartItem | null) => item && console.log(`focused: ${item.name}`),
    []
  )
  const onItemSelect = useCallback(
    (selectedItems: CustomOrgChartItem[]) =>
      console.log(selectedItems.length ? `selected: ${selectedItems[0].name}` : 'nothing selected'),
    []
  )
  const onItemHover = useCallback(
    (item: CustomOrgChartItem | null) => item && console.log(`hovered: ${item.name}`),
    []
  )

  return <OrgChart data={data} onItemFocus={onItemFocus} onItemSelect={onItemSelect} onItemHover={onItemHover}></OrgChart>
}
```

### Search

The component introduces a search feature which offers a way to focus on specific elements within the chart. By binding a needle `object` or `string`, items fitting the search criteria are highlighted.

```tsx
function OrganizationChart() {
  const [searchQuery, setSearchQuery] = useState('')
  return (
    <>
      <input
        type={'search'}
        onChange={event => {
          setSearchQuery(event.target.value)
        }}
      ></input>
      
      <OrgChart data={data} searchNeedle={searchQuery}></OrgChart>
    </>
  )
}
```
To further tailor the search functionality, developers can customize the process by registering a function to the `onSearch` event, which returns a `boolean` value indicating if the search was successful for the given item.


### Tooltip

Tooltips display specific information when hovering over an item. Users can configure the tooltip by setting a custom React component in the `renderTooltip` prop.
The organization chart component provides a default tooltip that displays the name of a person.

```tsx
function OrganizationChart () {
  return (
    <OrgChart 
      data={data} 
      renderTooltip={OrgChartTooltipTemplate}>
    </OrgChart>
  )
}
```

### Context Menu
The context menu provides context-specific actions for items. 
You can use the `contextMenuItems` to populate the context menu with actions. The organization chart component introduces a default context menu which provides actions to interact with the chart.

```tsx
function OrganizationChart() {
  return (
    <OrgChart data={data} contextMenuItems={OrgChartContextMenuItems}></OrgChart>
  )
}
```

To adjust the context menu visualization, add a custom React component using the `renderContextMenu` property.

```tsx
function OrganizationChart() {
  return (
    <OrgChart
      data={data}
      renderContextMenu={() => <button onClick={() => alert('Clicked')}>Click here!</button>}
    ></OrgChart>
  )
}
```

### Popup

The popup provides a custom overlay that displays contextual information for organization chart data.
The position of the popup relative to the clicked item can be configured with the `popupPosition` property.
To adjust the popup visualization, add a custom React component using the `renderPopup` property.

```tsx
function OrganizationChart () {
  return (
    <OrgChart data={data}
      popupPosition="north-east"
      renderPopup={(props: RenderPopupProps<CustomOrgChartItem>) => (<div>{props.item.name}</div>)}
    ></OrgChart>
  )
}
```

### Built-In Components

There are optional components available to enhance the interaction with the organization chart, which can be added as children of the organization chart component:

- **Overview**: Presents a simplified view of the entire graph along with the current viewport.
- **Controls**: Features a toolbar with buttons to adjust the viewport.

The controls component comes with a default implementation for organization charts.

```tsx
function OrganizationChart() {
  return (
    <OrgChart data={data}>
      <Overview></Overview>
      <Controls buttons={OrgChartControlButtons}></Controls>
    </OrgChart>
  )
}
```


### Hook & OrgChartProvider

Through the `useOrgChartContext()` hook, users gain access to the organization chart model, allowing them to utilize its functions for further customization of the interaction with the organization chart.

This hook is accessible only when used in a child component of an `OrgChartProvider`. This condition is consistently met when implementing child components for the `OrgChart` component. However, if the hook is called outside the organization chart component, the `OrgChartProvider` must be a common ancestor.

The following example demonstrates how to use the hook for a button in a sidebar or a customized context menu.

```tsx
function OrgChartWrapper() {
  const { fitContent, zoomToItem } = useOrgChartContext()!

  return (
    <>
      <OrgChart data={data} contextMenuItems={(item: CustomOrgChartItem | null) => {
          if (item) {
            return [{ title: 'Zoom to Item', action: () => item && zoomToItem(item) }]
          }
          return []
        }}>
      </OrgChart>
      <Sidebar>
        <button onClick={fitContent}>Fit Content</button>
      </Sidebar>
    </>
  )
}

function OrganizationChart () {
  return (
    <OrgChartProvider>
      <OrgChartWrapper></OrgChartWrapper>
    </OrgChartProvider>
  )
}
```

### Export Capabilities

The component allows users to export either the entire diagram or a specific part of it in SVG or PNG format.
Furthermore, it incorporates a print function that leverages the browser's capabilities, enabling users to generate
hard copies or save the diagram as PDF for offline access.

Access to the corresponding export functions is provided through the `useOrgChartContext()` hook described above. 

```tsx
function OrgChartWrapper() {
  const { print, exportToSvg, exportToPng } = useOrgChartContext()!

  return (
    <>
      <OrgChart data={data}></OrgChart>
      <Sidebar>
          <button onClick={async () => await print({ scale: 2 })}>Print</button>
          <button onClick={async () => await exportToSvg({ scale: 2 })}>Export to SVG</button>
          <button onClick={async () => await exportToPng({ scale: 2 })}>Export to PNG</button>
      </Sidebar>
    </>
  )
}

function OrganizationChart () {
  return (
    <OrgChartProvider>
      <OrgChartWrapper></OrgChartWrapper>
    </OrgChartProvider>
  )
}
```


## Learn More

Explore the possibilities of visualizing organizational structures with the yFiles Organization Chart Component. For further information about [yFiles for HTML](https://www.yworks.com/yfiles-overview) and our company, please visit [yWorks.com](https://www.yworks.com).

For support or feedback, please reach out to [our support team](https://www.yworks.com/contact) or open an [issue on GitHub](https://github.com/yWorks/react-yfiles-orgchart/issues). Happy diagramming!

