import {types} from '../actions'

const user = (state = {}, action) => {
  switch (action.type) {
    case types.token: {
      return {token: action.token}
    }
    default: {
      return state
    }
  }
}

export default user