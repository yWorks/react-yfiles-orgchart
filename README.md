# yFiles React Organization Chart Component

[![NPM version](https://img.shields.io/npm/v/@yworks/react-yfiles-orgchart?style=flat)](https://www.npmjs.org/package/@yworks/react-yfiles-orgchart)

[![yFiles React Organization Chart Component](https://raw.githubusercontent.com/yWorks/react-yfiles-orgchart/main/assets/react-orgchart-component.gif)](https://docs.yworks.com/react-yfiles-orgchart)

Welcome to the *yFiles React Organization Chart* component, a powerful and versatile React component based on the [yFiles](https://www.yworks.com/yfiles-overview) library. 
This component enables seamless integration for displaying organization charts in your React applications.

## Getting Started

### Prerequisites

To use the Organization Chart component, [yFiles for HTML](https://www.yworks.com/products/yfiles-for-html) is required.
You can evaluate yFiles for 60 days free of charge on [my.yworks.com](https://my.yworks.com/signup?product=YFILES_HTML_EVAL).
See [Licensing](https://docs.yworks.com/react-yfiles-orgchart/introduction/licensing) for more information on this topic.

You can learn how to work with the yFiles npm module in our [Developer’s Guide](https://docs.yworks.com/yfileshtml/#/dguide/yfiles_npm_module). A convenient way of getting access to yFiles is to use the [yFiles Dev Suite](https://www.npmjs.com/package/yfiles-dev-suite).

### Project Setup

1. **Installation**

   In addition to yFiles, the Organization Chart component requires React to be installed in your project.
   If you want to start your project from scratch, we recommend using vite:
   ```
   npm create vite@latest my-orgchart-app -- --template react-ts
   ```

   Add the yFiles dependency:
   ```
   npm install <yFiles package path>/lib-dev/yfiles-30.0.0+dev.tgz
   ```

   <details>

   <summary>Sample <code>package.json</code> dependencies</summary>
   The resulting package.json dependencies should resemble the following:

   ```json
      "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "@yfiles/yfiles": "./lib-dev/yfiles-30.0.0.tgz"
     }
   ```
   </details>

   Now, the component itself can be installed:
   ```bash
   npm install @yworks/react-yfiles-orgchart
   ```

2. **License**

   Be sure to invoke the `registerLicense` function before using the Organization Chart React component.
   When evaluating yFiles, the license JSON file is found in the `lib/` folder of the yFiles for HTML evaluation package.
   For licensed users, the license data is provided separately.

   <details>

   <summary>License registration</summary>

   Import or paste your license data and register the license, e.g. in `App.tsx`:

   ```js
   import yFilesLicense from './license.json'

   registerLicense(yFilesLicense)
   ```
   </details>

3. **Stylesheet**

   Make sure to import the CSS stylesheet as well:

   ```js
   import '@yworks/react-yfiles-orgchart/dist/index.css'
   ```

4. **Usage**

   You are now all set to utilize the Organization Chart component with your data!
   See a basic example `App.tsx` below:

   ```tsx
   import { 
     CustomOrgChartData, 
     OrgChart, 
     registerLicense 
   } from '@yworks/react-yfiles-orgchart'
   
   import '@yworks/react-yfiles-orgchart/dist/index.css'
   
   import yFilesLicense from './license.json'
   
   registerLicense(yFilesLicense)
   
   const data = [
     { id: 0, name: 'Eric Joplin', subordinates: [1, 2] },
     { id: 1, name: 'Amy Kain' },
     { id: 2, name: 'David Kerry' }
   ] satisfies CustomOrgChartData<{name: string}>
   
   function App() {
     return <OrgChart data={data}></OrgChart>
   }
   
   export default App
   ```

    > **Note:** By default, the `OrgChart` component adjusts its size to match the size of its parent element. Therefore, it is necessary to set the dimensions of the containing element or apply styling directly to the `OrgChart` component. This can be achieved by defining a CSS class or applying inline styles.

## Documentation

Find the full documentation, API and many code examples in our [documentation](https://docs.yworks.com/react-yfiles-orgchart).

## Live Playground

[![Live Playground](https://raw.githubusercontent.com/yWorks/react-yfiles-orgchart/main/assets/playground.png)](https://docs.yworks.com/react-yfiles-orgchart/introduction/welcome)

Try the yFiles React Organization Chart component directly in your browser with our [playground](https://docs.yworks.com/react-yfiles-orgchart/introduction/welcome)

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

## Licensing

All owners of a valid software license for [yFiles for HTML](https://www.yworks.com/products/yfiles-for-html)
are allowed to use these sources as the basis for their own [yFiles for HTML](https://www.yworks.com/products/yfiles-for-html)
powered applications.

Use of such programs is governed by the rights and conditions as set out in the
[yFiles for HTML license agreement](https://www.yworks.com/products/yfiles-for-html/sla).

You can evaluate yFiles for 60 days free of charge on [my.yworks.com](https://my.yworks.com/signup?product=YFILES_HTML_EVAL).

For more information, see the `LICENSE` file.

## Learn More

Explore the possibilities of visualizing organizational structures with the yFiles Organization Chart Component. For further information about [yFiles for HTML](https://www.yworks.com/yfiles-overview) and our company, please visit [yWorks.com](https://www.yworks.com).

If you are exploring a different use case and require another React component,
please take a look at the available [React components](https://www.yworks.com/yfiles-react-components) powered by yFiles!

For support or feedback, please reach out to [our support team](https://www.yworks.com/contact) or open an [issue on GitHub](https://github.com/yWorks/react-yfiles-orgchart/issues). Happy diagramming!

