import { ShootingStar } from "../../domain/ShootingStar/ShootingStar";
import { ShootingStarConfig } from "../../domain/ShootingStar/ShootingStarConfig";
import { AtomService } from "../Atom/AtomService";
import { BuildingService } from "../Building/BuildingService";
import { tileHeight } from "../Building/BuildingTiles";

export class ShootingStarService {
  /**
   * @typedef IProps
   * @property {AtomService} atomService
   * @property {BuildingService} buildingService
   * @property {CanvasRenderingContext2D} context
   *
   * @param {IProps} props
   */
  constructor(props) {
    this.props = props;

    this.config = new ShootingStarConfig();

    this.shootingStar = new ShootingStar();
  }

  /**
   * Updates any shooting stars on the screen, for those watching very closely.
   */
  drawShootingStar() {
    const { atomService, buildingService, context } = this.props;
    const { height, width } = context.canvas;

    let currentX = 0;
    let currentY = 0;
    const maxStarY =
      height - height * buildingService.config.heightPercent / 100 / tileHeight;
    let newX = 0;
    let newY = 0;

    //
    // If there is no shooting star now, count time until the decided period
    // has ended.
    //

    if (this.shootingStar.active === false) {
      //
      // If this causes the shooting star time to fire, set up the shooting
      // star.
      //

      if (this.shootingStar.time <= atomService.config.timerRateMs) {
        this.shootingStar.time = 0;
        this.shootingStar.active = true;

        //
        // The shooting star should start somewhere between the top of the
        // buildings and the top of the screen.
        //

        this.shootingStar.startX = Math.floor(Math.random() * width);
        this.shootingStar.startY = Math.floor(
          Math.pow(Math.random(), 2) * maxStarY
        );

        this.shootingStar.duration = Math.ceil(
          Math.random() * this.config.maxDurationMs
        );

        this.shootingStar.velocityX =
          Math.random() * (2.0 * this.config.maxSpeedX) - this.config.maxSpeedX;

        this.shootingStar.velocityY =
          Math.random() * (this.config.maxSpeedY - this.config.minSpeedY) +
          this.config.minSpeedY;

        //
        // No shooting star now, keep counting down.
        //
      } else {
        this.shootingStar.time -= atomService.config.timerRateMs;
        return;
      }
    }

    //
    // TODO: unbreak this code.
    //

    // context.lineWidth = Math.ceil(
    //   this.config.maxWidth *
    //   this.shootingStar.time /
    //   this.shootingStar.duration
    // )

    context.lineWidth = this.config.maxWidth;

    //
    // Draw the shooting star line from the current location to the next
    // location.
    //

    currentX =
      this.shootingStar.startX +
      Math.ceil(this.shootingStar.time * this.shootingStar.velocityX);

    currentY =
      this.shootingStar.startY +
      Math.ceil(this.shootingStar.time * this.shootingStar.velocityY);

    if (this.shootingStar.time < this.shootingStar.duration) {
      newX =
        currentX +
        Math.ceil(atomService.config.timerRateMs * this.shootingStar.velocityX);
      newY =
        currentY +
        Math.ceil(atomService.config.timerRateMs * this.shootingStar.velocityY);

      // If the shooting star is about to fall behind a building, cut it off;
      // otherwise, draw it.

      if (this.props.buildingService.getTopBuilding(newX, newY) !== -1) {
        this.shootingStar.time = this.shootingStar.duration;
      } else {
        context.strokeStyle = this.config.color;
        context.beginPath();
        context.moveTo(currentX, currentY);
        context.lineTo(newX, newY);
        context.stroke();
      }
    }

    //
    // Draw background from the start to the current value.
    //

    context.lineWidth = this.config.maxWidth + 1;
    context.strokeStyle = atomService.config.background;
    context.beginPath();
    context.moveTo(this.shootingStar.startX, this.shootingStar.startY);
    context.lineTo(currentX, currentY);
    context.stroke();

    if (this.shootingStar.time < this.shootingStar.duration) {
      //
      // If there is more time on the shooting star, just update time.
      //

      this.shootingStar.time += atomService.config.timerRateMs;
    } else {
      //
      // The shooting star is sadly over. Reset the counters and patiently
      // wait for the next one.
      //

      this.shootingStar.active = false;
      this.shootingStar.time = Math.ceil(
        Math.random() * this.config.maxPeriodMs
      );
    }
  }
}
