import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'
import { ColorModeScript } from '@chakra-ui/react'
import { config } from './app/shared/themes'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={config.initialColorMode} />
    <App />
  </React.StrictMode>,
)
