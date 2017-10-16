import fetch from 'isomorphic-fetch'
import {push} from 'react-router-redux'

export const types = {
  login: 'LOGIN',
  token: 'UPDATE_USER_CREDENTIALS',
  failedLogin: 'FAILED_LOGIN',
}

export const login = (user, password) => dispatch => {
  return fetch('/api/login', 
    {
      method: 'POST',
      body: {user, password}
    })
    .then(res => res.json())
    .then(json => {
      if(json.token) {
        dispatch(setCreds(json.token))
        dispatch(push('/bender'))
      } else {
        dispatch(failedLogin())
      }
    })
    .catch(e => console.error(e))
}

export const setCreds = token => {
  localStorage.setItem('token', token)

  return {
    type: types.token,
    token
  }
}

export const failedLogin = () => ({
  type: types.failedLogin
})