import { bindActionCreators } from '@reduxjs/toolkit'
import { Component } from 'react'
import { connect } from 'react-redux'
import { setUser, resetUser } from 'store/app/auth/userSlice'
import { severity, showMessage } from 'store/app/messageSlice'
import eventEmitter from 'services/event/EventEmitter'
import jwtService, { JwtServiceEvents } from 'services/jwt/JwtService'

class Authentication extends Component {
  state = {
    loaded: false
  }

  async componentDidMount() {
    await Promise.all([this.authCheck()])
    this.setState({ loaded: true })
  }

  authCheck = () =>
    new Promise(resolve => {
      //  Registrar ouvintes de eventos de autenticação

      eventEmitter.subscribe(JwtServiceEvents.UserLoggedInAutoEvent, () => {
        this.props.showMessage({ message: 'Logging in with JWT', severity: severity.INFO })

        jwtService
          .loginWithToken()
          .then(user => {
            this.props.setUser(user)

            resolve()

            this.props.showMessage({ message: 'Logged in with JWT', severity: severity.SUCCESS })
          })
          .catch(error => {
            this.props.showMessage({ message: error.message, severity: severity.ERROR })

            resolve()
          })
      })

      eventEmitter.subscribe(JwtServiceEvents.UserLoggedOutAutoEvent, message => {
        if (message) {
          this.props.showMessage({ message })
        }

        this.props.logout()

        resolve()
      })

      eventEmitter.subscribe(JwtServiceEvents.NoAccessTokenEvent, () => {
        resolve()
      })

      // Inicializar serviço JWT
      jwtService.init()

      return Promise.resolve()
    })

  render() {
    return this.state.loaded ? <>{this.props.children}</> : <div>Carregando ...</div>
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      logout: resetUser,
      setUser,
      showMessage
    },
    dispatch
  )

export default connect(null, mapDispatchToProps)(Authentication)
