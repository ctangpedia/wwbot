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
module.exports.reverseString = (str) => {
    return str.split("").reverse().join("");
}
module.exports.randomIntIncl = (min,max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}//moz, too lazy to write myself
module.exports.getCooldown = (user,cmd) => {
  switch(cmd){
    case "beg":
      if(user=="531822031059288074"||user=="395405722566918144"){
        return 10000;
      }else{
        return 12500;
      }
    break;
    case "work":
      if(user=="531822031059288074"||user=="395405722566918144"){
        return 15000;
      }else{
        return 200000;
      }
    break;
    case "pm":
      if(user=="531822031059288074"||user=="395405722566918144"){
        return 10000;
      }else{
        return 60000;
      }
    break;
    default:
    return 15000;
  }
}
