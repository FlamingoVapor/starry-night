import { RainConfig } from "../../domain/Rain/RainConfig";
import { AtomService } from "../Atom/AtomService";

export class RainService {
  /**
   * @typedef IProps
   * @property {AtomService} atomService
   * @property {CanvasRenderingContext2D} context
   *
   * @param {IProps} props
   */
  constructor(props) {
    this.props = props;

    this.config = new RainConfig();
  }

  /**
   * Draws black rain onto the sky, giving the illusion
   * that stars and lights are going back off.
   */
  drawRain() {
    let rainX = 0;
    let rainY = 0;

    const { atomService, context } = this.props;
    const { height, width } = context.canvas;

    for (
      let dropIndex = 0;
      dropIndex < this.config.dropsPerUpdate;
      dropIndex++
    ) {
      context.lineWidth =
        this.config.minWidth +
        Math.floor(
          Math.random() * (this.config.maxWidth - this.config.minWidth)
        );

      rainX = Math.floor(Math.random() * width);
      rainY = Math.floor(Math.random() * height);

      context.strokeStyle = atomService.config.background;
      context.beginPath();
      context.moveTo(rainX, rainY);
      context.lineTo(rainX + 1, rainY + 1);
      context.stroke();
    }
  }
}
