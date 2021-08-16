import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { Component, useState } from "react";

import Axios from "axios";
import Slider from "react-slick";

function UserAnswer({ userAnswer }) {
  const [text, setText] = useState("");

  const onClick = (e) => {
    console.log(e.target.value);
    let body = {
      answer: e.target.value,
    };
    Axios.post("/detail_topics/1/user_answers", body).then((response) => {
      console.log(response.data);
    });
  };

  return (
    <div>
      <input placeholder="예시답안 작성란"></input>
      <button onClick={onClick}>저장</button>
    </div>
  );
}

export default class UserAnswerList extends Component {
  render() {
    const { userAnswerList } = this.props;

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
    };
    return (
      <div>
        <Slider {...settings}>
          {/* {userAnswerList.map((userAnswer) => (
            <div>
              <UserAnswer userAnswer={userAnswer} />
            </div>
          ))} */}
          <div>
            <UserAnswer userAnswer="" />
          </div>
        </Slider>
      </div>
    );
  }
}
