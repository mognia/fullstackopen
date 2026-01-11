const { test, describe } = require('node:test')
const assert = require('node:assert') // Note: We use 'assert'
const listHelper = require('../utils/list_helper')

const blogs = [
    { id: "5a422a851b54a676234d17f7", title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7, __v: 0 },
    { id: "5a422aa71b54a676234d17f8", title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", likes: 5, __v: 0 },
    { id: "5a422b3a1b54a676234d17f9", title: "Canonical string reduction", author: "Edsger W. Dijkstra", url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", likes: 12, __v: 0 }
]

test('dummy returns one', () => {
    const result = listHelper.dummy([])
    // Correct syntax for Node built-in:
    assert.strictEqual(result, 1)
})

describe('total likes', () => {
    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes([blogs[0]])
        assert.strictEqual(result, 7)
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.totalLikes(blogs)
        assert.strictEqual(result, 24)
    })
})

describe('favorite blog', () => {
    test('finds the blog with the most likes', () => {
        const result = listHelper.favoriteBlog(blogs)
        // Important: Use deepStrictEqual for objects/arrays!
        assert.deepStrictEqual(result, blogs[2])
    })
})

describe('author statistics', () => {
    test('mostBlogs returns the author with the highest blog count', () => {
        const result = listHelper.mostBlogs(blogs)
        assert.deepStrictEqual(result, {
            author: "Edsger W. Dijkstra",
            blogs: 2
        })
    })
})