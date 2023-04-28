import {Mapa} from '../Mapa.js';
import {Celda} from '../Celda.js';
export class Agente { 
    constructor(nombre, color, matrizCosto) {
        this.nombre = nombre;
        this.color = color;
        this.mapa = new Mapa(this.color);
        this.matrizCosto = matrizCosto;
        this.numMovimientos = 0;
        this.costoTotal = 0;
    }

    // dirección:
    // 0 - arriba
    // 1 - derecha
    // 2 - abajo
    // 3 - izquierda
    // Retorna la celda al sensar en x dirección, en caso de no haber camino posible en esa ddirección, retorna undefined
    sensar(direccion){
        
        const key = Object.assign([], this.mapa.getActual().key);
        let celda;
        
        switch(direccion) {
            case 0:
                if(key[0] === 1)
                    return undefined;

                key[0]--;
                celda = this.mapa.celda(key);
                
                // Agregando el costo según el tipo de terreno
                celda.costo = this.matrizCosto[celda.value];
                return celda;

            case 1:
                const ultimaLetra = 64 + this.mapa.numCols();
                if(key[1].charCodeAt(0) === ultimaLetra)
                    return undefined;

                key[1] = String.fromCharCode(key[1].charCodeAt(0) + 1);
                celda = this.mapa.celda(key);

                // Agregando el costo según el tipo de terreno
                celda.costo = this.matrizCosto[celda.value];
                return celda;

            case 2:
                if(key[0] === this.mapa.numFilas())
                    return undefined;

                key[0]++;
                celda = this.mapa.celda(key);

                // Agregando el costo según el tipo de terreno
                celda.costo = this.matrizCosto[celda.value];
                return celda;

            case 3:
                if(key[1].charCodeAt(0) <= 65)
                    return undefined;

                key[1] = String.fromCharCode(key[1].charCodeAt(0) - 1);
                celda = this.mapa.celda(key);

                // Agregando el costo según el tipo de terreno
                celda.costo = this.matrizCosto[celda.value];
                return celda;
        }

        this.numMovimientos++;
    }

    // dirección:
    // 0 - arriba
    // 1 - derecha
    // 2 - abajo
    // 3 - izquierda
    moverse(direccion){
        // Key después de efectuar el movimiento
        let key = Object.assign([], this.mapa.getActual().key);
        // Key antes de moverse
        const keyAnterior = Object.assign([], this.mapa.getActual().key);
        let celdaResultante;

        // Celda de decisión
        let opcionesDeCamino = 0;
        if(this.sensar(0) != undefined)
            opcionesDeCamino++;
        if(this.sensar(1) != undefined)
            opcionesDeCamino++;
        if(this.sensar(2) != undefined)
            opcionesDeCamino++;
        if(this.sensar(3) != undefined)
            opcionesDeCamino++;

        switch(direccion) {
            case 0:
                // Validando que exista un camino
                celdaResultante = this.sensar(0);
                if(celdaResultante === undefined || celdaResultante.costo === Infinity)
                    return;

                if(key[0]>1)
                    key[0]--;

                this.costoTotal += celdaResultante.costo;
                break;

            case 1:
                // Validando que exista un camino
                celdaResultante = this.sensar(1);
                if(celdaResultante === undefined || celdaResultante.costo === Infinity)
                    return;
            
                const ultimaLetra = 64 + this.mapa.numCols();
                if(key[1].charCodeAt(0) < ultimaLetra)
                    key[1] = String.fromCharCode(key[1].charCodeAt(0) + 1);

                this.costoTotal += celdaResultante.costo;
                break;

            case 2:
                // Validando que exista un camino
                celdaResultante = this.sensar(2);
                if(celdaResultante === undefined || celdaResultante.costo === Infinity)
                    return;

                if(key[0]<this.mapa.numFilas())
                    key[0]++;

                this.costoTotal += celdaResultante.costo;
                break;

            case 3:
                // Validando que exista un camino
                celdaResultante = this.sensar(3);
                if(celdaResultante === undefined || celdaResultante.costo === Infinity)
                    return;
        
                if(key[1].charCodeAt(0) > 65)
                    key[1] = String.fromCharCode(key[1].charCodeAt(0) - 1);

                this.costoTotal += celdaResultante.costo;
                break;
        }

        this.mapa.setVisitado(key);
        this.mapa.setActual(key);
        
        if(opcionesDeCamino > 1)
            this.mapa.setDecision(keyAnterior);

        this.numMovimientos++;
    }

    // Búsqueda A*
    estrella(){
        
        // Conjuntos de abiertos y cerrados
        let conjuntoAbiertos = [];
        let conjuntoCerrados = new Set();
        let camino = new Set();
        // Nodos
        let inicial = this.mapa.getInicial();
        let celdaActual = this.mapa.getActual();
        let celdaFinal = this.mapa.getFinal();
        let mejorCelda = celdaActual;

        
        // Insertar nodo inicial en conjunto de abiertos
        conjuntoAbiertos.push(inicial); 
        
        while(mejorCelda.key !== celdaFinal.key){
            
            for(let index=0; index<4; index++){
                // Revisar si no tiene hijos
                if(this.sensar(0) === undefined && this.sensar(1) === undefined && this.sensar(2) === undefined && this.sensar(3) === undefined){
                    conjuntoCerrados.add(this.mapa.getActual());
                    
                }else{
                    // Agregando hijos a conjunto de abiertos
                    if(this.sensar(index) === undefined)
                        continue;
                    else{
                        // Además, si la celda sensada pertenece al conjunto de cerrados, la omite
                        if(conjuntoCerrados.has(this.sensar(index)))
                            continue;
                        
                        conjuntoAbiertos.push(this.sensar(index));
                    }
                }
            } 

            // Eliminando celda actual del conunto abiertos
            const i = conjuntoAbiertos.findIndex(celda => celda.key === mejorCelda.key);
            if (i !== -1)
                conjuntoAbiertos.splice(i, 1);

            // Agregando distancia  y h, desde celda sensada a celda final
            conjuntoAbiertos.forEach((celda) => {
                celda.d = this.mapa.getDistancia(celda, celdaFinal);
                celda.h = this.obtenerCosto(celda.value) + celda.d;   
            });            
            
            // Cerrando el nodo actual
            conjuntoCerrados.add(this.mapa.getActual());

            // encontrar la celda con el menor costo heurístico en el conjunto de abiertos
            mejorCelda = conjuntoAbiertos.sort((a, b) => a.h - b.h)[0];
            camino.add(mejorCelda);

            this.mapa.setActual(mejorCelda.key);
        }

        // Agregando final a conjunto de cerrados y ruta
        conjuntoCerrados.add(mejorCelda);
        camino.add(mejorCelda);

        let rutaOptima = Array.from(camino).reverse();
        // let rutaOptima = this.obtenerRutaOptima(camino, celdaFinal);

        rutaOptima.forEach((celda) => console.log(celda.key));

    }

    obtenerCosto(value){
        let costo = this.matrizCosto[value];
        return costo;
    }    
    // -----------------------------------------------------------------------------------------------------
}


