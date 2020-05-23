import React from 'react'
import {Route, Switch} from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import Dashboard from '../../dashboard/Dashboard'
import NotFound from '../../layout/NotFound'


const Routes = () => {
  return (

    <div className="container-fluid w-100" style={{width:'100%'}}>
      <Switch>
        <PrivateRoute exact path='/dashboard' component={Dashboard}/>
        <Route path="*" component={NotFound} />
      </Switch>
    </div>
)};

export default Routes