import { Grid, Slide } from '@mui/material'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import React from 'react'
import { Navigate } from 'react-router-dom'
import LoadingModal from '../../Components/Loading/LoadingModal'
import { isLoggedIn } from '../../Services/login'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import ResetPasswordModal from './ResetPasswordModal'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      loginModalOpen: false,
      redirect: false,
    }
    this.toggleLoginModal = this.toggleLoginModal.bind(this)
    this.registerModal = React.createRef()
    this.resetPasswordModal = React.createRef()
    this.setLoading = this.setLoading.bind(this)
  }

  toggleLoginModal() {this.setState(prevState => { return { loginModalOpen: !prevState.loginModalOpen }})}

  openRegisterModal() {this.registerModal.current.handleOpen()}

  openResetPasswordModal() {this.resetPasswordModal.current.handleOpen()}

  setLoading(val) {this.setState({ isLoading: val })}

  render() {
    const { isLoading, loginModalOpen, redirect } = this.state

    // TODO: Kann man das besser lösen? (mit Functional Components bestimmt!)
    isLoggedIn().then(() => {this.setState({ redirect: true })})

    if (redirect) {
      return <Navigate to="/" />
    }

    return (
      <div>
        <Slide in {...({ timeout: 800 })} direction="down">
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            style={{
              position: 'absolute',
              top: 75,
              bottom: 0,
              width: '100%',
            }}
          >
            <LoadingModal open={isLoading} />
            <Grid item style={{ margin: 20 }}>
              <Typography variant="h4" align="center">
                Bitte Loggen Sie sich ein oder registrieren Sie sich.
              </Typography>
            </Grid>
            <Grid item style={{ display: 'flex', flexDirection: 'column' }}>
              <Button
                type="button"
                size="large"
                variant="contained"
                style={{ margin: 5 }}
                onClick={() => this.toggleLoginModal()}
              >
                Anmelden
              </Button>
              <Button
                type="button"
                size="large"
                variant="outlined"
                style={{ margin: 5 }}
                onClick={() => this.openRegisterModal()}
              >
                Registrieren
              </Button>
              <Button
                type="button"
                variant="outlined"
                style={{ margin: 5, marginTop: 75 }}
                onClick={() => this.openResetPasswordModal()}
              >
                Passwort vergessen
              </Button>
            </Grid>
          </Grid>
        </Slide>
        <LoginModal setLoading={this.setLoading} open={loginModalOpen} toggleModal={this.toggleLoginModal} />
        <RegisterModal ref={this.registerModal} setLoading={this.setLoading} />
        <ResetPasswordModal ref={this.resetPasswordModal} setLoading={this.setLoading} />
      </div>
    )
  }
}

export default Login
