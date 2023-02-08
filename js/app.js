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

    //cargarHome();
});

/*
 ***********************************************************
 *                                                         *
 *                        FUNCIONES                        *
 *                                                         *
 ***********************************************************
*/

function obtenerAlbumes() {
    fetch('db.json')
        .then(respuesta => respuesta.json())
        .then(resultado => {
            resultado.albumes.forEach(album => {
                albumes.push(album);
            });
        })
        .catch(error => {
            console.log('Hubo un error, ' + error);
        });
}

function obtenerSencillas() {
    fetch('db.json')
        .then(respuesta => respuesta.json())
        .then(resultado => {   
            resultado.sencillas.canciones.forEach(sencilla => {
                sencillas.push(sencilla);
            });
        })
        .catch(error => {
            console.log('Hubo un error, ' + error);
        });
    }

function cargarHome() {

    limpiarHTML(contenidoPrincipal);

    // Sección álbumes
    const tituloSeccionAlbumes = document.createElement('h3');
    tituloSeccionAlbumes.classList.add('my-6', 'text-2xl', 'font-bold', 'md:my-10', 'md:text-4xl');
    tituloSeccionAlbumes.textContent = 'Descubre nuevos álbumes';

    const contenedorAlbumes = document.createElement('div');
    contenedorAlbumes.classList.add('grid', 'gap-4', 'gap-y-10', 'sm:grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4');

    // Sección canciones


    // Agrupar elementos
    contenidoPrincipal.appendChild(tituloSeccionAlbumes);
    contenidoPrincipal.appendChild(contenedorAlbumes);
}

function limpiarHTML(elemento) {
    while(elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}