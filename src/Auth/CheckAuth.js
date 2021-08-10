import { React, useEffect, useMemo, useState } from "react";

import isAuthorized from "./isAuthorized";

function CheckAuth() {
  const [isAuth, setIsAuth] = useState(false);

  let temp = false;

  const authInfo = () => {
    isAuthorized()
      .then((res) => {
        if (res) {
          setIsAuth((prevIsAuth) => true);
          temp = true;
        } else {
          setIsAuth(false);
          temp = false;
        }
      })
      .catch((err) => {
        console.error(err);
        setIsAuth(false);
        temp = false;
      });
  };

  useEffect(authInfo(), []);

  return <>{isAuth ? <div>"인증 완료"</div> : <div>로그인 해주세요</div>}</>;
}

export default CheckAuth;
