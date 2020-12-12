const fs = require('fs')
const config = require('../config.json')
const showdown  = require('showdown')
const converter = new showdown.Converter()

converter.setOption('noHeaderId', true)

function readPostContent(blogPost) {
    let fileContent = fs.readFileSync(blogPost, 'utf-8')
    let content = {
        header: {
            title: undefined,
            description: undefined,
            date: undefined
        },
        body: []
    }
    let tmp = []
    let post = fileContent.split('\n')
    let cntr = 0

    for (let line in post) {
        if (post[line].startsWith('---')) {
            cntr++
            continue
        }
        if (cntr < 2) {
            tmp.push(post[line])
            continue
        }
        if (post[line] === '') continue
        content.body += post[line] + '\n'
    }
    for (let i of tmp) {
        if (i.split(':')[0] === 'title') {
            content.header.title = i.split(':')[1].trim()
        } else if (i.split(':')[0] === 'description') {
            content.header.description = i.split(':')[1].trim()
        } else if (i.split(':')[0] === 'date') {
            content.header.date = i.split(':')[1].trim()
        }
    }
    return content
}

function createPost() {
    if (!fs.existsSync(config.builddir))
        fs.mkdirSync(config.builddir)
    let posts = fs.readdirSync(config.contentsdir)
    let postTemplateHtml = fs.readFileSync('post-template.html', 'utf-8')

    for (let post in posts) {
        let postsContent = readPostContent(`${config.contentsdir}/${posts[post]}`)
        postTemplateHtml = postTemplateHtml.replace(/{{ blogPostTitle }}/g, postsContent.header.title)
        postTemplateHtml = postTemplateHtml.replace(/{{ blogPostContent }}/, converter.makeHtml(postsContent.body))
        fs.writeFileSync(`${config.builddir}/${postsContent.header.date.split(' ')}-${postsContent.header.title.toLowerCase()}`, postTemplateHtml);
    }
}

createPost()
