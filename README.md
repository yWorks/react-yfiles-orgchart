# yFiles React Organization Chart Component

[![yFiles React Organization Chart Component](https://raw.githubusercontent.com/yWorks/react-yfiles-orgchart/main/assets/react-orgchart-component.gif)](https://docs.yworks.com/react-yfiles-orgchart)

Welcome to the *yFiles React Organization Chart* component, a powerful and versatile React component based on the [yFiles](https://www.yworks.com/yfiles-overview) library. 
This component enables seamless integration for displaying organization charts in your React applications.

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

## Documentation

Find the full documentation, API and many code examples in our [documentation](https://docs.yworks.com/react-yfiles-orgchart).

## Live Playground

[![Live Playground](https://raw.githubusercontent.com/yWorks/react-yfiles-orgchart/main/assets/playground.png)](https://docs.yworks.com/react-yfiles-orgchart/introduction/welcome)

Try the yFiles React Organization Chart component directly in our browser with our [playground](https://docs.yworks.com/react-yfiles-orgchart/introduction/welcome)

## Features

The component provides versatile features out of the box that can be further tailored to specific use cases. 

<table>
    <tr>
        <td>
            <a href="https://docs.yworks.com/react-yfiles-orgchart/introduction/welcome"><img src="https://raw.githubusercontent.com/yWorks/react-yfiles-orgchart/main/assets/level-of-detail.png" title="Level of detail visualization" alt="Level of detail visualization"></a><br>
            <a href="https://docs.yworks.com/react-yfiles-orgchart/introduction/welcome">Level of detail visualization</a>
        </td>
        <td>
            <a href="https://docs.yworks.com/react-yfiles-orgchart/features/custom-items"><img src="https://raw.githubusercontent.com/yWorks/react-yfiles-orgchart/main/assets/custom-visualization.png" title="Custom visualization" alt="Custom visualization"></a><br>
            <a href="https://docs.yworks.com/react-yfiles-orgchart/features/custom-items">Custom visualization</a>
        </td>
    </tr>
    <tr>
        <td>
            <a href="https://docs.yworks.com/react-yfiles-orgchart/features/hook-orgchartprovider"><img src="https://raw.githubusercontent.com/yWorks/react-yfiles-orgchart/main/assets/collapse-expand.png" title="Collapse / Expand" alt="Collapse / Expand"></a><br>
            <a href="https://docs.yworks.com/react-yfiles-orgchart/features/hook-orgchartprovider">Interactive Collapse / Expand</a>
        </td>
        <td>
            <a href="https://docs.yworks.com/react-yfiles-orgchart/features/search"><img src="https://raw.githubusercontent.com/yWorks/react-yfiles-orgchart/main/assets/search.png" title="Search" alt="Search"></a><br>
            <a href="https://docs.yworks.com/react-yfiles-orgchart/features/search">Search</a>
        </td>
    </tr>
</table>

Find all features in the [documentation](https://docs.yworks.com/react-yfiles-orgchart) and try them directly in the
browser with our integrated code playground.

## Learn More

Explore the possibilities of visualizing organizational structures with the yFiles Organization Chart Component. For further information about [yFiles for HTML](https://www.yworks.com/yfiles-overview) and our company, please visit [yWorks.com](https://www.yworks.com).

For support or feedback, please reach out to [our support team](https://www.yworks.com/contact) or open an [issue on GitHub](https://github.com/yWorks/react-yfiles-orgchart/issues). Happy diagramming!

