import { createSettings, getServer, sendRequest } from './general'

export function serviceSelfRegisterUser(data, successFunction, failureFunction) {
  const settings = createSettings('POST', '/reg/reg')
  settings.data = JSON.stringify(data)
  sendRequest(settings, successFunction, failureFunction, false, false).catch((e) => {
    // failureFunction()
    console.log(e)
  })
}

export function serviceResetPassword(data, successFunction, failureFunction) {
  const settings = createSettings('POST', '/reg/pwdvergessen')
  settings.data = JSON.stringify(data)
  sendRequest(settings, successFunction, failureFunction, false, false).catch((e) => {
    failureFunction()
    console.log(e)
  })
}

export function serviceSetNewPassword(data, successFunction, failureFunction) {
  const settings = createSettings('POST', '/reg/pwdset')
  settings.data = JSON.stringify(data)
  sendRequest(settings, successFunction, failureFunction, false, false).catch((e) => {
    failureFunction()
    console.log(e)
  })
}

export function serviceCreateUser(action, successFunction, failureFunction) {
  const settings = createSettings('POST', '/xaction/uaf')
  //	TODO: action-Tag um Inhalt entfernen (sobald Backend angepasst)
  settings.data = JSON.stringify({ action })
  sendRequest(settings, successFunction, failureFunction).catch((e) => {
    // failureFunction()
    console.log(e)
  })
}

export function uploadFile(data, successFunction, failureFunction) {
  const settings = createSettings('POST', '/up', false)
  console.log(data)
  // settings.data = JSON.stringify(data)
  settings.data = data
  sendRequest(settings, () => {}, failureFunction, true).then((res) => {
    successFunction(res)
  }).catch((e) => {
    failureFunction()
    console.log(e)
  })
}

export function serviceSendCommission(data, successFunction, failureFunction, submit = false) {
  console.log(data)
  const settings = createSettings('POST')
  data.action = submit ? 'beauftragungsdatafreigeben' : 'beauftragungsdataspeichern'
  const fileUploadList = []
  // TODO: Wirklich nur bei Bildern, nicht bei JSON-Objekten
  // Object.keys(data).forEach((key) => {
  //   if (typeof data[key] === 'object') {fileUploadList.push(key)}
  // })
  if (fileUploadList.length > 0) {
    const promises = []
    fileUploadList.forEach((fileKey) => {
      const promise = new Promise((resolve, reject) => {
        let formData = new FormData()
        formData.append('file', data[fileKey])
        uploadFile(formData, (res) => {
          console.log(res)
          const fileId = res.files[0].id
          data[fileKey] = `${getServer()}/ds?id=${fileId}`
          resolve()
        }, reject)
      })
      promises.push(promise)
    })
    console.log(data)
    Promise.all(promises).then(() => {
      settings.data = JSON.stringify(data)
      sendRequest(settings, successFunction, failureFunction).catch((e) => {
        failureFunction()
        console.log(e)
      })
    })
  } else {
    settings.data = JSON.stringify(data)
    sendRequest(settings, successFunction, failureFunction).catch((e) => {
      failureFunction()
      console.log(e)
    })
  }
}

export function serviceGetOverview() {
  const settings = createSettings('POST')
  const data = { action: 'overview' }
  settings.data = JSON.stringify(data)
  return sendRequest(settings, () => {}, () => {}, true).catch((e) => {
    console.log(e)
  })
}

export const serviceResetTestuser = () => {
  const settings = createSettings('POST')
  const data = { action: 'resetTestuser' }
  settings.data = JSON.stringify(data)
  return sendRequest(settings, () => {}, () => {}, true).catch((e) => {
    console.log(e)
  })
}
