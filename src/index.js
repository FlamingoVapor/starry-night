import { App } from "./app/App";
import { AtomService } from "./app/Atom/AtomService";
import { BuildingService } from "./app/Building/BuildingService";
import { FlasherService } from "./app/Flasher/FlasherService";
import { RainService } from "./app/Rain/RainService";
import { ShootingStarService } from "./app/ShootingStar/ShootingStarService";
import { StarService } from "./app/Star/StarService";

//
// Entry point.
//

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  ((/** @type {() => void} */ callback) =>
    window.setTimeout(callback, 1000 / 60));

/** @type {any} */
const w = window;

w.onload = function() {
  /** @type {HTMLCanvasElement} */
  const canvas = /** @type {any} */ (document.getElementById("city"));

  /** @type {CanvasRenderingContext2D} */
  const context = /** @type {any} */ (canvas.getContext("2d"));

  // ---

  const atomService = new AtomService();

  // ---

  const flasherService = new FlasherService({
    atomService,
    context
  });

  const rainService = new RainService({
    atomService,
    context
  });

  // ---

  const buildingService = new BuildingService({
    context,
    flasherService
  });

  // ---

  const shootingStarService = new ShootingStarService({
    atomService,
    buildingService,
    context
  });

  const starService = new StarService({
    buildingService,
    context
  });

  // ---

  const app = new App({
    atomService,
    buildingService,
    context,
    flasherService,
    rainService,
    shootingStarService,
    starService
  });

  app.init();

  w.onresize = () => {
    app.stop = true;
    setTimeout(() => app.init(), 500);
  };
};
