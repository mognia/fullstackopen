const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const { initialNotes, blogsInDb, usersInDb } = require("./test_helper");

const api = supertest(app)

// Helper to get token for tests
const getToken = async () => {
    const response = await api
        .post('/api/login')
        .send({ username: 'root', password: 'password' })
    return response.body.token
}

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({
        username: 'root',
        name: 'Superuser',
        passwordHash
    })

    const savedUser = await user.save()

    const blogsWithUser = initialNotes.map(blog => ({
        ...blog,
        user: savedUser._id
    }))

    await Blog.insertMany(blogsWithUser)
})

describe('GET /api/blogs', () => {
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
})

describe('POST /api/blogs', () => {
    test('a valid blog can be added with a token', async () => {
        const token = await getToken()
        const newBlog = {
            title: 'Test Blog with Auth',
            author: 'Tester',
            url: 'http://test.com',
            likes: 5
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await blogsInDb()
        assert.strictEqual(blogsAtEnd.length, initialNotes.length + 1)

        const contents = blogsAtEnd.map((blog) => blog.title)
        assert(contents.includes('Test Blog with Auth'))
    })

    test('if the likes property is missing, it defaults to 0', async () => {
        const token = await getToken()
        const newBlog = {
            title: 'Testing default likes',
            author: 'Test Author',
            url: 'https://testurl.com'
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)

        assert.strictEqual(response.body.likes, 0)
    })

    test('backend responds with 400 if title is missing', async () => {
        const token = await getToken()
        const newBlog = {
            author: 'No Title Author',
            url: 'https://missingtitle.com',
            likes: 5
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)
    })

    test('backend responds with 401 if token is missing', async () => {
        const newBlog = {
            title: 'No Token Blog',
            author: 'Sneaky',
            url: 'https://sneaky.com'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
    })
})

describe('PUT /api/blogs', () => {
    test('a blog can be updated', async () => {
        const blogsAtStart = await blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const updatedBlogData = {
            likes: blogToUpdate.likes + 1
        }

        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlogData)
            .expect(200)

        assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
    })
})

after(async () => {
    await mongoose.connection.close()
})