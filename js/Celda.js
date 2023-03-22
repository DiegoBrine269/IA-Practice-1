export class Celda {
    constructor(key, value) {
      this.key = key;
      this.value = value;
    }
    
    setColor (color) {
      this.color = color;
    }

    set significado (significado) {
      this.significado = significado;
    }
}