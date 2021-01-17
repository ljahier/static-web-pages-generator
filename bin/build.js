const fs = require("fs");
const config = require("../config.json");
const showdown = require("showdown");
const converter = new showdown.Converter();

converter.setOption("noHeaderId", true);

function readPostContent(blogPost) {
    let fileContent = fs.readFileSync(blogPost, "utf-8");
    let content = {
        header: {
            title: undefined,
            description: undefined,
            date: undefined,
            layout: undefined
        },
        body: [],
    };
    let tmp = [];
    let post = fileContent.split("\n");
    let count = 0;

    for (let line in post) {
        if (post[line].startsWith("---")) {
            count++;
            continue;
        }
        if (count < 2) {
            tmp.push(post[line]);
            continue;
        }
        if (post[line] === "") continue;
        content.body += post[line] + "\n";
    }
    tmp.map((elem) => {
        if (i.split(":")[0] === "title") {
            content.header.title = i.split(":")[1].trim();
        } else if (i.split(":")[0] === "description") {
            content.header.description = i.split(":")[1].trim();
        } else if (i.split(":")[0] === "date") {
            content.header.date = i.split(":")[1].trim();
        } else if (i.split(":")[0] === "layout") {
            content.header.layout = i.split(":")[1].trim();
        }
    })
    return (content);
}

function checkTreeStruct() {
    try {
        if (!fs.existsSync(config.builddir)) {
            fs.mkdirSync(config.builddir)
            fs.mkdirSync(config.builddir + "/" + config.contentsdir)
        }
    } catch (e) {
        console.log(e)
    }
}


exports.default = () => {
    console.log("Building...")

    checkTreeStruct()

    try {
        let posts = fs.readdirSync(config.contentsdir);

        for (let post in posts) {
            let postsContent = readPostContent(
                `${config.contentsdir}/${posts[post]}`
            )
            if (!fs.existsSync(`${config.templatesdir}/${postsContent.header.layout}.template.html`)) {
                console.log(`Cannot open file: ${config.templatesdir}/${postsContent.header.layout}.template.html`)
                process.exit(-1)
            }
            let postTemplateHtml = fs.readFileSync(
                `${config.templatesdir}/${postsContent.header.layout}.template.html`,
                "utf-8"
            )
            postTemplateHtml = postTemplateHtml.replace(
                /{{ blogPostTitle }}/g,
                postsContent.header.title
            )
            postTemplateHtml = postTemplateHtml.replace(
                /{{ blogPostContent }}/,
                converter.makeHtml(postsContent.body)
            )
            fs.writeFileSync(
                `${config.builddir}/${config.contentsdir}/${postsContent.header.date
                }-${postsContent.header.title.toLowerCase().replace(/ /g, "-")}.html`,
                postTemplateHtml
            )
        }
    } catch (e) {
        console.log(e)
        process.exit(-1)
    }
    console.log("Building done")
}



