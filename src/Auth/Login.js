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
      <AuthButton onClick="">구글로그인</AuthButton>
    </AuthWrapper>
  );
}

export default Login;
