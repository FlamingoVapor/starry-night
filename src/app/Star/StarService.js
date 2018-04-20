import { StarConfig } from "../../domain/Star/StarConfig";
import { BuildingService } from "../Building/BuildingService";

export class StarService {
  /**
   * @typedef IProps
   * @property {BuildingService} buildingService
   * @property {CanvasRenderingContext2D} context
   *
   * @param {IProps} props
   */
  constructor(props) {
    this.props = props;

    this.config = new StarConfig();
  }

  drawStars() {
    const { buildingService, context } = this.props;
    let starX = 0;
    let starY = 0;

    //
    // Randomly sprinkle a certain number of stars on the screen.
    //

    for (
      let starIndex = 0;
      starIndex < this.config.starsPerUpdate;
      starIndex++
    ) {
      starX = Math.floor(Math.random() * context.canvas.width);

      //
      // Squaring the Y coordinate puts more stars at the top
      // and gives it a more realistic (and less static-ish) view.
      //

      starY = Math.floor(Math.pow(Math.random(), 2) * context.canvas.height);

      if (buildingService.getTopBuilding(starX, starY) !== -1) {
        continue;
      }

      const r = Math.floor(Math.random() * 180);
      const g = Math.floor(Math.random() * 180);
      const b = Math.floor(Math.random() * 256);

      context.fillStyle = "rgb(" + r + ", " + g + ", " + b + ")";
      context.fillRect(starX, starY, 1, 1);
    }
  }
}
