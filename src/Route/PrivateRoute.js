import React from 'react';

import {Route, Redirect} from 'react-router-dom';

import isAuthorized from '../Auth/isAuthorized';




const PrivateRoute = ({component: Component, ...rest}) => { 
    console.log(isAuthorized());
    return ( 
        <Route {...rest} render={props => 
            ( isAuthorized() ? 
                <Component {...props} /> 
            : <Redirect to="/login" /> 
            )} /> 
        ); 
    }; 


export default PrivateRoute;

