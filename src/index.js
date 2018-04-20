import { App } from "./app/App";
import { BuildingService } from "./app/Building/BuildingService";
import { Config } from "./app/Config/Config";
import { FlasherService } from "./app/Flasher/FlasherService";
import { RainService } from "./app/Rain/RainService";
import { ShootingStarService } from "./app/ShootingStar/ShootingStarService";
import { StarService } from "./app/Star/StarService";
import { StateGeneral } from "./app/State/StateGeneral";
import { StateTiming } from "./app/State/StateTiming";

//
// Entry point.
//

/** @type {any} */
const w = window;

w.onload = function() {
  /** @type {HTMLCanvasElement} */
  const canvas = /** @type {any} */ (document.getElementById("city"));

  /** @type {CanvasRenderingContext2D} */
  const context = /** @type {any} */ (canvas.getContext("2d"));

  // ---

  const config = new Config();
  const stateGeneral = new StateGeneral(context);
  const stateTiming = new StateTiming();

  // ---

  const buildingService = new BuildingService({
    config,
    stateGeneral
  });

  const flasherService = new FlasherService({
    config,
    stateGeneral,
    stateTiming
  });

  const rainService = new RainService({
    config,
    stateGeneral
  });

  // ---

  const shootingStarService = new ShootingStarService({
    buildingService,
    config,
    stateGeneral,
    stateTiming
  });

  const starService = new StarService({
    buildingService,
    config,
    stateGeneral
  });

  // ---

  const app = new App({
    buildingService,
    config,
    flasherService,
    rainService,
    shootingStarService,
    starService,
    stateGeneral,
    stateTiming
  });

  app.initialize();

  w.onresize = () => {
    stateGeneral.stop = true;
    setTimeout(() => app.initialize(), 500);
  };
};
