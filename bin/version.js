const pkg = require('../package.json')

exports.default = () => {
    console.log(`CLI is running on version ${pkg.version}`)
}