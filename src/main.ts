function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

//difficulty 1 for easy, 2 for medium, 3 for hard

let playerHealth = Math.max(5, 11 - difficulty**2); // easy: 10, medium: 7, hard: 5
let monsterDamage = difficulty + 1

console.log(playerHealth);

score = parseInt($('h1.score span').text());
console.log(score);

