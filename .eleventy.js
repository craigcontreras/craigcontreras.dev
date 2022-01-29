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
    eleventyConfig.addWatchTarget("./src/_includes/img/");
    eleventyConfig.addPassthroughCopy("./src/_includes/img/");
    eleventyConfig.addWatchTarget("./src/assets/js/");
    eleventyConfig.addPassthroughCopy("./src/assets/js/");
    eleventyConfig.addWatchTarget("./src/assets/json/");
    eleventyConfig.addPassthroughCopy("./src/assets/json/");
    eleventyConfig.addWatchTarget("./src/assets/models/");
    eleventyConfig.addPassthroughCopy("./src/assets/models/");
    eleventyConfig.addPassthroughCopy("./node_modules/@fortawesome/fontawesome-free/js/");

    js = eleventyConfig.javascriptFunctions;

    return {
        dir : {
            input: "./src",
            output: "./build"
        }
    }
};