import React from 'react'
import ReactDOM from 'react-dom/client'
import { Calendar } from './components/Calendar'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Calendar />
  </React.StrictMode>,
)
