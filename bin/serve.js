const express = require('express')
const app = express()
const port = global.PORT || 8080

exports.default = () => {
    app.use(express.static("/build"));
    app.get("/:slug", (req, res) => {
        let path = './' + config.builddir + "/" + config.contentsdir + "/" + req.params.slug + '.html'
        try {
            let data = fs.readFileSync(path, "utf-8")
            res.end(data)
        } catch (e) {
            console.log('Cannot open file: ' + path)
        }
    });
    app.listen(port, () => console.log(`App running on ${port}`));
}