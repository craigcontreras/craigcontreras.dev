var { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
    eleventyConfig.addFilter("dateReadable", date => {
        return DateTime.fromJSDate(date, {
            zone: "system",
        }).setLocale('en').toLocaleString(DateTime.DATE_MED);
    });

    eleventyConfig.addCollection("sortByDate", function(collection) {
        return collection.getFilteredByGlob("./src/posts/*.md").sort((a, b) => {
            return b.date - a.date;
        });
    });

    eleventyConfig.addPassthroughCopy("./src/assets/css/");
    eleventyConfig.addWatchTarget("./src/assets/css/");
    eleventyConfig.addWatchTarget("./src/assets/img/");
    eleventyConfig.addPassthroughCopy("./src/assets/img/");
    eleventyConfig.addWatchTarget("./src/assets/js/");
    eleventyConfig.addPassthroughCopy("./src/assets/js/");
    eleventyConfig.addWatchTarget("./src/assets/json/");
    eleventyConfig.addPassthroughCopy("./src/assets/json/");
    eleventyConfig.addWatchTarget("./src/assets/models/");
    eleventyConfig.addPassthroughCopy("./src/assets/models/");
    eleventyConfig.addWatchTarget("./src/assets/fontawesome/");
    eleventyConfig.addPassthroughCopy("./src/assets/fontawesome/");
    eleventyConfig.addWatchTarget("./src/assets/webfonts/");
    eleventyConfig.addPassthroughCopy("./src/assets/webfonts/");

    js = eleventyConfig.javascriptFunctions;

    return {
        dir : {
            input: "./src",
            output: "./build"
        }
    }
};