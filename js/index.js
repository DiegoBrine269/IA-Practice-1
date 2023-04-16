import { Mapa } from "./Mapa.js";

let mapa;

let canvas = document.querySelector('#lienzo');
canvas.width = window.innerWidth;
let heightRatio = 1.5;
canvas.height = canvas.width * heightRatio;

// Esta función se ejecuta una vez el HTML esté cargado al 100%
document.addEventListener('DOMContentLoaded', index()); 

//Función principal
function index () {
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
            const filas = texto.split(/\r?\n/);
            
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
}

// --- Declaración de funciones ---

// Valida el contenido del archivo
function validarContenido(texto) {
    const regEx = /^([0-9]*\s*,\s*)*$/;
    
    return regEx.test(texto);
}

// Muestra el formulario para pedir los datos de las celdas
function mostrarFormInfo(listaNumeros) {
    const form = document.querySelector('#form-info-celdas');
    form.classList.toggle('d-none');

    const listaValores = document.querySelector('#lista-valores');
    
    // DOM Scripting
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
            //Cambia el atributo color de todas las celdas que tengan el mismo valor
            if(key.startsWith('color'))
                mapa.asignarColor(key.charAt(key.length - 1), value);

            //Cambia el atributo descripción de todas las celdas que tengan el mismo valor
            else if(key.startsWith('significado'))
                mapa.asignarSignificado(key.charAt(key.length - 1), value);
        }

        form.classList.toggle('d-none');

        
        mostrarFormDetalles();
        
    });
    

    // Muestra el form para pedir la celda inicial, la celda final
    function mostrarFormDetalles() {
        const form = document.querySelector('#form-detalles');
        form.classList.toggle('d-none');
        
        const selectCeldaInicial = document.querySelector('#celda-inicial');
        const selectCeldaFinal = document.querySelector('#celda-final');

        llenarSelect(selectCeldaInicial);
        llenarSelect(selectCeldaFinal);

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const keyInicial = [parseInt(selectCeldaInicial.value[0]), selectCeldaInicial.value[1]];
            const keyFinal = [parseInt(selectCeldaFinal.value[0]), selectCeldaFinal.value[1]];
            
            console.log(keyInicial, keyFinal);

            mapa.setInicial(keyInicial);
            mapa.setFinal(keyFinal);
            
            form.classList.toggle('d-none');

            let ctx = canvas.getContext("2d");
            mapa.dibujar(ctx);

            mostrarFormOcultarCelda();
        })
    }

    function mostrarFormOcultarCelda (){
        const form = document.querySelector('#form-esconder-celda');
        form.classList.toggle('d-none');

        const selectCeldaOcultar = document.querySelector('#celda-a-ocultar');

        llenarSelect(selectCeldaOcultar);

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const key = [parseInt(selectCeldaOcultar.value[0]), selectCeldaOcultar.value[1]];

            mapa.setInvisible(key);
            let ctx = canvas.getContext("2d");
            mapa.dibujar(ctx);
        })

    }


    // Lllena un select con todos las keys de celda
    function llenarSelect(select) {
        mapa.celdas.map((celda) => {
            console.log(celda.key);
    
            const key = celda.key[0] + celda.key[1];
    
            const option1 = document.createElement('option');
            option1.value = key;
            option1.innerText = key;
            
            select.append(option1);
        });

    }
}