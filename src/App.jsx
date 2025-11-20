// Importar el hook useState de React para manejar el estado de los componentes
import { useState } from 'react'
// Importar los estilos CSS de la aplicación
import './App.css'

/**
 * Componente principal de la aplicación de búsqueda de canciones y artistas
 * Utiliza la API de iTunes para obtener información musical
 * Diseño inspirado en YouTube Music
 */
function App() {
  // Estados de la aplicación
  // Estado para almacenar el término de búsqueda ingresado por el usuario
  const [searchTerm, setSearchTerm] = useState('') // Término de búsqueda ingresado por el usuario
  // Estado para almacenar los resultados de la búsqueda obtenidos de la API
  const [results, setResults] = useState([]) // Resultados de la búsqueda
  // Estado para indicar si se está cargando la información
  const [loading, setLoading] = useState(false) // Estado de carga
  // Estado para almacenar mensajes de error si ocurre algún problema
  const [error, setError] = useState(null) // Mensajes de error
  // Estado para saber si el usuario ya realizó una búsqueda
  const [hasSearched, setHasSearched] = useState(false) // Flag para saber si ya se buscó
  // Estado para almacenar la canción actual que se está reproduciendo
  const [currentTrack, setCurrentTrack] = useState(null) // Canción actual que se está reproduciendo
  // Estado para almacenar la cola de reproducción (lista de canciones)
  const [queue, setQueue] = useState([]) // Cola de reproducción

  /**
   * Función para realizar la búsqueda en la API de iTunes
   */
  const handleSearch = async () => {
    // Verificar si el término de búsqueda no está vacío
    if (!searchTerm.trim()) {
      // Si está vacío, mostrar un error y salir de la función
      setError('Por favor, ingresa un término de búsqueda')
      return
    }

    // Limpiar cualquier error previo
    setError(null)
    // Limpiar los resultados anteriores
    setResults([])
    // Activar el estado de carga
    setLoading(true)
    // Marcar que ya se realizó una búsqueda
    setHasSearched(true)

    try {
      // Construir la URL de la API de iTunes con el término de búsqueda codificado
      const apiUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(searchTerm)}&media=music&limit=20`
      // Realizar la petición HTTP a la API
      const response = await fetch(apiUrl)
      
      // Verificar si la respuesta fue exitosa
      if (!response.ok) {
        // Si no fue exitosa, lanzar un error
        throw new Error('Error al conectar con la API de iTunes')
      }

      // Convertir la respuesta a formato JSON
      const data = await response.json()

      // Verificar si hay resultados en la respuesta
      if (data.results && data.results.length > 0) {
        // Si hay resultados, guardarlos en el estado
        setResults(data.results)
        // Agregar solo los resultados que tienen previewUrl a la cola de reproducción
        setQueue(data.results.filter(item => item.previewUrl))
      } else {
        // Si no hay resultados, limpiar los estados
        setResults([])
        setQueue([])
      }
    } catch (err) {
      // Si ocurre un error, guardar el mensaje de error en el estado
      setError(err.message || 'Ocurrió un error al buscar. Por favor, verifica tu conexión e intenta nuevamente.')
      // Limpiar los resultados y la cola
      setResults([])
      setQueue([])
    } finally {
      // Desactivar el estado de carga sin importar si hubo error o no
      setLoading(false)
    }
  }

  /**
   * Función para manejar la tecla Enter en el input
   */
  const handleKeyPress = (e) => {
    // Verificar si se presionó la tecla Enter y no se está cargando
    if (e.key === 'Enter' && !loading) {
      // Si se cumplen las condiciones, ejecutar la búsqueda
      handleSearch()
    }
  }

  /**
   * Función para reproducir una canción
   */
  const handlePlay = (item) => {
    // Verificar si el item tiene una URL de preview disponible
    if (item.previewUrl) {
      // Si tiene preview, establecer la canción actual con toda su información
      setCurrentTrack({
        url: item.previewUrl, // URL del audio para reproducir
        name: item.trackName || 'Sin título', // Nombre de la canción o texto por defecto
        artist: item.artistName || 'Desconocido', // Nombre del artista o texto por defecto
        artwork: item.artworkUrl100?.replace('100x100', '300x300') || item.artworkUrl60?.replace('60x60', '300x300'), // Imagen de portada en mayor resolución
        collectionName: item.collectionName, // Nombre del álbum
        trackId: item.trackId // ID único de la canción
      })
    }
  }

  /**
   * Función para agregar canción a la cola
   */
  const handleAddToQueue = (item) => {
    // Verificar si el item tiene preview y no está ya en la cola
    if (item.previewUrl && !queue.find(q => q.trackId === item.trackId)) {
      // Si cumple las condiciones, agregarlo a la cola
      setQueue([...queue, item])
    }
  }

  /**
   * Función para reproducir la canción anterior en la cola
   */
  const handlePrevious = () => {
    // Verificar si hay una canción actual y hay canciones en la cola
    if (currentTrack && queue.length > 0) {
      // Buscar el índice de la canción actual en la cola
      const currentIndex = queue.findIndex(item => item.trackId === currentTrack.trackId)
      // Si hay una canción anterior (índice mayor a 0), reproducirla
      if (currentIndex > 0) {
        const previousItem = queue[currentIndex - 1]
        handlePlay(previousItem)
      } else if (currentIndex === -1 && queue.length > 0) {
        // Si la canción actual no está en la cola, reproducir la última canción
        handlePlay(queue[queue.length - 1])
      }
    }
  }

  /**
   * Función para reproducir la siguiente canción en la cola
   */
  const handleNext = () => {
    // Verificar si hay una canción actual y hay canciones en la cola
    if (currentTrack && queue.length > 0) {
      // Buscar el índice de la canción actual en la cola
      const currentIndex = queue.findIndex(item => item.trackId === currentTrack.trackId)
      // Si hay una canción siguiente (índice menor al último), reproducirla
      if (currentIndex < queue.length - 1) {
        const nextItem = queue[currentIndex + 1]
        handlePlay(nextItem)
      } else if (currentIndex === -1 && queue.length > 0) {
        // Si la canción actual no está en la cola, reproducir la primera canción
        handlePlay(queue[0])
      }
    } else if (queue.length > 0) {
      // Si no hay canción actual pero hay cola, reproducir la primera canción
      handlePlay(queue[0])
    }
  }

  // Retornar el JSX que representa la interfaz de la aplicación
  return (
    // Contenedor principal de la aplicación
    <div className="app-container">
      {/* Header - Barra superior de navegación */}
      <header className="ytm-header">
        {/* Contenedor fluido de Bootstrap */}
        <div className="container-fluid">
          {/* Fila con elementos alineados al centro */}
          <div className="row align-items-center">
            {/* Columna automática para el logo y menú hamburguesa */}
            <div className="col-auto">
              {/* Botón del menú hamburguesa */}
              <button className="btn btn-link text-white p-2">
                {/* Icono SVG del menú hamburguesa */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                </svg>
              </button>
              {/* Contenedor del logo de YouTube Music */}
              <div className="ytm-logo d-inline-flex align-items-center ms-2">
                {/* Icono de play en rojo */}
                <div className="ytm-logo-icon">▶</div>
                {/* Texto "Music" */}
                <span className="ms-2 fw-bold">Music</span>
              </div>
            </div>
            {/* Columna flexible para la barra de búsqueda */}
            <div className="col">
              {/* Grupo de input para la búsqueda */}
              <div className="input-group ytm-search">
                {/* Input de texto para buscar */}
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
                {/* Botón para limpiar el input si hay texto */}
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
            {/* Columna automática para el botón de acceso */}
            <div className="col-auto">
              {/* Botón de acceso/login */}
              <button className="btn btn-link text-white">Acceder</button>
            </div>
          </div>
        </div>
      </header>

      {/* Layout principal con sidebar izquierdo, contenido y sidebar derecho */}
      <div className={`main-layout ${queue.length > 0 ? 'has-sidebar-right' : ''}`}>
        {/* Sidebar izquierdo - Navegación principal */}
        <aside className="sidebar-left">
          {/* Navegación del sidebar */}
          <nav className="sidebar-nav">
            {/* Enlace a la página principal */}
            <a href="#" className="sidebar-item active">
              {/* Icono SVG de casa */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" className="me-3">
                <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z"/>
              </svg>
              Principal
            </a>
            {/* Enlace a explorar */}
            <a href="#" className="sidebar-item">
              {/* Icono SVG de información */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" className="me-3">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451.081.082.381 1.29-.39zm-1.5 2.371c.088 0 .143.007.143.041 0 .126-.155.26-.434.26-.279 0-.433-.134-.433-.26 0-.034.055-.041.143-.041zm.143-.25c-.192 0-.33.147-.33.347 0 .2.138.347.33.347.192 0 .33-.147.33-.347 0-.2-.138-.347-.33-.347z"/>
              </svg>
              Explorar
            </a>
            {/* Enlace a biblioteca */}
            <a href="#" className="sidebar-item">
              {/* Icono SVG de trofeo */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" className="me-3">
                <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z"/>
              </svg>
              Biblioteca
            </a>
          </nav>
        </aside>

        {/* Contenido principal - Área de resultados */}
        <main className="main-content">
          {/* Contenedor fluido con padding vertical */}
          <div className="container-fluid py-4">
            {/* Mensaje de error - Se muestra solo si hay un error */}
            {error && (
              <div className="alert alert-error alert-dismissible fade show mb-4" role="alert">
                <strong>Error:</strong> {error}
                {/* Botón para cerrar el mensaje de error */}
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setError(null)}
                  aria-label="Cerrar"
                ></button>
              </div>
            )}

            {/* Mensaje cuando no hay resultados - Se muestra si ya se buscó, no está cargando, no hay resultados y no hay error */}
            {hasSearched && !loading && results.length === 0 && !error && (
              <div className="alert alert-no-results text-center">
                {/* Emoji de música */}
                <div className="mb-3" style={{ fontSize: '4rem' }}>🎼</div>
                <h5>No se encontraron resultados</h5>
                <p className="mb-0">Intenta con otro término de búsqueda.</p>
              </div>
            )}

            {/* Grid de resultados - Se muestra solo si hay resultados */}
            {results.length > 0 && (
              <>
                {/* Título con cantidad de resultados */}
                <h2 className="mb-4">
                  {/* Badge con el número de resultados */}
                  <span className="badge bg-secondary me-2">{results.length}</span>
                  Resultados encontrados
                </h2>
                {/* Grid de tarjetas de música usando Bootstrap */}
                <div className="row g-3">
                  {/* Mapear cada resultado a una tarjeta */}
                  {results.map((item) => (
                    // Columna responsive para cada tarjeta
                    <div key={item.trackId} className="col-12 col-sm-6 col-md-4 col-lg-3">
                      {/* Tarjeta de música */}
                      <div className="card music-card h-100">
                        {/* Contenedor de la imagen con posición relativa */}
                        <div className="card-img-container position-relative">
                          {/* Imagen de la portada del álbum */}
                          <img
                            src={item.artworkUrl100?.replace('100x100', '300x300') || item.artworkUrl60?.replace('60x60', '300x300') || '/placeholder.png'}
                            className="card-img-top"
                            alt={item.trackName || 'Sin nombre'}
                            style={{ height: '200px', objectFit: 'cover' }}
                            onError={(e) => {
                              // Si la imagen falla al cargar, usar una imagen placeholder
                              e.target.src = 'https://via.placeholder.com/300x300/6366f1/ffffff?text=Sin+Imagen'
                            }}
                          />
                          {/* Overlay que aparece al hacer hover sobre la imagen */}
                          <div className="card-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                            {/* Botón de play - Solo se muestra si hay preview disponible */}
                            {item.previewUrl && (
                              <button
                                onClick={() => handlePlay(item)}
                                className="play-button rounded-circle border-0"
                                aria-label={`Reproducir ${item.trackName}`}
                              >
                                {/* Icono SVG de play */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                        {/* Cuerpo de la tarjeta con información */}
                        <div className="card-body">
                          {/* Título de la canción */}
                          <h6 className="card-title mb-1">{item.trackName || 'Sin título'}</h6>
                          {/* Nombre del artista */}
                          <p className="card-text small mb-2">{item.artistName || 'Desconocido'}</p>
                          {/* Botón de reproducir o no disponible */}
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

            {/* Estado inicial - Se muestra cuando no se ha realizado ninguna búsqueda */}
            {!hasSearched && (
              <div className="text-center py-5">
                {/* Emoji de nota musical grande */}
                <div className="mb-4" style={{ fontSize: '5rem' }}>🎵</div>
                {/* Título principal */}
                <h1 className="mb-3">Busque la cancion pa que baile</h1>
                {/* Subtítulo */}
                <p className="text-white-50">cantantes y grupos</p>
                {/* Descripción */}
                <p className="text-white-50 mt-3">Descubre música increíble con un solo clic</p>
              </div>
            )}
          </div>
        </main>

        {/* Sidebar derecho - Lista de "A continuación" - Solo se muestra si hay canciones en la cola */}
        {queue.length > 0 && (
          <aside className="sidebar-right">
            <div className="sidebar-right-content">
              {/* Encabezado del sidebar derecho */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">A CONTINUACIÓN</h6>
                <button className="btn btn-sm btn-link text-white p-0">Guardar</button>
              </div>
              {/* Lista de canciones en la cola */}
              <div className="queue-list">
                {/* Mapear las primeras 10 canciones de la cola */}
                {queue.slice(0, 10).map((item, index) => (
                  // Item de la cola - Se marca como activo si es la canción actual
                  <div
                    key={item.trackId}
                    className={`queue-item ${currentTrack?.trackId === item.trackId ? 'active' : ''}`}
                    onClick={() => handlePlay(item)}
                  >
                    {/* Número de posición en la cola */}
                    <div className="queue-item-number">{index + 1}</div>
                    {/* Imagen pequeña de la portada */}
                    <img
                      src={item.artworkUrl100 || item.artworkUrl60 || '/placeholder.png'}
                      alt={item.trackName}
                      className="queue-item-artwork"
                    />
                    {/* Información de la canción */}
                    <div className="queue-item-info">
                      {/* Título de la canción */}
                      <div className="queue-item-title">{item.trackName || 'Sin título'}</div>
                      {/* Nombre del artista */}
                      <div className="queue-item-artist">{item.artistName || 'Desconocido'}</div>
                    </div>
                    {/* Duración de la canción */}
                    <div className="queue-item-duration">
                      {/* Convertir milisegundos a formato mm:ss */}
                      {item.trackTimeMillis ? `${Math.floor(item.trackTimeMillis / 60000)}:${String(Math.floor((item.trackTimeMillis % 60000) / 1000)).padStart(2, '0')}` : '--:--'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Reproductor de audio fijo estilo YouTube Music - Solo se muestra si hay una canción actual */}
      {currentTrack && (
        <div className="audio-player-fixed">
          {/* Contenedor fluido de Bootstrap */}
          <div className="container-fluid">
            {/* Fila con elementos alineados al centro */}
            <div className="row align-items-center">
              {/* Columna izquierda - Portada y nombre de la canción (oculta en pantallas pequeñas) */}
              <div className="col-auto d-none d-md-flex align-items-center">
                {/* Imagen de la portada del álbum */}
                <img
                  src={currentTrack.artwork || 'https://via.placeholder.com/56x56/6366f1/ffffff?text=🎵'}
                  alt="Portada"
                  className="player-artwork"
                />
                {/* Información de la canción */}
                <div className="ms-3">
                  {/* Nombre de la canción */}
                  <div className="player-track-name">{currentTrack.name}</div>
                  {/* Nombre del artista */}
                  <div className="player-track-artist">{currentTrack.artist}</div>
                </div>
              </div>
              {/* Columna central - Controles de reproducción */}
              <div className="col d-flex flex-column align-items-center">
                {/* Controles de reproducción (anterior, play/pause, siguiente) */}
                <div className="player-controls d-flex align-items-center gap-3 mb-2">
                  {/* Botón para canción anterior */}
                  <button 
                    className="btn btn-link text-white p-1"
                    onClick={handlePrevious}
                    aria-label="Canción anterior"
                  >
                    {/* Icono SVG de flecha izquierda */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M11.354 1.146a.5.5 0 0 1 0 .708L5.707 8l5.647 5.146a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                    </svg>
                  </button>
                  {/* Botón de pausa/reproducción (controlado por el elemento audio) */}
                  <button className="btn btn-link text-white p-2">
                    {/* Icono SVG de pausa */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5.5 3.5A.5.5 0 0 1 6 4v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm5 0A.5.5 0 0 1 11 4v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>
                    </svg>
                  </button>
                  {/* Botón para siguiente canción */}
                  <button 
                    className="btn btn-link text-white p-1"
                    onClick={handleNext}
                    aria-label="Siguiente canción"
                  >
                    {/* Icono SVG de flecha derecha */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M4.646 1.146a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.146a.5.5 0 0 1 0-.708z"/>
                    </svg>
                  </button>
                </div>
                {/* Barra de progreso del audio */}
                <div className="player-progress w-100">
                  {/* Elemento HTML5 audio con controles nativos */}
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
              {/* Columna derecha - Controles adicionales (oculta en pantallas pequeñas) */}
              <div className="col-auto d-none d-lg-flex align-items-center gap-2">
                {/* Botón de like */}
                <button className="btn btn-link text-white p-1">
                  {/* Icono SVG de check (like) */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                  </svg>
                </button>
                {/* Botón de dislike */}
                <button className="btn btn-link text-white p-1">
                  {/* Icono SVG de carita triste (dislike) */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"/>
                  </svg>
                </button>
                {/* Botón de cola */}
                <button className="btn btn-link text-white p-1">
                  {/* Icono SVG de lista (cola) */}
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

// Exportar el componente App como exportación por defecto
export default App
