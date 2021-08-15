import { Redirect, Route } from "react-router-dom";

import React from "react";
import isAuthorized from "../Auth/isAuthorized";

const PrivateRoute = ({ component: Component, ...rest }) => {
  console.log(isAuthorized());
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthorized() ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;
