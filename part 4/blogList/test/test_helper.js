const Blog = require('../models/blog')

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

module.exports = {
    initialNotes, nonExistingId, blogsInDb: blogsInDb
}