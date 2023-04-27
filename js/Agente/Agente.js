import {Mapa} from '../Mapa.js';
let canvas = document.querySelector('#lienzo');
canvas.width = window.innerWidth;
let heightRatio = 1.5;
canvas.height = canvas.width * heightRatio;

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
    sensar(direccion) {
        const key = Object.assign([], this.mapa.getActual().key);
        let celda;

        switch (direccion) {
            case 0:
                if (key[0] === 1)
                    return undefined;

                key[0]--;
                celda = this.mapa.celda(key);

                // Agregando el costo según el tipo de terreno
                celda.costo = this.matrizCosto[celda.value];
                return celda;

            case 1:
                const ultimaLetra = 64 + this.mapa.numCols();
                if (key[1].charCodeAt(0) === ultimaLetra)
                    return undefined;

                key[1] = String.fromCharCode(key[1].charCodeAt(0) + 1);
                celda = this.mapa.celda(key);

                // Agregando el costo según el tipo de terreno
                celda.costo = this.matrizCosto[celda.value];
                return celda;

            case 2:
                if (key[0] === this.mapa.numFilas())
                    return undefined;

                key[0]++;
                celda = this.mapa.celda(key);

                // Agregando el costo según el tipo de terreno
                celda.costo = this.matrizCosto[celda.value];
                return celda;

            case 3:
                if (key[1].charCodeAt(0) <= 65)
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
    moverse(direccion) {
        // Key después de efectuar el movimiento
        let key = Object.assign([], this.mapa.getActual().key);
        // Key antes de moverse
        const keyAnterior = Object.assign([], this.mapa.getActual().key);
        let celdaResultante;
        let celda;
        // Celda de decisión
        let opcionesDeCamino = 0;
        if (this.sensar(0) !== undefined)
            opcionesDeCamino++;
        if (this.sensar(1) !== undefined)
            opcionesDeCamino++;
        if (this.sensar(2) !== undefined)
            opcionesDeCamino++;
        if (this.sensar(3) !== undefined)
            opcionesDeCamino++;


        switch (direccion) {
            case 0:
                // Validando que exista un camino
                celdaResultante = this.sensar(0);
                if (celdaResultante === undefined || celdaResultante.costo === Infinity)
                    return;

                if (key[0] > 1)
                    key[0]--;

                this.costoTotal += celdaResultante.costo;

                break;

            case 1:
                // Validando que exista un camino
                celdaResultante = this.sensar(1);
                if (celdaResultante === undefined || celdaResultante.costo === Infinity)
                    return;

                const ultimaLetra = 64 + this.mapa.numCols();
                if (key[1].charCodeAt(0) < ultimaLetra)
                    key[1] = String.fromCharCode(key[1].charCodeAt(0) + 1);

                this.costoTotal += celdaResultante.costo;
                break;

            case 2:
                // Validando que exista un camino
                celdaResultante = this.sensar(2);
                if (celdaResultante === undefined || celdaResultante.costo === Infinity)
                    return;

                if (key[0] < this.mapa.numFilas())
                    key[0]++;

                this.costoTotal += celdaResultante.costo;
                break;

            case 3:
                // Validando que exista un camino
                celdaResultante = this.sensar(3);
                if (celdaResultante === undefined || celdaResultante.costo === Infinity)
                    return;

                if (key[1].charCodeAt(0) > 65)
                    key[1] = String.fromCharCode(key[1].charCodeAt(0) - 1);

                this.costoTotal += celdaResultante.costo;
                break;
        }

        this.mapa.setVisitado(key);
        this.mapa.setActual(key);

        // Añadiendo visibilidad a las celdas adyacentes
        const celdasAdyacentes = [this.sensar(0), this.sensar(1), this.sensar(2), this.sensar(3)];
        celdasAdyacentes.forEach(celda => {
            if (celda !== undefined)
                celda.invisible = false;
        });

        if (opcionesDeCamino > 1)
            this.mapa.setDecision(keyAnterior);

        this.numMovimientos++;
        this.mapa.dibujar();
    }

    Anchura() {

        let inicial = this.mapa.getInicial();
        let cola = [];
        let padres = new Map();
        let visitados = new Set();
        cola.push(inicial);
        visitados.add(inicial);

        while (cola.length > 0) {

            let x = cola.shift();
            visitados.add(x);
            this.moverA(x.key);
            let hijos = [];

            if (this.mapa.getActual() === this.mapa.getFinal()) {
                console.log("Has encontrado el camino");
                break;
            }
            if (this.sensar(0) !== undefined && !visitados.has(this.sensar(0))) {
                hijos.push(this.moverA(this.sensar(0).key));
                this.moverA(x.key);

            }
            if (this.sensar(1) !== undefined && !visitados.has(this.sensar(1))) {
                hijos.push(this.moverA(this.sensar(1).key));
                this.moverA(x.key);
            }
            if (this.sensar(2) !== undefined && !visitados.has(this.sensar(2))) {

                hijos.push(this.moverA(this.sensar(2).key));
                this.moverA(x.key);
            }
            if (this.sensar(3) !== undefined && !visitados.has(this.sensar(3))) {
                hijos.push(this.moverA(this.sensar(3).key));
                this.moverA(x.key);
            }
            for (let j = 0; j < hijos.length; j++) {
                let hijo = hijos[j];
                cola.push(hijo);
                padres.set(hijo, x);

            }
        }

        let nodoAct = this.mapa.getFinal();
        let camino = [nodoAct];
        while (nodoAct !== this.mapa.getInicial()) {

            nodoAct = padres.get(nodoAct);
            camino.unshift(nodoAct);
        }
        console.log("El camino es : ", camino);

        this.moverA(inicial.key);
        this.movimientoAutomatico(camino);
        /*
                camino.forEach(function(celda) {
                    let direccion;
                    //Esta en diferente fila
                    if (celda.key[0]!==this.mapa.getActual()[0]){

                    }
                    //Esta en diferente columna
                    else if(celda.key[1]!==this.mapa.getActual()[1]){

                    }
                })*/
    }



    Profundidad() {
        let inicial = this.mapa.getInicial();
        let pila = [];
        let padres = new Map();
        let visitados = new Set();
        pila.push(inicial);
        visitados.add(inicial);
        padres.set(inicial, null);

        while (pila.length > 0) {
debugger;
            let x = pila.shift();

            let hijos = [];

            if (this.mapa.getActual() === this.mapa.getFinal()) {
                console.log("Has encontrado el camino");
                break;
            }
            if (this.sensar(0) !== undefined && !visitados.has(this.sensar(0))) {
                hijos.push(this.moverA(this.sensar(0).key));

            } else if (this.sensar(1) !== undefined && !visitados.has(this.sensar(1))) {
                hijos.push(this.moverA(this.sensar(1).key));

            } else if (this.sensar(2) !== undefined && !visitados.has(this.sensar(2))) {
                hijos.push(this.moverA(this.sensar(2).key));

            } else if (this.sensar(3) !== undefined && !visitados.has(this.sensar(3))) {
                hijos.push(this.moverA(this.sensar(3).key));

            }
            for (let j = 0; j < hijos.length; j++) {
                let hijo = hijos[j];
                pila.push(hijo);
                visitados.add(hijo);
                padres.set(hijo, x);
            }
        }
        let nodoX = this.mapa.getFinal();
        let camino = [nodoX];
        while (nodoX !== this.mapa.getInicial()) {

            nodoX = padres.get(nodoX);
            camino.unshift(nodoX);
        }
        console.log("El camino es : ", camino);
        this.moverA(inicial.key);

    }

    moverA(celda) {//Servira para dibujar el camino
        this.mapa.setActual(celda);
        let celdaResultante = this.mapa.getActual();
        this.mapa.dibujar(canvas);
        return celdaResultante;

    }

    movimientoAutomatico(camino) {
        let keyCeldaActualTemp = this.mapa.getActual().key;
        let direcciones = [];

        camino.forEach(function (celda) {
            const keyCeldaSiguiente = celda.key;

            let direccion;
            //Está en diferente fila
            if (keyCeldaActualTemp[0] !== keyCeldaSiguiente[0])
                direccion = keyCeldaSiguiente[0] > keyCeldaActualTemp[0] ? 2 : 0;

            //Está en diferente columna
            else if (keyCeldaActualTemp[1] !== keyCeldaSiguiente[1])
                direccion = keyCeldaSiguiente[1].charCodeAt(0) > keyCeldaActualTemp[1].charCodeAt(0) ? 1 : 3;

            keyCeldaActualTemp = keyCeldaSiguiente;

            direcciones.push(direccion);
        });

        direcciones.forEach(function (direccion, index) {
            let self=this;
            setTimeout(self.moverse(direccion), index * 500);
        });

    }
}
