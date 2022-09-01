export default {
    entry: "./dist/scrape.js",
    target: "node",
    mode: "development",
    experiments: {
        topLevelAwait: true
    },
    stats: "errors-only",
    /*output: {
        libraryTarget: "umd",
        umdNamedDefine: true,
        library: "scraper"
    }*/
}