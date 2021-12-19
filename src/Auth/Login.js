import React, { useRef, useState } from "react";

import AuthButton from "./AuthButton";
import AuthWrapper from "./AuthWrapper";
import Cookies from "universal-cookie";
import GoogleLogin from "react-google-login";
import InputWithLabel from "./InputWithLabel";
import Navigator from "../components/Navigator/Navigator";
import axios from "axios";
import { debounce } from "lodash";
import generateUuid from "./generateUuid";
import { useTranslation } from "react-i18next";
import getuser from "../api/getuser";
import {connect} from 'react-redux';
import {getUser} from '../store/actions';


function Login({user, handleUser}) {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const emailRef = useRef();
  const passwordRef = useRef();
  const { t, i18n } = useTranslation("login");

  function storeInfoLogin(accessToken) {
    const cookies = new Cookies();
    cookies.set("vtoken", accessToken, { path: "/" });

    if (localStorage.getItem("uuid") === null) {
      localStorage.setItem("uuid", generateUuid());
    }
  }

  async function postToLogin() {
    let body = inputs;

    await axios
      .post("/api/login", body)
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
            alert('잘못된 Email 또는 Password입니다.')
          }
          else {
            console.log("예상치 못한 오류입니다.");
          }
        }
      });
  }

  const googleOauthSuccess = async (res) => {
    const body = {
      accessToken: res.tokenId,
    };
    await axios
      .post("/api/oauth/google", body)
      .then(async (res) => {

        const accessToken = res.data.data.Token;
        storeInfoLogin(accessToken);

        await getuser()
          .then(res => {
              console.log(res);
              handleUser('USER', res);
          })
          
        
        window.location = "/";
      })
      .catch((err) => console.log(err));
  };

  const onChange = (e) => {
    const { value, name } = e.target; // 우선 e.target 에서 name 과 value 를 추출

    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const allAnswerFulfiled = () => {
    if (inputs.email && inputs.password) {
      return true;
    } else {
      return false;
    }
  };
  const nothing = () => { };

  const debounceFunc = debounce(onChange, 300);

  return (
    <div class="container max-w-full h-100vh bg-gray-100">
      <Navigator focus="로그인" />
      <AuthWrapper>
        <InputWithLabel
          label="Email"
          name="email"
          placeholder="이메일"
          onBlur={onChange}

        />
        <InputWithLabel
          label="Password"
          name="password"
          type="password"
          placeholder="비밀번호"
          onChange={onChange}
          onKeyPress={
            (e) => {
              if (e.key === 'Enter') {
                postToLogin();
              }
            }
          }

        />
        <AuthButton
          onClick={allAnswerFulfiled() ? postToLogin : nothing}
        >
          {t('login')}
        </AuthButton>

        <GoogleLogin
          className="w-full mt-2 font-semibold border-2 border-black rounded-lg"
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          onSuccess={googleOauthSuccess}
        ></GoogleLogin>
      </AuthWrapper>
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.getUsers.user
});

const mapDispatchToProps = (dispatch) => ({
  handleUser: (key,value) => dispatch(getUser(key, value))
});



export default connect(mapStateToProps, mapDispatchToProps)(Login);
