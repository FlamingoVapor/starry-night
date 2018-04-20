export class Config {
  constructor() {
    this.timerRateMs = 50;
    this.background = "rgb(0, 0, 0)";
    this.buildingColor = "rgb(248, 241, 3)";
    this.shootingStarColor = "rgb(100, 0, 0)";
    this.flasherColor = "rgb(190, 0, 0)";
    this.starsPerUpdate = 12;
    this.buildingPixelsPerUpdate = 15;
    this.buildingCount = 100;
    this.buildingHeightPercent = 50; // 35
    this.minBuildingWidth = 5;
    this.maxBuildingWidth = 18;
    this.minRainWidth = 2;
    this.maxRainWidth = 16;
    this.rainDropsPerUpdate = 15;
    this.flasherEnabled = true;
    this.flasherPeriodMs = 1700;
    this.maxShootingStarPeriodMs = 25000;
    this.maxShootingStarDurationMs = 1000;
    this.maxShootingStarSpeedX = 3.0;
    this.minShootingStarSpeedY = 0.1;
    this.maxShootingStarSpeedY = 1.0;
    this.maxShootingStarWidth = 4;
  }
}
