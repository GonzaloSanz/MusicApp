'use strict'

/*
 ***********************************************************
 *                                                         *
 *                       VARIABLES                         *
 *                                                         *
 ***********************************************************
*/

let albumes = [];
let sencillas = [];

let cancionActiva = {};

const contenidoPrincipal = document.querySelector('#contenido-principal');
const contenidoMenu = document.querySelector('#contenido-menu');
const contenidoReproductor = document.querySelector('#contenido-reproductor');
let primeraReproduccion = false;

// Accesos del menú
const inicioMenu = document.querySelector('#menu-inicio');
const albumesMenu = document.querySelector('#menu-albumes');
const cancionesMenu = document.querySelector('#menu-sencillas');

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
    // Recoger todos los álbumes y canciones del json
    obtenerDatos();

    // Acciones del menú
    inicioMenu.addEventListener('click', () => {
        limpiarHTML(contenidoPrincipal);

        cargarInicio();
    });

    albumesMenu.addEventListener('click', () => {
        limpiarHTML(contenidoPrincipal);

        contenidoPrincipal.classList.add('p-6');
        crearLogo();
        cargarAlbumes('Álbumes disponibles', albumes);
    });

    cancionesMenu.addEventListener('click', () => {
        limpiarHTML(contenidoPrincipal);

        contenidoPrincipal.classList.add('p-6');
        crearLogo();
        cargarCanciones('Echa un vistazo a nuestras canciones', sencillas);
    });

    // Controles de la canción

    btnAnterior.addEventListener('click', anteriorCancion);

    btnPlay.addEventListener('click', alternarPlayPlause);

    btnSiguiente.addEventListener('click', siguienteCancion);

    barraCancion.addEventListener('input', () => {
        audioCancion.currentTime = barraCancion.value;
        actualizarTiempoCancion(audioCancion, barraCancion, tiempoActual, tiempoRestante);
    });

    audioCancion.addEventListener("ended", siguienteCancion);

    // Controles de volumen
    iconoVolumen.addEventListener('click', () => {
        if (audioCancion.volume > 0) {
            volumenValor = audioCancion.volume;
            audioCancion.volume = 0;
            barraVolumen.value = 0;
            // VolumeMute.svg
            iconoVolumen.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                    <path d="M36.2,40.3l-4.4-4.4c-0.5,0.4-1.1,0.7-1.7,1c-0.6,0.3-1.2,0.6-1.8,0.8c-0.4,0.1-0.8,0.1-1.2-0.2c-0.3-0.3-0.5-0.6-0.5-1.1
                    c0-0.2,0.1-0.4,0.2-0.6s0.3-0.3,0.5-0.3c0.5-0.2,1-0.3,1.4-0.6c0.5-0.2,0.9-0.5,1.3-0.8l-6.6-6.6v6.6c0,0.5-0.2,0.9-0.7,1.1
                    s-0.9,0.1-1.3-0.3l-6-6h-5.2c-0.3,0-0.6-0.1-0.9-0.3C9.2,28.4,9,28.1,9,27.8v-7.2c0-0.3,0.1-0.6,0.3-0.9c0.2-0.2,0.5-0.3,0.9-0.3h5
                    l-8-8C7.1,11.2,7,10.9,7,10.6S7.1,10,7.4,9.7c0.2-0.2,0.5-0.4,0.8-0.4c0.3,0,0.6,0.1,0.8,0.4l28.9,28.8c0.2,0.2,0.4,0.5,0.4,0.9
                    c0,0.3-0.1,0.6-0.4,0.9s-0.5,0.4-0.9,0.4C36.7,40.6,36.4,40.5,36.2,40.3z M28.3,10.6c2.9,1,5.2,2.8,6.9,5.2c1.7,2.5,2.6,5.2,2.6,8.3
                    c0,1.4-0.2,2.7-0.6,4s-0.9,2.5-1.7,3.7l-1.7-1.7c0.5-0.9,0.9-1.9,1.2-2.9c0.3-1,0.4-2.1,0.4-3.1c0-2.6-0.7-5-2.2-7.1
                    s-3.4-3.5-5.9-4.2c-0.2-0.1-0.4-0.2-0.5-0.3c-0.1-0.2-0.2-0.4-0.2-0.6c0-0.5,0.2-0.8,0.5-1.1S27.9,10.5,28.3,10.6z M30.2,26.5
                    l-3.6-3.6v-5.2c1.3,0.6,2.2,1.5,2.9,2.6c0.7,1.2,1.1,2.5,1.1,3.8c0,0.4,0,0.8-0.1,1.2C30.5,25.8,30.4,26.1,30.2,26.5z M23.4,19.7
                    l-4.2-4.2l2.1-2.1c0.4-0.4,0.8-0.5,1.3-0.3c0.5,0.2,0.7,0.6,0.7,1.1L23.4,19.7z"/>
                </svg>
            `;
        } else if (audioCancion.volume === 0) {
            audioCancion.volume = volumenValor;
            barraVolumen.value = volumenValor;
            actualizarIconoVolumen();
        }
    });

    barraVolumen.addEventListener('input', () => {
        audioCancion.volume = barraVolumen.value;
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
}

function cargarAlbumes(titulo, albumes) {
    const tituloSeccionAlbumes = document.createElement('h3');
    tituloSeccionAlbumes.classList.add('my-6', 'text-2xl', 'font-bold', 'md:my-10', 'md:text-3xl');
    tituloSeccionAlbumes.textContent = titulo;

    const contenedorAlbumes = document.createElement('div');
    contenedorAlbumes.classList.add('grid', 'gap-4', 'gap-y-10', 'sm:grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4');

    contenidoPrincipal.appendChild(tituloSeccionAlbumes);
    contenidoPrincipal.appendChild(contenedorAlbumes);

    // Mostrar álbumes
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

function cargarCanciones(titulo, canciones, contenidoReducido = false) {
    const tituloSeccionCanciones = document.createElement('h3');
    tituloSeccionCanciones.classList.add('my-6', 'text-2xl', 'font-bold', 'md:my-10', 'md:text-3xl');
    tituloSeccionCanciones.textContent = titulo;

    const contenedorCanciones = document.createElement('div');
    contenedorCanciones.classList.add('grid', 'gap-4', 'gap-y-10', 'sm:grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4');

    contenidoPrincipal.appendChild(tituloSeccionCanciones);
    contenidoPrincipal.appendChild(contenedorCanciones);

    // Mostrar canciones
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

function crearLogo() {
    const divLogo = document.createElement('div');
    divLogo.classList.add('flex', 'items-center', 'mt-4', 'mb-8');
    divLogo.innerHTML = `    
        <svg id="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path d="M19.65 42q-3.15 0-5.325-2.175Q12.15 37.65 12.15 34.5q0-3.15 2.175-5.325Q16.5 27 19.65 27q1.4 0 2.525.4t1.975 1.1V9q0-1.25.875-2.125T27.15 6h5.35q1.4 0 2.375.975.975.975.975 2.375t-.975 2.4q-.975 1-2.375 1h-5.35V34.5q0 3.15-2.175 5.325Q22.8 42 19.65 42Z" />
            <linearGradient id="myGradient" x1="0.4" y1="1" x2="1" y2="0">
                <stop offset="12%" stop-color="#ff7a00" />
                <stop offset="40%" stop-color="#ff0169" />
                <stop offset="70%" stop-color="#d300c5" />
                <stop offset="100%" stop-color="#7336f3" />
            </linearGradient>
        </svg>

        <p class="font-bold text-4xl">Music App</p>
    `;

    contenidoPrincipal.appendChild(divLogo);
}

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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path d="m22.35 38.95-13.9-13.9q-.25-.25-.35-.5Q8 24.3 8 24q0-.3.1-.55.1-.25.35-.5L22.4 9q.4-.4 1-.4t1.05.45q.45.45.45 1.05 0 .6-.45 1.05L13.1 22.5h24.8q.65 0 1.075.425.425.425.425 1.075 0 .65-.425 1.075-.425.425-1.075.425H13.1l11.4 11.4q.4.4.4 1t-.45 1.05q-.45.45-1.05.45-.6 0-1.05-.45Z" />
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
    imagen.classList.add('h-cover-img', 'rounded-md');
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
        <svg id="timer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path d="M19.5 5q-.65 0-1.075-.425Q18 4.15 18 3.5q0-.65.425-1.075Q18.85 2 19.5 2h9q.65 0 1.075.425Q30 2.85 30 3.5q0 .65-.425 1.075Q29.15 5 28.5 5ZM24 27.35q.65 0 1.075-.425.425-.425.425-1.075v-8.5q0-.65-.425-1.075-.425-.425-1.075-.425-.65 0-1.075.425-.425.425-.425 1.075v8.5q0 .65.425 1.075.425.425 1.075.425Zm0 16.6q-3.7 0-6.975-1.425Q13.75 41.1 11.3 38.65q-2.45-2.45-3.875-5.725Q6 29.65 6 25.95q0-3.7 1.425-6.975Q8.85 15.7 11.3 13.25q2.45-2.45 5.725-3.875Q20.3 7.95 24 7.95q3.35 0 6.3 1.125 2.95 1.125 5.25 3.125l1.55-1.55q.4-.4 1-.4t1.05.45q.45.45.45 1.05 0 .6-.45 1.05l-1.5 1.5q1.8 2 3.075 4.85Q42 22 42 25.95q0 3.7-1.425 6.975Q39.15 36.2 36.7 38.65q-2.45 2.45-5.725 3.875Q27.7 43.95 24 43.95Zm0-3q6.25 0 10.625-4.375T39 25.95q0-6.25-4.375-10.625T24 10.95q-6.25 0-10.625 4.375T9 25.95q0 6.25 4.375 10.625T24 40.95ZM24 26Z" />
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

        divCancion.setAttribute('id', id);

        divCancion.onpointerup = () => {
            if (window.matchMedia("(max-width: 991px)").matches) {
                reproducir(idAlbum, id);
            }
        }

        divCancion.ondblclick = () => {
            if (window.matchMedia("(min-width: 992px)").matches) {
                reproducir(idAlbum, id);
            }
        }

        if (window.matchMedia("(min-width: 992px)").matches) {
            divCancion.onclick = () => {
                if (document.querySelector(".cancionSeleccionada")) {
                    document.querySelector(".cancionSeleccionada").classList.remove("cancionSeleccionada");
                }
                divCancion.classList.add("cancionSeleccionada");
            }
        }

        const cancionIzq = document.createElement('div');
        cancionIzq.classList.add('flex', 'gap-8', 'items-center', 'overflow-hidden');

        const pNumero = document.createElement('p');
        pNumero.textContent = id;

        const divNumero = document.createElement('div');
        divNumero.id = `numero${id}`;
        divNumero.classList.add('w-5');

        if (id === cancionActiva.id && nombre === cancionActiva.nombre && artista === cancionActiva.artista) {
            divNumero.style.display = "flex";
            divNumero.style.alignItems = "center";
            divNumero.innerHTML = `
                <div class="wave">
                    <div class="wave1"></div>
                    <div class="wave2"></div>
                    <div class="wave3"></div>
                    <div class="wave4"></div>
                </div>
                <div>
                    <p class="numero">${id}</p>
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
}

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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path d="m22.35 38.95-13.9-13.9q-.25-.25-.35-.5Q8 24.3 8 24q0-.3.1-.55.1-.25.35-.5L22.4 9q.4-.4 1-.4t1.05.45q.45.45.45 1.05 0 .6-.45 1.05L13.1 22.5h24.8q.65 0 1.075.425.425.425.425 1.075 0 .65-.425 1.075-.425.425-1.075.425H13.1l11.4 11.4q.4.4.4 1t-.45 1.05q-.45.45-1.05.45-.6 0-1.05-.45Z" />
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
        <svg id="timer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path d="M19.5 5q-.65 0-1.075-.425Q18 4.15 18 3.5q0-.65.425-1.075Q18.85 2 19.5 2h9q.65 0 1.075.425Q30 2.85 30 3.5q0 .65-.425 1.075Q29.15 5 28.5 5ZM24 27.35q.65 0 1.075-.425.425-.425.425-1.075v-8.5q0-.65-.425-1.075-.425-.425-1.075-.425-.65 0-1.075.425-.425.425-.425 1.075v8.5q0 .65.425 1.075.425.425 1.075.425Zm0 16.6q-3.7 0-6.975-1.425Q13.75 41.1 11.3 38.65q-2.45-2.45-3.875-5.725Q6 29.65 6 25.95q0-3.7 1.425-6.975Q8.85 15.7 11.3 13.25q2.45-2.45 5.725-3.875Q20.3 7.95 24 7.95q3.35 0 6.3 1.125 2.95 1.125 5.25 3.125l1.55-1.55q.4-.4 1-.4t1.05.45q.45.45.45 1.05 0 .6-.45 1.05l-1.5 1.5q1.8 2 3.075 4.85Q42 22 42 25.95q0 3.7-1.425 6.975Q39.15 36.2 36.7 38.65q-2.45 2.45-5.725 3.875Q27.7 43.95 24 43.95Zm0-3q6.25 0 10.625-4.375T39 25.95q0-6.25-4.375-10.625T24 10.95q-6.25 0-10.625 4.375T9 25.95q0 6.25 4.375 10.625T24 40.95ZM24 26Z" />
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

    divCancion.setAttribute('id', id);

    divCancion.onpointerup = () => {
        if (window.matchMedia("(max-width: 991px)").matches) {
            reproducir(false, id);
        }
    }

    divCancion.ondblclick = () => {
        if (window.matchMedia("(min-width: 992px)").matches) {
            reproducir(false, id);
        }
    }

    if (window.matchMedia("(min-width: 992px)").matches) {
        divCancion.onclick = () => {
            if (document.querySelector(".cancionSeleccionada")) {
                document.querySelector(".cancionSeleccionada").classList.remove("cancionSeleccionada");
            }
            divCancion.classList.add("cancionSeleccionada");
        }
    }

    const cancionIzq = document.createElement('div');
    cancionIzq.classList.add('flex', 'gap-8', 'items-center', 'overflow-hidden');

    const pNumeroCancion = document.createElement('p');
    pNumeroCancion.textContent = '1';

    const divNumero = document.createElement('div');
    divNumero.id = `numero${id}`;
    divNumero.classList.add('w-5');

    if (id === cancionActiva.id && nombre === cancionActiva.nombre && artista === cancionActiva.artista) {
        divNumero.style.display = "flex";
        divNumero.style.alignItems = "center";
        divNumero.innerHTML = `
            <div class="wave">
                <div class="wave1"></div>
                <div class="wave2"></div>
                <div class="wave3"></div>
                <div class="wave4"></div>
            </div>
            <div>
                <p class="numero">${id}</p>
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


}

function reproducir(idAlbum = false, idCancion) {
    if (primeraReproduccion === false) {
        contenidoPrincipal.classList.remove("lg:h-screen");
        contenidoMenu.classList.add("lg:h-[87%]");
        contenidoReproductor.classList.remove("hidden");
        primeraReproduccion = true;
    }

    if (document.querySelector(".wave")) {
        document.querySelector(".numero").classList.add("block");
        document.querySelector(".numero").classList.remove("numero");
        document.querySelector(".wave").remove();
    }

    const divCancion = document.getElementById(idCancion);

    const canciones = document.querySelectorAll('.cancion');
    canciones.forEach(cancion => {
        cancion.classList.remove('cancionSonando');
        cancion.classList.add('cancionHover');
    });

    divCancion.classList.remove('cancionHover');
    divCancion.classList.add('cancionSonando');

    const divNombre = document.getElementById(`numero${idCancion}`);
    divNombre.style.display = "flex";
    divNombre.style.alignItems = "center";
    divNombre.innerHTML = `
        <div class="wave">
            <div class="wave1"></div>
            <div class="wave2"></div>
            <div class="wave3"></div>
            <div class="wave4"></div>
        </div>
        <div>
            <p class="numero">${idCancion}</p>
        </div>
    `;

    if (idAlbum) {
        const albumCancion = albumes.find(album => album.id === idAlbum);

        const { nombreAlbum, artista, rutaImagen, canciones: cancionesAlbum } = albumCancion;

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
            artista
        }

    } else {
        const cancionSencilla = sencillas.find(sencilla => sencilla.id === idCancion);

        const { id, nombre, artista, rutaImagen, ruta } = cancionSencilla;

        coverReproductor.src = `../img/sencillas/${rutaImagen}`;
        tituloReproductor.textContent = nombre;
        artistaReproductor.textContent = artista;

        audioCancion.src = `../audios/sencillas/${ruta}`;

        cancionActiva = {
            id,
            nombre,
            artista,
        }
    }

    alternarPlayPlause();
}

function alternarPlayPlause() {
    if (audioCancion.paused) {
        audioCancion.play();

        audioCancion.addEventListener('timeupdate', () => {
            if (!audioCancion.paused) {
                actualizarTiempoCancion(audioCancion, barraCancion, tiempoActual, tiempoRestante);
            }
        });

        if (window.matchMedia("(max-width: 991px)").matches) {
            // Pause.svg
            btnPlay.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path d="M18.5,36.8c0.6,0,1.3-0.2,1.8-0.6s0.6-1,0.6-1.8V13.6c0-0.6-0.2-1.1-0.6-1.6c-0.5-0.6-1.1-0.8-1.8-0.8s-1.3,0.2-1.8,0.6
                c-0.5,0.5-0.6,1-0.6,1.8v20.8c0,0.6,0.2,1.1,0.6,1.6C17.2,36.7,17.9,36.8,18.5,36.8z M31.3,36.8c0.6,0,1.3-0.2,1.8-0.6
                c0.5-0.5,0.6-1,0.6-1.8V13.6c0-0.6-0.2-1.1-0.6-1.6c-0.5-0.6-1.1-0.8-1.8-0.8s-1.3,0.2-1.8,0.6c-0.5,0.5-0.6,1-0.6,1.8v20.8
                c0,0.6,0.2,1.1,0.6,1.6C30,36.7,30.7,36.8,31.3,36.8z"/>
            </svg>            
            `;
        } else if (window.matchMedia("(min-width: 992px)").matches) {
            // PauseCircle.svg
            btnPlay.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path d="M20 32q.65 0 1.075-.425.425-.425.425-1.075V17.45q0-.6-.425-1.025Q20.65 16 20 16q-.65 0-1.075.425-.425.425-.425 1.075v13.05q0 .6.425 1.025Q19.35 32 20 32Zm8 0q.65 0 1.075-.425.425-.425.425-1.075V17.45q0-.6-.425-1.025Q28.65 16 28 16q-.65 0-1.075.425-.425.425-.425 1.075v13.05q0 .6.425 1.025Q27.35 32 28 32Zm-4 12q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24t1.575-7.75q1.575-3.65 4.3-6.375 2.725-2.725 6.375-4.3Q19.9 4 24 4t7.75 1.575q3.65 1.575 6.375 4.3 2.725 2.725 4.3 6.375Q44 19.9 44 24t-1.575 7.75q-1.575 3.65-4.3 6.375-2.725 2.725-6.375 4.3Q28.1 44 24 44Z"/>
            </svg>
            `;
        }

        document.querySelector(".wave").style.display = "flex";
        document.querySelector(".numero").classList.remove("block");
    } else {
        audioCancion.pause();
        if (window.matchMedia("(max-width: 991px)").matches) {
            // PlayArrow.svg
            btnPlay.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path d="M18.3 36.4q-.75.5-1.525.05Q16 36 16 35.1V12.6q0-.9.775-1.35.775-.45 1.525.05L36 22.6q.7.45.7 1.25T36 25.1Z"/>
            </svg>         
            `;
        } else if (window.matchMedia("(min-width: 992px)").matches) {
            // PlayCircle.svg
            btnPlay.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path d="M19.15 18.25v11.5q0 .9.775 1.35.775.45 1.525-.05l9.05-5.8q.7-.45.7-1.25t-.7-1.25l-9.05-5.8q-.75-.5-1.525-.05-.775.45-.775 1.35ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24t1.575-7.75q1.575-3.65 4.3-6.375 2.725-2.725 6.375-4.3Q19.9 4 24 4t7.75 1.575q3.65 1.575 6.375 4.3 2.725 2.725 4.3 6.375Q44 19.9 44 24t-1.575 7.75q-1.575 3.65-4.3 6.375-2.725 2.725-6.375 4.3Q28.1 44 24 44Z"/>
            </svg>
            `;
        }

        document.querySelector(".wave").style.display = "none";
        document.querySelector(".numero").classList.add("block");
    }
}

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

function siguienteCancion() {
    const { idAlbum } = cancionActiva;

    if (idAlbum) {
        const elAlbum = albumes.find(album => album.id === idAlbum);

        if (cancionActiva.id + 1 <= elAlbum.canciones.length) {
            reproducir(idAlbum, cancionActiva.id + 1);
        } else {
            reproducir(idAlbum, 1);
        }

    } else {
        reproducir(false, cancionActiva.id);
    }
}

function numeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

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

function actualizarIconoVolumen() {
    if (audioCancion.volume === 0) {
        iconoVolumen.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path d="M36.2,40.3l-4.4-4.4c-0.5,0.4-1.1,0.7-1.7,1c-0.6,0.3-1.2,0.6-1.8,0.8c-0.4,0.1-0.8,0.1-1.2-0.2c-0.3-0.3-0.5-0.6-0.5-1.1
            c0-0.2,0.1-0.4,0.2-0.6s0.3-0.3,0.5-0.3c0.5-0.2,1-0.3,1.4-0.6c0.5-0.2,0.9-0.5,1.3-0.8l-6.6-6.6v6.6c0,0.5-0.2,0.9-0.7,1.1
            s-0.9,0.1-1.3-0.3l-6-6h-5.2c-0.3,0-0.6-0.1-0.9-0.3C9.2,28.4,9,28.1,9,27.8v-7.2c0-0.3,0.1-0.6,0.3-0.9c0.2-0.2,0.5-0.3,0.9-0.3h5
            l-8-8C7.1,11.2,7,10.9,7,10.6S7.1,10,7.4,9.7c0.2-0.2,0.5-0.4,0.8-0.4c0.3,0,0.6,0.1,0.8,0.4l28.9,28.8c0.2,0.2,0.4,0.5,0.4,0.9
            c0,0.3-0.1,0.6-0.4,0.9s-0.5,0.4-0.9,0.4C36.7,40.6,36.4,40.5,36.2,40.3z M28.3,10.6c2.9,1,5.2,2.8,6.9,5.2c1.7,2.5,2.6,5.2,2.6,8.3
            c0,1.4-0.2,2.7-0.6,4s-0.9,2.5-1.7,3.7l-1.7-1.7c0.5-0.9,0.9-1.9,1.2-2.9c0.3-1,0.4-2.1,0.4-3.1c0-2.6-0.7-5-2.2-7.1
            s-3.4-3.5-5.9-4.2c-0.2-0.1-0.4-0.2-0.5-0.3c-0.1-0.2-0.2-0.4-0.2-0.6c0-0.5,0.2-0.8,0.5-1.1S27.9,10.5,28.3,10.6z M30.2,26.5
            l-3.6-3.6v-5.2c1.3,0.6,2.2,1.5,2.9,2.6c0.7,1.2,1.1,2.5,1.1,3.8c0,0.4,0,0.8-0.1,1.2C30.5,25.8,30.4,26.1,30.2,26.5z M23.4,19.7
            l-4.2-4.2l2.1-2.1c0.4-0.4,0.8-0.5,1.3-0.3c0.5,0.2,0.7,0.6,0.7,1.1L23.4,19.7z"/>
        </svg>
        `;
    } else if (audioCancion.volume > 0 && audioCancion.volume <= 0.33) {
        iconoVolumen.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path d="M17,28.8c-0.3,0-0.6-0.1-0.9-0.3c-0.2-0.2-0.3-0.5-0.3-0.9v-7.2c0-0.3,0.1-0.6,0.3-0.9c0.2-0.2,0.5-0.3,0.9-0.3h5.2l6-6
            c0.4-0.4,0.8-0.5,1.3-0.3c0.5,0.2,0.7,0.6,0.7,1.1v19.8c0,0.5-0.2,0.9-0.7,1.1c-0.5,0.2-0.9,0.1-1.3-0.3l-6-6H17z"/>
        </svg>
        `;
    } else if (audioCancion.volume > 0.33 && audioCancion.volume <= 0.66) {
        iconoVolumen.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path d="M13.9,28.8c-0.3,0-0.6-0.1-0.9-0.3c-0.2-0.2-0.3-0.5-0.3-0.9v-7.2c0-0.3,0.1-0.6,0.3-0.9c0.2-0.2,0.5-0.3,0.9-0.3h5.2l6-6
                c0.4-0.4,0.8-0.5,1.3-0.3c0.5,0.2,0.7,0.6,0.7,1.1v19.8c0,0.5-0.2,0.9-0.7,1.1c-0.5,0.2-0.9,0.1-1.3-0.3l-6-6H13.9z M29.5,30.7V17.2
                c1.4,0.5,2.6,1.3,3.5,2.6s1.3,2.7,1.3,4.2c0,1.6-0.4,3-1.3,4.2C32.1,29.4,30.9,30.3,29.5,30.7z"/>
            </svg>
        `;
    } else {
        iconoVolumen.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path d="M28.9,37.5c-0.4,0.1-0.8,0.1-1.2-0.2c-0.3-0.3-0.5-0.6-0.5-1.1c0-0.2,0.1-0.4,0.2-0.6c0.1-0.2,0.3-0.3,0.5-0.3
                c2.4-0.9,4.4-2.3,5.9-4.4c1.5-2.1,2.2-4.4,2.2-7s-0.7-4.9-2.2-7c-1.5-2.1-3.5-3.5-5.9-4.3c-0.2-0.1-0.4-0.2-0.5-0.4
                c-0.1-0.2-0.2-0.4-0.2-0.6c0-0.5,0.2-0.8,0.5-1.1c0.4-0.3,0.7-0.3,1.1-0.2c2.9,1,5.2,2.8,6.9,5.2s2.6,5.2,2.6,8.3s-0.9,5.8-2.6,8.3
                S31.7,36.5,28.9,37.5z M10.8,28.8c-0.3,0-0.6-0.1-0.9-0.3c-0.2-0.2-0.3-0.5-0.3-0.9v-7.2c0-0.3,0.1-0.6,0.3-0.9
                c0.2-0.2,0.5-0.3,0.9-0.3H16l6-6c0.4-0.4,0.8-0.5,1.3-0.3c0.5,0.2,0.7,0.6,0.7,1.1v19.8c0,0.5-0.2,0.9-0.7,1.1
                c-0.5,0.2-0.9,0.1-1.3-0.3l-6-6H10.8z M26.4,30.7V17.2c1.4,0.5,2.6,1.3,3.5,2.6c0.9,1.3,1.3,2.7,1.3,4.2c0,1.6-0.4,3-1.3,4.2
                C29,29.4,27.8,30.3,26.4,30.7z"/>
            </svg>
        `;
    }
}

function comprobarMediaQuery() {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    mediaQuery.addEventListener("change", () => {
        if (mediaQuery.matches) {
            if (audioCancion.paused) {
                // PlayArrow.svg
                btnPlay.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                    <path d="M18.3 36.4q-.75.5-1.525.05Q16 36 16 35.1V12.6q0-.9.775-1.35.775-.45 1.525.05L36 22.6q.7.45.7 1.25T36 25.1Z"/>
                </svg>
                `;
            } else {
                // Pause.svg
                btnPlay.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path d="M18.5,36.8c0.6,0,1.3-0.2,1.8-0.6s0.6-1,0.6-1.8V13.6c0-0.6-0.2-1.1-0.6-1.6c-0.5-0.6-1.1-0.8-1.8-0.8s-1.3,0.2-1.8,0.6
                    c-0.5,0.5-0.6,1-0.6,1.8v20.8c0,0.6,0.2,1.1,0.6,1.6C17.2,36.7,17.9,36.8,18.5,36.8z M31.3,36.8c0.6,0,1.3-0.2,1.8-0.6
                    c0.5-0.5,0.6-1,0.6-1.8V13.6c0-0.6-0.2-1.1-0.6-1.6c-0.5-0.6-1.1-0.8-1.8-0.8s-1.3,0.2-1.8,0.6c-0.5,0.5-0.6,1-0.6,1.8v20.8
                    c0,0.6,0.2,1.1,0.6,1.6C30,36.7,30.7,36.8,31.3,36.8z"/>
                </svg>            
                `;
            }
        } else {
            if (audioCancion.paused) {
                // PlayCircle.svg
                btnPlay.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                    <path d="M19.15 18.25v11.5q0 .9.775 1.35.775.45 1.525-.05l9.05-5.8q.7-.45.7-1.25t-.7-1.25l-9.05-5.8q-.75-.5-1.525-.05-.775.45-.775 1.35ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24t1.575-7.75q1.575-3.65 4.3-6.375 2.725-2.725 6.375-4.3Q19.9 4 24 4t7.75 1.575q3.65 1.575 6.375 4.3 2.725 2.725 4.3 6.375Q44 19.9 44 24t-1.575 7.75q-1.575 3.65-4.3 6.375-2.725 2.725-6.375 4.3Q28.1 44 24 44Z"/>
                </svg>
                `;
            } else {
                // PauseCircle.svg
                btnPlay.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                    <path d="M20 32q.65 0 1.075-.425.425-.425.425-1.075V17.45q0-.6-.425-1.025Q20.65 16 20 16q-.65 0-1.075.425-.425.425-.425 1.075v13.05q0 .6.425 1.025Q19.35 32 20 32Zm8 0q.65 0 1.075-.425.425-.425.425-1.075V17.45q0-.6-.425-1.025Q28.65 16 28 16q-.65 0-1.075.425-.425.425-.425 1.075v13.05q0 .6.425 1.025Q27.35 32 28 32Zm-4 12q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24t1.575-7.75q1.575-3.65 4.3-6.375 2.725-2.725 6.375-4.3Q19.9 4 24 4t7.75 1.575q3.65 1.575 6.375 4.3 2.725 2.725 4.3 6.375Q44 19.9 44 24t-1.575 7.75q-1.575 3.65-4.3 6.375-2.725 2.725-6.375 4.3Q28.1 44 24 44Z"/>
                </svg>
                `;
            }
        }
    });
}

function limpiarHTML(elemento) {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}
