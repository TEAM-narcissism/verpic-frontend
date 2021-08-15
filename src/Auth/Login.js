import React, { useRef, useState } from "react";

import AuthButton from "./AuthButton";
import AuthWrapper from "./AuthWrapper";
import Cookies from "universal-cookie";
import InputWithLabel from "./InputWithLabel";
import axios from "axios";
import { debounce } from "lodash";

function Login() {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const emailRef = useRef();
  const passwordRef = useRef();

  function postToLogin() {
    let body = inputs;
    console.log(body);
    axios
      .post("/login", body)
      .then((res) => {
        console.log(res.data.data.Token);
        const accessToken = res.data.data.Token;

        const cookies = new Cookies();
        cookies.set("vtoken", accessToken, { path: "/" });
        window.location = "/";
      })
      .catch((error) => {
        if (error.response) {
          const { data } = error.response;
          console.error("data : ", data);
        }
      });
  }

  function GoogleLogin() {
    let body = "";
    console.log(body);
    const getCodeURL =
      "https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A//www.googleapis.com/auth/drive.metadata.readonly&access_type=offline&include_granted_scopes=true&response_type=code&state=state_parameter_passthrough_value&redirect_uri=https%3A//oauth2.example.com/code&client_id=732357881374-s8ol03uom7tp564gm1104bs9t07fdmjq.apps.googleusercontent.com";
    axios
      .post(getCodeURL, body)
      .then((res) => {
        console.log(res.data.data);
        // const accessToken = res.data.data.Token;

        // const cookies = new Cookies();
        // cookies.set("vtoken", accessToken, { path: "/" });
        // window.location = "/";
      })
      .catch((error) => {
        if (error.response) {
          const { data } = error.response;
          console.error("data : ", data);
        }
      });
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
        placeholder="비밀번호"
        onChange={debounceFunc}
        ref={passwordRef}
      />
      <AuthButton onClick={postToLogin}>로그인</AuthButton>
      <AuthButton onClick={GoogleLogin}>구글로그인</AuthButton>
    </AuthWrapper>
  );
}

export default Login;
