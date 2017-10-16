import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {login} from '../actions'

let Login = ({dispatch}) => {
  let input
  let password

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!input.value.trim()) {
          return
        }
        dispatch(login(input.value, password.value))
        input.value = ''
        password.value = ''
      }}>
        <input ref={node => {
          input = node
        }} />
        <input type="password" ref={node => {
          password = node
        }} />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired
}

Login = connect()(Login)

export default Login