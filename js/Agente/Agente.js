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
}