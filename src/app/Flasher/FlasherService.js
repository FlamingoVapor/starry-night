import { Config } from "../Config/Config";
import { StateGeneral } from "../State/StateGeneral";
import { StateTiming } from "../State/StateTiming";

export class FlasherService {
  /**
   * @typedef IProps
   * @property {Config} config
   * @property {StateGeneral} stateGeneral
   * @property {StateTiming} stateTiming
   *
   * @param {IProps} props
   */
  constructor(props) {
    this.props = props;
  }

  /**
   * Draw the flasher if enabled.
   */
  drawFlasher() {
    let blackOutFlasher = false;

    const { config, stateGeneral, stateTiming } = this.props;

    if (config.flasherEnabled === false) {
      stateTiming.flasherOn = false;
      return;
    }

    stateTiming.flasherTime += config.timerRateMs;
    if (stateTiming.flasherTime >= config.flasherPeriodMs) {
      stateTiming.flasherTime -= config.flasherPeriodMs;
      if (stateTiming.flasherOn === false) {
        stateTiming.flasherOn = true;
      } else {
        stateTiming.flasherOn = false;
        blackOutFlasher = true;
      }
    }

    if (stateTiming.flasherOn !== false || blackOutFlasher !== false) {
      stateGeneral.context.beginPath();
      stateGeneral.context.arc(
        stateGeneral.flasherX,
        stateGeneral.flasherY,
        3.5,
        0,
        2 * Math.PI,
        false
      );

      if (stateTiming.flasherOn === false) {
        stateGeneral.context.fillStyle = config.flasherColor;
      } else {
        stateGeneral.context.fillStyle = config.background;
      }

      stateGeneral.context.fill();
    }
  }
}
