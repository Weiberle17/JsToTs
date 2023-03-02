import $ from 'jquery'
import decode from 'jwt-decode'

export default class AuthService {
  // Initializing important variables
  constructor(domain) {
    this.domain = domain || 'http://localhost:8080' // API server domain
    this.fetch = this.fetch.bind(this) // React binding stuff
    this.getProfile = this.getProfile.bind(this)
  }

  login(username, password) {
    // Get a token from api server using the fetch api
    const credentials = window.btoa(`${username}:${password}`)
    const settings = {
      url: `${this.domain}/xauth`,
      method: 'POST',
      contentType: 'application/json',
      // WICHTIG: Nur erlaubte Header mitgeben
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    }
    return new Promise((resolve, reject) => {
      $.ajax(settings)
       .done(() => {})
       .then((res) => {
         const { islogin } = res
         if (islogin) {
           this.initUser(res)
           return resolve()
         } else {
           return reject('Login fehlgeschlagen.')
         }
       })
       .catch(error => reject(error))
    })
  }

  // refreshToken() {
  //   // Get a new token from api server using the fetch api
  //   return this.fetch(`${this.domain}/xauth`, {
  //     method: 'POST',
  //     headers: {
  //       'X-API-KEY': this.getToken(),
  //     },
  //     contentType: 'application/json',
  //   })
  //              .then((res) => {
  //                this.setToken(res.accessToken) // Setting the token in sessionStorage
  //                return Promise.resolve(res)
  //              })
  //              .catch(error => error)
  // }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    return new Promise((resolve, reject) => {
      const token = this.getToken() // Getting token from sessionStorage
      if (!token) {
        return reject(false)
      } else {
        if (!this.isTokenExpired(token)) {
          return resolve(true)
        }
        const settings = {
          url: `${this.domain}/xauth`,
          method: 'POST',
          contentType: 'application/json',
          headers: {
            'X-API-KEY': token,
          },
        }
        return $.ajax(settings)
                .done(
                  (res) => {
                    res.success ? resolve(true) : reject(false)
                  },
                )
                .catch(() => reject(false))
      }
    })
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token)
      return decoded.exp < Date.now() / 1000
    } catch (err) {
      return false
    }
  }

  initUser(response) {
    this.setToken(response.accessToken)
    this.setUser(response.user)
    this.setRole(response.rolle)
    this.setBeauftragung(response.beauftragung || false)
    this.setProjektkunde(response.projektkunde || false)
  }

// Speichern und Abrufen von "id_token" (Login-Token) im SessionStorage
  setToken(idToken) {sessionStorage.setItem('id_token', idToken)}

  getToken() {return sessionStorage.getItem('id_token')}

// Speichern und Abrufen von "user" (Benutzername) im SessionStorage
  setUser(user) {sessionStorage.setItem('user', user)}

  getUser() {return sessionStorage.getItem('user')}

// Speichern und Abrufen von "role" (Rolle des Benutzers) im SessionStorage
  setRole(role) {sessionStorage.setItem('role', role)}

  getRole() {return sessionStorage.getItem('role')}

// Speichern und Abrufen von "beauftragung" (darf Benutzer Beauftragungen sehen) im SessionStorage
  setBeauftragung(bea) {sessionStorage.setItem('beauftragung', bea)}

  getBeauftragung() {return sessionStorage.getItem('beauftragung')}

// Speichern und Abrufen von "projektkunde" (darf Benutzer Projektkunden-Beauftragungen sehen) im SessionStorage
  setProjektkunde(prj) {sessionStorage.setItem('projektkunde', prj)}

  getProjektkunde() {return sessionStorage.getItem('projektkunde')}

  // TODO: Ggf. anpassen, wenn Logout-Service fertig
  logout() {
    // Get a token from api server using the fetch api
    const settings = {
      url: `${this.domain}/logout.jsp`,
      method: 'GET',
      // contentType: 'application/json',
    }
    return new Promise((resolve, reject) => {
      $.ajax(settings)
       .done(() => {})
       .then((res) => {
         const { logout } = res
         console.log(logout)
         if (logout) {
           // Clear user token and profile data from sessionStorage
           console.log('Logout erfolgreich')
           sessionStorage.clear()
           return resolve()
         } else {
           console.log('Logout fehlgeschlagen')
           sessionStorage.clear()
           return reject()
         }
       })
       .catch(error => {
         console.log(error)
         sessionStorage.clear()
         return reject()
       })
    })
  }

  getProfile() {
    // Using jwt-decode npm package to decode the token
    return decode(this.getToken())
  }

  fetch(url, options) {
    // performs api calls sending the required authentication headers
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    // Setting Authorization header
    this.loggedIn().then(() => {
      headers['X-API-KEY'] = this.getToken()
    })

    return fetch(url, {
      headers,
      ...options,
    })
      .then(this.checkStatus)
      .then(response => response.json())
  }

  checkStatus(response) {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
      return response
    }
    const error = new Error(response.statusText)
    error.response = response
    throw error
  }
}
