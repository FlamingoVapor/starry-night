(function() {

  //
  // Configuration.
  //

  var timerRateMs = 50
  var background = 'rgb(0, 0, 0)'
  var buildingColor = 'rgb(248, 241, 3)'
  var shootingStarColor = 'rgb(100, 0, 0)'
  var flasherColor = 'rgb(190, 0, 0)'
  var starsPerUpdate = 12
  var buildingPixelsPerUpdate = 15
  var buildingCount = 100
  var buildingHeightPercent = 50 // 35
  var minBuildingWidth = 5
  var maxBuildingWidth = 18
  var minRainWidth = 2
  var maxRainWidth = 16
  var rainDropsPerUpdate = 15
  var flasherEnabled = true
  var flasherPeriodMs = 1700
  var maxShootingStarPeriodMs = 25000
  var maxShootingStarDurationMs = 1000
  var maxShootingStarSpeedX = 3.0
  var minShootingStarSpeedY = 0.1
  var maxShootingStarSpeedY = 1.0
  var maxShootingStarWidth = 4

  //
  // State.
  //

  var canvas = null
  var canvasWidth = 0
  var canvasHeight = 0
  var building = null
  var flasherX = 0
  var flasherY = 0
  var stop = true

  //
  // Timing State.
  //

  var flasherTime = 0
  var flasherOn = false
  var shootingStarTime = 0
  var shootingStarActive = false
  var shootingStarStartX = 0
  var shootingStarStartY = 0
  var shootingStarVelocityX = 0.0
  var shootingStarVelocityY = 0.0
  var shootingStarDuration = 0

  //
  // Buildings are made up of tiled 8x8 blocks.
  //

  var buildingTiles = [
    [
      [0, 0, 0, 0, 1, 0, 0, 1],
      [0, 0, 0, 0, 1, 0, 0, 1],
      [0, 0, 0, 0, 1, 0, 0, 1],
      [0, 0, 0, 0, 1, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    [
      [1, 1, 0, 0, 1, 1, 0, 0],
      [1, 1, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    [
      [1, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    [
      [1, 0, 0, 0, 1, 0, 0, 0],
      [1, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 1, 0, 0, 0],
      [1, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    [
      [0, 1, 1, 0, 1, 1, 0, 0],
      [0, 1, 1, 0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
  ]

  var tileHeight = buildingTiles[0].length
  var tileWidth = buildingTiles[0][0].length
  var buildingStyleCount = buildingTiles.length

  //
  // Internal functions.
  //

  function initialize() {
    var buildingIndex
    var flasherBuilding
    var index2
    var maxActualHeight
    var maxHeight
    var minX
    var minXIndex
    var randomHeight
    var swap

    var context = canvas.getContext('2d')
    canvasWidth = context.canvas.width = window.innerWidth
    canvasHeight = context.canvas.height = window.innerHeight

    context.rect(0, 0, canvasWidth, canvasHeight)
    context.fillStyle = background
    context.fill()

    //
    // Maximum height of a building.
    //

    maxHeight =
      Math.ceil(canvasHeight * (buildingHeightPercent / 100) / tileHeight)

    //
    // Sanity check.
    //

    if (minBuildingWidth === 0)
      minBuildingWidth = 1

    if (maxBuildingWidth < minBuildingWidth)
      maxBuildingWidth = minBuildingWidth + 1

    //
    // Initialize the buildings.
    //

    building = []
    maxActualHeight = 0

    for (
      buildingIndex = 0;
      buildingIndex < buildingCount;
      buildingIndex += 1
    ) {
      var house = {}

      house.style = Math.floor(Math.random() * buildingStyleCount)

      //
      // Squaring the random height makes for a more interesting
      // distribution of buildings.
      //

      house.height = Math.ceil(Math.pow(Math.random(), 2) * maxHeight)
      house.width =
        minBuildingWidth +
        (Math.floor(Math.random() * (maxBuildingWidth - minBuildingWidth)))
      house.beginX = Math.floor(Math.random() * canvasWidth)
      house.zCoordinate = buildingIndex + 1

      //
      // The tallest building on the landscape gets the flasher.
      //

      if (house.height > maxActualHeight) {
        maxActualHeight = house.height
        flasherBuilding = buildingIndex
      }

      building.push(house)
    }

    //
    // The flasher goes at the center of the top of the tallest building.
    //

    flasherOn = false
    flasherTime = 0

    flasherX =
      building[flasherBuilding].beginX +
      (building[flasherBuilding].width * tileWidth / 2)

    flasherY =
      canvasHeight -
      (building[flasherBuilding].height * tileHeight)

    //
    // Sort the buildings by X coordinate.
    //

    for (
      buildingIndex = 0;
      buildingIndex < buildingCount - 1;
      buildingIndex += 1
    ) {

      //
      // Find the building with the lowest X coordinate.
      //

      minX = canvasWidth
      minXIndex = -1
      for (index2 = buildingIndex; index2 < buildingCount; index2 += 1) {
        if (building[index2].beginX < minX) {
          minX = building[index2].beginX
          minXIndex = index2
        }
      }

      //
      // Swap it into position.
      //

      if (buildingIndex != minXIndex) {
        swap = building[buildingIndex]
        building[buildingIndex] = building[minXIndex]
        building[minXIndex] = swap
      }
    }

    //
    // Kick off the timer.
    //

    stop = false
    update(context)
  }

  function update(context, microseconds) {
    drawStars(context, function() {
      drawBuildings(context, function() {
        drawRain(context, function() {
          drawShootingStar(context, function() {
            drawFlasher(context, function() {
              setTimeout(function() {
                if (stop !== true) update(context)
              }, timerRateMs)
            })
          })
        })
      })
    })
  }

  function drawStars(context, callback) {
    var starIndex
    var starX
    var starY

    //
    // Randomly sprinkle a certain number of stars on the screen.
    //

    starIndex = 0

    while (starIndex < starsPerUpdate) {
      starX = Math.floor(Math.random() * canvasWidth)

      //
      // Squaring the Y coordinate puts more stars at the top
      // and gives it a more realistic (and less static-ish) view.
      //

      starY = Math.floor(Math.pow(Math.random(), 2) * canvasHeight)

      if (getTopBuilding(starX, starY) !== -1)
        continue

      var r = Math.floor(Math.random() * 180)
      var g = Math.floor(Math.random() * 180)
      var b = Math.floor(Math.random() * 256)

      context.fillStyle = 'rgb(' + r + ', ' + g + ', ' + b + ')'
      context.fillRect(starX, starY, 1, 1)

      starIndex += 1
    }

    callback()
  }

  //
  // Draw little lights into the buildings, each one a hard little worker.
  //

  function drawBuildings(context, callback) {
    var buildingIndex
    var buildingHeightRange
    var buildingHeightOffset
    var pixelsOn
    var potentialX
    var potentialY
    var style
    var tileX
    var tileY

    buildingHeightRange = canvasHeight - flasherY
    buildingHeightOffset = flasherY
    pixelsOn = 0

    while (pixelsOn < buildingPixelsPerUpdate) {
      potentialX = Math.floor(Math.random() * canvasWidth)
      potentialY =
        buildingHeightOffset + Math.floor(Math.random() * buildingHeightRange)

      buildingIndex = getTopBuilding(potentialX, potentialY)
      if (buildingIndex === -1)
        continue

      tileX = (potentialX - building[buildingIndex].beginX) % tileWidth
      tileY = potentialY % tileHeight
      style = building[buildingIndex].style
      if (buildingTiles[style][tileY][tileX] === 0)
        continue

      context.fillStyle = buildingColor
      context.fillRect(potentialX, potentialY, 1, 1)

      pixelsOn += 1
    }

    callback()
  }

  //
  // Determine which building the given pixel is in.
  //

  function getTopBuilding(canvasX, canvasY) {
    var buildingIndex
    var buildingRight
    var buildingTop
    var frontBuilding
    var maxZ

    frontBuilding = -1
    maxZ = 0

    for (
      buildingIndex = 0;
      buildingIndex < buildingCount;
      buildingIndex += 1
    ) {

      //
      // The buildings are sorted by X coordinate. If this building
      // starts to the right of the pixel in question,
      // none of the rest intersect.
      //

      if (building[buildingIndex].beginX > canvasX)
        break

      //
      // Check to see if the pixel is inside this building.
      //

      buildingTop =
        canvasHeight - building[buildingIndex].height * tileHeight

      buildingRight =
        building[buildingIndex].beginX +
        building[buildingIndex].width * tileWidth

      if (
        (canvasX >= building[buildingIndex].beginX) &&
        (canvasX < buildingRight) &&
        (canvasY > buildingTop)
      ) {

        //
        // If this is the front-most building, mark it as the new winner.
        //

        if (building[buildingIndex].zCoordinate > maxZ) {
          frontBuilding = buildingIndex
          maxZ = building[buildingIndex].zCoordinate
        }
      }
    }

    return frontBuilding
  }

  //
  // Draw black rain onto the sky, giving the illusion
  // that stars and lights are going back off.
  //

  function drawRain(context, callback) {
    var dropIndex
    var lineWidth
    var rainX
    var rainY

    for (dropIndex = 0; dropIndex < rainDropsPerUpdate; dropIndex += 1) {
      context.lineWidth =
        minRainWidth +
        Math.floor(Math.random() * (maxRainWidth - minRainWidth))

      rainX = Math.floor(Math.random() * canvasWidth)
      rainY = Math.floor(Math.random() * canvasHeight)

      context.strokeStyle = background
      context.beginPath()
      context.moveTo(rainX, rainY)
      context.lineTo(rainX + 1, rainY + 1)
      context.stroke()
    }

    callback()
  }

  //
  // Draw the flasher if enabled.
  //

  function drawFlasher(context, callback) {
    var blackOutFlasher
    var lineWidth

    blackOutFlasher = false
    if (flasherEnabled === false) {
      flasherOn = false
      return
    }

    flasherTime += timerRateMs
    if (flasherTime >= flasherPeriodMs) {
      flasherTime -= flasherPeriodMs
      if (flasherOn === false) {
        flasherOn = true
      } else {
        flasherOn = false
        blackOutFlasher = true
      }
    }

    if (flasherOn !== false || blackOutFlasher !== false) {
      var context = canvas.getContext('2d')
      context.beginPath()
      context.arc(flasherX, flasherY, 3.5, 0, 2 * Math.PI, false)

      if (flasherOn === false) {
        context.fillStyle = flasherColor
      } else {
        context.fillStyle = background
      }

      context.fill()
    }

    callback()
  }

  //
  // Update any shooting stars on the screen, for those watching very closely.
  //

  function drawShootingStar(context, callback) {
    var backgroundPen
    var currentX
    var currentY
    var lineWidth
    var maxStarY
    var newX
    var newY
    var randomY

    maxStarY =
      canvasHeight - (canvasHeight * buildingHeightPercent / 100 / tileHeight)

    //
    // If there is no shooting star now, count time until the decided period
    // has ended.
    //

    if (shootingStarActive === false) {

      //
      // If this causes the shooting star time to fire, set up the shooting
      // star.
      //

      if (shootingStarTime <= timerRateMs) {
        shootingStarTime = 0
        shootingStarActive = true

        //
        // The shooting star should start somewhere between the top of the
        // buildings and the top of the screen.
        //

        shootingStarStartX = Math.floor(Math.random() * canvasWidth)
        shootingStarStartY = Math.floor(Math.pow(Math.random(), 2) * maxStarY)

        shootingStarDuration =
          Math.ceil(Math.random() * maxShootingStarDurationMs)

        shootingStarVelocityX = 
          Math.random() *
          (2.0 * maxShootingStarSpeedX) -
          maxShootingStarSpeedX

        shootingStarVelocityY = 
          Math.random() *
          (maxShootingStarSpeedY - minShootingStarSpeedY) +
          minShootingStarSpeedY

      //
      // No shooting star now, keep counting down.
      //

      } else {
        shootingStarTime -= timerRateMs
        return callback()
      }
    }

    //
    // TODO: unbreak this code.
    //

    // context.lineWidth = Math.ceil(
    //   maxShootingStarWidth *
    //   shootingStarTime /
    //   shootingStarDuration
    // )

    context.lineWidth = maxShootingStarWidth

    //
    // Draw the shooting star line from the current location to the next
    // location.
    //

    currentX =
      shootingStarStartX +
      Math.ceil(shootingStarTime * shootingStarVelocityX)

    currentY = 
      shootingStarStartY +
      Math.ceil(shootingStarTime * shootingStarVelocityY)

    if (shootingStarTime < shootingStarDuration) {
      newX = currentX + Math.ceil(timerRateMs * shootingStarVelocityX)
      newY = currentY + Math.ceil(timerRateMs * shootingStarVelocityY)

      // If the shooting star is about to fall behind a building, cut it off;
      // otherwise, draw it.

      if (getTopBuilding(newX, newY) !== -1) {
        shootingStarTime = shootingStarDuration
      } else {
        context.strokeStyle = shootingStarColor
        context.beginPath()
        context.moveTo(currentX, currentY)
        context.lineTo(newX, newY)
        context.stroke()
      }
    }

    //
    // Draw background from the start to the current value.
    //

    context.lineWidth = maxShootingStarWidth + 1
    context.strokeStyle = background
    context.beginPath()
    context.moveTo(shootingStarStartX, shootingStarStartY)
    context.lineTo(currentX, currentY)
    context.stroke()

    if (shootingStarTime < shootingStarDuration) {

      //
      // If there is more time on the shooting star, just update time.
      //

      shootingStarTime += timerRateMs
    } else {

      //
      // The shooting star is sadly over. Reset the counters and patiently
      // wait for the next one.
      //

      shootingStarActive = false
      shootingStarTime = Math.ceil(Math.random() * maxShootingStarPeriodMs)
    }

    callback()
  }

  //
  // Entry point.
  //

  window.onload = function() {
    canvas = document.getElementById('city')
    initialize()
  }

  window.onresize = function() {
    stop = true
    setTimeout(initialize, 500)
  }

})()
