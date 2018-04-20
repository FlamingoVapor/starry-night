import { Building } from "../../domain/Building/Building";
import { BuildingConfig } from "../../domain/Building/BuildingConfig";
import { FlasherService } from "../Flasher/FlasherService";
import {
  buildingStyleCount,
  buildingTiles,
  tileHeight,
  tileWidth
} from "./BuildingTiles";

export class BuildingService {
  /**
   * @typedef IProps
   * @property {CanvasRenderingContext2D} context
   * @property {FlasherService} flasherService
   *
   * @param {IProps} props
   */
  constructor(props) {
    this.props = props;

    this.buildings = [new Building()];

    this.config = new BuildingConfig();
  }

  /**
   * Draws little lights into the buildings, each one a hard little worker.
   */
  drawBuildings() {
    const { context, flasherService } = this.props;

    let buildingIndex = 0;
    const buildingHeightOffset = flasherService.flasher.y;
    const buildingHeightRange = context.canvas.height - buildingHeightOffset;
    let potentialX = 0;
    let potentialY = 0;
    let style = 0;
    let tileX = 0;
    let tileY = 0;

    for (let pixelsOn = 0; pixelsOn < this.config.pixelsPerUpdate; pixelsOn++) {
      potentialX = Math.floor(Math.random() * context.canvas.width);
      potentialY =
        buildingHeightOffset + Math.floor(Math.random() * buildingHeightRange);

      buildingIndex = this.getTopBuilding(potentialX, potentialY);
      if (buildingIndex === -1) {
        continue;
      }

      tileX = (potentialX - this.buildings[buildingIndex].beginX) % tileWidth;
      tileY = potentialY % tileHeight;
      style = this.buildings[buildingIndex].style;
      if (buildingTiles[style][tileY][tileX] === 0) {
        continue;
      }

      context.fillStyle = this.config.color;
      context.fillRect(potentialX, potentialY, 1, 1);
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

    const { context } = this.props;

    for (
      let buildingIndex = 0;
      buildingIndex < this.config.count;
      buildingIndex++
    ) {
      //
      // The buildings are sorted by X coordinate. If this building
      // starts to the right of the pixel in question,
      // none of the rest intersect.
      //

      if (this.buildings[buildingIndex].beginX > canvasX) {
        break;
      }

      //
      // Check to see if the pixel is inside this building.
      //

      buildingTop =
        context.canvas.height -
        this.buildings[buildingIndex].height * tileHeight;

      buildingRight =
        this.buildings[buildingIndex].beginX +
        this.buildings[buildingIndex].width * tileWidth;

      if (
        canvasX >= this.buildings[buildingIndex].beginX &&
        canvasX < buildingRight &&
        canvasY > buildingTop
      ) {
        //
        // If this is the front-most building, mark it as the new winner.
        //

        if (this.buildings[buildingIndex].zCoordinate > maxZ) {
          frontBuilding = buildingIndex;
          maxZ = this.buildings[buildingIndex].zCoordinate;
        }
      }
    }

    return frontBuilding;
  }

  init() {
    this.checkSanity();

    let maxActualHeight = 0;
    let maxHeight = 0;
    let tallestBuilding = 0;

    const { context } = this.props;

    this.buildings = [];

    maxActualHeight = 0;

    maxHeight = Math.ceil(
      context.canvas.height * (this.config.heightPercent / 100) / tileHeight
    );

    for (
      let buildingIndex = 0;
      buildingIndex < this.config.count;
      buildingIndex++
    ) {
      const building = new Building();

      building.style = Math.floor(Math.random() * buildingStyleCount);

      //
      // Squaring the random height makes for a more interesting
      // distribution of buildings.
      //

      building.height = Math.ceil(Math.pow(Math.random(), 2) * maxHeight);
      building.width =
        this.config.minWidth +
        Math.floor(
          Math.random() * (this.config.maxWidth - this.config.minWidth)
        );
      building.beginX = Math.floor(Math.random() * context.canvas.width);
      building.zCoordinate = buildingIndex + 1;

      //
      // The tallest building on the landscape gets the flasher.
      //

      if (building.height > maxActualHeight) {
        maxActualHeight = building.height;
        tallestBuilding = buildingIndex;
      }

      this.buildings.push(building);
    }

    this.setFlasherAtTop(tallestBuilding);

    this.sortByX();
  }

  /**
   * @private
   */
  checkSanity() {
    if (this.config.minWidth === 0) {
      this.config.minWidth = 1;
    }

    if (this.config.maxWidth < this.config.minWidth) {
      this.config.maxWidth = this.config.minWidth + 1;
    }
  }

  /**
   * @private
   * @param {number} buildingIndex
   */
  setFlasherAtTop(buildingIndex) {
    const { context, flasherService } = this.props;

    flasherService.flasher.on = false;
    flasherService.flasher.time = 0;

    flasherService.flasher.x =
      this.buildings[buildingIndex].beginX +
      this.buildings[buildingIndex].width * tileWidth / 2;

    flasherService.flasher.y =
      context.canvas.height - this.buildings[buildingIndex].height * tileHeight;
  }

  /**
   * @private
   */
  sortByX() {
    let minX = 0;
    let minXIndex = 0;
    let swap = new Building();

    const { context } = this.props;

    for (
      let buildingIndex = 0;
      buildingIndex < this.config.count - 1;
      buildingIndex += 1
    ) {
      //
      // Find the building with the lowest X coordinate.
      //

      minX = context.canvas.width;
      minXIndex = -1;
      for (
        let index2 = buildingIndex;
        index2 < this.config.count;
        index2 += 1
      ) {
        if (this.buildings[index2].beginX < minX) {
          minX = this.buildings[index2].beginX;
          minXIndex = index2;
        }
      }

      //
      // Swap it into position.
      //

      if (buildingIndex !== minXIndex) {
        swap = this.buildings[buildingIndex];
        this.buildings[buildingIndex] = this.buildings[minXIndex];
        this.buildings[minXIndex] = swap;
      }
    }
  }
}
