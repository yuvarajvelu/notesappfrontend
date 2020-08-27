import React from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ username, password, setUsername, setPassword, handleSubmit }) => {
  return (
    <div>
      <form onSubmit = { handleSubmit }>
        <div>
            Username
          <input type = 'text' id = 'username' name = 'username' value = {username} onChange = { ({ target }) => setUsername(target.value) } />
        </div>
        <div>
            Password
          <input type = 'password' id = 'password' name = 'password' value = {password} onChange = {({ target }) => setPassword(target.value)} />
        </div>
        <button type = 'submit' id = 'login-button'>Login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  username : PropTypes.string.isRequired,
  password : PropTypes.string.isRequired,
  setUsername : PropTypes.func.isRequired,
  setPassword : PropTypes.func.isRequired,
  handleSubmit : PropTypes.func.isRequired
}

export default LoginForm