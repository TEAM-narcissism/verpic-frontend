import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { Component } from "react";

import Slider from "react-slick";

function UserAnswer({ useranswer }) {
  return (
    <div>
      <input placeholder="예시답안 작성란"></input>
    </div>
  );
}

export default class UserAnswerList extends Component {
  render() {
    const { preview, detailTopicList } = this.props;

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
            <h2> 본문 </h2>
            <h3>{preview.context}</h3>
          </div>
          <div>
            <h2> 한국어 상세 토픽 </h2>
            <h3>{detailTopicList[0].context}</h3>
          </div>
          <div>
            <h2> 영어 상세 토픽</h2>
            <h3>{detailTopicList[0].context}</h3>
          </div>
        </Slider>
      </div>
    );
  }
}
