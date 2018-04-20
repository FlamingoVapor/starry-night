import { Config } from "../Config/Config";
import { StateGeneral } from "../State/StateGeneral";
import { buildingTiles, tileHeight, tileWidth } from "./BuildingTiles";

export class BuildingService {
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
   * Draw little lights into the buildings, each one a hard little worker.
   */
  drawBuildings() {
    const { config, stateGeneral } = this.props;

    let buildingIndex = 0;
    const buildingHeightRange =
      stateGeneral.canvasHeight - stateGeneral.flasherY;
    const buildingHeightOffset = stateGeneral.flasherY;
    let potentialX = 0;
    let potentialY = 0;
    let style = 0;
    let tileX = 0;
    let tileY = 0;

    for (
      let pixelsOn = 0;
      pixelsOn < config.buildingPixelsPerUpdate;
      pixelsOn++
    ) {
      potentialX = Math.floor(Math.random() * stateGeneral.canvasWidth);
      potentialY =
        buildingHeightOffset + Math.floor(Math.random() * buildingHeightRange);

      buildingIndex = this.getTopBuilding(potentialX, potentialY);
      if (buildingIndex === -1) {
        continue;
      }

      tileX =
        (potentialX - stateGeneral.building[buildingIndex].beginX) % tileWidth;
      tileY = potentialY % tileHeight;
      style = stateGeneral.building[buildingIndex].style;
      if (buildingTiles[style][tileY][tileX] === 0) {
        continue;
      }

      stateGeneral.context.fillStyle = config.buildingColor;
      stateGeneral.context.fillRect(potentialX, potentialY, 1, 1);
    }
  }

  /**
   * Determines which building the given pixel is in.
   *
   * @param {number} canvasX
   * @param {number} canvasY
   */
  getTopBuilding(canvasX, canvasY) {
    let buildingRight = 0;
    let buildingTop = 0;
    let frontBuilding = -1;
    let maxZ = 0;

    const { config, stateGeneral } = this.props;

    for (
      let buildingIndex = 0;
      buildingIndex < config.buildingCount;
      buildingIndex++
    ) {
      //
      // The buildings are sorted by X coordinate. If this building
      // starts to the right of the pixel in question,
      // none of the rest intersect.
      //

      if (stateGeneral.building[buildingIndex].beginX > canvasX) {
        break;
      }

      //
      // Check to see if the pixel is inside this building.
      //

      buildingTop =
        stateGeneral.canvasHeight -
        stateGeneral.building[buildingIndex].height * tileHeight;

      buildingRight =
        stateGeneral.building[buildingIndex].beginX +
        stateGeneral.building[buildingIndex].width * tileWidth;

      if (
        canvasX >= stateGeneral.building[buildingIndex].beginX &&
        canvasX < buildingRight &&
        canvasY > buildingTop
      ) {
        //
        // If this is the front-most building, mark it as the new winner.
        //

        if (stateGeneral.building[buildingIndex].zCoordinate > maxZ) {
          frontBuilding = buildingIndex;
          maxZ = stateGeneral.building[buildingIndex].zCoordinate;
        }
      }
    }

    return frontBuilding;
  }
}
