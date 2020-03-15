/**
 * Shuffles the given array
 * @author CoolAJ86 via StackOverflow https://stackoverflow.com/a/2450976
 * @param {Array} array - an array to shuffle
 * @returns {Array} the shuffled array
 */
module.exports.shuffle = (array) => {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
