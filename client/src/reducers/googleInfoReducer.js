import {SET_CURRENT_USER} from "../actions/types";
import isEmpty from "../validation/is-empty";

const initialState = {
  err: null,
  isAuthenticated: false,
  isAuthenticating: false,
  token_data: {},
  user: {}
};

export default function googleInfoReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
          return {
              ...state,
              isAuthenticated: !isEmpty(action.payload),
              user: action.payload
          };
    default:
      return state;
  }
}

