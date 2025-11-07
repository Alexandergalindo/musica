import { useState } from 'react'
import './App.css'

/**
 * Componente principal de la aplicación de búsqueda de canciones y artistas
 * Utiliza la API de iTunes para obtener información musical
 */
function App() {
  // Estados de la aplicación
  const [searchTerm, setSearchTerm] = useState('') // Término de búsqueda ingresado por el usuario
  const [results, setResults] = useState([]) // Resultados de la búsqueda
  const [loading, setLoading] = useState(false) // Estado de carga
  const [error, setError] = useState(null) // Mensajes de error
  const [hasSearched, setHasSearched] = useState(false) // Flag para saber si ya se buscó

  /**
   * Función para realizar la búsqueda en la API de iTunes
   * Se ejecuta al presionar el botón de búsqueda
   */
  const handleSearch = async () => {
    // Validar que haya un término de búsqueda
    if (!searchTerm.trim()) {
      setError('Por favor, ingresa un término de búsqueda')
      return
    }

    // Limpiar estados anteriores
    setError(null)
    setResults([])
    setLoading(true)
    setHasSearched(true)

    try {
      // Construir la URL de la API de iTunes
      const apiUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&limit=20`
      
      // Realizar la petición HTTP
      const response = await fetch(apiUrl)
      
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error('Error al conectar con la API de iTunes')
      }

      // Convertir la respuesta a JSON
      const data = await response.json()

      // Actualizar los resultados
      if (data.results && data.results.length > 0) {
        setResults(data.results)
      } else {
        setResults([])
      }
    } catch (err) {
      // Manejar errores
      setError(err.message || 'Ocurrió un error al buscar. Por favor, verifica tu conexión e intenta nuevamente.')
      setResults([])
    } finally {
      // Finalizar el estado de carga
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

  return (
    <div className="app-container">
      <div className="container-fluid min-vh-100 py-5">
        <div className="container">
          {/* Encabezado */}
          <div className="row mb-5">
            <div className="col-12 text-center">
              <div className="header-content">
                <div className="music-icon">🎵</div>
                <h1 className="display-3 fw-bold mb-3 gradient-text">
                  Buscador de Canciones
                </h1>
                <h2 className="display-6 fw-light mb-4 text-white-50">
                  y Artistas
                </h2>
                <p className="lead text-white-50 mb-0">
                  Descubre música increíble con un solo clic
                </p>
              </div>
            </div>
          </div>

          {/* Formulario de búsqueda */}
          <div className="row mb-5">
            <div className="col-12 col-md-10 col-lg-8 offset-md-1 offset-lg-2">
              <div className="search-card">
                <div className="search-card-body">
                  <div className="input-group input-group-lg search-input-group">
                    <span className="input-group-text search-icon-wrapper">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                      </svg>
                    </span>
                    <input
                      type="text"
                      className="form-control search-input"
                      placeholder="Busca canciones, artistas, álbumes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={loading}
                    />
                    <button
                      className="btn btn-search"
                      type="button"
                      onClick={handleSearch}
                      disabled={loading || !searchTerm.trim()}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Buscando...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                          </svg>
                          Buscar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* Mensaje de error */}
        {error && (
          <div className="row mb-4">
            <div className="col-12 col-md-8 offset-md-2">
              <div className="alert alert-error alert-dismissible fade show" role="alert">
                <div className="d-flex align-items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                  </svg>
                  <div className="flex-grow-1">
                    <strong>Error:</strong> {error}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setError(null)}
                  aria-label="Cerrar"
                ></button>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje cuando no hay resultados */}
        {hasSearched && !loading && results.length === 0 && !error && (
          <div className="row mb-4">
            <div className="col-12 col-md-8 offset-md-2">
              <div className="alert alert-no-results text-center" role="alert">
                <div className="no-results-icon mb-3">🎼</div>
                <h5 className="alert-heading mb-3">No se encontraron resultados</h5>
                <p className="mb-0">
                  No se encontraron canciones o artistas que coincidan con tu búsqueda.
                  <br />
                  <span className="text-white-50">Intenta con otro término de búsqueda.</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Encabezado de resultados */}
        {results.length > 0 && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="results-header">
                <h2 className="results-title">
                  <span className="results-count">{results.length}</span>
                  <span className="results-text">Resultados encontrados</span>
                </h2>
              </div>
            </div>
          </div>
        )}

        {/* Grid de tarjetas con resultados */}
        <div className="row g-4">
          {results.map((item, index) => (
            <div 
              key={item.trackId}
              className="col-12 col-sm-6 col-md-4 col-lg-3"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="music-card h-100">
                {/* Imagen del álbum con overlay */}
                <div className="card-img-container">
                  <img
                    src={item.artworkUrl100?.replace('100x100', '300x300') || item.artworkUrl60?.replace('60x60', '300x300') || '/placeholder.png'}
                    className="card-img-top"
                    alt={`Portada del álbum ${item.collectionName || item.trackName || 'Sin nombre'}`}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300/6366f1/ffffff?text=Sin+Imagen'
                    }}
                  />
                  <div className="card-overlay">
                    {item.previewUrl && (
                      <a
                        href={item.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="play-button"
                        aria-label={`Escuchar vista previa de ${item.trackName}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                          <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
                <div className="card-body d-flex flex-column">
                  {/* Título de la canción */}
                  <h5 className="card-title fw-bold" title={item.trackName}>
                    {item.trackName || 'Sin título'}
                  </h5>
                  {/* Nombre del artista */}
                  <p className="card-artist">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="me-1">
                      <path d="M9 13c0 1.105-1.12 2-2.5 2S4 14.105 4 13s1.12-2 2.5-2 2.5.895 2.5 2z"/>
                      <path fillRule="evenodd" d="M9 3v10h1V3H9z"/>
                      <path d="M5 11.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/>
                    </svg>
                    {item.artistName || 'Desconocido'}
                  </p>
                  {/* Nombre del álbum */}
                  {item.collectionName && (
                    <p className="card-album">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" className="me-1">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-4 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"/>
                      </svg>
                      {item.collectionName}
                    </p>
                  )}
                  {/* Botón para escuchar vista previa */}
                  {item.previewUrl ? (
                    <div className="mt-auto pt-3">
                      <a
                        href={item.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-preview w-100"
                        aria-label={`Escuchar vista previa de ${item.trackName}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                          <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                        </svg>
                        Escuchar Vista Previa
                      </a>
                    </div>
                  ) : (
                    <div className="mt-auto pt-3">
                      <button className="btn btn-no-preview w-100" disabled>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                          <path d="M5.5 3.5A.5.5 0 0 1 6 4v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm5 0A.5.5 0 0 1 11 4v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>
                        </svg>
                        Vista previa no disponible
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  )
}

export default App
