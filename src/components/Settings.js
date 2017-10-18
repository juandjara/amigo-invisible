import React, { Component } from 'react';
import { 
  login,
  logout, 
  register,
  loginObserver, 
  updateProfile,
  getProfile
} from '../services/firebase'
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button'
import Tabs, { Tab } from 'material-ui/Tabs';
import Icon from 'material-ui/Icon'
import { CircularProgress } from 'material-ui/Progress';

export default class Settings extends Component {
  state = {
    email: '',
    password: '',
    name: '',
    likes: '',
    dislikes: '',
    tab: 0,
    user: null,
    loading: true
  }
  componentDidMount() {
    loginObserver(user => {
      this.setState({user, loading: true})
      user ? console.log("Logged in with email ", user.email) : console.log("Logged out")
      if(!user) {
        this.setState({loading: false})
        return
      }
      getProfile(user.uid).then(profile => {
        this.setState({
          loading: false,
          name: profile.name || '',
          likes: profile.likes || '',
          dislikes: profile.dislikes || ''
        })
      })
    })
  }
  onSubmit(ev) {
    ev.preventDefault()
    const {email, password, tab} = this.state
    this.setState({loading: true})
    const promise = tab === 0 ? 
      login(email, password) : 
      register(email, password)
    promise.then(() => this.setState({loading: false}))
    promise.catch(err => console.error(err.message))
  }
  updateProfile(ev) {
    ev.preventDefault()
    const {user, name, likes, dislikes} = this.state
    this.setState({loading: true})
    updateProfile(user.uid, {name, likes, dislikes})
    .then(() => this.setState({ loading: false }))
  }
  handleChange = name => ev => {
    this.setState({
      [name]: ev.target.value
    })
  }
  changeTab(tab) {
    this.setState({
      tab, email: '', password: ''
    })
  }
  renderForm() {
    const {email, password, tab} = this.state
    return (
      <form style={{padding: '1em'}} onSubmit={ev => this.onSubmit(ev)}>
        <TextField
          fullWidth
          style={{margin: '1em 0'}} 
          label="Email"
          type="email"
          value={email}
          required
          onChange={this.handleChange("email")}
        />
        <TextField
          fullWidth
          style={{margin: '1em 0'}} 
          label="Contraseña"
          type="password"
          value={password}
          required
          inputProps={{minLength: 6}}
          onChange={this.handleChange("password")}
        />
        <Button type="submit" raised color="primary">
          {tab === 0 ? 'Iniciar sesión' : 'Crear cuenta'}
        </Button>
      </form>
    );
  }
  renderTabs() {
    return (
      <div>
        <Tabs 
          value={this.state.tab} 
          onChange={(ev, tab) => this.changeTab(tab)}>
          <Tab label="Iniciar sesión" />
          <Tab label="Crear cuenta" />
        </Tabs>
        {this.renderForm()}
      </div>
    )
  }
  renderAccount() {
    const {user, name, likes, dislikes} = this.state
    return (
      <div>
        <form style={{margin: '1em'}} onSubmit={ev => this.updateProfile(ev)}>
          <TextField 
            fullWidth
            style={{margin: '1em 0'}}
            label="Nombre"
            value={name}
            onChange={this.handleChange("name")}
          />
          <TextField 
            fullWidth
            multiline
            rows={3}
            style={{margin: '1em 0'}}
            label="Me gusta"
            value={likes}
            onChange={this.handleChange("likes")}
          />
          <TextField 
            fullWidth
            multiline
            rows={3}
            style={{margin: '1em 0'}}
            label="No me gusta"
            value={dislikes}
            onChange={this.handleChange("dislikes")}
          />
          <Button type="submit" raised color="primary">
            Guardar
          </Button>
          <Button onClick={() => logout()}>
            Cerrar sesi&oacute;n
          </Button>
        </form>
      </div>
    )
  }
  render() {
    const {loading, user} = this.state
    return (
      <main>
        {loading && (
          <div style={{display: 'flex', alignItems: 'center', padding: '.5rem'}}>
            <CircularProgress />
            <h3 style={{margin: '1rem'}}>Cargando ...</h3>
          </div>
        )}
        {user ? this.renderAccount() : this.renderTabs()}
      </main>
    )
  }
}