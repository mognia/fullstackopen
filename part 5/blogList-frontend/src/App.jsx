import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: null })

  // 5.6: Reference to the Togglable component to close the form
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: null, type: null }), 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      notify('Welcome back!')
    } catch {
      notify('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  // 5.6: Refactored creation logic
  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      // 5.6: Use the ref to hide the form after success
      blogFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(returnedBlog))
      notify(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
    } catch {
      notify('Failed to create blog', 'error')
    }
  }

  // 5.8 & 5.9: Update likes
  const handleLike = async (id, blogObject) => {
    try {
      const updatedBlog = await blogService.update(id, blogObject)
      // Replace the old blog with the updated one in state
      setBlogs(blogs.map(b => b.id !== id ? b : updatedBlog))
    } catch {
      notify('Error updating likes', 'error')
    }
  }

  // 5.11: Delete blog
  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        notify('Blog removed')
      } catch {
        notify('Failed to remove blog', 'error')
      }
    }
  }

  const Notification = ({ info }) => {
    if (!info.message) return null
    const style = {
      color: info.type === 'error' ? 'red' : 'green',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10
    }
    return <div style={style}>{info.message}</div>
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification info={notification} />
        <form onSubmit={handleLogin}>
          <div>username <input value={username} onChange={({ target }) => setUsername(target.value)} /></div>
          <div>password <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} /></div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification info={notification} />

      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      {/* 5.5 & 5.6: The refactored form inside Togglable */}
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      <br />
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            updateLikes={handleLike}
            deleteBlog={handleDelete}
            currentUser={user}
          />
        )
      }
    </div>
  )
}

export default App