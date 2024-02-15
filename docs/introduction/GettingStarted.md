---
title: Getting Started
section: 1
tags: []
---

# Getting Started

1. **Installation:**
   Install the component via npm by running the following command in your project directory:
   ```bash
   npm install @yworks/react-yfiles-orgchart
   ```

   The organization chart module has some peer dependencies that must be installed somewhere in your project. Since it is a React module, `react` and `react-dom` dependencies are needed.

   Additionally, the component relies on the [yFiles](https://www.yworks.com/yfiles-overview) library which is not published to the public npm registry. You can learn  how to work with the yFiles npm module in our [Developer's Guide](https://docs.yworks.com/yfileshtml/#/dguide/yfiles_npm_module).

   Ensure that the dependencies in the `package.json` file resemble the following:
   ```json
   {
     ...
     "dependencies": {
       "@yworks/react-yfiles-orgchart": "^0.1.0",
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
   Utilize the component in your application. Make sure to import the CSS stylesheet.

   ```tsx
   import {CustomOrgChartData, OrgChart, registerLicense } from '@yworks/react-yfiles-orgchart'
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

## Learn More

Explore the possibilities of visualizing organizational structures with the yFiles Organization Chart Component. For further information about [yFiles for HTML](https://www.yworks.com/yfiles-overview) and our company, please visit [yWorks.com](https://www.yworks.com).

For support or feedback, please reach out to [our support team](https://website.yworks.home/contact) or open an issue on GitHub. Happy diagramming!

