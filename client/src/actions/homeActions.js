import axios from 'axios'
import {CLEAR_ERRORS, GET_HOME, GET_SHEET, HOME_LOADING, SEARCH_LOADING,} from './types'
import {tokenHeader} from '../utils/headers';

export const getHomeData=() => dispatch => {
  axios.get('api/getSheets', tokenHeader()).then(res => {
    dispatch({
        type: GET_HOME,
        payload: res.data
      })
  }).catch(err =>
      console.log(err)
  )
};

export const restartSync=(id) => dispatch => {
  axios.get(`api/restartSync/${id}`, tokenHeader()).then(res => {
    window.location.reload()
  }).catch(err =>
      console.log(err)
  )
};

export const pauseSync=(id) => dispatch => {
  axios.get(`api/cancelSync/${id}`, tokenHeader()).then(res => {
    window.location.reload()
  }).catch(err =>
      console.log(err)
  )
};

export const openSheet=(id, cols) => dispatch => {

  axios.get(`/api/getTable/${id}/${cols}`, tokenHeader())
    .then(res => {
      dispatch({
        type: GET_SHEET,
        payload: res.data
      })
    }).catch(err =>
    console.log(err)
  )
};

export const deleteSheet=(id) => dispatch => {
  axios.get(`api/deleteSheet/${id}`, tokenHeader())
    .then(res => {
      window.location.reload()
    }).catch(err =>
    console.log(err)
  )
};

export const addSheet = (data) => dispatch => {
  axios.post(`/api/enter`,data).then(res => {
    console.log(res.data)
    window.location.href = '/home'
  }).catch(err =>
    {console.log(err)}
  )
};
export const unPinFile = (id) => dispatch => {
  axios.post(`/api/upload/unPinFile`,id).then(res => {
    console.log(res.data)
  }).catch(err =>
    {console.log(err)}
  )
};


export const homeLoading = () => {
  return {
    type: HOME_LOADING
  }
};

export const setSearchLoading = () => {
  return {
    type: SEARCH_LOADING
  }
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  }
};
