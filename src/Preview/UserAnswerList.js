import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { Component, useState, useRef } from "react";

import axios from "axios";
import Slider from "react-slick";
import Cookies from "universal-cookie";

function UserAnswer({ detailTopicId }) {
  const [text, setText] = useState("");
  const cookies = new Cookies();
  const token = cookies.get('vtoken');
  const inputRef = useRef(null);

  const onBlur= (e) => {
    e.preventDefault();
    setText(e.target.value);
  }

  const onClick = (e) => {
    console.log(text);
    
    let body = {
      answer: text,
    };
    if (!detailTopicId) {
      alert("Select detail topic and save user answer.");
      return;
    }
    else {
      axios
        .post("/detail_topics/" + detailTopicId + "/user_answers", body, {
          headers: {
            Authorization: token,
          },
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error => {
          console.log(error);
        }));
    }
  };

  return (
    <div>
      <textarea onBlur={onBlur} className="p-2 w-full h-48 border-black" ref={inputRef} placeholder="왼쪽의 상세 토픽 중 하나를 클릭한 후 예시답안을 작성해주세요."></textarea>
      <div className="mx-auto w-10vw text-center bg-blue-500 m-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={onClick}>저장</div>
    </div>
  );
}

export default class UserAnswerList extends Component {
  render() {
    const { userAnswerList, whichDetailTopic } = this.props;
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
          <div>
            <UserAnswer detailTopicId={whichDetailTopic} />
          </div>
        </Slider>
      </div>
    );
  }
}
