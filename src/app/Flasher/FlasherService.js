import { Flasher } from "../../domain/Flasher/Flasher";
import { FlasherConfig } from "../../domain/Flasher/FlasherConfig";
import { AtomService } from "../Atom/AtomService";

export class FlasherService {
  /**
   * @typedef IProps
   * @property {AtomService} atomService
   * @property {CanvasRenderingContext2D} context
   *
   * @param {IProps} props
   */
  constructor(props) {
    this.props = props;

    this.config = new FlasherConfig();

    this.flasher = new Flasher();
  }

  /**
   * Draw the flasher if enabled.
   */
  drawFlasher() {
    let blackOutFlasher = false;

    if (this.config.enabled === false) {
      this.flasher.on = false;
      return;
    }

    const { atomService, context } = this.props;

    this.flasher.time += atomService.config.timerRateMs;
    if (this.flasher.time >= this.config.periodMs) {
      this.flasher.time -= this.config.periodMs;
      if (this.flasher.on === false) {
        this.flasher.on = true;
      } else {
        this.flasher.on = false;
        blackOutFlasher = true;
      }
    }

    if (this.flasher.on !== false || blackOutFlasher !== false) {
      context.beginPath();
      context.arc(this.flasher.x, this.flasher.y, 3.5, 0, 2 * Math.PI, false);

      if (this.flasher.on === false) {
        context.fillStyle = this.config.color;
      } else {
        context.fillStyle = atomService.config.background;
      }

      context.fill();
    }
  }
}
