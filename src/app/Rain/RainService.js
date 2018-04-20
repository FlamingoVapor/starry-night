import { Config } from "../Config/Config";
import { StateGeneral } from "../State/StateGeneral";

export class RainService {
  /**
   * @typedef IProps
   * @property {Config} config
   * @property {StateGeneral} stateGeneral
   *
   * @param {IProps} props
   */
  constructor(props) {
    this.props = props;
  }

  /**
   * Draws black rain onto the sky, giving the illusion
   * that stars and lights are going back off.
   */
  drawRain() {
    let rainX = 0;
    let rainY = 0;

    const { config, stateGeneral } = this.props;

    for (
      let dropIndex = 0;
      dropIndex < config.rainDropsPerUpdate;
      dropIndex++
    ) {
      stateGeneral.context.lineWidth =
        config.minRainWidth +
        Math.floor(Math.random() * (config.maxRainWidth - config.minRainWidth));

      rainX = Math.floor(Math.random() * stateGeneral.canvasWidth);
      rainY = Math.floor(Math.random() * stateGeneral.canvasHeight);

      stateGeneral.context.strokeStyle = config.background;
      stateGeneral.context.beginPath();
      stateGeneral.context.moveTo(rainX, rainY);
      stateGeneral.context.lineTo(rainX + 1, rainY + 1);
      stateGeneral.context.stroke();
    }
  }
}
