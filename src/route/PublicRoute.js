import { Redirect, Route } from "react-router-dom";

import React from "react";
import isAuthorized from "utils/isAuthorized";

const PublicRoute = ({ component: Component, ...rest }) => {
  return (
    // 로그인이 되지 않았을 때만 접근 가능한 컴포넌트
    <Route
      {...rest}
      render={(props) =>
        !isAuthorized() ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default PublicRoute;
