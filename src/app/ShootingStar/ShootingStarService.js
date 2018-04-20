import { BuildingService } from "../Building/BuildingService";
import { tileHeight } from "../Building/BuildingTiles";
import { Config } from "../Config/Config";
import { StateGeneral } from "../State/StateGeneral";
import { StateTiming } from "../State/StateTiming";

export class ShootingStarService {
  /**
   * @typedef IProps
   * @property {BuildingService} buildingService
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
   * Updates any shooting stars on the screen, for those watching very closely.
   */
  drawShootingStar() {
    const { config, stateGeneral, stateTiming } = this.props;

    let currentX = 0;
    let currentY = 0;
    const maxStarY =
      stateGeneral.canvasHeight -
      stateGeneral.canvasHeight *
        config.buildingHeightPercent /
        100 /
        tileHeight;
    let newX = 0;
    let newY = 0;

    //
    // If there is no shooting star now, count time until the decided period
    // has ended.
    //

    if (stateTiming.shootingStarActive === false) {
      //
      // If this causes the shooting star time to fire, set up the shooting
      // star.
      //

      if (stateTiming.shootingStarTime <= config.timerRateMs) {
        stateTiming.shootingStarTime = 0;
        stateTiming.shootingStarActive = true;

        //
        // The shooting star should start somewhere between the top of the
        // buildings and the top of the screen.
        //

        stateTiming.shootingStarStartX = Math.floor(
          Math.random() * stateGeneral.canvasWidth
        );
        stateTiming.shootingStarStartY = Math.floor(
          Math.pow(Math.random(), 2) * maxStarY
        );

        stateTiming.shootingStarDuration = Math.ceil(
          Math.random() * config.maxShootingStarDurationMs
        );

        stateTiming.shootingStarVelocityX =
          Math.random() * (2.0 * config.maxShootingStarSpeedX) -
          config.maxShootingStarSpeedX;

        stateTiming.shootingStarVelocityY =
          Math.random() *
            (config.maxShootingStarSpeedY - config.minShootingStarSpeedY) +
          config.minShootingStarSpeedY;

        //
        // No shooting star now, keep counting down.
        //
      } else {
        stateTiming.shootingStarTime -= config.timerRateMs;
        return;
      }
    }

    //
    // TODO: unbreak this code.
    //

    // stateGeneral.context.lineWidth = Math.ceil(
    //   maxShootingStarWidth *
    //   shootingStarTime /
    //   shootingStarDuration
    // )

    stateGeneral.context.lineWidth = config.maxShootingStarWidth;

    //
    // Draw the shooting star line from the current location to the next
    // location.
    //

    currentX =
      stateTiming.shootingStarStartX +
      Math.ceil(
        stateTiming.shootingStarTime * stateTiming.shootingStarVelocityX
      );

    currentY =
      stateTiming.shootingStarStartY +
      Math.ceil(
        stateTiming.shootingStarTime * stateTiming.shootingStarVelocityY
      );

    if (stateTiming.shootingStarTime < stateTiming.shootingStarDuration) {
      newX =
        currentX +
        Math.ceil(config.timerRateMs * stateTiming.shootingStarVelocityX);
      newY =
        currentY +
        Math.ceil(config.timerRateMs * stateTiming.shootingStarVelocityY);

      // If the shooting star is about to fall behind a building, cut it off;
      // otherwise, draw it.

      if (this.props.buildingService.getTopBuilding(newX, newY) !== -1) {
        stateTiming.shootingStarTime = stateTiming.shootingStarDuration;
      } else {
        stateGeneral.context.strokeStyle = config.shootingStarColor;
        stateGeneral.context.beginPath();
        stateGeneral.context.moveTo(currentX, currentY);
        stateGeneral.context.lineTo(newX, newY);
        stateGeneral.context.stroke();
      }
    }

    //
    // Draw background from the start to the current value.
    //

    stateGeneral.context.lineWidth = config.maxShootingStarWidth + 1;
    stateGeneral.context.strokeStyle = config.background;
    stateGeneral.context.beginPath();
    stateGeneral.context.moveTo(
      stateTiming.shootingStarStartX,
      stateTiming.shootingStarStartY
    );
    stateGeneral.context.lineTo(currentX, currentY);
    stateGeneral.context.stroke();

    if (stateTiming.shootingStarTime < stateTiming.shootingStarDuration) {
      //
      // If there is more time on the shooting star, just update time.
      //

      stateTiming.shootingStarTime += config.timerRateMs;
    } else {
      //
      // The shooting star is sadly over. Reset the counters and patiently
      // wait for the next one.
      //

      stateTiming.shootingStarActive = false;
      stateTiming.shootingStarTime = Math.ceil(
        Math.random() * config.maxShootingStarPeriodMs
      );
    }
  }
}
