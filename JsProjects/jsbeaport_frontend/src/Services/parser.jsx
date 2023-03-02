export const parseDeadline = (deadline) => {
  if (deadline) {
    // TODO: DDMM auf MMDD ändern, wenn in DB geändert
    const today = new Date()
    const deadlineDate = typeof deadline === 'number' ? new Date(deadline / 10000, deadline % 10000 / 100 - 1, deadline % 100) : new Date(today.getFullYear(), parseInt(deadline.substring(2)) - 1, parseInt(deadline.substring(0, 2)))
    const deadlineString = deadlineDate.toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
    const daysLeft = Math.floor((deadlineDate - today) / (1000 * 60 * 60 * 24))
    return { deadlineString, daysLeft }
  } else {
    return { deadlineString: 'Unbekannt', daysLeft: 0 }
  }
}

export const pad = (num, size) => {
  let s = num + ''
  while (s.length < size) s = '0' + s
  return s
}

export const formatValues = (userJson, fields) => {
  fields.forEach(field => {
    if (!(!field.value || field.value.length === 0)) {
      if (field.type === 'okz') {
        userJson[field.key] = pad(field.value, 4)
      } else if (field.type === 'ags') {
        if (field.value.length === 6) {
          userJson[field.key] = '08' + field.value
        } else if (field.value.length === 7) {
          userJson[field.key] = '0' + field.value
        } else {
          userJson[field.key] = field.value
        }
      } else {
        userJson[field.key] = field.value
      }
    }
  })
}

export const jsonDeepCopy = (inObject) => {
  let outObject, value, key

  if (typeof inObject !== 'object' || inObject === null) {
    return inObject // Return the value if inObject is not an object
  }

  // Create an array or object to hold the values
  outObject = Array.isArray(inObject) ? [] : {}

  for (key in inObject) {
    value = inObject[key]

    // Recursively (deep) copy for nested objects, including arrays
    outObject[key] = jsonDeepCopy(value)
  }

  return outObject
}

export const roundNumber = (number, step) => {
  if (step < 1) {
    return parseInt((number / step).toString()) * step
  } else {
    return (parseInt(number) / step) * step
  }
}
