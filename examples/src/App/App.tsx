import yFilesLicense from '../yfiles-license.json'
import './App.css'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Header from './Header.tsx'
import routes from './routes.ts'
import SimpleOrgChart from '../examples/SimpleOrgChart'
import { registerLicense } from '@yworks/react-yfiles-orgchart'

function App() {
  registerLicense(yFilesLicense)

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/examples" />} />
        <Route path="examples" element={<Header />}>
          <Route index element={<SimpleOrgChart />} />
          {routes.map(route => (
            <Route path={route.path} key={route.path} element={<route.component />} />
          ))}
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
