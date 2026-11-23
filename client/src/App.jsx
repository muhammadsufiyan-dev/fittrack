import Preloader from './components/ui/Preloader'
import AppRoutes from './routes/AppRoutes'
import ScrollToTop from './routes/ScrollToTop'

function App() {
  return (
    <>
      <Preloader />
      <ScrollToTop />
      <AppRoutes />
    </>
  )
}

export default App
