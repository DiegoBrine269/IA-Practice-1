export class Celda {

    constructor(key, value) {
      this.key = key;
      this.value = value;
    }
    
    setColor (color) {
      this.color = color;
      return this;
    }
    
    setSignificado (significado) {
      this.significado = significado;
      return this;
    }

    setCosto (costo) {
      this.costo = costo;
      return this;
    }

    setInicial (inicial = false) {
      this.inicial = inicial;
      return this;
    }

    setFinal (final = false) {
      this.final = final;
      return this;
    }

    setVisitado (visitado) {
      this.visitado = visitado;
      return this;
    }

    setActual (actual) {
      this.actual = actual;
      return this;
    }
    
    setDecision (decision) {
      this.decision = decision;
      return this;
    }

    setInvisible (invisible) {
      this.invisible = invisible;
      return this;
    }


    getFinal () {
      return this.final;
    }

    getVisitado () {
      return this.visitado;
    }

    getActual () {
      return this.actual;
    }

}