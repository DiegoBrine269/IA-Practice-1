import {Agente} from './Agente.js'
import {Mapa} from './Mapa.js'


export class Nodo{

    constructor(celda1, celda2) {
        this.celda1 = celda1;
        this.celda2 = celda2;
        this.c = 0;
        this.h = 0;
        this.padre = null;
        this.movimiento = null;
    }

}

