import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

// 5.8 & 5.9: Update likes
const update = async (id, newObject) => {
  // Usually, PUT requests don't require a token for likes
  // unless your backend specifically checks for it.
  const response = await axios.put(`${baseUrl}/${id}`, newObject)
  return response.data
}

// 5.11: Delete blog
const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getAll, create, update, remove, setToken }