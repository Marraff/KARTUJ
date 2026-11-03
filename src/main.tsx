import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import { requestPersistentStorage } from './db/database'
import { initInstallPrompt } from './lib/installPrompt'
import './styles/tokens.css'
import './styles/global.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Missing #root element in index.html')

void requestPersistentStorage()
initInstallPrompt()

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
