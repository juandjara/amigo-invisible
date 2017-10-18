import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import teal from 'material-ui/colors/teal';
import orange from 'material-ui/colors/orange';
import red from 'material-ui/colors/red';
import Header from './components/Header'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

import Users from './components/Users'
import Settings from './components/Settings'
import Raffles from './components/Raffles'

const theme = createMuiTheme({
  palette: {
    primary: teal,
    secondary: orange,
    error: red
  }
})

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <div>
            <Header></Header>
            <Switch>
              <Route path="/" exact render={() => <Redirect to="/users" />} />
              <Route path="/users" component={Users}></Route>
              <Route path="/settings" component={Settings} />
              <Route path="/raffles" component={Raffles} />
            </Switch>
          </div>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
