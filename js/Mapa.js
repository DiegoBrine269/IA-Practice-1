import { Celda } from "./Celda.js";

export class Mapa {
    constructor () {
        // super();
        this.celdas = [];
    }

    nuevaCelda(key, value){
        let c = new Celda(key, value)
        this.celdas.push(c);
        return c;
    }

    asignarColor(value, color) {
        this.celdas.forEach((celda) => {
            if(celda.value === value){
                celda.setColor(color);
            }
        });
    }

    asignarSignificado(value, significado) {
        this.celdas.forEach((celda) => {
            if(celda.value === value){
                celda.setSignificado(significado);
            }
        });
    }

    // Ejecutar este método para obtener una celda en especial, la key debe ser por ejemplo: [1, 'B']
    celda (key) {
        return this.celdas.find(item => this.equalsCheck(item.key, key));
    }

    // Compara dos arreglos
    equalsCheck = (a, b) => JSON.stringify(a) === JSON.stringify(b);
}