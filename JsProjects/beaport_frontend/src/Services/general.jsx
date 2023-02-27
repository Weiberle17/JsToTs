import $ from 'jquery'
import AuthService from './authentication'

export const getServer = () => {
  // const currentServer = window.location.href.split('/').slice(0, 3).join('/')
  // return currentServer.startsWith('http://localhost') ? `http://localhost:8080/bp` :
  //   'https://beaport.komm-one.net/bp'

  // return `http://localhost:8080/bp`
  // return 'https://beaport.komm-one.net/bp'
}

export const getAuthService = () => new AuthService(getServer())

const Auth = getAuthService()

export const getCurrentUser = () => Auth.getUser()
export const getRole = () => Auth.getRole()
export const isAdmin = () => getRole() === 'ADMIN' || getRole() === 'RZADMIN'
export const isBeaUser = () => Auth.getBeauftragung() === 'true'
export const isPrjUser = () => Auth.getProjektkunde() === 'true'
export const isNewUser = () => false // TODO: Prüfung einfügen, ob User "Neuer Kunde" ist (erst nächste Version)

export function createSettings(method, path = '/beauftragung', processData = true) {
  const token = Auth.getToken()
  const headers = {}
  if (token) {headers['X-API-KEY'] = token}
  return {
    async: true,
    crossDomain: true,
    url: `${getServer()}${path}`,
    processData,
    contentType: 'application/json;charset=utf-8',
    method,
    headers,
  }
}

export function checkRes(response, needlogin) {
  let serviceReached = true
  const { islogin, success, message } = response
  const authorized = needlogin ? islogin : true
  let msg = 'Ihre Anfrage konnte nicht ausgeführt werden.'
  if (typeof response === 'string') {
    serviceReached = !response.startsWith('<!DOCTYPE html>')
    msg += ' (Error: Service not reached)'
  } else if (!authorized) {
    msg = 'Bitte melden Sie sich erneut an, um die Anfrage auszuführen.'
    Auth.logout()
    window.location.reload()
  } else if (!success) {
    if (message) {
      msg = message
    } else {
      msg += ' (Error: Request failed)'
    }
  }
  const requestSuccess = serviceReached && authorized && success
  return {
    requestSuccess,
    msg,
  }
}

// TODO: Neu aufbauen/strukturieren
export async function sendRequest(settings, successFunction, failureFunction, useResponse = false, needlogin = true) {
  console.log('Sende Anfrage')
  return new Promise((resolve, reject) => {
    $.ajax(settings)
     .done((res) => {
       console.log('Anfrage erfolgreich')
       console.log(res)
       let returnValue
       const { requestSuccess, msg } = checkRes(res, needlogin)
       if (requestSuccess) {
         if (useResponse) {
           const value = resolve(res)
           returnValue = resolve(value)
         } else {
           const value = resolve(successFunction())
           returnValue = resolve(value)
         }
       } else {
         console.log('Antwort ungültig')
         console.log(msg)
         returnValue = reject(failureFunction(msg)) ?? msg
       }
       return returnValue
     })
     .fail((errorResponse) => {
       console.log('Anfrage fehlgeschlagen')
       return reject(failureFunction('Anfrage fehlgeschlagen.', errorResponse))
     })
  })
}