import {store} from '../store';

const {dispatch} = store;

export const setToken = token => {
  dispatch({type: 'SET_TOKEN', payload: token});
};

export const setIsLoggedIn = isLoggedIn => {
  dispatch({type: 'SET_IS_LOGGED_IN', payload: isLoggedIn});
};

export const setUser = user => {
  dispatch({type: 'SET_USER', payload: user});
};
