import { Redirect, Route } from "react-router-dom";

import React from "react";
import isAuthorized from "utils/isAuthorized";

const PrivateRoute = ({ component: Component, ...rest }) => {

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
