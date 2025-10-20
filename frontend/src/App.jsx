import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { TrackProvider } from './providers/TrackProvider'
import { ArtistProvider } from './providers/ArtistProvider'
import { LinkProvider } from './providers/LinkProvider'
import { TagProvider } from './providers/TagProvider'
import { MediaProvider } from './providers/MediaProvider'
import HomePage from './pages/HomePage'
import TrackPage from './pages/TrackPage'
import ArtistPage from './pages/ArtistPage'
import LinkPage from './pages/LinkPage'
import TagPage from './pages/TagPage'
import MediaPage from './pages/MediaPage'

function App() {
  return (
    <TrackProvider>
    <ArtistProvider>
    <LinkProvider>
    <TagProvider>
    <MediaProvider>
      <Router>
        <nav style={{ padding: '1rem', background: '#f0f0f0' }}>
          <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
          <Link to="/tracks" style={{ marginRight: '1rem' }}>Tracks</Link>
          <Link to="/artists" style={{ marginRight: '1rem' }}>Artists</Link>
          <Link to="/links" style={{ marginRight: '1rem' }}>Links</Link>
          <Link to="/tags" style={{ marginRight: '1rem' }}>Tags</Link>
          <Link to="/medias" style={{ marginRight: '1rem' }}>Medias</Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tracks" element={<TrackPage />} />
          <Route path="/artists" element={<ArtistPage />} />
          <Route path="/links" element={<LinkPage />} />
          <Route path="/tags" element={<TagPage />} />
          <Route path="/medias" element={<MediaPage />} />
        </Routes>
      </Router>
    </MediaProvider>
    </TagProvider>
    </LinkProvider>
    </ArtistProvider>
    </TrackProvider>
  )
}

export default App
