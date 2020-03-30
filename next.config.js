const withTM = require("next-transpile-modules")([
  "@amcharts/amcharts4",
  "@amcharts/amcharts4-geodata"
]);
module.exports = withTM();