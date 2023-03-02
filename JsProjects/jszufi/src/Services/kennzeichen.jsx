
const alphabet = "ABCDEFGHIKKLMNOPQRSTUVWXYZ"

const getRandomChar = () => alphabet[Math.floor(Math.random() * alphabet.length)]

const getRandomNum = () => Math.floor(Math.random() * 10000)

// TODO: Ortskennzeichen dynamisch
export const getRandomKennzeichen = (ort = 'BS') => `${ort}-${getRandomChar()}${getRandomChar()}-${getRandomNum()}`
