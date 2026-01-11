const Blog = require('../models/blog')
const User = require('../models/user')

const initialNotes = [
    {
        title: 'Test 1',
        author: "Arthur",
        url: "http://example.com/",
        likes: 1,
    },
    {
        title: 'Test 2',
        author: "Morten",
        url: "http://example2.com/",
        likes: 2,
    }
]

const nonExistingId = async () => {
    const note = new Blog({ content: 'willremovethissoon' })
    await note.save()
    await note.deleteOne()

    return note._id.toString()
}

const blogsInDb = async () => {
    const notes = await Blog.find({})
    return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}


module.exports = {
    initialNotes, nonExistingId, blogsInDb,usersInDb
}