'use strict'

/*
 ***********************************************************
 *                                                         *
 *                       VARIABLES                         *
 *                                                         *
 ***********************************************************
*/

// Arrays que tendrán los datos adquiridos del JSON
let albumes = [];
let sencillas = [];

// Objeto que contendrá los datos de la canción reproduciéndose
let cancionActiva = {};

const contenidoPrincipal = document.querySelector('#contenido-principal');
const contenidoMenu = document.querySelector('#contenido-menu');
const contenidoReproductor = document.querySelector('#contenido-reproductor');
let primeraReproduccion = false;

// Accesos del menú
const inicioMenu = document.querySelector('#menu-inicio');
const albumesMenu = document.querySelector('#menu-albumes');
const cancionesMenu = document.querySelector('#menu-sencillas');

const iconoInicio = document.querySelector('#inicio');
const iconoAlbumes = document.querySelector('#albumes');
const iconoSencillas = document.querySelector('#sencillas');

// Cover y nombres del reproductor
const coverReproductor = document.querySelector('#coverReproductor');
const tituloReproductor = document.querySelector('#tituloReproductor');
const artistaReproductor = document.querySelector('#artistaReproductor');

// Canción
const audioCancion = document.querySelector('#audioCancion');
const tiempoActual = document.querySelector('#tiempoActual');
const tiempoRestante = document.querySelector('#tiempoRestante');

// Controles canción
const barraCancion = document.querySelector('#barraCancion');
const btnAleatorio = document.querySelector('#btn-aleatorio');
const btnAnterior = document.querySelector('#btn-anterior');
const btnPlay = document.querySelector('#btn-play');
const btnSiguiente = document.querySelector('#btn-siguiente');
const btnRepetir = document.querySelector('#btn-repetir');

// Controles Volumen
audioCancion.volume = 0.5;
let volumenValor = audioCancion.volume;
const volumenAlmacenado = localStorage.getItem('volumen');
const barraVolumen = document.querySelector('#barraVolumen');
const iconoVolumen = document.querySelector('#icono-volumen');

/*
 ***********************************************************
 *                                                         *
 *                   EJECUCIÓN PRINCIPAL                   *
 *                                                         *
 ***********************************************************
*/

window.addEventListener('load', () => {
    obtenerDatos();

    // Acciones del menú
    inicioMenu.addEventListener('click', () => {
        limpiarHTML(contenidoPrincipal);

        cargarInicio();
        cargarIconoMenuInicio();
    });

    albumesMenu.addEventListener('click', () => {
        limpiarHTML(contenidoPrincipal);

        contenidoPrincipal.classList.add('p-6');
        crearLogo();
        cargarIconoMenuAlbum();
        cargarAlbumes('Álbumes disponibles', albumes);
    });

    cancionesMenu.addEventListener('click', () => {
        limpiarHTML(contenidoPrincipal);

        contenidoPrincipal.classList.add('p-6');
        crearLogo();
        cargarIconoMenuSencillas();
        cargarCanciones('Echa un vistazo a nuestras canciones', sencillas);
    });

    // Extender reproductor
    contenidoReproductor.onclick = (contenidoReproductor) => {
        if (window.matchMedia('(max-width: 1023px)').matches) {
            if (contenidoReproductor.target.tagName === 'IMG' || contenidoReproductor.target.tagName === 'svg' || contenidoReproductor.target.tagName === 'path') {
                event.stopPropagation();
            } else {
                extenderReproductor();
            }
        }
    }

    coverReproductor.addEventListener('click', () => {
        if (cancionActiva.idAlbum) {
            mostrarAlbum(cancionActiva.idAlbum);
        } else if (cancionActiva.id) {
            mostrarCancion(cancionActiva.id);
        }
    });

    // Controles de la canción
    btnAleatorio.addEventListener('click', modoAleatorio);

    btnAnterior.addEventListener('click', anteriorCancion);

    btnPlay.addEventListener('click', alternarPlayPause);

    btnSiguiente.addEventListener('click', siguienteCancion);

    btnRepetir.addEventListener('click', modoLoop);

    barraCancion.addEventListener('input', () => {
        audioCancion.currentTime = barraCancion.value;
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === ' ') {
            if (event.target == document.body) {
                event.preventDefault();
            }
            
            if (primeraReproduccion && !document.querySelector('#reproductorExtendido')) {
                alternarPlayPause();
            }

            if (document.querySelector('#reproductorExtendido')) {
                const btnPlayExtendido = document.getElementById('btn-playExtendido');
                const tiempoActualExtendido = document.getElementById('tiempoActualExtendido');
                const tiempoRestanteExtendido = document.getElementById('tiempoRestanteExtendido');
                const barraCancionExtendida = document.getElementById('barraCancionExtendida');

                alternarPlayPauseExtendido(btnPlayExtendido, barraCancionExtendida, tiempoActualExtendido, tiempoRestanteExtendido);
            }
        }
    });

    audioCancion.addEventListener('ended', siguienteCancion);

    // Controles de volumen
    iconoVolumen.addEventListener('click', () => {
        if (audioCancion.volume > 0) {
            volumenValor = audioCancion.volume;
            audioCancion.volume = 0;
            barraVolumen.value = 0;
            // VolumeMute.svg
            iconoVolumen.innerHTML = `
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                    <path d='M36.2,40.3l-4.4-4.4c-0.5,0.4-1.1,0.7-1.7,1c-0.6,0.3-1.2,0.6-1.8,0.8c-0.4,0.1-0.8,0.1-1.2-0.2c-0.3-0.3-0.5-0.6-0.5-1.1
                    c0-0.2,0.1-0.4,0.2-0.6s0.3-0.3,0.5-0.3c0.5-0.2,1-0.3,1.4-0.6c0.5-0.2,0.9-0.5,1.3-0.8l-6.6-6.6v6.6c0,0.5-0.2,0.9-0.7,1.1
                    s-0.9,0.1-1.3-0.3l-6-6h-5.2c-0.3,0-0.6-0.1-0.9-0.3C9.2,28.4,9,28.1,9,27.8v-7.2c0-0.3,0.1-0.6,0.3-0.9c0.2-0.2,0.5-0.3,0.9-0.3h5
                    l-8-8C7.1,11.2,7,10.9,7,10.6S7.1,10,7.4,9.7c0.2-0.2,0.5-0.4,0.8-0.4c0.3,0,0.6,0.1,0.8,0.4l28.9,28.8c0.2,0.2,0.4,0.5,0.4,0.9
                    c0,0.3-0.1,0.6-0.4,0.9s-0.5,0.4-0.9,0.4C36.7,40.6,36.4,40.5,36.2,40.3z M28.3,10.6c2.9,1,5.2,2.8,6.9,5.2c1.7,2.5,2.6,5.2,2.6,8.3
                    c0,1.4-0.2,2.7-0.6,4s-0.9,2.5-1.7,3.7l-1.7-1.7c0.5-0.9,0.9-1.9,1.2-2.9c0.3-1,0.4-2.1,0.4-3.1c0-2.6-0.7-5-2.2-7.1
                    s-3.4-3.5-5.9-4.2c-0.2-0.1-0.4-0.2-0.5-0.3c-0.1-0.2-0.2-0.4-0.2-0.6c0-0.5,0.2-0.8,0.5-1.1S27.9,10.5,28.3,10.6z M30.2,26.5
                    l-3.6-3.6v-5.2c1.3,0.6,2.2,1.5,2.9,2.6c0.7,1.2,1.1,2.5,1.1,3.8c0,0.4,0,0.8-0.1,1.2C30.5,25.8,30.4,26.1,30.2,26.5z M23.4,19.7
                    l-4.2-4.2l2.1-2.1c0.4-0.4,0.8-0.5,1.3-0.3c0.5,0.2,0.7,0.6,0.7,1.1L23.4,19.7z'/>
                </svg>
            `;
        } else if (audioCancion.volume === 0) {
            audioCancion.volume = volumenValor;
            barraVolumen.value = volumenValor;
            actualizarIconoVolumen();
        }
    });

    if (volumenAlmacenado) {
        barraVolumen.value = volumenAlmacenado;
        audioCancion.volume = barraVolumen.value;
    }

    barraVolumen.addEventListener('input', () => {
        audioCancion.volume = barraVolumen.value;
        localStorage.setItem('volumen', barraVolumen.value);
        actualizarIconoVolumen();
    });

    comprobarMediaQuery();
});

/*
 ***********************************************************
 *                                                         *
 *                        FUNCIONES                        *
 *                                                         *
 ***********************************************************
*/

// Recoger todos los álbumes y canciones del json
function obtenerDatos() {
    fetch('db.json')
        .then(respuesta => respuesta.json())
        .then(resultado => {
            resultado.albumes.forEach(album => {
                albumes.push(album);
            });

            resultado.sencillas.forEach(sencilla => {
                sencillas.push(sencilla);
            });

            cargarInicio();
        })
        .catch(error => {
            console.log('Ocurrió un error, ' + error);
        });
}

// Cargar la home de la aplicación, con álbumes y canciones aleatorias
function cargarInicio() {
    contenidoPrincipal.classList.add('p-6');
    crearLogo();

    // Generar cuatro álbumes aleatorios
    let albumesHome = [];
    let aleatorio;
    let nuevoAlbum;

    while (albumesHome.length <= 3) {
        aleatorio = numeroAleatorio(1, 5);

        nuevoAlbum = albumes.find(album => album.id === aleatorio);

        if (albumesHome.find(album => album.id === nuevoAlbum.id)) {
            continue;
        } else {
            albumesHome = [...albumesHome, nuevoAlbum];
        }
    }

    cargarAlbumes('Descubre nuevos álbumes', albumesHome);

    // Generar ocho canciones aleatorias
    let cancionesHome = [];
    let nuevaCancion;

    while (cancionesHome.length <= 7) {
        aleatorio = numeroAleatorio(1, 13);

        nuevaCancion = sencillas.find(cancion => cancion.id === aleatorio);

        if (cancionesHome.find(cancion => cancion.id === nuevaCancion.id)) {
            continue;
        } else {
            cancionesHome = [...cancionesHome, nuevaCancion];
        }
    }

    cargarCanciones('Canciones del momento', cancionesHome, true);

    cargarIconoMenuInicio();
}

// Mostrar la vista con todos los álbumes disponibles
function cargarAlbumes(titulo, albumes) {
    const tituloSeccionAlbumes = document.createElement('h3');
    tituloSeccionAlbumes.classList.add('my-6', 'text-2xl', 'font-bold', 'md:my-10', 'md:text-3xl');
    tituloSeccionAlbumes.textContent = titulo;

    const contenedorAlbumes = document.createElement('div');
    contenedorAlbumes.classList.add('grid', 'gap-4', 'gap-y-10', 'sm:grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4', 'mb-8');

    contenidoPrincipal.appendChild(tituloSeccionAlbumes);
    contenidoPrincipal.appendChild(contenedorAlbumes);

    albumes.forEach(album => {
        const { id, nombreAlbum, artista, rutaImagen } = album;

        const divAlbum = document.createElement('div');
        divAlbum.classList.add('bg-zinc-900', 'rounded-lg', 'overflow-hidden', 'w-4/5', 'justify-self-center', 'p-5', 'ease-in-out', 'duration-500', 'sm:w-full', 'md:cursor-pointer', 'md:hover:-translate-y-4', 'md:mx-0');
        divAlbum.setAttribute('id', id);

        divAlbum.onclick = () => {
            mostrarAlbum(id);
        }

        const imagen = document.createElement('img');
        imagen.src = `img/albumes/${rutaImagen}`;
        imagen.alt = 'Imagen del álbum';

        const descripcion = document.createElement('div');

        const nombre = document.createElement('p');
        nombre.classList.add('text-xl', 'font-semibold', 'mt-4', 'mb-1');
        nombre.textContent = nombreAlbum;

        const autor = document.createElement('p');
        autor.classList.add('text-md', 'text-zinc-400');
        autor.textContent = artista;

        descripcion.appendChild(nombre);
        descripcion.appendChild(autor);

        divAlbum.appendChild(imagen);
        divAlbum.appendChild(descripcion);

        contenedorAlbumes.appendChild(divAlbum);
    });
}

// Mostrar la vista con todas las canciones disponibles
function cargarCanciones(titulo, canciones, contenidoReducido = false) {
    const tituloSeccionCanciones = document.createElement('h3');
    tituloSeccionCanciones.classList.add('my-6', 'text-2xl', 'font-bold', 'md:my-10', 'md:text-3xl');
    tituloSeccionCanciones.textContent = titulo;

    const contenedorCanciones = document.createElement('div');
    contenedorCanciones.classList.add('grid', 'gap-4', 'gap-y-10', 'sm:grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4', 'mb-8');

    contenidoPrincipal.appendChild(tituloSeccionCanciones);
    contenidoPrincipal.appendChild(contenedorCanciones);

    canciones.forEach((cancion, index) => {
        const { id, nombre, artista, rutaImagen } = cancion;

        const divCancion = document.createElement('div');
        divCancion.classList.add('bg-zinc-900', 'p-5', 'rounded-lg', 'overflow-hidden', 'w-4/5', 'justify-self-center', 'ease-in-out', 'duration-500', 'sm:w-full',
            'md:cursor-pointer', 'md:hover:-translate-y-4', 'ease-in-out', 'duration-500', 'md:mx-0');

        if (contenidoReducido) {
            if (index >= 4 && index < 6) {
                divCancion.classList.add('hidden');
                divCancion.classList.add('sm:block');
            }

            if (index >= 6) {
                divCancion.classList.add('hidden');
                divCancion.classList.add('lg:block');
            }
        }

        divCancion.setAttribute('id', id);
        divCancion.onclick = () => {
            mostrarCancion(id);
        }

        const imagen = document.createElement('img');
        imagen.src = `img/sencillas/${rutaImagen}`;
        imagen.alt = 'Imagen de la canción';

        const descripcion = document.createElement('div');

        const nombreCancion = document.createElement('p');
        nombreCancion.classList.add('text-xl', 'font-semibold', 'mt-4', 'mb-1');
        nombreCancion.textContent = nombre;

        const autor = document.createElement('p');
        autor.classList.add('text-md', 'text-zinc-400');
        autor.textContent = artista;

        descripcion.appendChild(nombreCancion);
        descripcion.appendChild(autor);

        divCancion.appendChild(imagen);
        divCancion.appendChild(descripcion);

        contenedorCanciones.appendChild(divCancion);
    });
}

// Crear el logo de la aplicación y añadirlo al contenido principal
function crearLogo() {
    const divLogo = document.createElement('div');
    divLogo.classList.add('flex', 'items-center', 'mt-4', 'mb-8');
    divLogo.innerHTML = `    
        <svg id='logo' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
        <path d='M19.65 42q-3.15 0-5.325-2.175Q12.15 37.65 12.15 34.5q0-3.15 2.175-5.325Q16.5 27 19.65 27q1.4 0 2.525.4t1.975 1.1V9q0-1.25.875-2.125T27.15 6h5.35q1.4 0 2.375.975.975.975.975 2.375t-.975 2.4q-.975 1-2.375 1h-5.35V34.5q0 3.15-2.175 5.325Q22.8 42 19.65 42Z' />
            <linearGradient id='myGradient' x1='0.4' y1='1' x2='1' y2='0'>
                <stop offset='12%' stop-color='#ff7a00' />
                <stop offset='40%' stop-color='#ff0169' />
                <stop offset='70%' stop-color='#d300c5' />
                <stop offset='100%' stop-color='#7336f3' />
            </linearGradient>
        </svg>

        <p class='font-bold text-4xl'>Music App</p>
    `;

    contenidoPrincipal.appendChild(divLogo);
}

// Mostrar la información y canciones del álbum al hacer clic sobre él
function mostrarAlbum(idAlbum) {
    const albumSeleccionado = albumes.find(album => album.id === idAlbum);

    contenidoPrincipal.classList.remove('p-6');
    limpiarHTML(contenidoPrincipal);

    const { nombreAlbum, artista, fecha_lanzamiento, cantidad_canciones, duracion, rutaImagen, color, sombra, canciones } = albumSeleccionado;

    // Cabecera
    const divCabecera = document.createElement('div');
    divCabecera.classList.add('p-5', 'sm:p-10');
    divCabecera.style.background = `linear-gradient(${color}, ${sombra})`;

    const divVolver = document.createElement('div');
    divVolver.classList.add('w-6', 'md:hover:cursor-pointer');
    divVolver.innerHTML = `
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
            <path d='m22.35 38.95-13.9-13.9q-.25-.25-.35-.5Q8 24.3 8 24q0-.3.1-.55.1-.25.35-.5L22.4 9q.4-.4 1-.4t1.05.45q.45.45.45 1.05 0 .6-.45 1.05L13.1 22.5h24.8q.65 0 1.075.425.425.425.425 1.075 0 .65-.425 1.075-.425.425-1.075.425H13.1l11.4 11.4q.4.4.4 1t-.45 1.05q-.45.45-1.05.45-.6 0-1.05-.45Z' />
        </svg>
    `;

    divVolver.onclick = () => {
        limpiarHTML(contenidoPrincipal);

        contenidoPrincipal.classList.add('p-6');
        crearLogo();
        cargarAlbumes('Álbumes disponibles', albumes);
    }

    const divContenidoCabecera = document.createElement('div');
    divContenidoCabecera.classList.add('flex', 'flex-wrap', 'justify-between', 'gap-8', 'mt-8', 'md:flex-nowrap', 'md:justify-start');

    const divImagen = document.createElement('div');
    divImagen.classList.add('h-full', 'min-w-fit', 'mx-auto', 'md:mx-0');

    const imagen = document.createElement('img');
    imagen.classList.add('h-cover-img', 'rounded-md', 'object-contain');
    imagen.src = `img/albumes/${rutaImagen}`;
    imagen.alt = 'Imagen del Álbum';

    divImagen.appendChild(imagen);

    const divInfo = document.createElement('div');
    divInfo.classList.add('flex', 'flex-wrap', 'content-end', 'w-full', 'md:w-fit', 'md:gap-4', 'lg:gap-6');

    const pNombre = document.createElement('p');
    pNombre.classList.add('w-full', 'mb-3', 'text-4xl', 'font-bold', 'md:text-6xl', 'lg:text-7xl', 'xl:text-8xl');
    pNombre.textContent = nombreAlbum;

    const divResto = document.createElement('p');
    divResto.classList.add('w-full', 'flex', 'flex-wrap', 'gap-x-5', 'gap-y-1', 'text-md');

    const spanArtista = document.createElement('span');
    spanArtista.textContent = artista;
    spanArtista.classList.add('font-semibold');

    const spanCantidadCanciones = document.createElement('span');
    spanCantidadCanciones.textContent = `${cantidad_canciones} canciones`;

    const spanDuracion = document.createElement('span');
    spanDuracion.textContent = `${duracion} minutos`;

    const spanFecha = document.createElement('span');
    spanFecha.textContent = fecha_lanzamiento;

    divResto.appendChild(spanArtista);
    divResto.appendChild(spanCantidadCanciones);
    divResto.appendChild(spanDuracion);
    divResto.appendChild(spanFecha);

    divInfo.appendChild(pNombre);
    divInfo.appendChild(divResto);

    divContenidoCabecera.appendChild(divImagen);
    divContenidoCabecera.appendChild(divInfo);

    divCabecera.appendChild(divVolver);
    divCabecera.appendChild(divContenidoCabecera);

    contenidoPrincipal.appendChild(divCabecera);

    // Canciones
    const divCanciones = document.createElement('div');
    divCanciones.classList.add('flex', 'flex-wrap', 'p-5', 'sm:p-10');

    const cancionesHead = document.createElement('div');
    cancionesHead.classList.add('w-full', 'flex', 'justify-between', 'items-center', 'border-b', 'border-neutral-600', 'px-5', 'py-2.5', 'mb-4');

    const cancionesHeadIzq = document.createElement('div');
    cancionesHeadIzq.classList.add('flex', 'gap-8');

    const pNumero = document.createElement('p');
    pNumero.textContent = '#';

    const pTitulo = document.createElement('p');
    pTitulo.classList.add('uppercase');
    pTitulo.textContent = 'Título';

    const cancionesHeader = document.createElement('div');
    cancionesHeader.innerHTML = `
        <svg id='timer' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
            <path d='M19.5 5q-.65 0-1.075-.425Q18 4.15 18 3.5q0-.65.425-1.075Q18.85 2 19.5 2h9q.65 0 1.075.425Q30 2.85 30 3.5q0 .65-.425 1.075Q29.15 5 28.5 5ZM24 27.35q.65 0 1.075-.425.425-.425.425-1.075v-8.5q0-.65-.425-1.075-.425-.425-1.075-.425-.65 0-1.075.425-.425.425-.425 1.075v8.5q0 .65.425 1.075.425.425 1.075.425Zm0 16.6q-3.7 0-6.975-1.425Q13.75 41.1 11.3 38.65q-2.45-2.45-3.875-5.725Q6 29.65 6 25.95q0-3.7 1.425-6.975Q8.85 15.7 11.3 13.25q2.45-2.45 5.725-3.875Q20.3 7.95 24 7.95q3.35 0 6.3 1.125 2.95 1.125 5.25 3.125l1.55-1.55q.4-.4 1-.4t1.05.45q.45.45.45 1.05 0 .6-.45 1.05l-1.5 1.5q1.8 2 3.075 4.85Q42 22 42 25.95q0 3.7-1.425 6.975Q39.15 36.2 36.7 38.65q-2.45 2.45-5.725 3.875Q27.7 43.95 24 43.95Zm0-3q6.25 0 10.625-4.375T39 25.95q0-6.25-4.375-10.625T24 10.95q-6.25 0-10.625 4.375T9 25.95q0 6.25 4.375 10.625T24 40.95ZM24 26Z' />
        </svg>
    
    `;

    cancionesHeadIzq.appendChild(pNumero);
    cancionesHeadIzq.appendChild(pTitulo);

    cancionesHead.appendChild(cancionesHeadIzq);
    cancionesHead.appendChild(cancionesHeader);

    divCanciones.appendChild(cancionesHead);

    canciones.forEach(cancion => {

        const { id, nombre, duracion } = cancion;

        const divCancion = document.createElement('div');
        divCancion.classList.add('cancion', 'w-full', 'flex', 'justify-between', 'items-center', 'p-5', 'rounded-md', 'md:hover:cursor-pointer');

        if (nombre === cancionActiva.nombre && artista === cancionActiva.artista) {
            divCancion.classList.add('cancionSonando');
        } else {
            divCancion.classList.add('cancionHover');
        }

        divCancion.setAttribute('id', `album${idAlbum}-cancion${id}`);

        divCancion.onclick = (e) => {
            if (e.pointerType === 'touch') {
                reproducir(idAlbum, id);
                if (document.querySelector('.cancionSeleccionada')) {
                    document.querySelector('.cancionSeleccionada').classList.remove('cancionSeleccionada');
                }
                divCancion.classList.add('cancionSeleccionada');
            }
            else if (e.pointerType === 'mouse') {
                if (document.querySelector('.cancionSeleccionada')) {
                    document.querySelector('.cancionSeleccionada').classList.remove('cancionSeleccionada');
                }
                divCancion.classList.add('cancionSeleccionada');
            }
        }

        divCancion.ondblclick = () => {
            if (window.matchMedia('(min-width: 1024px)').matches) {
                reproducir(idAlbum, id);
            }
        }

        const cancionIzq = document.createElement('div');
        cancionIzq.classList.add('flex', 'gap-8', 'items-center', 'overflow-hidden');

        const pNumero = document.createElement('p');
        pNumero.textContent = id;

        const divNumero = document.createElement('div');
        divNumero.id = `album${idAlbum}-numero${id}`;
        divNumero.classList.add('w-5');

        if (id === cancionActiva.id && nombre === cancionActiva.nombre && artista === cancionActiva.artista) {
            divNumero.classList.add('flex', 'items-center');
            divNumero.innerHTML = `
                <div class='wave'>
                    <div class='wave1'></div>
                    <div class='wave2'></div>
                    <div class='wave3'></div>
                    <div class='wave4'></div>
                </div>
                <div>
                    <p class='numero'>${id}</p>
                </div>
            `;
        } else {
            divNumero.appendChild(pNumero);
        }

        const pNombre = document.createElement('p');
        pNombre.classList.add('whitespace-nowrap', 'text-ellipsis', 'overflow-hidden');
        pNombre.textContent = nombre;

        const divNombre = document.createElement('div');
        divNombre.classList.add('w-full', 'min-w-0');
        divNombre.appendChild(pNombre);

        cancionIzq.appendChild(divNumero);
        cancionIzq.appendChild(divNombre);

        const cancionDer = document.createElement('div');

        const pTiempo = document.createElement('p');
        pTiempo.textContent = duracion;

        cancionDer.appendChild(pTiempo);

        divCancion.appendChild(cancionIzq);
        divCancion.appendChild(cancionDer);

        divCanciones.appendChild(divCancion);
    });

    contenidoPrincipal.appendChild(divCanciones);

    cargarIconoMenuAlbum();
    contenidoPrincipal.scrollTo(0,0);
}

// Mostrar la vista de una sola canción, con su información
function mostrarCancion(idCancion) {
    const cancionSeleccionada = sencillas.find(cancion => cancion.id === idCancion);

    contenidoPrincipal.classList.remove('p-6');
    limpiarHTML(contenidoPrincipal);

    const { id, nombre, artista, fecha_lanzamiento, rutaImagen, duracion, color, sombra } = cancionSeleccionada;

    // Cabecera
    const divCabecera = document.createElement('div');
    divCabecera.classList.add('p-5', 'sm:p-10');
    divCabecera.style.background = `linear-gradient(${color}, ${sombra})`;

    const divVolver = document.createElement('div');
    divVolver.classList.add('w-6', 'md:hover:cursor-pointer');
    divVolver.innerHTML = `
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
            <path d='m22.35 38.95-13.9-13.9q-.25-.25-.35-.5Q8 24.3 8 24q0-.3.1-.55.1-.25.35-.5L22.4 9q.4-.4 1-.4t1.05.45q.45.45.45 1.05 0 .6-.45 1.05L13.1 22.5h24.8q.65 0 1.075.425.425.425.425 1.075 0 .65-.425 1.075-.425.425-1.075.425H13.1l11.4 11.4q.4.4.4 1t-.45 1.05q-.45.45-1.05.45-.6 0-1.05-.45Z' />
        </svg>
    `;

    divVolver.onclick = () => {
        limpiarHTML(contenidoPrincipal);

        contenidoPrincipal.classList.add('p-6');
        crearLogo();
        cargarCanciones('Echa un vistazo a nuestras canciones', sencillas);
    }

    const divContenidoCabecera = document.createElement('div');
    divContenidoCabecera.classList.add('flex', 'flex-wrap', 'justify-between', 'gap-8', 'mt-8', 'md:flex-nowrap', 'md:justify-start');

    const divImagen = document.createElement('div');
    divImagen.classList.add('h-full', 'min-w-fit', 'mx-auto', 'md:mx-0');

    const imagen = document.createElement('img');
    imagen.classList.add('h-cover-img', 'rounded-md');
    imagen.src = `img/sencillas/${rutaImagen}`;
    imagen.alt = 'Imagen de la canción';

    divImagen.appendChild(imagen);

    const divInfo = document.createElement('div');
    divInfo.classList.add('flex', 'flex-wrap', 'content-end', 'w-full', 'md:w-fit', 'md:gap-4', 'lg:gap-6');

    const pNombre = document.createElement('p');
    pNombre.classList.add('w-full', 'mb-3', 'text-4xl', 'font-bold', 'md:text-6xl', 'lg:text-7xl', 'xl:text-8xl');
    pNombre.textContent = nombre;

    const divResto = document.createElement('p');
    divResto.classList.add('w-full', 'flex', 'flex-wrap', 'gap-x-5', 'gap-y-1', 'text-md');

    const spanArtista = document.createElement('span');
    spanArtista.textContent = artista;
    spanArtista.classList.add('font-semibold');

    const spanFecha = document.createElement('span');
    spanFecha.textContent = fecha_lanzamiento;

    divResto.appendChild(spanArtista);
    divResto.appendChild(spanFecha);

    divInfo.appendChild(pNombre);
    divInfo.appendChild(divResto);

    divContenidoCabecera.appendChild(divImagen);
    divContenidoCabecera.appendChild(divInfo);

    divCabecera.appendChild(divVolver);
    divCabecera.appendChild(divContenidoCabecera);

    contenidoPrincipal.appendChild(divCabecera);

    // Canción
    const divGeneral = document.createElement('div');
    divGeneral.classList.add('flex', 'flex-wrap', 'p-5', 'sm:p-10');

    const cancionesHead = document.createElement('div');
    cancionesHead.classList.add('w-full', 'flex', 'justify-between', 'items-center', 'border-b', 'border-neutral-600', 'px-5', 'py-2.5', 'mb-4');

    const cancionesHeadIzq = document.createElement('div');
    cancionesHeadIzq.classList.add('flex', 'gap-8');

    const pNumero = document.createElement('p');
    pNumero.textContent = '#';

    const pTitulo = document.createElement('p');
    pTitulo.classList.add('uppercase');
    pTitulo.textContent = 'Título';

    const cancionesHeader = document.createElement('div');
    cancionesHeader.innerHTML = `
        <svg id='timer' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
            <path d='M19.5 5q-.65 0-1.075-.425Q18 4.15 18 3.5q0-.65.425-1.075Q18.85 2 19.5 2h9q.65 0 1.075.425Q30 2.85 30 3.5q0 .65-.425 1.075Q29.15 5 28.5 5ZM24 27.35q.65 0 1.075-.425.425-.425.425-1.075v-8.5q0-.65-.425-1.075-.425-.425-1.075-.425-.65 0-1.075.425-.425.425-.425 1.075v8.5q0 .65.425 1.075.425.425 1.075.425Zm0 16.6q-3.7 0-6.975-1.425Q13.75 41.1 11.3 38.65q-2.45-2.45-3.875-5.725Q6 29.65 6 25.95q0-3.7 1.425-6.975Q8.85 15.7 11.3 13.25q2.45-2.45 5.725-3.875Q20.3 7.95 24 7.95q3.35 0 6.3 1.125 2.95 1.125 5.25 3.125l1.55-1.55q.4-.4 1-.4t1.05.45q.45.45.45 1.05 0 .6-.45 1.05l-1.5 1.5q1.8 2 3.075 4.85Q42 22 42 25.95q0 3.7-1.425 6.975Q39.15 36.2 36.7 38.65q-2.45 2.45-5.725 3.875Q27.7 43.95 24 43.95Zm0-3q6.25 0 10.625-4.375T39 25.95q0-6.25-4.375-10.625T24 10.95q-6.25 0-10.625 4.375T9 25.95q0 6.25 4.375 10.625T24 40.95ZM24 26Z' />
        </svg>
    
    `;

    cancionesHeadIzq.appendChild(pNumero);
    cancionesHeadIzq.appendChild(pTitulo);

    cancionesHead.appendChild(cancionesHeadIzq);
    cancionesHead.appendChild(cancionesHeader);

    divGeneral.appendChild(cancionesHead);

    const divCancion = document.createElement('div');
    divCancion.classList.add('cancion', 'w-full', 'flex', 'justify-between', 'items-center', 'p-5', 'rounded-md', 'md:hover:cursor-pointer');

    if (nombre === cancionActiva.nombre && artista === cancionActiva.artista) {
        divCancion.classList.add('cancionSonando');
    } else {
        divCancion.classList.add('cancionHover');
    }

    divCancion.setAttribute('id', `albumNo-cancion${id}`);

    divCancion.onclick = (evento) => {
        if (evento.pointerType === 'touch') {
            reproducir(false, id);
        }
        else if (evento.pointerType === 'mouse') {
            if (document.querySelector('.cancionSeleccionada')) {
                document.querySelector('.cancionSeleccionada').classList.remove('cancionSeleccionada');
            }
            divCancion.classList.add('cancionSeleccionada');
        }
    }

    divCancion.ondblclick = () => {
        if (window.matchMedia('(min-width: 1024px)').matches) {
            reproducir(false, id);
        }
    }

    const cancionIzq = document.createElement('div');
    cancionIzq.classList.add('flex', 'gap-8', 'items-center', 'overflow-hidden');

    const pNumeroCancion = document.createElement('p');
    pNumeroCancion.textContent = `${id}`;

    const divNumero = document.createElement('div');
    divNumero.id = `albumNo-numero${id}`;
    divNumero.classList.add('w-5');

    if (id === cancionActiva.id && nombre === cancionActiva.nombre && artista === cancionActiva.artista) {
        divNumero.classList.add('flex', 'items-center');
        divNumero.innerHTML = `
            <div class='wave'>
                <div class='wave1'></div>
                <div class='wave2'></div>
                <div class='wave3'></div>
                <div class='wave4'></div>
            </div>
            <div>
                <p class='numero'>${id}</p>
            </div>
        `;
    } else {
        divNumero.appendChild(pNumeroCancion);
    }

    const pNombreCancion = document.createElement('p');
    pNombreCancion.classList.add('whitespace-nowrap', 'text-ellipsis', 'overflow-hidden');
    pNombreCancion.textContent = nombre;

    const divNombre = document.createElement('div');
    divNombre.classList.add('w-full', 'min-w-0');
    divNombre.appendChild(pNombreCancion);

    cancionIzq.appendChild(divNumero);
    cancionIzq.appendChild(divNombre);

    const cancionDer = document.createElement('div');

    const pTiempo = document.createElement('p');
    pTiempo.textContent = duracion;

    cancionDer.appendChild(pTiempo);

    divCancion.appendChild(cancionIzq);
    divCancion.appendChild(cancionDer);

    divGeneral.appendChild(divCancion);

    contenidoPrincipal.appendChild(divGeneral);

    cargarIconoMenuSencillas();
    contenidoPrincipal.scrollTo(0,0);
}

// Activar el modo aleatorio
function modoAleatorio() {
    if(btnAleatorio.classList.contains('modos')) {
        btnAleatorio.classList.remove('modos');
    } else {
        btnAleatorio.classList.add('modos');
    }

    if(btnRepetir.classList.contains('modos')) {
        btnRepetir.classList.remove('modos');
    }
}

// Modo aleatorio en la vista de reproductor extendido
function modoAleatorioExtendido(btnAleatorioExtendido, btnRepetirExtendido) {
    modoAleatorio();
    if(btnAleatorio.classList.contains('modos')) {
        btnAleatorioExtendido.classList.add('modos');
    } else {
        btnAleatorioExtendido.classList.remove('modos');
    }

    if(btnRepetirExtendido.classList.contains('modos')) {
        btnRepetirExtendido.classList.remove('modos');
        btnRepetir.classList.remove('modos');
    }
}

// Reproducir la anterior canción a la actual
function anteriorCancion() {
    const { idAlbum } = cancionActiva;

    if (idAlbum) {
        const elAlbum = albumes.find(album => album.id === idAlbum);

        if (cancionActiva.id - 1 >= 1) {
            reproducir(idAlbum, cancionActiva.id - 1);
        } else {
            reproducir(idAlbum, elAlbum.canciones.length);
        }

    } else {
        reproducir(false, cancionActiva.id);
    }
}

// Reproducir la canción con el id pasado por parámetros
function reproducir(idAlbum = false, idCancion) {
    if (primeraReproduccion === false) {
        contenidoPrincipal.classList.remove('lg:h-screen');
        contenidoMenu.classList.add('lg:h-[87%]');
        contenidoReproductor.classList.remove('hidden');
        primeraReproduccion = true;
    }

    if (document.querySelector('.wave')) {
        document.querySelector('.numero').classList.add('block');
        document.querySelector('.numero').classList.remove('numero');
        document.querySelector('.wave').remove();
    }

    const canciones = document.querySelectorAll('.cancion');
    canciones.forEach(cancion => {
        cancion.classList.remove('cancionSonando');
        cancion.classList.add('cancionHover');
    });

    if(document.getElementById(`album${idAlbum}-cancion${idCancion}`)) {
        const divCancion = document.getElementById(`album${idAlbum}-cancion${idCancion}`);

        divCancion.classList.remove('cancionHover');
        divCancion.classList.add('cancionSonando');

    } else if(document.getElementById(`albumNo-cancion${idCancion}`)) {
        const divCancion = document.getElementById(`albumNo-cancion${idCancion}`);
        
        divCancion.classList.remove('cancionHover');
        divCancion.classList.add('cancionSonando');
    }

    if(document.getElementById(`album${idAlbum}-numero${idCancion}`)) {
        const divNombre = document.getElementById(`album${idAlbum}-numero${idCancion}`);
        divNombre.classList.add('flex', 'items-center');
        divNombre.innerHTML = `
            <div class='wave'>
                <div class='wave1'></div>
                <div class='wave2'></div>
                <div class='wave3'></div>
                <div class='wave4'></div>
            </div>
            <div>
                <p class='numero'>${idCancion}</p>
            </div>
        `;
    } else if(document.getElementById(`albumNo-numero${idCancion}`)) {
        const divNombre = document.getElementById(`albumNo-numero${idCancion}`);
        divNombre.classList.add('flex', 'items-center');
        divNombre.innerHTML = `
            <div class='wave'>
                <div class='wave1'></div>
                <div class='wave2'></div>
                <div class='wave3'></div>
                <div class='wave4'></div>
            </div>
            <div>
                <p class='numero'>${idCancion}</p>
            </div>
        `;
    }

    if (idAlbum) {
        const albumCancion = albumes.find(album => album.id === idAlbum);

        const { nombreAlbum, artista, rutaImagen, canciones: cancionesAlbum, color, sombra } = albumCancion;

        const laCancion = cancionesAlbum.find(cancion => cancion.id === idCancion);

        const { nombre, ruta } = laCancion;

        coverReproductor.src = `../img/albumes/${rutaImagen}`;
        tituloReproductor.textContent = nombre;
        artistaReproductor.textContent = artista;

        audioCancion.src = `../audios/${nombreAlbum}/${ruta}`;

        cancionActiva = {
            idAlbum,
            id: idCancion,
            nombre,
            artista,
            color,
            sombra
        }

    } else {
        const cancionSencilla = sencillas.find(sencilla => sencilla.id === idCancion);

        const { id, nombre, artista, rutaImagen, ruta, color, sombra } = cancionSencilla;

        coverReproductor.src = `../img/sencillas/${rutaImagen}`;
        tituloReproductor.textContent = nombre;
        artistaReproductor.textContent = artista;

        audioCancion.src = `../audios/sencillas/${ruta}`;

        cancionActiva = {
            id,
            nombre,
            artista,
            color,
            sombra
        }
    }

    if (document.querySelector('#reproductorExtendido')) {
        document.querySelector('#tituloReproductorExtendido').textContent = cancionActiva.nombre;
    }

    alternarPlayPause();
}

// Eliminar la vista de reproductor extendido
function borrarReproductorExtendido(){
    document.getElementById('reproductorExtendido').remove();
};

// Mostrar vista de reproductor extendido
function extenderReproductor() {
    const reproductorExtendido = document.createElement('div');
    reproductorExtendido.id = 'reproductorExtendido';

    let rutaImagen = '';
    if (cancionActiva.idAlbum) {
        const albumActivo = albumes.find(album => album.id === cancionActiva.idAlbum);
        rutaImagen = `../img/albumes/${albumActivo.rutaImagen}`;
    } else {
        const sencillaActivo = sencillas.find(sencilla => sencilla.id === cancionActiva.id);
        rutaImagen = `../img/sencillas/${sencillaActivo.rutaImagen}`;
    }

    let duracionTotal = audioCancion.duration;
    let duracionRestante = duracionTotal - audioCancion.currentTime;
    let duracionMinutos = Math.floor(duracionRestante / 60);
    let duracionSegundos = Math.floor(duracionRestante % 60);

    if (duracionSegundos < 10) {
        duracionSegundos = `0${duracionSegundos}`;
    }

    if (duracionSegundos) {
        tiempoRestante.textContent = `-${duracionMinutos}:${duracionSegundos}`;
    }

    let minutosActuales = Math.floor(audioCancion.currentTime / 60);
    let segundosActuales = Math.floor(audioCancion.currentTime % 60);

    if (segundosActuales < 10) {
        segundosActuales = `0${segundosActuales}`;
    }

    if (segundosActuales) {
        tiempoActual.textContent = `${minutosActuales}:${segundosActuales}`;
    }
    
    // Contenido del reproductor
    reproductorExtendido.innerHTML = `
        <div class='h-custom w-full absolute top-0 left-0 z-10 lg:hidden'>
        <div class='flex flex-wrap content-between p-5 sm:p-10 h-full w-full text-white overflow-auto' style='background: linear-gradient(${cancionActiva.color}, ${cancionActiva.sombra});'>
            <div class='h-fit md:hover:cursor-pointer'>
            <svg onclick='borrarReproductorExtendido()' class='w-10' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                <path
                d='m22.35 38.95-13.9-13.9q-.25-.25-.35-.5Q8 24.3 8 24q0-.3.1-.55.1-.25.35-.5L22.4 9q.4-.4 1-.4t1.05.45q.45.45.45 1.05 0 .6-.45 1.05L13.1 22.5h24.8q.65 0 1.075.425.425.425.425 1.075 0 .65-.425 1.075-.425.425-1.075.425H13.1l11.4 11.4q.4.4.4 1t-.45 1.05q-.45.45-1.05.45-.6 0-1.05-.45Z'>
                </path>
            </svg>
            </div>
            <div class='w-full min-h-fit h-fit flex flex-wrap justify-center gap-4'>
            <div class='w-full min-h-fit flex flex-wrap justify-between gap-16 sm:gap-8 md:gap-4'>
                <div class='min-h-fit h-fit min-w-fit mx-auto'>
                <img id="coverReproductorExtendido" class='h-cover-img rounded-md object-contain'
                    src='${rutaImagen}' alt='Imagen del Álbum'>
                </div>
                <div class='flex flex-wrap w-full'>
                <p id='tituloReproductorExtendido' class='w-full mb-3 text-4xl font-bold md:text-6xl lg:text-7xl xl:text-8xl'>${cancionActiva.nombre}</p>
                <p class='w-full font-semibold'>${cancionActiva.artista}</p>
                </div>
            </div>
            <div class='w-full h-fit flex flex-wrap justify-center'>
                <div class='w-full flex items-center gap-2 mb-4'>
                <span id='tiempoActualExtendido'>${minutosActuales}:${segundosActuales}</span>
                <input class='range w-full' type='range' id='barraCancionExtendida' value='${audioCancion.currentTime}' min='0' max='${audioCancion.duration}'>
                <span id='tiempoRestanteExtendido'>-${duracionMinutos}:${duracionSegundos}</span>
                </div>
                <div class='w-full min-h-fit h-fit flex flex-wrap items-center justify-center gap-4 mb-4'>
                <div id='btn-aleatorioExtendido'>
                    <svg class='w-11' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                    <path
                        d='M19.8 21.8 8.65 10.65q-.45-.45-.45-1.075T8.65 8.5q.4-.4 1.05-.4t1.05.4l11.2 11.15Zm10.8 18.7q-.65 0-1.075-.425Q29.1 39.65 29.1 39q0-.65.425-1.075.425-.425 1.075-.425h4.75l-9.2-9.15 2.1-2.15 9.3 9.2v-4.85q0-.65.425-1.075.425-.425 1.075-.425.65 0 1.075.425.425.425.425 1.075V39q0 .65-.425 1.075-.425.425-1.075.425Zm-22-1.1q-.45-.4-.45-1.025 0-.625.45-1.075l26.85-26.85H30.6q-.65 0-1.075-.425Q29.1 9.6 29.1 8.95q0-.65.425-1.075.425-.425 1.075-.425h8.45q.65 0 1.075.425.425.425.425 1.075v8.45q0 .65-.425 1.075-.425.425-1.075.425-.65 0-1.075-.425-.425-.425-.425-1.075v-4.8L10.7 39.45q-.4.4-1.025.4-.625 0-1.075-.45Z' />
                    </svg>
                </div>
                <div id='btn-anterior'>
                    <svg class='w-14' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                    <path
                        d='M12.5 36q-.65 0-1.075-.425Q11 35.15 11 34.5v-21q0-.65.425-1.075Q11.85 12 12.5 12q.65 0 1.075.425Q14 12.85 14 13.5v21q0 .65-.425 1.075Q13.15 36 12.5 36Zm22.15-1.65-13.15-9.1q-.7-.45-.7-1.25t.7-1.25l13.15-9.1q.75-.55 1.55-.125.8.425.8 1.325v18.3q0 .85-.8 1.3-.8.45-1.55-.1Z' />
                    </svg>
                </div>
                <div id='btn-playExtendido'>
                    <svg class='w-14' id='play' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                    <path
                        d='M18.3 36.4q-.75.5-1.525.05Q16 36 16 35.1V12.6q0-.9.775-1.35.775-.45 1.525.05L36 22.6q.7.45.7 1.25T36 25.1Z' />
                    </svg>
                </div>
                <div id='btn-siguiente'>
                    <svg class='w-14' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                    <path
                        d='M35.5 36q-.65 0-1.075-.425Q34 35.15 34 34.5v-21q0-.65.425-1.075Q34.85 12 35.5 12q.65 0 1.075.425Q37 12.85 37 13.5v21q0 .65-.425 1.075Q36.15 36 35.5 36Zm-22.15-1.65q-.75.55-1.55.1-.8-.45-.8-1.3v-18.3q0-.9.8-1.325.8-.425 1.55.125l13.15 9.1q.7.45.7 1.25t-.7 1.25Z' />
                    </svg>
                </div>
                <div id='btn-repetirExtendido'>
                    <svg class='w-12' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                    <path
                        d='M35 34.5V28q0-.65.425-1.075.425-.425 1.075-.425.65 0 1.075.425.425.425.425 1.025V36q0 .65-.425 1.075-.425.425-1.075.425H11.8l3.2 3.2q.5.5.5 1.125t-.45 1.075q-.45.45-1.05.475-.6.025-1.05-.425l-5.9-5.9Q6.6 36.6 6.6 36q0-.6.45-1.05l5.85-5.85q.45-.45 1.075-.45t1.075.45q.45.45.45 1.075t-.45 1.075L11.8 34.5Zm-22-21V20q0 .65-.425 1.075-.425.425-1.075.425-.65 0-1.075-.425Q10 20.65 10 20.05V12q0-.65.425-1.075.425-.425 1.075-.425h24.7L33 7.3q-.45-.45-.475-1.1-.025-.65.425-1.1.45-.45 1.05-.475.6-.025 1.05.425l5.9 5.9q.45.45.45 1.05 0 .6-.45 1.05L35.1 18.9q-.45.45-1.075.45t-1.075-.45q-.45-.45-.45-1.075t.45-1.075l3.25-3.25Z' />
                    </svg>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    `;

    contenidoPrincipal.appendChild(reproductorExtendido);

    const coverReproductorExtendido = document.getElementById('coverReproductorExtendido');
    const btnAleatorioExtendido = document.getElementById('btn-aleatorioExtendido');
    const btnPlayExtendido = document.getElementById('btn-playExtendido');
    const btnRepetirExtendido = document.getElementById('btn-repetirExtendido');
    const tiempoActualExtendido = document.getElementById('tiempoActualExtendido');
    const tiempoRestanteExtendido = document.getElementById('tiempoRestanteExtendido');
    const barraCancionExtendida = document.getElementById('barraCancionExtendida');

    coverReproductorExtendido.addEventListener('click', () => {
        if (cancionActiva.idAlbum) {
            mostrarAlbum(cancionActiva.idAlbum);
        } else if (cancionActiva.id) {
            mostrarCancion(cancionActiva.id);
        }
    });

    if(btnAleatorio.classList.contains('modos')) {
        btnAleatorioExtendido.classList.add('modos');
    }

    if(btnRepetir.classList.contains('modos')) {
        btnRepetirExtendido.classList.add('modos');
    }

    if (!audioCancion.paused) {
        if (window.matchMedia('(max-width: 1023px)').matches) {
            // Pause.svg
            btnPlayExtendido.innerHTML = `
            <svg class='w-14' id='play' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
            <path d='M18.5,36.8c0.6,0,1.3-0.2,1.8-0.6s0.6-1,0.6-1.8V13.6c0-0.6-0.2-1.1-0.6-1.6c-0.5-0.6-1.1-0.8-1.8-0.8s-1.3,0.2-1.8,0.6
                c-0.5,0.5-0.6,1-0.6,1.8v20.8c0,0.6,0.2,1.1,0.6,1.6C17.2,36.7,17.9,36.8,18.5,36.8z M31.3,36.8c0.6,0,1.3-0.2,1.8-0.6
                c0.5-0.5,0.6-1,0.6-1.8V13.6c0-0.6-0.2-1.1-0.6-1.6c-0.5-0.6-1.1-0.8-1.8-0.8s-1.3,0.2-1.8,0.6c-0.5,0.5-0.6,1-0.6,1.8v20.8
                c0,0.6,0.2,1.1,0.6,1.6C30,36.7,30.7,36.8,31.3,36.8z'/>
            </svg>            
            `;
        } else if (window.matchMedia('(min-width: 1024px)').matches) {
            // PauseCircle.svg
            btnPlayExtendido.innerHTML = `
            <svg class='w-14' id='play' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                <path d='M20 32q.65 0 1.075-.425.425-.425.425-1.075V17.45q0-.6-.425-1.025Q20.65 16 20 16q-.65 0-1.075.425-.425.425-.425 1.075v13.05q0 .6.425 1.025Q19.35 32 20 32Zm8 0q.65 0 1.075-.425.425-.425.425-1.075V17.45q0-.6-.425-1.025Q28.65 16 28 16q-.65 0-1.075.425-.425.425-.425 1.075v13.05q0 .6.425 1.025Q27.35 32 28 32Zm-4 12q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24t1.575-7.75q1.575-3.65 4.3-6.375 2.725-2.725 6.375-4.3Q19.9 4 24 4t7.75 1.575q3.65 1.575 6.375 4.3 2.725 2.725 4.3 6.375Q44 19.9 44 24t-1.575 7.75q-1.575 3.65-4.3 6.375-2.725 2.725-6.375 4.3Q28.1 44 24 44Z'/>
            </svg>
            `;
        }
    } else {
        if (window.matchMedia('(max-width: 1023px)').matches) {
            // PlayArrow.svg
            btnPlayExtendido.innerHTML = `
            <svg class='w-14' id='play' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                <path d='M18.3 36.4q-.75.5-1.525.05Q16 36 16 35.1V12.6q0-.9.775-1.35.775-.45 1.525.05L36 22.6q.7.45.7 1.25T36 25.1Z'/>
            </svg>         
            `;
        } else if (window.matchMedia('(min-width: 1024px)').matches) {
            // PlayCircle.svg
            btnPlayExtendido.innerHTML = `
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                <path d='M19.15 18.25v11.5q0 .9.775 1.35.775.45 1.525-.05l9.05-5.8q.7-.45.7-1.25t-.7-1.25l-9.05-5.8q-.75-.5-1.525-.05-.775.45-.775 1.35ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24t1.575-7.75q1.575-3.65 4.3-6.375 2.725-2.725 6.375-4.3Q19.9 4 24 4t7.75 1.575q3.65 1.575 6.375 4.3 2.725 2.725 4.3 6.375Q44 19.9 44 24t-1.575 7.75q-1.575 3.65-4.3 6.375-2.725 2.725-6.375 4.3Q28.1 44 24 44Z'/>
            </svg>
            `;
        }
    }

    btnRepetirExtendido.addEventListener('click', () => {
        modoLoopExtendido(btnRepetirExtendido, btnAleatorioExtendido)
    });
    document.getElementById('btn-anterior').addEventListener('click', anteriorCancion);
    btnPlayExtendido.addEventListener('click', () => {
        alternarPlayPauseExtendido(btnPlayExtendido, barraCancionExtendida, tiempoActualExtendido, tiempoRestanteExtendido)
    });   
    document.getElementById('btn-siguiente').addEventListener('click', siguienteCancion);
    btnAleatorioExtendido.addEventListener('click', () => {
        modoAleatorioExtendido(btnAleatorioExtendido, btnRepetirExtendido);
    });

    barraCancionExtendida.value = audioCancion.currentTime;
    
    audioCancion.addEventListener('timeupdate', () => {
        if (!audioCancion.paused) {
            actualizarTiempoCancion(audioCancion, barraCancionExtendida, tiempoActualExtendido, tiempoRestanteExtendido);
        }
    });

    barraCancionExtendida.addEventListener('input', () => {
        audioCancion.currentTime = barraCancionExtendida.value;
    });

}

// Cambiar el botón de play y pausa en función del estado de la canción
function alternarPlayPause() {
    if (audioCancion.paused) {
        audioCancion.play();

        audioCancion.addEventListener('timeupdate', () => {
            if (!audioCancion.paused) {
                actualizarTiempoCancion(audioCancion, barraCancion, tiempoActual, tiempoRestante);
            }
        });

        if (window.matchMedia('(max-width: 1023px)').matches) {
            // Pause.svg
            btnPlay.innerHTML = `
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
            <path d='M18.5,36.8c0.6,0,1.3-0.2,1.8-0.6s0.6-1,0.6-1.8V13.6c0-0.6-0.2-1.1-0.6-1.6c-0.5-0.6-1.1-0.8-1.8-0.8s-1.3,0.2-1.8,0.6
                c-0.5,0.5-0.6,1-0.6,1.8v20.8c0,0.6,0.2,1.1,0.6,1.6C17.2,36.7,17.9,36.8,18.5,36.8z M31.3,36.8c0.6,0,1.3-0.2,1.8-0.6
                c0.5-0.5,0.6-1,0.6-1.8V13.6c0-0.6-0.2-1.1-0.6-1.6c-0.5-0.6-1.1-0.8-1.8-0.8s-1.3,0.2-1.8,0.6c-0.5,0.5-0.6,1-0.6,1.8v20.8
                c0,0.6,0.2,1.1,0.6,1.6C30,36.7,30.7,36.8,31.3,36.8z'/>
            </svg>            
            `;
        } else if (window.matchMedia('(min-width: 1024px)').matches) {
            // PauseCircle.svg
            btnPlay.innerHTML = `
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                <path d='M20 32q.65 0 1.075-.425.425-.425.425-1.075V17.45q0-.6-.425-1.025Q20.65 16 20 16q-.65 0-1.075.425-.425.425-.425 1.075v13.05q0 .6.425 1.025Q19.35 32 20 32Zm8 0q.65 0 1.075-.425.425-.425.425-1.075V17.45q0-.6-.425-1.025Q28.65 16 28 16q-.65 0-1.075.425-.425.425-.425 1.075v13.05q0 .6.425 1.025Q27.35 32 28 32Zm-4 12q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24t1.575-7.75q1.575-3.65 4.3-6.375 2.725-2.725 6.375-4.3Q19.9 4 24 4t7.75 1.575q3.65 1.575 6.375 4.3 2.725 2.725 4.3 6.375Q44 19.9 44 24t-1.575 7.75q-1.575 3.65-4.3 6.375-2.725 2.725-6.375 4.3Q28.1 44 24 44Z'/>
            </svg>
            `;
        }

        if(document.querySelector('.wave')) {
            document.querySelector('.wave').style.display = 'flex';
        }

        if(document.querySelector('.numero')) {
            document.querySelector('.numero').classList.remove('block');
        }
        
    } else {
        audioCancion.pause();
        if (window.matchMedia('(max-width: 1023px)').matches) {
            // PlayArrow.svg
            btnPlay.innerHTML = `
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                <path d='M18.3 36.4q-.75.5-1.525.05Q16 36 16 35.1V12.6q0-.9.775-1.35.775-.45 1.525.05L36 22.6q.7.45.7 1.25T36 25.1Z'/>
            </svg>         
            `;
        } else if (window.matchMedia('(min-width: 1024px)').matches) {
            // PlayCircle.svg
            btnPlay.innerHTML = `
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                <path d='M19.15 18.25v11.5q0 .9.775 1.35.775.45 1.525-.05l9.05-5.8q.7-.45.7-1.25t-.7-1.25l-9.05-5.8q-.75-.5-1.525-.05-.775.45-.775 1.35ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24t1.575-7.75q1.575-3.65 4.3-6.375 2.725-2.725 6.375-4.3Q19.9 4 24 4t7.75 1.575q3.65 1.575 6.375 4.3 2.725 2.725 4.3 6.375Q44 19.9 44 24t-1.575 7.75q-1.575 3.65-4.3 6.375-2.725 2.725-6.375 4.3Q28.1 44 24 44Z'/>
            </svg>
            `;
        }
        
        if(document.querySelector('.wave')) {
            document.querySelector('.wave').style.display = 'none';
        }

        if(document.querySelector('.numero')) {
            document.querySelector('.numero').classList.add('block');
        }
    }
}

// Alternar botones de play y pausa en el reproductor extendido
function alternarPlayPauseExtendido(btnPlayExtendido, barraCancionExtendida, tiempoActualExtendido, tiempoRestanteExtendido) {
    if (audioCancion.paused) {
        audioCancion.play();

        audioCancion.addEventListener('timeupdate', () => {
            if (!audioCancion.paused) {
                actualizarTiempoCancion(audioCancion, barraCancionExtendida, tiempoActualExtendido, tiempoRestanteExtendido);
            }
        });

        if (window.matchMedia('(max-width: 1023px)').matches) {
            // Pause.svg
            btnPlayExtendido.innerHTML = `
            <svg class='w-14' id='play' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
            <path d='M18.5,36.8c0.6,0,1.3-0.2,1.8-0.6s0.6-1,0.6-1.8V13.6c0-0.6-0.2-1.1-0.6-1.6c-0.5-0.6-1.1-0.8-1.8-0.8s-1.3,0.2-1.8,0.6
                c-0.5,0.5-0.6,1-0.6,1.8v20.8c0,0.6,0.2,1.1,0.6,1.6C17.2,36.7,17.9,36.8,18.5,36.8z M31.3,36.8c0.6,0,1.3-0.2,1.8-0.6
                c0.5-0.5,0.6-1,0.6-1.8V13.6c0-0.6-0.2-1.1-0.6-1.6c-0.5-0.6-1.1-0.8-1.8-0.8s-1.3,0.2-1.8,0.6c-0.5,0.5-0.6,1-0.6,1.8v20.8
                c0,0.6,0.2,1.1,0.6,1.6C30,36.7,30.7,36.8,31.3,36.8z'/>
            </svg>
            `;

            btnPlay.innerHTML = `
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
            <path d='M18.5,36.8c0.6,0,1.3-0.2,1.8-0.6s0.6-1,0.6-1.8V13.6c0-0.6-0.2-1.1-0.6-1.6c-0.5-0.6-1.1-0.8-1.8-0.8s-1.3,0.2-1.8,0.6
                c-0.5,0.5-0.6,1-0.6,1.8v20.8c0,0.6,0.2,1.1,0.6,1.6C17.2,36.7,17.9,36.8,18.5,36.8z M31.3,36.8c0.6,0,1.3-0.2,1.8-0.6
                c0.5-0.5,0.6-1,0.6-1.8V13.6c0-0.6-0.2-1.1-0.6-1.6c-0.5-0.6-1.1-0.8-1.8-0.8s-1.3,0.2-1.8,0.6c-0.5,0.5-0.6,1-0.6,1.8v20.8
                c0,0.6,0.2,1.1,0.6,1.6C30,36.7,30.7,36.8,31.3,36.8z'/>
            </svg>  
            `;
        } else if (window.matchMedia('(min-width: 1024px)').matches) {
            // PauseCircle.svg
            btnPlayExtendido.innerHTML = `
            <svg class='w-14' id='play' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                <path d='M20 32q.65 0 1.075-.425.425-.425.425-1.075V17.45q0-.6-.425-1.025Q20.65 16 20 16q-.65 0-1.075.425-.425.425-.425 1.075v13.05q0 .6.425 1.025Q19.35 32 20 32Zm8 0q.65 0 1.075-.425.425-.425.425-1.075V17.45q0-.6-.425-1.025Q28.65 16 28 16q-.65 0-1.075.425-.425.425-.425 1.075v13.05q0 .6.425 1.025Q27.35 32 28 32Zm-4 12q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24t1.575-7.75q1.575-3.65 4.3-6.375 2.725-2.725 6.375-4.3Q19.9 4 24 4t7.75 1.575q3.65 1.575 6.375 4.3 2.725 2.725 4.3 6.375Q44 19.9 44 24t-1.575 7.75q-1.575 3.65-4.3 6.375-2.725 2.725-6.375 4.3Q28.1 44 24 44Z'/>
            </svg>
            `;
        }

        if(document.querySelector('.wave')) {
            document.querySelector('.wave').style.display = 'flex';
        }

        if(document.querySelector('.numero')) {
            document.querySelector('.numero').classList.remove('block');
        }

    } else {
        audioCancion.pause();
        if (window.matchMedia('(max-width: 1023px)').matches) {
            // PlayArrow.svg
            btnPlayExtendido.innerHTML = `
            <svg class='w-14' id='play' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                <path d='M18.3 36.4q-.75.5-1.525.05Q16 36 16 35.1V12.6q0-.9.775-1.35.775-.45 1.525.05L36 22.6q.7.45.7 1.25T36 25.1Z'/>
            </svg>         
            `;

            btnPlay.innerHTML = `
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                <path d='M18.3 36.4q-.75.5-1.525.05Q16 36 16 35.1V12.6q0-.9.775-1.35.775-.45 1.525.05L36 22.6q.7.45.7 1.25T36 25.1Z'/>
            </svg>      
            `;
        } else if (window.matchMedia('(min-width: 1024px)').matches) {
            // PlayCircle.svg
            btnPlayExtendido.innerHTML = `
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                <path d='M19.15 18.25v11.5q0 .9.775 1.35.775.45 1.525-.05l9.05-5.8q.7-.45.7-1.25t-.7-1.25l-9.05-5.8q-.75-.5-1.525-.05-.775.45-.775 1.35ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24t1.575-7.75q1.575-3.65 4.3-6.375 2.725-2.725 6.375-4.3Q19.9 4 24 4t7.75 1.575q3.65 1.575 6.375 4.3 2.725 2.725 4.3 6.375Q44 19.9 44 24t-1.575 7.75q-1.575 3.65-4.3 6.375-2.725 2.725-6.375 4.3Q28.1 44 24 44Z'/>
            </svg>
            `;
        }

        if(document.querySelector('.wave')) {
            document.querySelector('.wave').style.display = 'none';
        }

        if(document.querySelector('.numero')) {
            document.querySelector('.numero').classList.add('block');
        }
    }
}

// Reproducir la siguiente canción a la actual
function siguienteCancion() {
    const { idAlbum } = cancionActiva;

    if (idAlbum) {
        const elAlbum = albumes.find(album => album.id === idAlbum);

        const { canciones: cancionesAlbum } = elAlbum;

        if(btnAleatorio.classList.contains('modos')) {
            let indiceAleatorio;

            do {
                indiceAleatorio = numeroAleatorio(1, cancionesAlbum.length);
            } while(indiceAleatorio === cancionActiva.id);

            const laCancion = cancionesAlbum.find(cancion => cancion.id === indiceAleatorio);

            reproducir(idAlbum, laCancion.id);

        } else if(btnRepetir.classList.contains('modos')) {
            reproducir(idAlbum, cancionActiva.id);

        } else {
            if (cancionActiva.id + 1 <= elAlbum.canciones.length) {
                reproducir(idAlbum, cancionActiva.id + 1);
            } else {
                reproducir(idAlbum, 1);
            }
        }

    } else {
        reproducir(idAlbum, cancionActiva.id);
    }
}

// Activar el modo loop
function modoLoop() {
    if(btnRepetir.classList.contains('modos')) {
        btnRepetir.classList.remove('modos');
    } else {
        btnRepetir.classList.add('modos');
    }

    if(btnAleatorio.classList.contains('modos')) {
        btnAleatorio.classList.remove('modos');
    }
}

// Modo loop en reproductor extendido
function modoLoopExtendido(btnRepetirExtendido, btnAleatorioExtendido) {
    modoLoop();

    if(btnRepetir.classList.contains('modos')) {
        btnRepetirExtendido.classList.add('modos');
    } else {
        btnRepetirExtendido.classList.remove('modos');
    }

    if(btnAleatorioExtendido.classList.contains('modos')) {
        btnAleatorioExtendido.classList.remove('modos');
        btnAleatorio.classList.remove('modos');
    }
}

// Generar un número aleatorio entre los dos pasados por parámetros (ambos incluídos)
function numeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Actualizar el tiempo restante y actual de la canción
function actualizarTiempoCancion(audioCancion, barraCancion, tiempoActual, tiempoRestante) {
    let duracionTotal = audioCancion.duration;
    let duracionRestante = duracionTotal - audioCancion.currentTime;
    let duracionMinutos = Math.floor(duracionRestante / 60);
    let duracionSegundos = Math.floor(duracionRestante % 60);

    if (duracionSegundos < 10) {
        duracionSegundos = `0${duracionSegundos}`;
    }

    if (duracionSegundos) {
        tiempoRestante.textContent = `-${duracionMinutos}:${duracionSegundos}`;
    }

    let minutosActuales = Math.floor(audioCancion.currentTime / 60);
    let segundosActuales = Math.floor(audioCancion.currentTime % 60);

    if (segundosActuales < 10) {
        segundosActuales = `0${segundosActuales}`;
    }

    if (segundosActuales) {
        tiempoActual.textContent = `${minutosActuales}:${segundosActuales}`;
    }

    barraCancion.value = audioCancion.currentTime;
    barraCancion.max = audioCancion.duration;
}

// Rellenar el icono de inicio del menú 
function cargarIconoMenuInicio() {
    iconoInicio.innerHTML = `
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                <path d='M11 42q-1.25 0-2.125-.875T8 39V19.5q0-.7.325-1.35.325-.65.875-1.05l13-9.75q.4-.3.85-.45.45-.15.95-.15.5 0 .95.15.45.15.85.45l13 9.75q.55.4.875 1.05.325.65.325 1.35V39q0 1.25-.875 2.125T37 42h-9V28h-8v14Z'/>
            </svg>
        `;
    iconoAlbumes.innerHTML = `
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                <path d='M24 32.2q3.5 0 6-2.375T32.5 24q0-3.55-2.475-6.025Q27.55 15.5 24 15.5q-3.45 0-5.825 2.5T15.8 24q0 3.45 2.375 5.825T24 32.2Zm0-6.2q-.85 0-1.425-.575Q22 24.85 22 24q0-.85.575-1.425Q23.15 22 24 22q.85 0 1.425.575Q26 23.15 26 24q0 .85-.575 1.425Q24.85 26 24 26Zm0 18q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24q0-4.15 1.575-7.8 1.575-3.65 4.3-6.35 2.725-2.7 6.375-4.275Q19.9 4 24 4q4.15 0 7.8 1.575 3.65 1.575 6.35 4.275 2.7 2.7 4.275 6.35Q44 19.85 44 24q0 4.1-1.575 7.75-1.575 3.65-4.275 6.375t-6.35 4.3Q28.15 44 24 44Zm0-3q7.1 0 12.05-4.975Q41 31.05 41 24q0-7.1-4.95-12.05Q31.1 7 24 7q-7.05 0-12.025 4.95Q7 16.9 7 24q0 7.05 4.975 12.025Q16.95 41 24 41Zm0-17Z'/>
            </svg>
        `;
    iconoSencillas.innerHTML = `
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                <path d='M19.6,42c-2.1,0-3.9-0.7-5.3-2.2c-1.4-1.5-2.2-3.2-2.2-5.3c0-2.1,0.7-3.9,2.2-5.3c1.5-1.4,3.2-2.2,5.3-2.2
                c0.9,0,1.8,0.1,2.5,0.4c0.7,0.3,1.4,0.6,2,1.1V9c0-0.8,0.3-1.5,0.9-2.1C25.6,6.3,26.3,6,27.1,6h5.4c0.9,0,1.7,0.3,2.4,1s1,1.4,1,2.4
                s-0.3,1.7-1,2.4s-1.4,1-2.4,1h-5.4v21.8c0,2.1-0.7,3.9-2.2,5.3C23.5,41.3,21.8,42,19.6,42z M19.4,30.3c-2.3,0-4.2,1.9-4.2,4.2
                s1.9,4.2,4.2,4.2s4.2-1.9,4.2-4.2S21.7,30.3,19.4,30.3z'/>
            </svg>
        `;
}

// Rellenar el icono de álbumes del menú 
function cargarIconoMenuAlbum() {
    iconoInicio.innerHTML = `
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                <path d='M11 39h7.5V26.5h11V39H37V19.5L24 9.75 11 19.5Zm0 3q-1.25 0-2.125-.875T8 39V19.5q0-.7.325-1.35.325-.65.875-1.05l13-9.75q.4-.3.85-.45.45-.15.95-.15.5 0 .95.15.45.15.85.45l13 9.75q.55.4.875 1.05.325.65.325 1.35V39q0 1.25-.875 2.125T37 42H26.5V29.5h-5V42Zm13-17.65Z'/>
            </svg>
        `;
    iconoAlbumes.innerHTML = `
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                <path d='M24 32.2q3.5 0 6-2.375T32.5 24q0-3.55-2.475-6.025Q27.55 15.5 24 15.5q-3.45 0-5.825 2.5T15.8 24q0 3.45 2.375 5.825T24 32.2Zm0-6.2q-.85 0-1.425-.575Q22 24.85 22 24q0-.85.575-1.425Q23.15 22 24 22q.85 0 1.425.575Q26 23.15 26 24q0 .85-.575 1.425Q24.85 26 24 26Zm0 18q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24q0-4.15 1.575-7.8 1.575-3.65 4.3-6.35 2.725-2.7 6.375-4.275Q19.9 4 24 4q4.15 0 7.8 1.575 3.65 1.575 6.35 4.275 2.7 2.7 4.275 6.35Q44 19.85 44 24q0 4.1-1.575 7.75-1.575 3.65-4.275 6.375t-6.35 4.3Q28.15 44 24 44Z'/>      
            </svg>
        `;
    iconoSencillas.innerHTML = `
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                <path d='M19.6,42c-2.1,0-3.9-0.7-5.3-2.2c-1.4-1.5-2.2-3.2-2.2-5.3c0-2.1,0.7-3.9,2.2-5.3c1.5-1.4,3.2-2.2,5.3-2.2
                c0.9,0,1.8,0.1,2.5,0.4c0.7,0.3,1.4,0.6,2,1.1V9c0-0.8,0.3-1.5,0.9-2.1C25.6,6.3,26.3,6,27.1,6h5.4c0.9,0,1.7,0.3,2.4,1s1,1.4,1,2.4
                s-0.3,1.7-1,2.4s-1.4,1-2.4,1h-5.4v21.8c0,2.1-0.7,3.9-2.2,5.3C23.5,41.3,21.8,42,19.6,42z M19.4,30.3c-2.3,0-4.2,1.9-4.2,4.2
                s1.9,4.2,4.2,4.2s4.2-1.9,4.2-4.2S21.7,30.3,19.4,30.3z'/>
            </svg>
        `;
}

// Rellenar el icono de sencillas del menú 
function cargarIconoMenuSencillas() {
    iconoInicio.innerHTML = `
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                <path d='M11 39h7.5V26.5h11V39H37V19.5L24 9.75 11 19.5Zm0 3q-1.25 0-2.125-.875T8 39V19.5q0-.7.325-1.35.325-.65.875-1.05l13-9.75q.4-.3.85-.45.45-.15.95-.15.5 0 .95.15.45.15.85.45l13 9.75q.55.4.875 1.05.325.65.325 1.35V39q0 1.25-.875 2.125T37 42H26.5V29.5h-5V42Zm13-17.65Z'/>
            </svg>
        `;
    iconoAlbumes.innerHTML = `
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                <path d='M24 32.2q3.5 0 6-2.375T32.5 24q0-3.55-2.475-6.025Q27.55 15.5 24 15.5q-3.45 0-5.825 2.5T15.8 24q0 3.45 2.375 5.825T24 32.2Zm0-6.2q-.85 0-1.425-.575Q22 24.85 22 24q0-.85.575-1.425Q23.15 22 24 22q.85 0 1.425.575Q26 23.15 26 24q0 .85-.575 1.425Q24.85 26 24 26Zm0 18q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24q0-4.15 1.575-7.8 1.575-3.65 4.3-6.35 2.725-2.7 6.375-4.275Q19.9 4 24 4q4.15 0 7.8 1.575 3.65 1.575 6.35 4.275 2.7 2.7 4.275 6.35Q44 19.85 44 24q0 4.1-1.575 7.75-1.575 3.65-4.275 6.375t-6.35 4.3Q28.15 44 24 44Zm0-3q7.1 0 12.05-4.975Q41 31.05 41 24q0-7.1-4.95-12.05Q31.1 7 24 7q-7.05 0-12.025 4.95Q7 16.9 7 24q0 7.05 4.975 12.025Q16.95 41 24 41Zm0-17Z'/>
            </svg>
        `;
    iconoSencillas.innerHTML = `
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                <path d='M19.65 42q-3.15 0-5.325-2.175Q12.15 37.65 12.15 34.5q0-3.15 2.175-5.325Q16.5 27 19.65 27q1.4 0 2.525.4t1.975 1.1V9q0-1.25.875-2.125T27.15 6h5.35q1.4 0 2.375.975.975.975.975 2.375t-.975 2.4q-.975 1-2.375 1h-5.35V34.5q0 3.15-2.175 5.325Q22.8 42 19.65 42Z'/>
            </svg>
        `;
}

// Cambiar el icono del volumen de la canción, según vaya cambiando el valor de la barra
function actualizarIconoVolumen() {
    if (audioCancion.volume === 0) {
        iconoVolumen.innerHTML = `
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
            <path d='M36.2,40.3l-4.4-4.4c-0.5,0.4-1.1,0.7-1.7,1c-0.6,0.3-1.2,0.6-1.8,0.8c-0.4,0.1-0.8,0.1-1.2-0.2c-0.3-0.3-0.5-0.6-0.5-1.1
            c0-0.2,0.1-0.4,0.2-0.6s0.3-0.3,0.5-0.3c0.5-0.2,1-0.3,1.4-0.6c0.5-0.2,0.9-0.5,1.3-0.8l-6.6-6.6v6.6c0,0.5-0.2,0.9-0.7,1.1
            s-0.9,0.1-1.3-0.3l-6-6h-5.2c-0.3,0-0.6-0.1-0.9-0.3C9.2,28.4,9,28.1,9,27.8v-7.2c0-0.3,0.1-0.6,0.3-0.9c0.2-0.2,0.5-0.3,0.9-0.3h5
            l-8-8C7.1,11.2,7,10.9,7,10.6S7.1,10,7.4,9.7c0.2-0.2,0.5-0.4,0.8-0.4c0.3,0,0.6,0.1,0.8,0.4l28.9,28.8c0.2,0.2,0.4,0.5,0.4,0.9
            c0,0.3-0.1,0.6-0.4,0.9s-0.5,0.4-0.9,0.4C36.7,40.6,36.4,40.5,36.2,40.3z M28.3,10.6c2.9,1,5.2,2.8,6.9,5.2c1.7,2.5,2.6,5.2,2.6,8.3
            c0,1.4-0.2,2.7-0.6,4s-0.9,2.5-1.7,3.7l-1.7-1.7c0.5-0.9,0.9-1.9,1.2-2.9c0.3-1,0.4-2.1,0.4-3.1c0-2.6-0.7-5-2.2-7.1
            s-3.4-3.5-5.9-4.2c-0.2-0.1-0.4-0.2-0.5-0.3c-0.1-0.2-0.2-0.4-0.2-0.6c0-0.5,0.2-0.8,0.5-1.1S27.9,10.5,28.3,10.6z M30.2,26.5
            l-3.6-3.6v-5.2c1.3,0.6,2.2,1.5,2.9,2.6c0.7,1.2,1.1,2.5,1.1,3.8c0,0.4,0,0.8-0.1,1.2C30.5,25.8,30.4,26.1,30.2,26.5z M23.4,19.7
            l-4.2-4.2l2.1-2.1c0.4-0.4,0.8-0.5,1.3-0.3c0.5,0.2,0.7,0.6,0.7,1.1L23.4,19.7z'/>
        </svg>
        `;
    } else if (audioCancion.volume > 0 && audioCancion.volume <= 0.33) {
        iconoVolumen.innerHTML = `
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
            <path d='M17,28.8c-0.3,0-0.6-0.1-0.9-0.3c-0.2-0.2-0.3-0.5-0.3-0.9v-7.2c0-0.3,0.1-0.6,0.3-0.9c0.2-0.2,0.5-0.3,0.9-0.3h5.2l6-6
            c0.4-0.4,0.8-0.5,1.3-0.3c0.5,0.2,0.7,0.6,0.7,1.1v19.8c0,0.5-0.2,0.9-0.7,1.1c-0.5,0.2-0.9,0.1-1.3-0.3l-6-6H17z'/>
        </svg>
        `;
    } else if (audioCancion.volume > 0.33 && audioCancion.volume <= 0.66) {
        iconoVolumen.innerHTML = `
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                <path d='M13.9,28.8c-0.3,0-0.6-0.1-0.9-0.3c-0.2-0.2-0.3-0.5-0.3-0.9v-7.2c0-0.3,0.1-0.6,0.3-0.9c0.2-0.2,0.5-0.3,0.9-0.3h5.2l6-6
                c0.4-0.4,0.8-0.5,1.3-0.3c0.5,0.2,0.7,0.6,0.7,1.1v19.8c0,0.5-0.2,0.9-0.7,1.1c-0.5,0.2-0.9,0.1-1.3-0.3l-6-6H13.9z M29.5,30.7V17.2
                c1.4,0.5,2.6,1.3,3.5,2.6s1.3,2.7,1.3,4.2c0,1.6-0.4,3-1.3,4.2C32.1,29.4,30.9,30.3,29.5,30.7z'/>
            </svg>
        `;
    } else {
        iconoVolumen.innerHTML = `
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                <path d='M28.9,37.5c-0.4,0.1-0.8,0.1-1.2-0.2c-0.3-0.3-0.5-0.6-0.5-1.1c0-0.2,0.1-0.4,0.2-0.6c0.1-0.2,0.3-0.3,0.5-0.3
                c2.4-0.9,4.4-2.3,5.9-4.4c1.5-2.1,2.2-4.4,2.2-7s-0.7-4.9-2.2-7c-1.5-2.1-3.5-3.5-5.9-4.3c-0.2-0.1-0.4-0.2-0.5-0.4
                c-0.1-0.2-0.2-0.4-0.2-0.6c0-0.5,0.2-0.8,0.5-1.1c0.4-0.3,0.7-0.3,1.1-0.2c2.9,1,5.2,2.8,6.9,5.2s2.6,5.2,2.6,8.3s-0.9,5.8-2.6,8.3
                S31.7,36.5,28.9,37.5z M10.8,28.8c-0.3,0-0.6-0.1-0.9-0.3c-0.2-0.2-0.3-0.5-0.3-0.9v-7.2c0-0.3,0.1-0.6,0.3-0.9
                c0.2-0.2,0.5-0.3,0.9-0.3H16l6-6c0.4-0.4,0.8-0.5,1.3-0.3c0.5,0.2,0.7,0.6,0.7,1.1v19.8c0,0.5-0.2,0.9-0.7,1.1
                c-0.5,0.2-0.9,0.1-1.3-0.3l-6-6H10.8z M26.4,30.7V17.2c1.4,0.5,2.6,1.3,3.5,2.6c0.9,1.3,1.3,2.7,1.3,4.2c0,1.6-0.4,3-1.3,4.2
                C29,29.4,27.8,30.3,26.4,30.7z'/>
            </svg>
        `;
    }
}

// Cambiar el estilo de los iconos de play y pausa, según la resolución de la pantalla
function comprobarMediaQuery() {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    mediaQuery.addEventListener('change', () => {
        if (mediaQuery.matches) {
            
            if (document.getElementById('reproductorExtendido')){
                borrarReproductorExtendido();
            }
            
            if (audioCancion.paused) {
                // PlayArrow.svg
                btnPlay.innerHTML = `
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                    <path d='M18.3 36.4q-.75.5-1.525.05Q16 36 16 35.1V12.6q0-.9.775-1.35.775-.45 1.525.05L36 22.6q.7.45.7 1.25T36 25.1Z'/>
                </svg>
                `;
            } else {
                // Pause.svg
                btnPlay.innerHTML = `
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                <path d='M18.5,36.8c0.6,0,1.3-0.2,1.8-0.6s0.6-1,0.6-1.8V13.6c0-0.6-0.2-1.1-0.6-1.6c-0.5-0.6-1.1-0.8-1.8-0.8s-1.3,0.2-1.8,0.6
                    c-0.5,0.5-0.6,1-0.6,1.8v20.8c0,0.6,0.2,1.1,0.6,1.6C17.2,36.7,17.9,36.8,18.5,36.8z M31.3,36.8c0.6,0,1.3-0.2,1.8-0.6
                    c0.5-0.5,0.6-1,0.6-1.8V13.6c0-0.6-0.2-1.1-0.6-1.6c-0.5-0.6-1.1-0.8-1.8-0.8s-1.3,0.2-1.8,0.6c-0.5,0.5-0.6,1-0.6,1.8v20.8
                    c0,0.6,0.2,1.1,0.6,1.6C30,36.7,30.7,36.8,31.3,36.8z'/>
                </svg>            
                `;
            }
        } else {
            if (audioCancion.paused) {
                // PlayCircle.svg
                btnPlay.innerHTML = `
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                    <path d='M19.15 18.25v11.5q0 .9.775 1.35.775.45 1.525-.05l9.05-5.8q.7-.45.7-1.25t-.7-1.25l-9.05-5.8q-.75-.5-1.525-.05-.775.45-.775 1.35ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24t1.575-7.75q1.575-3.65 4.3-6.375 2.725-2.725 6.375-4.3Q19.9 4 24 4t7.75 1.575q3.65 1.575 6.375 4.3 2.725 2.725 4.3 6.375Q44 19.9 44 24t-1.575 7.75q-1.575 3.65-4.3 6.375-2.725 2.725-6.375 4.3Q28.1 44 24 44Z'/>
                </svg>
                `;
            } else {
                // PauseCircle.svg
                btnPlay.innerHTML = `
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
                    <path d='M20 32q.65 0 1.075-.425.425-.425.425-1.075V17.45q0-.6-.425-1.025Q20.65 16 20 16q-.65 0-1.075.425-.425.425-.425 1.075v13.05q0 .6.425 1.025Q19.35 32 20 32Zm8 0q.65 0 1.075-.425.425-.425.425-1.075V17.45q0-.6-.425-1.025Q28.65 16 28 16q-.65 0-1.075.425-.425.425-.425 1.075v13.05q0 .6.425 1.025Q27.35 32 28 32Zm-4 12q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24t1.575-7.75q1.575-3.65 4.3-6.375 2.725-2.725 6.375-4.3Q19.9 4 24 4t7.75 1.575q3.65 1.575 6.375 4.3 2.725 2.725 4.3 6.375Q44 19.9 44 24t-1.575 7.75q-1.575 3.65-4.3 6.375-2.725 2.725-6.375 4.3Q28.1 44 24 44Z'/>
                </svg>
                `;
            }
        }
    });
}

// Eliminar el contenido HTML del elemento pasado por parámetros
function limpiarHTML(elemento) {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}
