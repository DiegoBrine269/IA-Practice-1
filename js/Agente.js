import { Mapa } from "./Mapa.js"

export class Agente { 
    constructor(nombre, color, matrizCosto, mapa) {
        this.nombre = nombre;
        this.mapa = mapa;
        this.color = color;
        this.matrizCosto = matrizCosto;
    }
}