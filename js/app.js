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

const contenidoPrincipal = document.querySelector('#contenido-principal');

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
    btnPlay.addEventListener('click', alternarPlayPlause);

    barraCancion.addEventListener('change', () => {
        audioCancion.currentTime = barraCancion.value;
    });

    audioCancion.addEventListener("ended", siguienteCancion);

    // Controles de volumen
    iconoVolumen.addEventListener('click', () => {
        if(audioCancion.volume > 0) {
            audioCancion.volume = 0;
            barraVolumen.value = 0;
            iconoVolumen.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="m39.55 44.1-5.5-5.5q-1 .7-2.075 1.275-1.075.575-2.225.975-.8.25-1.45-.25-.65-.5-.65-1.35 0-.4.225-.725.225-.325.625-.425.9-.3 1.775-.7.875-.4 1.625-.95l-8.25-8.3v8.25q0 1-.925 1.375T21.1 37.45L13.65 30h-6.5q-.65 0-1.075-.425-.425-.425-.425-1.075v-9q0-.65.425-1.075Q6.5 18 7.15 18h6.3L3.5 8.05q-.45-.45-.425-1.075Q3.1 6.35 3.55 5.9 4 5.45 4.6 5.45q.6 0 1.05.45l36.1 36.05q.45.45.45 1.075t-.45 1.075q-.45.45-1.1.45-.65 0-1.1-.45Zm-9.8-37.05q5.35 1.9 8.625 6.525Q41.65 18.2 41.65 23.95q0 2.55-.7 5t-2.1 4.65l-2.15-2.15q1-1.7 1.475-3.6.475-1.9.475-3.9 0-4.95-2.775-8.9T28.5 9.75q-.4-.1-.625-.425Q27.65 9 27.65 8.6q0-.85.675-1.325t1.425-.225Zm2.4 19.85-4.5-4.5v-6.5Q30 17 31.325 19.2q1.325 2.2 1.325 4.8 0 .75-.125 1.475-.125.725-.375 1.425Zm-8.5-8.5-5.2-5.2 2.65-2.65q.7-.7 1.625-.325.925.375.925 1.375Z"/></svg>  
            `;
        } else if (audioCancion.volume === 0) {
            audioCancion.volume = 0.2;
            barraVolumen.value = 0.2;
            iconoVolumen.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M15.5 30q-.65 0-1.075-.425Q14 29.15 14 28.5v-9q0-.65.425-1.075Q14.85 18 15.5 18H22l7.45-7.45q.7-.7 1.625-.325Q32 10.6 32 11.6v24.8q0 1-.925 1.375t-1.625-.325L22 30Z"/></svg>
            `;
        }
    });

    barraVolumen.addEventListener('change', () => {
        audioCancion.volume = barraVolumen.value;

        if (audioCancion.volume === 0) {
            iconoVolumen.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="m39.55 44.1-5.5-5.5q-1 .7-2.075 1.275-1.075.575-2.225.975-.8.25-1.45-.25-.65-.5-.65-1.35 0-.4.225-.725.225-.325.625-.425.9-.3 1.775-.7.875-.4 1.625-.95l-8.25-8.3v8.25q0 1-.925 1.375T21.1 37.45L13.65 30h-6.5q-.65 0-1.075-.425-.425-.425-.425-1.075v-9q0-.65.425-1.075Q6.5 18 7.15 18h6.3L3.5 8.05q-.45-.45-.425-1.075Q3.1 6.35 3.55 5.9 4 5.45 4.6 5.45q.6 0 1.05.45l36.1 36.05q.45.45.45 1.075t-.45 1.075q-.45.45-1.1.45-.65 0-1.1-.45Zm-9.8-37.05q5.35 1.9 8.625 6.525Q41.65 18.2 41.65 23.95q0 2.55-.7 5t-2.1 4.65l-2.15-2.15q1-1.7 1.475-3.6.475-1.9.475-3.9 0-4.95-2.775-8.9T28.5 9.75q-.4-.1-.625-.425Q27.65 9 27.65 8.6q0-.85.675-1.325t1.425-.225Zm2.4 19.85-4.5-4.5v-6.5Q30 17 31.325 19.2q1.325 2.2 1.325 4.8 0 .75-.125 1.475-.125.725-.375 1.425Zm-8.5-8.5-5.2-5.2 2.65-2.65q.7-.7 1.625-.325.925.375.925 1.375Z"/></svg>  
            `;
        } else if(audioCancion.volume > 0 && audioCancion.volume <= 0.33) {
            iconoVolumen.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M15.5 30q-.65 0-1.075-.425Q14 29.15 14 28.5v-9q0-.65.425-1.075Q14.85 18 15.5 18H22l7.45-7.45q.7-.7 1.625-.325Q32 10.6 32 11.6v24.8q0 1-.925 1.375t-1.625-.325L22 30Z"/></svg>
            `;
        } else if(audioCancion.volume > 0.33 && audioCancion.volume <= 0.66) {
            iconoVolumen.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M11.5 30q-.65 0-1.075-.425Q10 29.15 10 28.5v-9q0-.65.425-1.075Q10.85 18 11.5 18H18l7.45-7.45q.7-.7 1.625-.325Q28 10.6 28 11.6v24.8q0 1-.925 1.375t-1.625-.325L18 30ZM31 32.4V15.55q2.7.85 4.35 3.2Q37 21.1 37 24q0 2.95-1.65 5.25T31 32.4Z"/></svg>
            `;
        } else {
            iconoVolumen.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M30.1 40.85q-.8.25-1.45-.25-.65-.5-.65-1.35 0-.4.225-.725.225-.325.625-.425 4.55-1.6 7.35-5.45t2.8-8.7q0-4.85-2.8-8.725T28.85 9.8q-.4-.1-.625-.45Q28 9 28 8.6q0-.85.675-1.325T30.1 7.05q5.35 1.9 8.625 6.525Q42 18.2 42 23.95t-3.275 10.375Q35.45 38.95 30.1 40.85ZM7.5 30q-.65 0-1.075-.425Q6 29.15 6 28.5v-9q0-.65.425-1.075Q6.85 18 7.5 18H14l7.45-7.45q.7-.7 1.625-.325Q24 10.6 24 11.6v24.8q0 1-.925 1.375t-1.625-.325L14 30ZM27 32.4V15.55q2.7.85 4.35 3.2Q33 21.1 33 24q0 2.95-1.65 5.25T27 32.4Z"/></svg>
            `;
        }
    });
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
    tituloSeccionCanciones.classList.add('my-6', 'text-2xl', 'font-bold', 'md:my-12', 'md:text-3xl');
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

    const { nombreAlbum, artista, fecha_lanzamiento, cantidad_canciones, duracion, rutaImagen, color, canciones } = albumSeleccionado;

    // Cabecera
    const divCabecera = document.createElement('div');
    divCabecera.classList.add('bg-blue-900', 'p-5', 'sm:p-10');

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

    const cancionesHeadDer = document.createElement('div');
    cancionesHeadDer.innerHTML = `
        <svg id="timer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path d="M19.5 5q-.65 0-1.075-.425Q18 4.15 18 3.5q0-.65.425-1.075Q18.85 2 19.5 2h9q.65 0 1.075.425Q30 2.85 30 3.5q0 .65-.425 1.075Q29.15 5 28.5 5ZM24 27.35q.65 0 1.075-.425.425-.425.425-1.075v-8.5q0-.65-.425-1.075-.425-.425-1.075-.425-.65 0-1.075.425-.425.425-.425 1.075v8.5q0 .65.425 1.075.425.425 1.075.425Zm0 16.6q-3.7 0-6.975-1.425Q13.75 41.1 11.3 38.65q-2.45-2.45-3.875-5.725Q6 29.65 6 25.95q0-3.7 1.425-6.975Q8.85 15.7 11.3 13.25q2.45-2.45 5.725-3.875Q20.3 7.95 24 7.95q3.35 0 6.3 1.125 2.95 1.125 5.25 3.125l1.55-1.55q.4-.4 1-.4t1.05.45q.45.45.45 1.05 0 .6-.45 1.05l-1.5 1.5q1.8 2 3.075 4.85Q42 22 42 25.95q0 3.7-1.425 6.975Q39.15 36.2 36.7 38.65q-2.45 2.45-5.725 3.875Q27.7 43.95 24 43.95Zm0-3q6.25 0 10.625-4.375T39 25.95q0-6.25-4.375-10.625T24 10.95q-6.25 0-10.625 4.375T9 25.95q0 6.25 4.375 10.625T24 40.95ZM24 26Z" />
        </svg>
    
    `;

    cancionesHeadIzq.appendChild(pNumero);
    cancionesHeadIzq.appendChild(pTitulo);

    cancionesHead.appendChild(cancionesHeadIzq);
    cancionesHead.appendChild(cancionesHeadDer);

    divCanciones.appendChild(cancionesHead);

    canciones.forEach(cancion => {

        const { id, nombre, duracion } = cancion;

        const divCancion = document.createElement('div');
        divCancion.classList.add('cancion', 'w-full', 'flex', 'justify-between', 'items-center', 'p-5', 'rounded-md', 'md:hover:cursor-pointer', 'md:hover:bg-green-600');
        divCancion.setAttribute('id', id);

        divCancion.onclick = () => {
            reproducir(idAlbum, id);
        }

        const cancionIzq = document.createElement('div');
        cancionIzq.classList.add('flex', 'gap-8');

        const pNumero = document.createElement('p');
        pNumero.textContent = id;

        const pNombre = document.createElement('p');
        pNombre.textContent = nombre;

        cancionIzq.appendChild(pNumero);
        cancionIzq.appendChild(pNombre);

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

function reproducir(idAlbum, idCancion) {
    const canciones = document.querySelectorAll('.cancion');
    canciones.forEach(cancion => {
        cancion.classList.remove('bg-green-600');
    });

    const divCancion = document.getElementById(idCancion);
    divCancion.classList.add('bg-green-600');

    const albumCancion = albumes.find(album => album.id === idAlbum);

    const { nombreAlbum, artista, rutaImagen, canciones:cancionesAlbum} = albumCancion;

    const laCancion = cancionesAlbum.find(cancion => cancion.id === idCancion);

    const { nombre, ruta} = laCancion;
    console.log(nombre);

    coverReproductor.src = `../img/albumes/${rutaImagen}`;
    tituloReproductor.textContent = nombre;
    artistaReproductor.textContent = artista;

    audioCancion.src = `../audios/${nombreAlbum}/${ruta}`;

    alternarPlayPlause();
}

function alternarPlayPlause() {
    if (audioCancion.paused) {
        audioCancion.play();

        audioCancion.addEventListener('timeupdate', () => {
            tiempoActual.textContent = audioCancion.currentTime;
            //tiempoRestante.textContent = ;

            barraCancion.value = audioCancion.currentTime;
            barraCancion.max = audioCancion.duration;

        });
        btnPlay.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M20 32q.65 0 1.075-.425.425-.425.425-1.075V17.45q0-.6-.425-1.025Q20.65 16 20 16q-.65 0-1.075.425-.425.425-.425 1.075v13.05q0 .6.425 1.025Q19.35 32 20 32Zm8 0q.65 0 1.075-.425.425-.425.425-1.075V17.45q0-.6-.425-1.025Q28.65 16 28 16q-.65 0-1.075.425-.425.425-.425 1.075v13.05q0 .6.425 1.025Q27.35 32 28 32Zm-4 12q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24t1.575-7.75q1.575-3.65 4.3-6.375 2.725-2.725 6.375-4.3Q19.9 4 24 4t7.75 1.575q3.65 1.575 6.375 4.3 2.725 2.725 4.3 6.375Q44 19.9 44 24t-1.575 7.75q-1.575 3.65-4.3 6.375-2.725 2.725-6.375 4.3Q28.1 44 24 44Z"/></svg>
        `;

    } else {
        audioCancion.pause();
        btnPlay.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M19.15 18.25v11.5q0 .9.775 1.35.775.45 1.525-.05l9.05-5.8q.7-.45.7-1.25t-.7-1.25l-9.05-5.8q-.75-.5-1.525-.05-.775.45-.775 1.35ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24t1.575-7.75q1.575-3.65 4.3-6.375 2.725-2.725 6.375-4.3Q19.9 4 24 4t7.75 1.575q3.65 1.575 6.375 4.3 2.725 2.725 4.3 6.375Q44 19.9 44 24t-1.575 7.75q-1.575 3.65-4.3 6.375-2.725 2.725-6.375 4.3Q28.1 44 24 44Z"/></svg>
        `;
    }
}

function siguienteCancion() {

}

function numeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function limpiarHTML(elemento) {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}