import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App/App.tsx'

import '@yworks/react-yfiles-orgchart/dist/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
