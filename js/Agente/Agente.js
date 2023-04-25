import {Mapa} from '../Mapa.js';

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
        
        // conjunto de nodos por explorar (Se agrega el inicial)
        let nodosAbiertos = new Set([this.mapa.getInicial()]);
        const destino = this.mapa.getFinal();

        // conjunto de nodos ya explorados
        const cerrados = new Set();

        const movimientos = new Set();
        const ruta = new Set();
        let distancias = [];
        let sigCelda = {};
        let actual;
        
        debugger;
        // mientras hayan nodos por explorar
        while (nodosAbiertos.size > 0) {
            // encuentra el nodo con el costo f más bajo
            if(actual == null)
                for (const nodo of nodosAbiertos) {
                    if (!actual || nodosAbiertos.valor < actual.valor) {
                        actual = nodo;
                    }
                }
            else
                actual = nodosAbiertos.sigId;
            

            // si encontramos el nodo de destino, reconstruimos el camino
            if (actual === destino) {
                const camino = [actual];
                while (actual.padre) {
                    camino.push(actual.padre);
                    actual = actual.padre;
                }
                camino.reverse();
                return camino;
            }
            // for (let i = nodosAbiertos.length - 1; i >= 0; i--) {
                //     if (nodosAbiertos[i] === actual.key) {
                    //       nodosAbiertos.splice(i, 1);
                    //     }
                    //   }
                    
                    
            // mueve el nodo actual del conjunto de nodosAbiertos al conjunto de cerrados
            nodosAbiertos.delete(actual);
            cerrados.add(actual);

            // para cada nodo abierto
            
            // Sensar arriba    
            if(this.sensar(0) != undefined){                    
                nodosAbiertos.add(this.sensar(0));
                distancias.push(this.rellenarH(this.sensar(0), destino));
            }

            // Sensar derecha
            if(this.sensar(1) != undefined){                    
                nodosAbiertos.add(this.sensar(1));
                distancias.push(this.rellenarH(this.sensar(1), destino));
            }

            // Sensar abajo
            if(this.sensar(2) != undefined){                    
                nodosAbiertos.add(this.sensar(2));
                distancias.push(this.rellenarH(this.sensar(2), destino));
            }

            // Sensar izquierda
            if(this.sensar(3) != undefined){                    
                nodosAbiertos.add(this.sensar(3));
                distancias.push(this.rellenarH(this.sensar(3), destino));
            }
            
            sigCelda.key = this.obtenerMejorEvaluacion(nodosAbiertos, distancias);
            this.mapa.setActual(sigCelda.key[0]); 
        }
    }

    // Distancia de una celda a la final
    rellenarH(opcionDeCelda, celdaFinal){       
        let distancia;   
        distancia = this.mapa.getDistancia(opcionDeCelda, celdaFinal) + opcionDeCelda.costo;
        return distancia;       
        
    }
        
        // De los nodos sensados, se selcciona el nodo con menor valor en H
    obtenerMejorEvaluacion(nodos, h){
        
        // Comparar valores en nodos
        debugger;
        let counter;
        let menor = h[0];
        
        // for (const numero of nodos) {
        //     if (numero < menor) {
        //         menor = numero; // Actualiza el valor mínimo si el elemento actual es menor que el valor actual de 'min'
        //     }
        // }

        // for (const elemento of nodos) {
           
        // } 
        // 4,3,6,5
        for(counter = 0; counter < nodos.size+1; counter++){
            if(nodos.sigId == undefined){
                nodos.sigId = this.sensar(counter);
                nodos.movimiento = counter;
                nodos.valor = h[counter];
            
                if(h[counter] < nodos.valor){
                    nodos.sigId = this.sensar(counter);
                    nodos.valor = h[counter];
                    nodos.movimiento = counter;
                }
            }
        
        }

        return nodos;          
    }         
}