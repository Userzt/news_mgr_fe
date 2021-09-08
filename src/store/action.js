export const SET_LOGIN_INFO = 'SET_LOGIN_INFO';

export function setLoginInfo(isLogin) {
    return {
        type: SET_LOGIN_INFO,
        isLogin
    }
}
