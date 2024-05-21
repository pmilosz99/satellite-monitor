import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'
import { ColorModeScript } from '@chakra-ui/react'
import { config } from './app/shared/themes'
import { queryClient } from './app/shared/react-query.ts'
import { QueryClientProvider } from '@tanstack/react-query'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={config.initialColorMode} />
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
