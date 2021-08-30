import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { Component, useState } from "react";

import Axios from "axios";
import Cookies from "universal-cookie";
import Slider from "react-slick";

function UserAnswer({ detailTopicId }) {
  const [text, setText] = useState("");
  const cookies = new Cookies();
  const token = cookies.get("vtoken");

  const onClick = (e) => {
    let practice = document.getElementById("practice").value;
    console.log(practice);
    let body = {
      answer: practice,
    };
    if (detailTopicId === 0) {
      alert("Select detail topic and save user answer.");
      return;
    } else {
      Axios.post(
        "/api/detail_topics/" + detailTopicId + "/user_answers",
        body,
        {
          headers: {
            Authorization: token,
          },
        }
      )
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div>
      <textarea
        id="practice"
        className="resize w-full h-48 border-black"
        placeholder="왼쪽의 상세 토픽 중 하나를 클릭한 후 예시답안을 작성해주세요."
      ></textarea>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={onClick}
      >
        저장
      </button>
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
          {/* {userAnswerList.map((userAnswer) => (
            <div>
              <UserAnswer userAnswer={userAnswer} />
            </div>
          ))} */}
          <div>
            <UserAnswer detailTopicId={whichDetailTopic} />
          </div>
        </Slider>
      </div>
    );
  }
}
