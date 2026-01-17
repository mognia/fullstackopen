import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog(newBlog)
    setNewBlog({ title: '', author: '', url: '' })
  }
  BlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired
  }
  return (
    <form onSubmit={addBlog}>
      <div>title: <input value={newBlog.title} onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })} /></div>
      <div>author: <input value={newBlog.author} onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })} /></div>
      <div>url: <input value={newBlog.url} onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })} /></div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm