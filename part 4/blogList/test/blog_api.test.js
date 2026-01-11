const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const {initialNotes, blogsInDb} = require("./test_helper");

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialNotes)
})

test("blogs are returned as json", async () => {
    await api.get('/api/blogs')
        .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const res = await api.get('/api/blogs')

    assert.strictEqual(res.body.length, initialNotes.length)
})

test("blogs have a property named id instead of _id", async () => {
    const res = await api.get('/api/blogs')
    const blogToIdentify = res.body[0]

    assert.ok(blogToIdentify.id)
    assert.strictEqual(blogToIdentify._id, undefined)
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'Test test',
        author: "John Doe",
        url: "http://google.com/",
        likes: 0,
    }

    await api
        .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
    const blogsAtEnd = await blogsInDb()
    assert.strictEqual(blogsAtEnd.length, initialNotes.length+1)

    const contents = blogsAtEnd.map((blog) => blog.url)
    assert(contents.includes('http://google.com/'))
})
test('if the likes property is missing, it defaults to 0', async () => {
    const newBlog = {
        title: 'Testing default likes',
        author: 'Test Author',
        url: 'https://testurl.com'
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    // Check the saved blog in the response
    assert.strictEqual(response.body.likes, 0)
})

    test('backend responds with 400 if title is missing', async () => {
        const newBlog = {
            author: 'No Title Author',
            url: 'https://missingtitle.com',
            likes: 5
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })

    test('backend responds with 400 if url is missing', async () => {
        const newBlog = {
            title: 'Missing URL Blog',
            author: 'No URL Author',
            likes: 5
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })

test('a blog can be deleted', async ()=>{
    const blogsAtStrat = await blogsInDb();
    const blogToDelete = blogsAtStrat[0]

    await api.delete(`/api/blogs/${blogsAtStrat[0].id}`).expect(204)
    const blogsAtEnd = await blogsInDb();

    const contents = blogsAtEnd.map((blog) => blog.url)
    assert(!contents.includes(blogToDelete.url))

    assert.strictEqual(blogsAtEnd.length, initialNotes.length-1)

})
test('a blog can be updated', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToUpdate = blogsAtStart[0]

    const updatedBlogData = {
        likes: blogToUpdate.likes + 1
    }

    const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlogData)
        .expect(200)
        .expect('Content-Type', /application\/json/)


    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)

    // Verify it's actually changed in the database
    const blogsAtEnd = await Blog.find({})
    const updatedBlogInDb = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    assert.strictEqual(updatedBlogInDb.likes, blogToUpdate.likes + 1)
})
after(async () => {
    await mongoose.connection.close()
})