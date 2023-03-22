import { Mapa } from "./Mapa.js";

let mapa;

// Esta función se ejecuta una vez el HTML esté cargado al 100%
document.addEventListener('DOMContentLoaded',  function () {
    let texto;
    
    //Lectura del archivo
    const fileSelector = document.querySelector('#file-selector');
    
    fileSelector.addEventListener('change', function (){
        const [file] = fileSelector.files;
        const reader = new FileReader();
    
        reader.addEventListener("load", () => {
            //Procesamiento del texto
            texto = reader.result;

            // Validación del texto
            if(!validarContenido(texto)) {
                alert('Error');
                return;
            }

            // Se instancia el mapa y se comienzan a guardar los datos
            mapa = new Mapa();

            //Lista de todos los números diferentes que se presenten en el archivo
            let listaNumeros = []; 

            // Key de la celda
            let numFila = 1;
            let letraColumna = 'A';

            // Separa en filas todo el archivo
            const filas = texto.split(/\r?\n/)
            
            // De cada fila, tomar los dígitos separados por coma
            for (const fila of filas) {
                const numeros = fila.split(/,/);
                
                //Cada número se va a guardar en una celda del mapa
                for(let numero of numeros) {
                    numero = numero.trim();
                    if(numero !== ''){
                        mapa.nuevaCelda([numFila, letraColumna], numero);
                        
                        //Siguiente letra
                        letraColumna = String.fromCharCode(letraColumna.charCodeAt(0) + 1);
                    
                        //Guardar en la lista de números
                        if (!listaNumeros.includes(numero)) {
                            listaNumeros.push(numero);
                        }
                    }
                }
                
                // console.log(mapa.celdas);
                letraColumna = 'A';
                numFila ++;
            }

            // Mostrar formulario para pedir la información del mapa
            mostrarFormInfo(listaNumeros);

        }, false);
    
        if (file) {
            reader.readAsText(file);
        }        
    });
}); 

// --- Declaración de funciones ---

//Valida el contenido del archivo
function validarContenido(texto) {
    const regEx = /^([0-9]*\s*,\s*)*$/;
    
    return regEx.test(texto);
}

function mostrarFormInfo(listaNumeros) {
    const form = document.querySelector('#form-info-celdas');
    form.classList.toggle('d-none');

    const listaValores = document.querySelector('#lista-valores');
    
    for(let valor of listaNumeros) {
        const tr = document.createElement('tr'); 
        const tdValor = document.createElement('td');
        tdValor.innerText = valor;

        const tdColor = document.createElement('td');
        const inputColor = document.createElement('input');
        inputColor.type = 'color';
        inputColor.name = 'color-' + valor;
        inputColor.required = 'true';
        tdColor.append(inputColor);

        const tdSignificado = document.createElement('td');
        const inputSignificado = document.createElement('input');
        inputSignificado.type = 'text';
        inputSignificado.name = 'significado-' + valor;
        // inputSignificado.required = 'true';
        tdSignificado.append(inputSignificado);

        tr.append(tdValor, tdColor, tdSignificado);
        listaValores.append(tr);
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitter = document.querySelector("input[value=Guardar]");
        const formData = new FormData(form, submitter);

        // Guardando los colores y significados de cada celda
        for (const [key, value] of formData) {

            // console.log(key, value);

            //color-1
            if(key.startsWith('color')){

                // console.log(value);
                mapa.asignarColor(key.charAt(key.length - 1), value);
                console.log(mapa.celdas);
            }

            // console.log(mapa.celdas);

            // console.log(key, value);
            // mapa.celda([1, 'B'])
        }
    });
}

//Elimina todo el contenido del lienzo y redibuja en este básandose en la información guardada en los objetos
function dibujar() {

}