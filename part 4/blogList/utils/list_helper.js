const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}
const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null

    return blogs.reduce((prev, current) => {
        return (prev.likes > current.likes) ? prev : current
    })
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null

    const counts = _.countBy(blogs, 'author') // { "Edsger W. Dijkstra": 3, "Robert C. Martin": 1 }

    const authorWithMost = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b)

    return {
        author: authorWithMost,
        blogs: counts[authorWithMost]
    }
}
const mostLikes = (blogs) => {
    if (blogs.length === 0) return null

    const blogsByAuthor = _.groupBy(blogs, 'author')

    const likesByAuthor = _.map(blogsByAuthor, (authorBlogs, author) => ({
        author: author,
        likes: _.sumBy(authorBlogs, 'likes')
    }))

    return _.maxBy(likesByAuthor, 'likes')
}
module.exports = { dummy,totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes }