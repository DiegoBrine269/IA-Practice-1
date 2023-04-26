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
    }
    Anchura() {

        let inicial=this.mapa.getInicial();
        let cola=[];
        let padres=new Map();
        let visitados=new Set();
        cola.push(inicial);
        visitados.add(inicial);
        padres.set(inicial,null);

        while(cola.length>0){

            let x=cola.shift();
            visitados.add(x);
            this.moverA(x.key);
            let hijos=[];
            if(this.mapa.getActual()===this.mapa.getFinal()){
                console.log("Has encontrado el camino");
                break;
            }
            if(this.sensar(0)!==undefined&&!visitados.has(this.sensar(0))){
                hijos.push(this.moverA(this.sensar(0).key));
                this.moverA(x.key);
            }
            if(this.sensar(1)!==undefined&&!visitados.has(this.sensar(1))){
                hijos.push(this.moverA(this.sensar(1).key));
                this.moverA(x.key);
            }
            if(this.sensar(2)!==undefined&&!visitados.has(this.sensar(2))){

                hijos.push(this.moverA(this.sensar(2).key));
                this.moverA(x.key);
            }
            if(this.sensar(3)!==undefined&&!visitados.has(this.sensar(3))){
                hijos.push(this.moverA(this.sensar(3).key));
                this.moverA(x.key);
            }
            for (let j=0;j<hijos.length;j++){
                let hijo=hijos[j];
                cola.push(hijo);
                padres.set(hijo,x);

            }

        }
        debugger;
        let nodoAct=this.mapa.getFinal();
        let camino=[nodoAct];
        while (nodoAct!==this.mapa.getInicial()){

            nodoAct=padres.get(nodoAct);
            camino.unshift(nodoAct);
        }
        console.log("El camino es : ",camino);

    }
    Profundidad(){
        let inicial=this.mapa.getInicial();
        let cola=[];
        let padres=new Map();
        let visitados=new Set();
        cola.push(inicial);
        visitados.add(inicial);
        padres.set(inicial,null);

        while(cola.length>0){
            let x=cola.shift();
            visitados.add(x);
            this.moverA(x.key);
            if(this.mapa.getActual()===this.mapa.getFinal()){
                console.log("Has encontrado el camino");
                break;
            }
            else if(this.sensar(0)!==undefined&&!visitados.has(this.sensar(0))){
                cola.push(this.moverA(this.sensar(0).key));
                this.moverA(x.key);
            }
            else if(this.sensar(1)!==undefined&&!visitados.has(this.sensar(1))){
                cola.push(this.moverA(this.sensar(1).key));
                this.moverA(x.key);
            }
            else if(this.sensar(2)!==undefined&&!visitados.has(this.sensar(2))){
                cola.push(this.moverA(this.sensar(2).key));
                this.moverA(x.key);
            }
            else if(this.sensar(3)!==undefined&&!visitados.has(this.sensar(3))){
                cola.push(this.moverA(this.sensar(3).key));
                this.moverA(x.key);
            }
        }

    }

    moverA(celda){//Servira para dibujar el camino
        this.mapa.setActual(celda);
        let celdaResultante=this.mapa.getActual();
        this.mapa.dibujar(canvas);
        return celdaResultante;

    }
    moverseBusqueda(direccion){
        let celda;
//Usamos la función moverse, para que se pueda mover el agente sin necesidad de usar las flechas
        if (direccion===0){//Arriba
            this.moverse(0);
            this.mapa.dibujar(canvas);
            celda=this.mapa.getActual();
            return celda;
        }

        if (direccion===1){//Derecha
            this.moverse(1);
            this.mapa.dibujar(canvas);
            celda=this.mapa.getActual();
            return celda;
        }

        if (direccion===2){//Abajo
            this.moverse(2);
            this.mapa.dibujar(canvas);
            celda=this.mapa.getActual();
            return celda;
        }
        if (direccion===3){//Izquierda
            this.moverse(3);
            this.mapa.dibujar(canvas);
            celda=this.mapa.getActual();
            return celda;
        }
    }
    moverseproto2(direccion,celda){
        if (direccion===0){//Arriba
            this.moverse(0);
            this.mapa.dibujar(canvas);
            return celda;
        }

        if (direccion===1){//Derecha
            this.moverse(1);
            this.mapa.dibujar(canvas);
            return celda;
        }

        if (direccion===2){//Abajo
            this.moverse(2);
            this.mapa.dibujar(canvas);
            return celda;
        }
        if (direccion===3){//Izquierda
            this.moverse(3);
            this.mapa.dibujar(canvas);
            return celda;
        }
    }
    moverseProto(direccion,celda) {

        let celdaResultante;
        let filas=this.mapa.numFilas();
        let columnas=this.mapa.numCols();
        const ultimaLetra = 64 + columnas;

        switch (direccion) {
            case 0://Arriba
                celdaResultante=this.sensar(0);
                if ( celdaResultante === undefined || celdaResultante.costo === Infinity){
                    return undefined;
                }else{
                    if (celda[0]>1) {
                        celda[0]--;
                        return celda;
                    }
                }
                break;
            case 1://Derecha
                celdaResultante=this.sensar(1);
                if (celdaResultante===undefined||celdaResultante.costo===Infinity){
                    return undefined;
                }else{
                    if (celda[1].charCodeAt(0) < ultimaLetra) {
                        celda[1] = String.fromCharCode(celda[1].charCodeAt(0) + 1);
                    }
                    return celda;
                }

                break;
            case 2://Abajo
                celdaResultante=this.sensar(2);
                if (celdaResultante===undefined||celdaResultante.costo===Infinity){
                    return undefined;
                }else{
                    if (celda[0]<filas) {
                       celda[0]++;
                    }
                    return celda;
                }
                break;
            case 3://Izquierda
                celdaResultante=this.sensar(3);
                if (celdaResultante===undefined||celdaResultante.costo===Infinity) {
                    return undefined;
                }else {
                    if (celda[1].charCodeAt(0) > 65) {
                       celda[1] = String.fromCharCode(celda[1].charCodeAt(0) - 1);
                    }
                    return celda;
                }


                break;
        }
    }

}