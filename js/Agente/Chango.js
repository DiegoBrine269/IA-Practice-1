import { Agente } from "./Agente.js";

export class Chango extends Agente{
    constructor(nombre, color){
        let matrizCosto = {
            '0' : Infinity,
            '1' : 2,
            '2' : 4,
            '3' : 3,
            '4' : 1,
        }
        super(nombre, color, matrizCosto);
    }
}