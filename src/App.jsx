import { useState } from 'react'
import './App.css'

/**
 * Componente principal de la aplicación de búsqueda de canciones y artistas
 * Utiliza la API de iTunes para obtener información musical
 * Diseño inspirado en YouTube Music
 */
function App() {
  // Estados de la aplicación
  const [searchTerm, setSearchTerm] = useState('') // Término de búsqueda ingresado por el usuario
  const [results, setResults] = useState([]) // Resultados de la búsqueda
  const [loading, setLoading] = useState(false) // Estado de carga
  const [error, setError] = useState(null) // Mensajes de error
  const [hasSearched, setHasSearched] = useState(false) // Flag para saber si ya se buscó
  const [currentTrack, setCurrentTrack] = useState(null) // Canción actual que se está reproduciendo
  const [queue, setQueue] = useState([]) // Cola de reproducción

  /**
   * Función para realizar la búsqueda en la API de iTunes
   */
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Por favor, ingresa un término de búsqueda')
      return
    }

    setError(null)
    setResults([])
    setLoading(true)
    setHasSearched(true)

    try {
      const apiUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&limit=20`
      const response = await fetch(apiUrl)
      
      if (!response.ok) {
        throw new Error('Error al conectar con la API de iTunes')
      }

      const data = await response.json()

      if (data.results && data.results.length > 0) {
        setResults(data.results)
        // Agregar resultados a la cola
        setQueue(data.results.filter(item => item.previewUrl))
      } else {
        setResults([])
        setQueue([])
      }
    } catch (err) {
      setError(err.message || 'Ocurrió un error al buscar. Por favor, verifica tu conexión e intenta nuevamente.')
      setResults([])
      setQueue([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * Función para manejar la tecla Enter en el input
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSearch()
    }
  }

  /**
   * Función para reproducir una canción
   */
  const handlePlay = (item) => {
    if (item.previewUrl) {
      setCurrentTrack({
        url: item.previewUrl,
        name: item.trackName || 'Sin título',
        artist: item.artistName || 'Desconocido',
        artwork: item.artworkUrl100?.replace('100x100', '300x300') || item.artworkUrl60?.replace('60x60', '300x300'),
        collectionName: item.collectionName,
        trackId: item.trackId
      })
    }
  }

  /**
   * Función para agregar canción a la cola
   */
  const handleAddToQueue = (item) => {
    if (item.previewUrl && !queue.find(q => q.trackId === item.trackId)) {
      setQueue([...queue, item])
    }
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="ytm-header">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-auto">
              <button className="btn btn-link text-white p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                </svg>
              </button>
              <div className="ytm-logo d-inline-flex align-items-center ms-2">
                <div className="ytm-logo-icon">▶</div>
                <span className="ms-2 fw-bold">Music</span>
              </div>
            </div>
            <div className="col">
              <div className="input-group ytm-search">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
                {searchTerm && (
                  <button
                    className="btn btn-link text-white"
                    onClick={() => setSearchTerm('')}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            <div className="col-auto">
              <button className="btn btn-link text-white">Acceder</button>
            </div>
          </div>
        </div>
      </header>

      <div className="main-layout">
        {/* Sidebar izquierdo */}
        <aside className="sidebar-left">
          <nav className="sidebar-nav">
            <a href="#" className="sidebar-item active">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" className="me-3">
                <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z"/>
              </svg>
              Principal
            </a>
            <a href="#" className="sidebar-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" className="me-3">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451.081.082.381 1.29-.39zm-1.5 2.371c.088 0 .143.007.143.041 0 .126-.155.26-.434.26-.279 0-.433-.134-.433-.26 0-.034.055-.041.143-.041zm.143-.25c-.192 0-.33.147-.33.347 0 .2.138.347.33.347.192 0 .33-.147.33-.347 0-.2-.138-.347-.33-.347z"/>
              </svg>
              Explorar
            </a>
            <a href="#" className="sidebar-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" className="me-3">
                <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z"/>
              </svg>
              Biblioteca
            </a>
          </nav>
        </aside>

        {/* Contenido principal */}
        <main className="main-content">
          <div className="container-fluid py-4">
            {/* Mensaje de error */}
            {error && (
              <div className="alert alert-error alert-dismissible fade show mb-4" role="alert">
                <strong>Error:</strong> {error}
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setError(null)}
                  aria-label="Cerrar"
                ></button>
              </div>
            )}

            {/* Mensaje cuando no hay resultados */}
            {hasSearched && !loading && results.length === 0 && !error && (
              <div className="alert alert-no-results text-center">
                <div className="mb-3" style={{ fontSize: '4rem' }}>🎼</div>
                <h5>No se encontraron resultados</h5>
                <p className="mb-0">Intenta con otro término de búsqueda.</p>
              </div>
            )}

            {/* Grid de resultados */}
            {results.length > 0 && (
              <>
                <h2 className="mb-4">
                  <span className="badge bg-secondary me-2">{results.length}</span>
                  Resultados encontrados
                </h2>
                <div className="row g-3">
                  {results.map((item) => (
                    <div key={item.trackId} className="col-12 col-sm-6 col-md-4 col-lg-3">
                      <div className="card music-card h-100">
                        <div className="card-img-container position-relative">
                          <img
                            src={item.artworkUrl100?.replace('100x100', '300x300') || item.artworkUrl60?.replace('60x60', '300x300') || '/placeholder.png'}
                            className="card-img-top"
                            alt={item.trackName || 'Sin nombre'}
                            style={{ height: '200px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/300x300/6366f1/ffffff?text=Sin+Imagen'
                            }}
                          />
                          <div className="card-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                            {item.previewUrl && (
                              <button
                                onClick={() => handlePlay(item)}
                                className="play-button rounded-circle border-0"
                                aria-label={`Reproducir ${item.trackName}`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="card-body">
                          <h6 className="card-title mb-1">{item.trackName || 'Sin título'}</h6>
                          <p className="card-text small mb-2">{item.artistName || 'Desconocido'}</p>
                          {item.previewUrl ? (
                            <button
                              onClick={() => handlePlay(item)}
                              className="btn btn-sm btn-danger w-100"
                            >
                              Reproducir
                            </button>
                          ) : (
                            <button className="btn btn-sm btn-no-preview w-100" disabled>
                              No disponible
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Estado inicial */}
            {!hasSearched && (
              <div className="text-center py-5">
                <div className="mb-4" style={{ fontSize: '5rem' }}>🎵</div>
                <h1 className="mb-3">Busque la cancion pa que baile</h1>
                <p className="text-white-50">cantantes y grupos</p>
                <p className="text-white-50 mt-3">Descubre música increíble con un solo clic</p>
              </div>
            )}
          </div>
        </main>

        {/* Sidebar derecho - Up Next */}
        {queue.length > 0 && (
          <aside className="sidebar-right">
            <div className="sidebar-right-content">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">A CONTINUACIÓN</h6>
                <button className="btn btn-sm btn-link text-white p-0">Guardar</button>
              </div>
              <div className="queue-list">
                {queue.slice(0, 10).map((item, index) => (
                  <div
                    key={item.trackId}
                    className={`queue-item ${currentTrack?.trackId === item.trackId ? 'active' : ''}`}
                    onClick={() => handlePlay(item)}
                  >
                    <div className="queue-item-number">{index + 1}</div>
                    <img
                      src={item.artworkUrl100 || item.artworkUrl60 || '/placeholder.png'}
                      alt={item.trackName}
                      className="queue-item-artwork"
                    />
                    <div className="queue-item-info">
                      <div className="queue-item-title">{item.trackName || 'Sin título'}</div>
                      <div className="queue-item-artist">{item.artistName || 'Desconocido'}</div>
                    </div>
                    <div className="queue-item-duration">
                      {item.trackTimeMillis ? `${Math.floor(item.trackTimeMillis / 60000)}:${String(Math.floor((item.trackTimeMillis % 60000) / 1000)).padStart(2, '0')}` : '--:--'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Reproductor de audio fijo estilo YouTube Music */}
      {currentTrack && (
        <div className="audio-player-fixed">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-auto d-none d-md-flex align-items-center">
                <img
                  src={currentTrack.artwork || 'https://via.placeholder.com/56x56/6366f1/ffffff?text=🎵'}
                  alt="Portada"
                  className="player-artwork"
                />
                <div className="ms-3">
                  <div className="player-track-name">{currentTrack.name}</div>
                  <div className="player-track-artist">{currentTrack.artist}</div>
                </div>
              </div>
              <div className="col d-flex flex-column align-items-center">
                <div className="player-controls d-flex align-items-center gap-3 mb-2">
                  <button className="btn btn-link text-white p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M11.354 1.146a.5.5 0 0 1 0 .708L5.707 8l5.647 5.146a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                    </svg>
                  </button>
                  <button className="btn btn-link text-white p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5.5 3.5A.5.5 0 0 1 6 4v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm5 0A.5.5 0 0 1 11 4v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>
                    </svg>
                  </button>
                  <button className="btn btn-link text-white p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M4.646 1.146a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.146a.5.5 0 0 1 0-.708z"/>
                    </svg>
                  </button>
                </div>
                <div className="player-progress w-100">
                  <audio
                    src={currentTrack.url}
                    controls
                    autoPlay
                    className="w-100"
                  >
                    Tu navegador no soporta el elemento de audio.
                  </audio>
                </div>
              </div>
              <div className="col-auto d-none d-lg-flex align-items-center gap-2">
                <button className="btn btn-link text-white p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                  </svg>
                </button>
                <button className="btn btn-link text-white p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"/>
                  </svg>
                </button>
                <button className="btn btn-link text-white p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 3.5A.5.5 0 0 1 6 4v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm5 0A.5.5 0 0 1 11 4v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
