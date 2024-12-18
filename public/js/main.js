const totalStage = 7;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

function handleDifficultyChange(difficultyValue) {
    console.log('Updated difficulty:', difficultyValue);
}

function enterGame() {
  $('section.start').css({"display": "none"});
  $('section.game').css({"display": "block"});
}

function gameInit(difficulty) {
  let playerHealth = Math.max(5, 11 - difficulty**2); // easy: 10, medium: 7, hard: 5
  let minimumMonsterDamage = difficulty + 1;
  let stage = 1;
  let multiplier = stage * difficulty;
  let delay = speedStage(multiplier);
  let score = 0;
  let totalMonster = 0;
  return {playerHealth, minimumMonsterDamage, stage, difficulty, multiplier, delay, score, totalMonster};
}

function stageMultiplier(stage, difficulty) {
  return stage * difficulty;
}

function getScore() {
  return parseInt($('h1.score span').text());
}

function totalMonsterOnStage(stage,  difficulty) {
  // total monsters in stage
  return Math.floor((Math.ceil(stage*4.5) + Math.floor(1.5*difficulty))*1.25);
}

function spawnMonster(multiplier) {
  // Spawn both circle and square here uwu
  // Spawn one time per function
  const type = Math.random() < 0.8 ? 'circle' : 'square'; // 80% circle:1, 20% square:2
  // Spawn on random tile
  const spawn = getRandomInt(9) + 1;
  if (type == 'square') {
    // Square here
    const damage = Math.random() < (0.90 ** multiplier) ? 1 : getRandomInt(5) + 1; // random damage 1 or 1 - 5
    const mutate = Math.random() < (0.90 ** multiplier) ? 1 : 2 // random mutation fake or real one 1: red real square, 2:fake circle
    return {typeMons: type, damageMons: damage, mutateMons: mutate, spawnMons: spawn}
  } else {
    // circle
    return {typeMons: type, spawnMons: spawn}
  }
}

function appearMonster(monster) {
  // Show both circle and square shapes

  // Get tile
  let tile = monster.spawnMons;

  // Change the normal square to red
  if (monster.mutateMons == 1){
    $(`.hole:nth-child(${tile}) .bg.e`).addClass('mutation')
  }

  // Show Monster
  $(`.hole:nth-child(${tile}) .bg.e .entity`).addClass(monster.typeMons);
  $(`.hole:nth-child(${tile}) .bg.e`).css({"display": "block"});

  // Show Hole
  $(`.hole:nth-child(${tile}) .bg.h`).css({"display": "block"});

  // is active
  $(`.hole:nth-child(${tile})`).addClass("active");
}

function disappearMonster(monster) {
  // Reset color, shape, type

  // Get tile
  let tile = monster.spawnMons;

  // Change entity shape from type
  $(`.hole:nth-child(${tile}) .bg.e .entity`).removeClass(monster.typeMons);
  
  // default color
  if (monster.mutateMons == 1){
    $(`.hole:nth-child(${tile}) .bg.e`).removeClass('mutation')
  }

  // hide monster and hole
  $(`.hole:nth-child(${tile}) .bg.e`).css({"display": "none"});
  $(`.hole:nth-child(${tile}) .bg.h`).css({"display": "none"});

  // inactive
  $(`.hole:nth-child(${tile})`).removeClass("active");
}

function speedStage (multiplier) {
  // monster spawn delay in milisecond unit (ms)
  let speed = ((2.5 - (0.15 * multiplier)) * 1000)/(multiplier*0.75);
  if (speed < 0.1) {
    speed = 0.1;
  }
  return speed;
}

function createMonster(player) {
  let monsters = [];
  let totalMonster = totalMonsterOnStage(player.stage, player.difficulty);
  // making monster and then add to array
  for (let i = 0; i < totalMonster; i++) {
    monsters.push(spawnMonster(player.multiplier));
  };
  return monsters
}

function checkTile(monster) {
  // Boolean

  // Get tile
  let tile = monster.spawnMons;
  return $(`.hole:nth-child(${tile})`).hasClass('active');
}

function resetTile(monster) {
  // Get tile
  let tile = monster.spawnMons;

  // Reset the active class to mark the tile as available again
  $(`.hole:nth-child(${tile})`).removeClass("active");
}

function displayMonster(monster, disappearTime, gameState) {
  // Immediately show the monster
  appearMonster(monster);
  // Allow user to click on the monster while it is visible
  let tile = monster.spawnMons;
  let isClicked = false; // Track if the monster was clicked

  $(`.hole:nth-child(${tile})`).on('click', function () {
    console.log('Monster clicked:', monster);

    isClicked = true; // Mark the monster as clicked
    if (monster.typeMons === 'circle') {
      console.log("Circle clicked!");
      // Reward player, e.g., increase score
      gameState.score += 100;
      updateStatus(gameState);
    } else if (monster.typeMons === 'square') {
      console.log("Square clicked! Damage: ", monster.damageMons);
      // Subtract health by the square's damage
      gameState.playerHealth -= monster.damageMons;
      updateStatus(gameState);
      console.log("Player Health: ", gameState.playerHealth);
    }

    disappearMonster(monster); // disappear immediately
    $(this).off('click'); // prevent multiple clicks

  });

  setTimeout(() => {
    if (!isClicked && monster.typeMons === 'circle') {
      // If the circle wasn't clicked before disappearing, reduce player health
      console.log('Monster clicked:', monster);
      console.log("Circle missed! Reducing health.");
      gameState.playerHealth--; // Subtract health for missing the circle
      updateStatus(gameState);
      console.log("Player Health: ", gameState.playerHealth);
    }

    disappearMonster(monster); // Monster disappears naturally
    $(`.hole:nth-child(${tile})`).off('click'); // Remove click event

  }, disappearTime); // The time after which the monster disappears
}

function updateStatus(gameState) {
  $('span#heart').html(gameState.playerHealth);
  $('span#score').html(gameState.score);
  $('span#stage').html(gameState.stage);
  $('span#monster').html(gameState.totalMonster);
  $('span#multiplier').html(gameState.multiplier);
}

function updateStage(gameState) {
  //test 
  // gameState.stage = 7;
  let id = gameState.stage;
  //random stage in endless uwu.
  if (gameState > totalStage) {
    id = getRandomInt(totalStage);
  }
  $('.display').attr('id', `stage${id}`);
  $('.hole').attr('id', `hole${id}`);
}

function gameOver() {
  $('section.game').css({"display": "none"});
  $('section.gameover').css({"display": "block"});
}

function neutralizeMonsPos(monsters) {
  for (let i = 1; i < monsters.length; i++) {
    if (monsters[i].spawnMons === monsters[i-1].spawnMons) {
      let newValue;
      do {
        newValue = getRandomInt(9) + 1; // 1-9
      } while (newValue === monsters[i].spawnMons);

      monsters[i].spawnMons = newValue;
    } 
  }

  return monsters;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

$('section.start .start-btn').on('click', function () {
  if (difficulty === undefined) {
    difficulty = handleDifficultyChange(difficulty);
    $('section.start .alert').css({"display": "block"});
  } else {
    enterGame();
    var gameState = gameInit(difficulty);

    function playStage() {
      //endless gameplay
      if (gameState.playerHealth <= 0) {
        console.log("Game Over");
        updateStatus(gameState);
        gameOver();
        return; // Exit if all stages are completed
      }

      let totalMonster = totalMonsterOnStage(gameState.stage, gameState.difficulty);
      gameState.totalMonster = totalMonster;
      gameState.multiplier = stageMultiplier(gameState.stage, gameState.difficulty);
      updateStage(gameState);
      updateStatus(gameState);
      let monsters = createMonster(gameState);
      monsters = neutralizeMonsPos(monsters); // don't let consecutive elements in an array have the same value
      let monstersQueue = [...monsters]; // Make a copy to process
    
      console.log(`Stage ${gameState.stage}`, totalMonster, monsters, gameState.delay);
    
      let spawnInterval = setInterval(async () => {
        // Checking Player's health after clicking.
        if (monstersQueue.length > 0) {
          // Attempt to spawn a monster
          let monster = monstersQueue.shift(); // Get the next monster in the queue
          if (!(checkTile(monster))) {
            let disappearTime = gameState.delay * 1.75; // Adjust how long the monster stays visible
            displayMonster(monster, disappearTime, gameState);
            if (gameState.playerHealth <= 0 ) {
              clearInterval(spawnInterval);
              console.log("UwU you died.")
              gameOver();
              //you swap the gameover
            }
          } else {
            // If the tile is occupied, push the monster back to the end of the queue
            monstersQueue.push(monster);
            // I forgot to reset the hole.
            resetTile(monster);
          }
        } else {
          clearInterval(spawnInterval); // Stop spawning monsters after all are displayed

          gameState.stage++;
          await delay(3000);
          playStage(); // Proceed to the next stage after all monsters are spawned
        }
      }, gameState.delay); // Time delay between spawning each monster
    }

    // Start playing the first stage
    playStage();
  }
});