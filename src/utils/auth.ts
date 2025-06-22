const Token = 'Token'

export function setToken(token: string) {
    return window.localStorage.setItem(Token, token)
}

export function getToken() {
    return window.localStorage.getItem(Token)
}

export function removeToken() {
    return window.localStorage.removeItem(Token)
}

export function getTokenFromQuery() {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    if (token) {
        localStorage.setItem('token', token)
        const cleanUrl = window.location.origin + window.location.pathname
        window.history.replaceState({}, '', cleanUrl)
    }
}
