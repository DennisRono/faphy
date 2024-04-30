const loggedReducer = (state = false, action) => {
  switch (action.type) {
    case 'SETLOGGED':
      return action.payload
    default:
      return state
  }
}

export default loggedReducer
