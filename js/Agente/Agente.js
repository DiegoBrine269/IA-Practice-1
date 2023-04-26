import {Mapa} from '../Mapa.js';
import {Celda} from '../Celda.js';
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
    sensar(direccion){
        
        const key = Object.assign([], this.mapa.getActual().key);
        let celda;
        
        switch(direccion) {
            case 0:
                if(key[0] === 1)
                    return undefined;

                key[0]--;
                celda = this.mapa.celda(key);
                
                // Agregando el costo según el tipo de terreno
                celda.costo = this.matrizCosto[celda.value];
                return celda;

            case 1:
                const ultimaLetra = 64 + this.mapa.numCols();
                if(key[1].charCodeAt(0) === ultimaLetra)
                    return undefined;

                key[1] = String.fromCharCode(key[1].charCodeAt(0) + 1);
                celda = this.mapa.celda(key);

                // Agregando el costo según el tipo de terreno
                celda.costo = this.matrizCosto[celda.value];
                return celda;

            case 2:
                if(key[0] === this.mapa.numFilas())
                    return undefined;

                key[0]++;
                celda = this.mapa.celda(key);

                // Agregando el costo según el tipo de terreno
                celda.costo = this.matrizCosto[celda.value];
                return celda;

            case 3:
                if(key[1].charCodeAt(0) <= 65)
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
    moverse(direccion){
        // Key después de efectuar el movimiento
        let key = Object.assign([], this.mapa.getActual().key);
        // Key antes de moverse
        const keyAnterior = Object.assign([], this.mapa.getActual().key);
        let celdaResultante;

        // Celda de decisión
        let opcionesDeCamino = 0;
        if(this.sensar(0) != undefined)
            opcionesDeCamino++;
        if(this.sensar(1) != undefined)
            opcionesDeCamino++;
        if(this.sensar(2) != undefined)
            opcionesDeCamino++;
        if(this.sensar(3) != undefined)
            opcionesDeCamino++;

        switch(direccion) {
            case 0:
                // Validando que exista un camino
                celdaResultante = this.sensar(0);
                if(celdaResultante === undefined || celdaResultante.costo === Infinity)
                    return;

                if(key[0]>1)
                    key[0]--;

                this.costoTotal += celdaResultante.costo;
                break;

            case 1:
                // Validando que exista un camino
                celdaResultante = this.sensar(1);
                if(celdaResultante === undefined || celdaResultante.costo === Infinity)
                    return;
            
                const ultimaLetra = 64 + this.mapa.numCols();
                if(key[1].charCodeAt(0) < ultimaLetra)
                    key[1] = String.fromCharCode(key[1].charCodeAt(0) + 1);

                this.costoTotal += celdaResultante.costo;
                break;

            case 2:
                // Validando que exista un camino
                celdaResultante = this.sensar(2);
                if(celdaResultante === undefined || celdaResultante.costo === Infinity)
                    return;

                if(key[0]<this.mapa.numFilas())
                    key[0]++;

                this.costoTotal += celdaResultante.costo;
                break;

            case 3:
                // Validando que exista un camino
                celdaResultante = this.sensar(3);
                if(celdaResultante === undefined || celdaResultante.costo === Infinity)
                    return;
        
                if(key[1].charCodeAt(0) > 65)
                    key[1] = String.fromCharCode(key[1].charCodeAt(0) - 1);

                this.costoTotal += celdaResultante.costo;
                break;
        }

        this.mapa.setVisitado(key);
        this.mapa.setActual(key);
        
        if(opcionesDeCamino > 1)
            this.mapa.setDecision(keyAnterior);

        this.numMovimientos++;
    }
    // Búsqueda A*
    estrella(){
        this.moverA(this.mapa.getFinal());
    }
    
    moverA(objetivo) {
        // Obtenemos la celda actual y el costo hasta ella
     
        let actual = this.mapa.getActual();
        const costoActual = actual.value;
        const celdaFinal = this.mapa.getFinal();
        let evaluacion = [];
        // Creamos una copia de la lista de celdas y la utilizamos como lista de celdas no visitadas
        let mapa = this.mapa.celdas.slice();

        // Creamos una lista de celdas por visitar, inicialmente solo contiene la celda actual
        let nodosAbiertos = [actual];
        let ruta = [];
        // Creamos una lista de celdas ya visitadas, inicialmente vacía
        let nodosCerrados = new Set();
      
        // Creamos una lista de costos desde la celda inicial hasta cada celda, inicialmente solo contiene el costo actual
        let costoDesdeInicio = [costoActual];
      
        // Creamos una lista de costos estimados desde la celda actual hasta el objetivo
        let costoEstimado = [this.mapa.getDistancia(actual, celdaFinal)];
      
        // Mientras haya celdas por visitar
        while (evaluacion.key !== celdaFinal.key) {
          // Seleccionamos la celda con el costo estimado más bajo
        
            const indiceActual = costoEstimado.indexOf(Math.min(...costoEstimado));
            let celdaActual = nodosAbiertos[indiceActual];
            const costoActual = costoDesdeInicio[indiceActual];
            
            // Si hemos llegado al objetivo, terminamos la búsqueda
            if (actual.key[0] === celdaFinal.key[0] && actual.key[1] === celdaFinal.key[1]) {
                console.log("LLEGAMOSSSSSSS");
                return;
            }
            
            // Eliminamos la celda actual de las listas por visitar y de costos
            nodosAbiertos.splice(indiceActual, 1);
            costoDesdeInicio.splice(indiceActual, 1);
            costoEstimado.splice(indiceActual, 1);
         
            
            // Añadimos la celda actual a las celdas visitadas
            nodosCerrados.add(actual);
            // Eliminamos la celda actual de la lista de celdas no visitadas
            mapa = mapa.filter((celda) => celda.key[0] !== actual.key[0] || celda.key[1] !== actual.key[1]);
            
            // Para cada vecino de la celda actual
            let vecinos = this.obtenerAdyacentes(actual.key);
            for (let i = 0; i < vecinos.length; i++) {
                const vecino = vecinos[i];
                
                
                // Si el vecino ya fue visitado, lo ignoramos
                if (nodosCerrados.has((celda) => celda.key[0] === vecino[0] && celda.key[1] === vecino[1])) {
                continue;
                }
                // Calculamos el costo desde la celda inicial hasta el vecino
                
                evaluacion.h = parseInt(costoActual) + parseInt(this.mapa.celda(vecino.key).costo);
                
                // Recorre la copia del mapa y elimina celda actual 
                for (let i = 0; i < mapa.length; i++) {
                    if (mapa[i] === vecino) {
                        nodosAbiertos.push(mapa[i]);
                        ruta.push(mapa[i]);

                        if(ruta.length > 1){
                            debugger;
                            evaluacion = this.obtenerMejorH(ruta);
                            ruta.splice(i, 1);
                            this.mapa.setActual(evaluacion.key);
                            actual = evaluacion;
                            console.log(ruta.key);
                        }
                        mapa.splice(i, 1); // elimina el elemento en la posición i
                    }

                }   
            }
        }
    }

    
    obtenerAdyacentes(key) {
        
        this.key = key;
        let adyacentes = [];
      
        for(let counter = 0; counter < 4; counter++){            
            if(this.sensar(counter) === undefined)
                continue;
            else{
                // Agregar el adyacente a la lista de adyacentes
                adyacentes.movimiento = counter;
                adyacentes.push(this.sensar(counter));            
            }
        
        }
        
        return adyacentes;
    }

    obtenerMejorH(ruta){
        debugger;
        let menorH = ruta[0];
        menorH.h = menorH.costo + this.mapa.getDistancia(this.mapa.getActual(), this.mapa.getFinal());
        ruta.forEach(element => element.h = element.costo + this.mapa.getDistancia(this.mapa.getActual(), this.mapa.getFinal()));
        if(ruta.length !== 1){
            for (let i = 1; i < ruta.length; i++) {
                if (ruta[i].costo < menorH.costo) {
                    menorH = ruta[i];
                    menorH.h = menorH.costo + this.mapa.getDistancia(this.mapa,getActual(), this.mapa.getFinal());
                    
                }
            }
            return menorH;           
        }
    }
}


