import { GET_SEARCH_RESULTS, GET_SEARCH_PAGE } from '../actions/types';

const initialState = {
  numItems: 0,
  activePage: 0,
  itemsPerPage: 0,
  items: []
}

const search = (state = initialState, action) => {
  switch (action.type) {
    case GET_SEARCH_RESULTS:
      return {
        numItems: action.numItems,
        activePage: action.activePage,
        itemsPerPage: action.itemsPerPage,
        items: action.items
      }
    case GET_SEARCH_PAGE:
      return {
        ...state,
        activePage: action.activePage,
        items: action.items
      }
    default:
      return state
  }
}

export default search