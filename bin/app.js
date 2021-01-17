#!/usr/bin/env node

let commands = ["serve", "build", "help", "version"]
let flags = ["-p", "-b"]

if (process.argv.length < 3) {
    require('./help').default()
    process.exit(-1)
}

process.argv.forEach((value, index, array) => {
    if (value === "-p") {
        global.PORT = array[index + 1]
    }
    if (value === "-b") {
        require('./build').default()
    }
    commands.forEach((cmd) => {
        if (value === cmd) {
            require(`./${value}`).default()
        }
    })
})
