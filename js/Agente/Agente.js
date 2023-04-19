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

        let ruta = []; // [[4,F], [5,G], [6,G]]
        let movimientos = []; // [0, 1, 1, 1, 2, 3, 0]
       
        let nodosAbiertos = [];
        let nodosCerrados = [];
        let nodoActual = this.mapa.getActual();
        const celdaFinal = this.mapa.getFinal();
        
        
        // Obteniendo la celda final, inicial y actual de la clase mapa
        /*
            nodo = {
                ID: 12H
                D(A, M) = 4
                C = 2
                h = D + c
            }

        */
        const nodoFinal= {
                id : this.mapa.getFinal().key, // [4, 'F']
                // d  : this.mapa.getDistancia(celdaActual, celdaFinal),
                // c  : 0
        }
        // nodoFinal.h = d + c;

        const nodoInicial = {
            id : this.mapa.getFinal().key, // [4, 'F']
            d  : this.mapa.getDistancia(celdaActual, celdaFinal),
            c  : 0
        }
        nodoInicial.h = d + c;    


        nodosAbiertos.push(nodoInicial);
        // Sensar en sentido de las manecillas del reloj 
        while(celdaActual =! celdaFinal){
            //Arriba
            if(Agente.sensar(0) != undefined){
                nodosAbiertos.push(Agente.sensar(0)); 

            }
            // Derecha
            if(Agente.sensar(1) != undefined){
                nodosAbiertos.push(Agente.sensar(1));
            }
            // Abajo
            
            if(Agente.sensar(0) != undefined){
                nodosAbiertos.push(Agente.sensar(2)); 

            }
            // Izquierda
            if(Agente.sensar(0) != undefined){
                nodosAbiertos.push(Agente.sensar(3));

            }
            celdaActual = selectLowestH(nodosAbiertos, celdaActual, celdaFinal);

        }

        // Ya encontramos la ruta, ahora a mover al mono
        /*
            movimientos.foreach(direccion => {
                setTimeout(() => {
                    this.mover(direccion);
                }, 1000);
            });
        */
       
    }

    // De los nodos abiertos, se selcciona la celda el nodo con menor valor en H
    selectLowestH(abiertos, celdaActual, nodoFinal){
        let h = [];
        let auxH = [];

        let menorH = {
            nodoPadre: celdaActual.key,
            id : undefined,
            numero : undefined, 
            mov : undefined,
            h : undefined,
            c : undefined
        }
        // Guardando distancias en auxH
        distancia = getDistancia(abiertos, nodoFinal);
        abiertos.forEach(distancia => auxH.push(distancia));
        
        // Comparar distancias en auxH para sacar la menor junto a su movimiento (0, 1, 2, 3)
        menorH.numero = auxH[0];

        for(i = 0; i < auxH.length; i++ ){
            if(auxH[i] < menor){                
                menorH.numero = aux[i];
                menorH.mov = i;
                menorH.id = abiertos.key[i];
            
            }
        }       

        return menorH;        

    }


}
