import React, { useRef, useState } from "react";
import { useTranslation } from 'react-i18next';

import AuthButton from "./AuthButton";
import AuthWrapper from "./AuthWrapper";
import Cookies from "universal-cookie";
import InputWithLabel from "./InputWithLabel";
import axios from "axios";
import { debounce } from "lodash";
import Navigator from "../Component/Navigator";
import GoogleLogin from "react-google-login";
import generateUuid from "./generateUuid";





function Login() {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const emailRef = useRef();
  const passwordRef = useRef();
  const { t, i18n } = useTranslation('login');


  function storeInfoLogin(accessToken) {
    const cookies = new Cookies();
    cookies.set("vtoken", accessToken, { path: "/" });

    if (localStorage.getItem("uuid") === null) {
      localStorage.setItem("uuid", generateUuid());
    }
  }

  async function postToLogin() {
    let body = inputs;
    console.log(body);
    await axios
      .post("/login", body)
      .then(async (res) => {
        const accessToken = res.data.data.Token;
        storeInfoLogin(accessToken);

        window.location = "/";
      })
      .catch((error) => {
        console.log(error.response);
        if (error.response) {
          const statusCode = error.response.data.httpStatus;
          if (statusCode === "BAD_REQUEST") {
            console.log("잘못된 email 또는 password입니다.");
          }
          else {
            console.log("예상치 못한 오류입니다.");
          }
        }
      });
  }


  const googleOauthSuccess = async (res) => {

    console.log(res.tokenId)
    const body = {
      "accessToken": res.tokenId
    };
    await axios.post("/oauth/google", body).
      then(async (res) => {
        const accessToken = res.data.data.Token;
        storeInfoLogin(accessToken);
        window.location = "/";
      })
      .catch((err) => console.log(err));
  }




  const onChange = (e) => {
    const { value, name } = e.target; // 우선 e.target 에서 name 과 value 를 추출

    console.log(value);
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const debounceFunc = debounce(onChange, 300);

  return (
    <div class="container max-w-full h-100vh bg-gray-100">
      <Navigator focus="로그인" />
      <AuthWrapper>
        <InputWithLabel
          label="Email"
          name="email"
          placeholder="이메일"
          onChange={debounceFunc}
          ref={emailRef}
        />
        <InputWithLabel
          label="Password"
          name="password"
          type="password"
          placeholder="비밀번호"
          onChange={debounceFunc}
          ref={passwordRef}
        />
        <AuthButton onClick={postToLogin}>{t('login')}</AuthButton>

        <GoogleLogin className="w-full mt-2 font-semibold border-2 border-black rounded-lg"
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          onSuccess={googleOauthSuccess}
        ></GoogleLogin>


      </AuthWrapper>
    </div>
  );
}

export default Login;
