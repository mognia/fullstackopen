import Blog from './Blog.jsx'
import { render,screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm.jsx'

test('renders title and author, but not url or likes by default', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Full Stack Learner',
    url: 'https://fullstackopen.com',
    likes: 10
  }
  render(<Blog blog={blog} />)

  const element = screen.getByText(/Component testing is done with react-testing-library/i)
  expect(element).toBeDefined()

  const url = screen.queryByText('https://fullstackopen.com')
  expect(url).toBeNull()

  const likes = screen.queryByText('likes 10')
  expect(likes).toBeNull()
})

test('clicking the view button displays url and likes', async () => {
  const blog = {
    title: 'Testing Component Rendering',
    author: 'Full Stack Open',
    url: 'https://test.com',
    likes: 5,
    user: {
      username: 'johndoe',
      name: 'John Doe'
    }
  }

  const mockUser = {
    username: 'johndoe'
  }

  const user = userEvent.setup()

  render(<Blog blog={blog} currentUser={mockUser} />)

  const button = screen.getByText('view')
  await user.click(button)

  const urlElement = screen.getByText(/https:\/\/test\.com/i)
  const likesElement = screen.getByText(/likes 5/i)

  expect(urlElement).toBeDefined()
  expect(likesElement).toBeDefined()
})

test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    title: 'Click test',
    author: 'Tester',
    url: 'https://test.com',
    likes: 5,
    user: { name: 'Admin', username: 'admin' },
  }

  const mockUser = {
    username: 'admin'
  }

  const mockHandler = vi.fn() // Create a mock function

  const user = userEvent.setup()

  render(<Blog blog={blog} currentUser={mockUser} updateLikes={mockHandler} />)
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  // We need to render the component with the mock function
  render(<BlogForm createBlog={createBlog} />)

  // Use getByRole or getByPlaceholderText if you added placeholders
  const inputs = screen.getAllByRole('textbox') // [title, author, url]
  const sendButton = screen.getByText('create')

  await user.type(inputs[0], 'Testing Form Title')
  await user.type(inputs[1], 'Testing Form Author')
  await user.type(inputs[2], 'Testing Form URL')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing Form Title')
  expect(createBlog.mock.calls[0][0].author).toBe('Testing Form Author')
  expect(createBlog.mock.calls[0][0].url).toBe('Testing Form URL')
})
