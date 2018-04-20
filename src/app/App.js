import { AtomService } from "./Atom/AtomService";
import { BuildingService } from "./Building/BuildingService";
import { FlasherService } from "./Flasher/FlasherService";
import { RainService } from "./Rain/RainService";
import { ShootingStarService } from "./ShootingStar/ShootingStarService";
import { StarService } from "./Star/StarService";

export class App {
  /**
   * @typedef IProps
   * @property {AtomService} atomService
   * @property {BuildingService} buildingService
   * @property {CanvasRenderingContext2D} context
   * @property {FlasherService} flasherService
   * @property {RainService} rainService
   * @property {ShootingStarService} shootingStarService
   * @property {StarService} starService
   *
   * @param {IProps} props
   */
  constructor(props) {
    this.props = props;

    this.stop = true;
  }

  init() {
    const { atomService, buildingService, context } = this.props;

    context.canvas.width = context.canvas.offsetWidth;
    context.canvas.height = context.canvas.offsetHeight;

    context.rect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = atomService.config.background;
    context.fill();

    buildingService.init();

    //
    // Kick off the timer.
    //

    this.update();
  }

  update() {
    this.stop = false;

    const {
      buildingService,
      flasherService,
      rainService,
      shootingStarService,
      starService
    } = this.props;

    starService.drawStars();
    buildingService.drawBuildings();
    rainService.drawRain();
    shootingStarService.drawShootingStar();
    flasherService.drawFlasher();

    requestAnimationFrame(() => {
      if (this.stop !== true) {
        this.update();
      }
    });
  }
}
