const pkg = require('../package.json');

exports.default = () => {
    const usageTxt = `
${pkg.name}, version: ${pkg.version}

${pkg.description}

usage:
    ${pkg.name} <command> <flag>

    COMMANDS LIST:
        serve: associated with flag "-p 8080" allow you to access to the build web page in your browser
        build: compile from the markdown/nunjunks files to static html pages on build folder
        version: show the version of the CLI
        help: show this usage page
    FLAGS:
        -p: associated with the serve command allow you to choose the port you want to use
        -b: associated with the serve command, you can build source file before launching the server
    `
    console.log(usageTxt)
}