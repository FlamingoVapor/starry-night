import { Building } from "../../domain/Building/Building";

export class StateGeneral {
  /**
   * @param {CanvasRenderingContext2D} context
   */
  constructor(context) {
    this.building = [new Building()];
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.context = context;
    this.flasherX = 0;
    this.flasherY = 0;
    this.stop = true;
  }
}
