import { BuildingService } from "../Building/BuildingService";
import { Config } from "../Config/Config";
import { StateGeneral } from "../State/StateGeneral";

export class StarService {
  /**
   * @typedef IProps
   * @property {BuildingService} buildingService
   * @property {Config} config
   * @property {StateGeneral} stateGeneral
   *
   * @param {IProps} props
   */
  constructor(props) {
    this.props = props;
  }

  drawStars() {
    const { buildingService, config, stateGeneral } = this.props;
    let starX = 0;
    let starY = 0;

    //
    // Randomly sprinkle a certain number of stars on the screen.
    //

    for (let starIndex = 0; starIndex < config.starsPerUpdate; starIndex++) {
      starX = Math.floor(Math.random() * stateGeneral.canvasWidth);

      //
      // Squaring the Y coordinate puts more stars at the top
      // and gives it a more realistic (and less static-ish) view.
      //

      starY = Math.floor(
        Math.pow(Math.random(), 2) * stateGeneral.canvasHeight
      );

      if (buildingService.getTopBuilding(starX, starY) !== -1) {
        continue;
      }

      const r = Math.floor(Math.random() * 180);
      const g = Math.floor(Math.random() * 180);
      const b = Math.floor(Math.random() * 256);

      stateGeneral.context.fillStyle = "rgb(" + r + ", " + g + ", " + b + ")";
      stateGeneral.context.fillRect(starX, starY, 1, 1);
    }
  }
}
