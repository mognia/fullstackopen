import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    // States for Exercise 5.3 (New Blog)
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    // State for Exercise 5.4 (Notifications)
    // We use an object to handle both message and style type
    const [notification, setNotification] = useState({ message: null, type: null })

    useEffect(() => {
        blogService.getAll().then(blogs => setBlogs(blogs))
    }, [])

    // Exercise 5.2: Effect for persistent login
    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    // Helper for notifications (Ex 5.4)
    const notify = (message, type = 'success') => {
        setNotification({ message, type })
        setTimeout(() => {
            setNotification({ message: null, type: null })
        }, 5000)
    }

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({ username, password })

            // Exercise 5.2: Save user to local storage
            window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
            notify('Welcome back!')
        } catch  {
            notify('wrong username or password', 'error')
        }
    }

    const handleLogout = () => {
        window.localStorage.removeItem('loggedBlogappUser')
        setUser(null)
        notify('Logged out successfully')
    }

    // Exercise 5.3: Create new blog
    const handleCreateBlog = async (event) => {
        event.preventDefault()
        try {
            const newBlog = await blogService.create({ title, author, url })
            setBlogs(blogs.concat(newBlog))

            // Exercise 5.4: Success notification
            notify(`a new blog ${title} by ${author} added`)

            setTitle('')
            setAuthor('')
            setUrl('')
        } catch  {
            notify('Failed to create blog', 'error')
        }
    }

    // Notification Component (Ex 5.4)
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

    // Conditional Views
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

            <h2>create new</h2>
            <form onSubmit={handleCreateBlog}>
                <div>title: <input value={title} onChange={({ target }) => setTitle(target.value)} /></div>
                <div>author: <input value={author} onChange={({ target }) => setAuthor(target.value)} /></div>
                <div>url: <input value={url} onChange={({ target }) => setUrl(target.value)} /></div>
                <button type="submit">create</button>
            </form>

            <br />
            {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
        </div>
    )
}

export default App