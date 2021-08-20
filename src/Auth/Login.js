import React, { useRef, useState } from "react";

import AuthButton from "./AuthButton";
import AuthWrapper from "./AuthWrapper";
import Cookies from "universal-cookie";
import InputWithLabel from "./InputWithLabel";
import axios from "axios";
import { debounce } from "lodash";
import Navigator from "../Component/Navigator";

function Login() {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const emailRef = useRef();
  const passwordRef = useRef();

  async function postToLogin() {
    let body = inputs;
    console.log(body);
    await axios
      .post("/login", body)
      .then(async (res) => {
        const accessToken = res.data.data.Token;
        const cookies = new Cookies();
        cookies.set("vtoken", accessToken, { path: "/" });

        // await getuser(accessToken).then(
        //   (res) => {
        //     console.log(res);
        //     cookies.set("uid", res.id, { path: "/" });
        //   }
        // )



        function generateUuid() {
          return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function (c) {
              let r = (Math.random() * 16) | 0,
                v = c === "x" ? r : (r & 0x3) | 0x8;
              return v.toString(16);
            }
          );
        }

        if (localStorage.getItem("uuid") === null) {
          localStorage.setItem("uuid", generateUuid());
        }

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
    <>
      <Navigator />
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
    </>
  );
}

export default Login;
