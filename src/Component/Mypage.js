import React, { useEffect, useState } from "react";

import Axios from "axios";

function Mypage() {
  const [profile, setProfile] = useState({
    photo: "",
    name: "",
    firstlanguage: "",
    learnlanguage: "",
  });

  useEffect(() => {
    Axios.get("/users/1").then((response) => {
      if (response.data) {
        console.log(response.data);
        setProfile(response.data);
      } else {
        alert("fail");
      }
    });
  }, []);

  return (
    <>
      <div>{profile.photo}</div>
      <div>{profile.name}</div>
      <div>{profile.firstlanguage}</div>
      <div>{profile.learnlanguage}</div>
    </>
  );
}

export default Mypage;
