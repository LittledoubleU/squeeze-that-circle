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



$('section.start .start-btn').on('click', function () {
    if (difficulty == undefined) {
      //difficulty 1 for easy, 2 for medium, 3 for hard
      difficulty = handleDifficultyChange(difficulty);
      console.log(difficulty);

      // alert
      $('section.start .alert').css({"display" : "block"});
    } else {
      console.log("select: ", difficulty);
      enterGame()
      let playerHealth = Math.max(5, 11 - difficulty**2); // easy: 10, medium: 7, hard: 5
      let monsterDamage = difficulty + 1
      console.log(playerHealth);
      
      score = parseInt($('h1.score span').text());
      console.log(score);
    }
});
