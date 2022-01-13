import AuthState from '../states/AuthState';

const AuthReducer = (state = AuthState, action) => {
  const {type, payload} = action;
  switch (type) {
    case 'SET_TOKEN':
      return {...state, ...{token: payload}};
    case 'SET_IS_LOGGED_IN':
      return {...state, ...{isLoggedIn: payload}};
    case 'SET_USER':
      return {...state, ...{user: payload}};
    default:
      return state;
  }
};

export default AuthReducer;
