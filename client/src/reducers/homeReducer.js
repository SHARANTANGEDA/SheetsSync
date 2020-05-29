import {GET_HOME, GET_SHEET, HOME_LOADING} from '../actions/types'

const initialState = {
  home: null,
  loading: true,
  sheet: null,
  loadSheet: true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case HOME_LOADING:
      return {
        ...state,
        loading: true,
        home: [],
        sheet: [],
        loadSheet: true
      };

    case GET_HOME:
      return {
        ...state,
        home: action.payload,
        loading: false
      };
    case  GET_SHEET:
      return {
        ...state,
        sheet: action.payload,
        loadSheet: false
      }
    default:
      return state;

  }
}
