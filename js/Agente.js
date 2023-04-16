import {Mapa} from './Mapa.js';

export class Agente { 
    constructor(nombre, color, matrizCosto) {
        this.nombre = nombre;
        this.color = color;
        this.mapa = new Mapa(this.color);
        this.matrizCosto = matrizCosto;
    }

    // dirección:
    // 0 - arriba
    // 1 - derecha
    // 2 - abajo
    // 3 - izquierda
    sensar(direccion){
        switch(direccion) {
            case 0:
                const key = this.mapa.getActual().key;
                key[0] --;
                console.log(key);
                // return this.mapa.celda([]);
                break;
        }
    }

    // dirección:
    // 0 - arriba
    // 1 - derecha
    // 2 - abajo
    // 3 - izquierda
    moverse(direccion){
        const key = this.mapa.getActual().key;
        switch(direccion) {
            case 0:
                if(key[0]>1)
                    key[0]--;
                this.mapa.setActual(key);
                break;

            case 2:
                if(key[0]<this.mapa.numFilas)
                    key[0]++;
                this.mapa.setActual(key);
                break;
        }
    }
}