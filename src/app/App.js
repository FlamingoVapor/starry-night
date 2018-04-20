import { Building } from "../domain/Building/Building";
import { BuildingService } from "./Building/BuildingService";
import {
  buildingStyleCount,
  tileHeight,
  tileWidth
} from "./Building/BuildingTiles";
import { Config } from "./Config/Config";
import { FlasherService } from "./Flasher/FlasherService";
import { RainService } from "./Rain/RainService";
import { ShootingStarService } from "./ShootingStar/ShootingStarService";
import { StarService } from "./Star/StarService";
import { StateGeneral } from "./State/StateGeneral";
import { StateTiming } from "./State/StateTiming";

export class App {
  /**
   * @typedef IProps
   * @property {BuildingService} buildingService
   * @property {Config} config
   * @property {FlasherService} flasherService
   * @property {RainService} rainService
   * @property {ShootingStarService} shootingStarService
   * @property {StarService} starService
   * @property {StateGeneral} stateGeneral
   * @property {StateTiming} stateTiming
   *
   * @param {IProps} props
   */
  constructor(props) {
    this.props = props;
  }

  initialize() {
    const { config, stateGeneral, stateTiming } = this.props;

    let flasherBuilding = 0;
    let maxActualHeight = 0;
    let maxHeight = 0;
    let minX = 0;
    let minXIndex = 0;
    let swap = new Building();

    stateGeneral.canvasWidth = stateGeneral.context.canvas.width =
      window.innerWidth;
    stateGeneral.canvasHeight = stateGeneral.context.canvas.height =
      window.innerHeight;

    stateGeneral.context.rect(
      0,
      0,
      stateGeneral.canvasWidth,
      stateGeneral.canvasHeight
    );
    stateGeneral.context.fillStyle = config.background;
    stateGeneral.context.fill();

    //
    // Maximum height of a building.
    //

    maxHeight = Math.ceil(
      stateGeneral.canvasHeight *
        (config.buildingHeightPercent / 100) /
        tileHeight
    );

    //
    // Sanity check.
    //

    if (config.minBuildingWidth === 0) {
      config.minBuildingWidth = 1;
    }

    if (config.maxBuildingWidth < config.minBuildingWidth) {
      config.maxBuildingWidth = config.minBuildingWidth + 1;
    }

    //
    // Initialize the buildings.
    //

    stateGeneral.building = [];
    maxActualHeight = 0;

    for (
      let buildingIndex = 0;
      buildingIndex < config.buildingCount;
      buildingIndex++
    ) {
      const house = new Building();

      house.style = Math.floor(Math.random() * buildingStyleCount);

      //
      // Squaring the random height makes for a more interesting
      // distribution of buildings.
      //

      house.height = Math.ceil(Math.pow(Math.random(), 2) * maxHeight);
      house.width =
        config.minBuildingWidth +
        Math.floor(
          Math.random() * (config.maxBuildingWidth - config.minBuildingWidth)
        );
      house.beginX = Math.floor(Math.random() * stateGeneral.canvasWidth);
      house.zCoordinate = buildingIndex + 1;

      //
      // The tallest building on the landscape gets the flasher.
      //

      if (house.height > maxActualHeight) {
        maxActualHeight = house.height;
        flasherBuilding = buildingIndex;
      }

      stateGeneral.building.push(house);
    }

    //
    // The flasher goes at the center of the top of the tallest building.
    //

    stateTiming.flasherOn = false;
    stateTiming.flasherTime = 0;

    stateGeneral.flasherX =
      stateGeneral.building[flasherBuilding].beginX +
      stateGeneral.building[flasherBuilding].width * tileWidth / 2;

    stateGeneral.flasherY =
      stateGeneral.canvasHeight -
      stateGeneral.building[flasherBuilding].height * tileHeight;

    //
    // Sort the buildings by X coordinate.
    //

    for (
      let buildingIndex = 0;
      buildingIndex < config.buildingCount - 1;
      buildingIndex += 1
    ) {
      //
      // Find the building with the lowest X coordinate.
      //

      minX = stateGeneral.canvasWidth;
      minXIndex = -1;
      for (
        let index2 = buildingIndex;
        index2 < config.buildingCount;
        index2 += 1
      ) {
        if (stateGeneral.building[index2].beginX < minX) {
          minX = stateGeneral.building[index2].beginX;
          minXIndex = index2;
        }
      }

      //
      // Swap it into position.
      //

      if (buildingIndex !== minXIndex) {
        swap = stateGeneral.building[buildingIndex];
        stateGeneral.building[buildingIndex] = stateGeneral.building[minXIndex];
        stateGeneral.building[minXIndex] = swap;
      }
    }

    //
    // Kick off the timer.
    //

    stateGeneral.stop = false;
    this.update();
  }

  update() {
    const {
      buildingService,
      config,
      flasherService,
      rainService,
      shootingStarService,
      starService,
      stateGeneral
    } = this.props;

    starService.drawStars();
    buildingService.drawBuildings();
    rainService.drawRain();
    shootingStarService.drawShootingStar();
    flasherService.drawFlasher();

    setTimeout(() => {
      if (stateGeneral.stop !== true) {
        this.update();
      }
    }, config.timerRateMs);
  }
}
