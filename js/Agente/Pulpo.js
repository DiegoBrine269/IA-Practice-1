import { Agente } from "./Agente.js";

export class Pulpo extends Agente{
    constructor(nombre, color){
        let matrizCosto = {
            '0' : Infinity,
            '1' : 2,
            '2' : 1,
            '3' : Infinity,
            '4' : 3,
        }
        super(nombre, color, matrizCosto);
    }
}