import { Agente } from "./Agente.js";

export class PieGrande extends Agente{
    constructor(nombre, color){
        let matrizCosto = {
            '0' : 15,
            '1' : 4,
            '2' : Infinity,
            '3' : Infinity,
            '4' : 4,
        }
        super(nombre, color, matrizCosto);
    }
}