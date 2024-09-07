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
  return {playerHealth, minimumMonsterDamage, stage, difficulty, multiplier};
}

function stageMultiplier(stage, difficulty) {
  return stage * difficulty;
}

function getScore() {
  return parseInt($('h1.score span').text());
}

function totalMonsterOnStage(stage,  difficulty) {
  // total monsters in stage
  return Math.ceil(stage*4.5) + Math.floor(1.5*difficulty);
}

function spawnMonster(multiplier) {
  // Spawn both circle and square here uwu
  // Spawn one time per function
  const type = Math.random() < (0.8 ** multiplier) ? 1 : 2; // 80% circle:1, 20% square:2
  // Spawn on random tile
  const spawn = getRandomInt(9) + 1;
  if (type == 2) {
    // Square here
    const damage = Math.random() < (0.99 ** multiplier) ? 1 : getRandomInt(5) + 1; // random damage 1 or 1 - 5
    const mutate = Math.random() < (0.99 ** multiplier) ? 1 : 2 // random mutation fake or real one 1: red real square, 2:fake circle
    return {typeMons: type, damageMons: damage, mutateMons: mutate, spawnMons: spawn}
  } else {
    // circle
    return {typeMons: type, spawnMons: spawn}
  }
}

function appearMonster(monster, tile) {
  // Show both circle and square shapes

  // Change entity shape from type
  let shape;
  if (monster.typeMons == 1) {
    shape = 'circle';
  } else {
    shape = 'square';
  }

  // Change the normal square to red
  if (monster.mutate == 1){
    $(`.hole:nth-child(${tile}) .bg.e .entity`).css({"--color": "red"});
  }

  // Show Monster
  $(`.hole:nth-child(${tile}) .bg.e .entity`).addClass(shape);
  $(`.hole:nth-child(${tile}) .bg.e`).css({"display": "block"});

  // Show Hole
  $(`.hole:nth-child(${tile}) .bg.h`).css({"display": "block"});
}

function disappearMonster(monster, tile) {
  // Reset color, shape, type

  // Change entity shape from type
  let shape;
  if (monster.typeMons == 1) {
    shape = 'circle';
  } else {
    shape = 'square';
  }
  $(`.hole:nth-child(${tile}) .bg.e .entity`).removeClass(shape);
  
  // default color
  if (monster.mutate == 1){
    $(`.hole:nth-child(${tile}) .bg.e .entity`).css({"--color": "white"});
  }

  // hide monster and hole
  $(`.hole:nth-child(${tile}) .bg.e`).css({"display": "none"});
  $(`.hole:nth-child(${tile}) .bg.h`).css({"display": "none"});
}

function speedStage (multiplier) {
  // monster spawn delay
  return 2.5 - (0.15 * multiplier)
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

$('section.start .start-btn').on('click', function () {
    if (difficulty == undefined) {
      // difficulty 1 for easy, 2 for medium, 3 for hard
      difficulty = handleDifficultyChange(difficulty);
      console.log(difficulty);

      // alert
      $('section.start .alert').css({"display" : "block"});
    } else {
      console.log("select: ", difficulty);
      enterGame();
      var player = gameInit(difficulty);

      var monsters = createMonster(player);
      console.log('monsters: ',monsters);
    }
});
