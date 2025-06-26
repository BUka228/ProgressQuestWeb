import React from 'react'
import ReactDOM from 'react-dom/client'
import { initializeApp } from './services/firebase'
import App from './App'
import './index.css'

// Initialize Firebase
initializeApp()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
