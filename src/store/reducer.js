import { SET_LOGIN_INFO } from "./action";

let isLogin = sessionStorage.getItem("token");
const defaultState = {
  isLogin,
};

function reducer(state = defaultState, action) {
  switch (action.type) {
    case SET_LOGIN_INFO:
      return Object.assign({}, state, { isLogin: action.isLogin });
    default:
      return state;
  }
}

export default reducer;
