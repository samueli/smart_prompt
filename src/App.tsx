import { Providers } from './components/providers'
import { Router } from './Router'
import { BaseModelProvider } from './contexts/BaseModelContext'

function App() {
  return (
    <BaseModelProvider>
      <Providers>
        <Router />
      </Providers>
    </BaseModelProvider>
  )
}

export default App