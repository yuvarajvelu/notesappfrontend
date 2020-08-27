import axios from 'axios'

const baseUrl = '/api/notes'

let token = null
const setToken = newToken => {  token = `bearer ${newToken}`}
const getAll = async () => {
  const response = await axios.get(baseUrl)
  const nonExisting = {
    id: 10000,
    content: 'This note is not saved in the server',
    date: new Date(),
    important: true
  }
  return response.data.concat(nonExisting)
}

const create = async newObject => {
  const config = {
    headers: { authorization : token }
  }
  const response = await axios.post(baseUrl,newObject,config)
  return response.data
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`,newObject)
  return request.then(response => response.data)
}
export default { getAll, create, update, setToken }