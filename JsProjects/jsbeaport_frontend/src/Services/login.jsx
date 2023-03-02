import { getAuthService } from './general'

const Auth = getAuthService()

export const isLoggedIn = () => Auth.loggedIn()

export function login(u, p) {
  return new Promise((resolve, reject) => {
    // TODO: Promise.resolve() prüfen
    Auth.login(u, p)
        .then(() => resolve(Promise.resolve()))
        .catch(e => reject(e))
  })
}

export function logout() {
  return Auth.logout()
}
