import { Outlet } from 'react-router-dom';
import NavBar from './components/layout/NavBar';
import TrackProvider from './providers/TrackProvider'

function App() {
  return (
    <>
    <TrackProvider>
     
              <header>
                <NavBar />
              </header>
              <main>
                <Outlet />
              </main>
    </TrackProvider>
    </>
  );
}

export default App;