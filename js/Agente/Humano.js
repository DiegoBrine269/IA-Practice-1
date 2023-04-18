import { Agente } from "./Agente.js";

export class Humano extends Agente{
    constructor(nombre, color){
        let matrizCosto = {
            '0' : Infinity,
            '1' : 1,
            '2' : 2,
            '3' : 3,
            '4' : 4,
        }
        super(nombre, color, matrizCosto);
    }
}