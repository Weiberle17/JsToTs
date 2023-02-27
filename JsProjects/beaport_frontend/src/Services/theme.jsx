import { createTheme } from '@mui/material'
import { deDE } from '@mui/material/locale'
import { adaptV4Theme } from '@mui/material/styles'

const mainColor = '#003A40'

export const textColors = {
  primary: 'rgba(0, 58, 64, 0.87)',
  secondary: 'rgba(0, 58, 64, 0.74)',
  disabled: 'rgba(0, 58, 64, 0.54)',
  hint: 'rgba(0, 58, 64, 0.74)',
}

// TODO: Durch neues Theme ersetzen
const theme = () => createTheme(adaptV4Theme({
  // Komm.ONE Palette
  palette: {
    primary: {
      // main: '#F0AF00', // <- Dark Amarillo
      // main: '#009490', // <- Dark Lagoon
      main: mainColor,
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#DE3400', // <- Neue Akzentfarbe
      contrastText: '#FFFFFF',
    },
    text: textColors,
  },
  props: {
    MuiTypography: {
      // TODO: Nötig?
      // variantMapping: {
      //   h5: 'h1',
      //   subtitle1: 'h2',
      //   h6: 'h3',
      // },
    },
  },
  typography: {
    // fontFamily: [
    //   '"DM Sans"',
    //   'sans-serif'
    // ].join(','),
    useNextVariants: true,
  },
}, deDE))

export default theme()