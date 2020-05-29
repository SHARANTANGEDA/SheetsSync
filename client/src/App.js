import React, {Component} from 'react'
import './App.css'
import {Provider} from 'react-redux'
import store from './store'
import NavBar from './components/layout/NavBar'
import Landing from './components/layout/Landing'
import Home from './components/layout/Home'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Routes from './components/common/Routes/Routes'
import Sidebar from "./components/layout/Sidebar";
import ViewSheet from "./components/layout/ViewSheet";


class App extends Component {
  constructor(props) {
  super(props);
  this.state = { width: 0, height: 0 };
  this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
}

componentDidMount() {
  this.updateWindowDimensions();
  window.addEventListener('resize', this.updateWindowDimensions);
}

componentWillUnmount() {
  window.removeEventListener('resize', this.updateWindowDimensions);
}

updateWindowDimensions() {
  this.setState({ width: window.innerWidth, height: window.innerHeight });
}
  render() {
    return (
      <Provider store={store}>
      <Router >
      <div className="App w-100 " style={{width:this.state.width, height: this.state.height, overflow: 'scroll'}}>
        <NavBar/>
        <Switch>
        {/*<Route exact path="/home" component={Landing}/>*/}
          <Route exact path='/' component={Landing}/>
          <Route exact path='/home' component={Home}/>
          <Route exact path='/openSheet/:id/:cols' component={ViewSheet}/>
          {/*<Route exact path='/forgotPassword' component={ForgotPassword}/>*/}
          {/*<Route exact path='/register' component={Register}/>*/}
          <div className='wrapper' style={{width:this.state.width, height: this.state.height, overflow: 'scroll'}}>
             <Sidebar/>
          <Route component={Routes}/>
          </div>
        </Switch>
        </div>
      </Router>
      </Provider>
    );
  }
}

export default App;
