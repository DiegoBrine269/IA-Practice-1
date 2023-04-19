import { Celda } from "./Celda.js";


export class Mapa {
    constructor (colorAgente) {
        this.celdas = new Array();
        this.colorAgente = colorAgente;
    }

    // Crea una nueva celda y la agrega al mapa
    nuevaCelda(key, value){
        // TODO: Revisar si existe la key

        let c = new Celda(key, value)
        this.celdas.push(c);
        return c;
    }

    //Retorna el número de filas 
    numFilas(){
        let max = 0;
        this.celdas.forEach((item => {
            max = item.key[0] > max ? item.key[0] : max;
        }));
        return max;
    }

    //Retorna el número de columnas 
    numCols(){
        return this.numCeldas() / this.numFilas();
    }

    numCeldas() {
        return this.celdas.length;
    }

    // Asigna el atributo color a cada celda dado un valor
    setColor(value, color) {
        this.celdas.forEach((celda) => {
            if(celda.value === value){
                celda.setColor(color);
            }
        });
    }

    // Asigna el atributo significado a cada celda dado un valor
    setSignificado(value, significado) {
        this.celdas.forEach((celda) => {
            if(celda.value === value){
                celda.setSignificado(significado);
            }
        });
    }

    // Asigna el valor que le cuesta moverse a esta celda al agente
    setCosto (value, costo) {
        this.celdas.forEach((celda) => {            
            if(celda.value == value)
                celda.setCosto(costo);
            
        });
    } 

    // Ejecutar este método para obtener una celda en especial, la key debe ser por ejemplo: [1, 'B']
    celda (key) {
        return this.celdas.find(item => this.equalsCheck(item.key, key));
    }


    // Establece una celda como la actual
    setActual (key) {
        // debugger;
        this.celdas.forEach((celda) => {            
            celda.actual = false;

            if(this.equalsCheck(celda.key, key))
                celda.actual = true;
            
        });
    } 

    // Establece una celda como la inicial
    setInicial (key) {
        this.celdas.forEach((celda) => {            
            celda.setInicial(false);

            if(this.equalsCheck(celda.key, key))
                celda.setInicial(true);
            
        });
    } 

    // Establece una celda como la final
    setFinal (key) {
        this.celdas.forEach((celda) => {            
            celda.setFinal(false);

            if(this.equalsCheck(celda.key, key))
                celda.setFinal(true);
            
        });
    } 

    setVisitado (key) {
        this.celdas.forEach((celda) => {            
            if(this.equalsCheck(celda.key, key))
                celda.setVisitado(true);
            
        });
    } 

    setDecision (key) {
        this.celdas.forEach((celda) => {            
            if(this.equalsCheck(celda.key, key))
                celda.setDecision(true);
            
        });
    } 

    setInvisible (key) {
        this.celdas.forEach((celda) => {            
            if(this.equalsCheck(celda.key, key)){
                celda.setInvisible(true);
            }
            
        });
    } 

    // Obtiene la celda que está etiquetada como inicial
    getActual = () => this.celdas.find(celda => celda.actual === true);

    // Obtiene la celda que está etiquetada como inicial
    getInicial = () => this.celdas.find(celda => celda.inicial === true);

    // Obtiene la celda que está etiquetada como final
    getFinal = () => this.celdas.find(celda => celda.final === true);

    // Obtiene el conjunto de celdas que hayan sido visitadas
    getVisitadas = () => this.celdas.filter(celda => celda.visitada === true);


    // Compara dos arreglos
    equalsCheck = (a, b) => JSON.stringify(a) === JSON.stringify(b);   

    //Elimina todo el contenido del lienzo y redibuja en este básandose en la información guardada en los objetos
    dibujar(canvas) {
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        
        ctx.fillStyle = '#000000';
        ctx.font = "30px Arial";
        ctx.textAlign = "center";

        const numFilas = this.numFilas();
        const numCols = this.numCols();

        let tamano = 50;
        let mitad = tamano / 2;

        // Dibujando el perímetro vertical que indica el número de fila 
        for(let i=1; i<=numFilas; i++) {
            ctx.rect(0, tamano, tamano, tamano*i);
            ctx.fillText(i, 25, tamano*(i+1)-15 );
        };

        // Dibujando el perímetro horizontal que indica la letra de la columna 
        let letraColumna = 'A';
        for(let i=1; i<=numCols; i++) {
            ctx.rect(tamano, 0, tamano*i, tamano);
            ctx.fillText(letraColumna, tamano*(i+1)-25, 35 );
            letraColumna = String.fromCharCode(letraColumna.charCodeAt(0) + 1);
        };

        // Dibujando celda por celda
        this.celdas.map((celda) => {
            const numCol = celda.key[1].charCodeAt(0) - 64;
            const numFila = celda.key[0];
            ctx.fillStyle = celda.invisible === true ? '#000000' : celda.color;
            ctx.fillRect(tamano*numCol, tamano*numFila, tamano, tamano);
            ctx.font = "20px Arial";
            ctx.fillStyle = '#A8A8A8';

            if(celda.inicial)
                ctx.fillText("I", tamano*numCol+3, tamano*numFila+25);
            if(celda.final)
                ctx.fillText("F", tamano*numCol+10, tamano*numFila+25);
            if(celda.visitado)
                ctx.fillText("V", tamano*numCol+20, tamano*numFila+25);
            if(celda.actual){
                ctx.fillText("X", tamano*numCol+31, tamano*numFila+25);
                ctx.fillStyle = this.colorAgente;
                ctx.beginPath();
                ctx.arc(tamano*numCol+mitad, tamano*numFila+mitad, 10, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.fill();
            }
            if(celda.decision)
                ctx.fillText("O", tamano*numCol+44, tamano*numFila+25);
        });

        ctx.stroke();
    }

    invertHex(hex) {
        return (Number(hex) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase()
    }
}