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

/*
 ***********************************************************
 *                                                         *
 *                   EJECUCIÓN PRINCIPAL                   *
 *                                                         *
 ***********************************************************
*/

window.addEventListener('load', () => {
    obtenerAlbumes();
    obtenerSencillas();
});

/*
 ***********************************************************
 *                                                         *
 *                        FUNCIONES                        *
 *                                                         *
 ***********************************************************
*/

async function obtenerAlbumes() {

    fetch('db.json')
        .then(respuesta => respuesta.json())
        .then(resultado => {
            resultado.albumes.forEach(album => {
                albumes.push(album);
            });
        })
        .catch(error => {
            console.log('Ocurrió un error, ' + error);
        });
}

async function obtenerSencillas() {

    fetch('db.json')
        .then(respuesta => respuesta.json())
        .then(resultado => {
            resultado.sencillas.forEach(sencilla => {
                sencillas.push(sencilla);
            });

            cargarHome();
        })
        .catch(error => {
            console.log('Ocurrió un error, ' + error);
        });
}

function cargarHome() {

    limpiarHTML(contenidoPrincipal);

    // Sección álbumes
    const tituloSeccionAlbumes = document.createElement('h3');
    tituloSeccionAlbumes.classList.add('my-6', 'text-2xl', 'font-bold', 'md:my-10', 'md:text-3xl');
    tituloSeccionAlbumes.textContent = 'Descubre nuevos álbumes';

    const contenedorAlbumes = document.createElement('div');
    contenedorAlbumes.classList.add('grid', 'gap-4', 'gap-y-10', 'sm:grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4');

    contenidoPrincipal.appendChild(tituloSeccionAlbumes);
    contenidoPrincipal.appendChild(contenedorAlbumes);

    // 4 álbumes aleatorios
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

    albumesHome.forEach(album => {
        const { id, nombreAlbum, artista, rutaImagen } = album;

        const divAlbum = document.createElement('div');
        divAlbum.classList.add('bg-zinc-900', 'rounded-lg', 'overflow-hidden', 'w-4/5', 'justify-self-center', 'p-5', 'ease-in-out', 'duration-500', 'sm:w-full', 'md:cursor-pointer', 'md:hover:-translate-y-4', 'md:mx-0');
        divAlbum.setAttribute('id', id);

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

    // Sección canciones
    const tituloSeccionCanciones = document.createElement('h3');
    tituloSeccionCanciones.classList.add('my-6', 'text-2xl', 'font-bold', 'md:my-12', 'md:text-3xl');
    tituloSeccionCanciones.textContent = 'Canciones del momento';

    const contenedorCanciones = document.createElement('div');
    contenedorCanciones.classList.add('grid', 'gap-4', 'gap-y-10', 'sm:grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4');

    contenidoPrincipal.appendChild(tituloSeccionCanciones);
    contenidoPrincipal.appendChild(contenedorCanciones);

    // 4 álbumes aleatorios
    let cancionesHome = [];
    let nuevaCancion;

    // while (cancionesHome.length <= 3) {
    //     aleatorio = numeroAleatorio(1, 5);

    //     nuevoAlbum = canciones.find(album => album.id === aleatorio);

    //     if (cancionesHome.find(album => album.id === nuevoAlbum.id)) {
    //         continue;
    //     } else {
    //         cancionesHome = [...cancionesHome, nuevoAlbum];
    //     }
    // }

}


function numeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function limpiarHTML(elemento) {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}