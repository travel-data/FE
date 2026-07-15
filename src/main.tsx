import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './global.css'

import Provider from './components/provider'
import i18n from './lib/i18n'
i18n
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider />
  </StrictMode>,
)
