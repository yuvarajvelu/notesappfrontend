import React, { useState, useEffect } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import loginService from './services/login'
import './index.css'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import Togglable from './components/Togglable'
import Footer from './components/Footer'

const App = () => {
  const [notes,setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const noteFormRef = React.createRef()

  const hook = () => {
    noteService.getAll().then(initialNotes => {
      setNotes(initialNotes)
    })
  }
  useEffect(hook,[])
  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson)
      setUser(user)
      noteService.setToken(user.token)
    }
  },[])

  const addNote = async noteObject => {
    noteFormRef.current.toggleVisibility()
    const returnedNote = await noteService.create(noteObject)
    setNotes(notes.concat(returnedNote))
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('invalid username or password')
      setTimeout(() => {
        setErrorMessage(null)
      },5000)
    }
  }



  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  const toggleImportanceOf = (id) => {
    const note = notes.find(note => note.id === id)
    const changedNote = { ...note,important: !note.important }
    noteService.update(id,changedNote).then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    })
      // eslint-disable-next-line no-unused-vars
      .catch(error => {
        setErrorMessage(`The content '${note.content}' is already deleted from the server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(note => note.id !== id))
      })
  }

  const loginForm = () => (
    <Togglable buttonLabel = 'login'>
      <LoginForm username = {username} password = {password} setUsername = {setUsername} setPassword = {setPassword}  handleSubmit = {handleLoginSubmit}/>
    </Togglable>
  )

  const noteForm = () => (
    <Togglable buttonLabel="new note" ref = {noteFormRef}>
      <NoteForm
        createNote={addNote}
      />
    </Togglable>
  )

  return (
    <div>
      <h1>Notes</h1>
      <Notification message = {errorMessage} />
      {user === null
        ? loginForm()
        : <div>
          <p>{user.name} logged-in</p>
          {noteForm()}
        </div>
      }
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
        {notesToShow.map(note => <Note note={note} key={note.id} toggleImportance={() => toggleImportanceOf(note.id)}/>)}
      </ul>

      <Footer />
    </div>
  )
}
export default App
