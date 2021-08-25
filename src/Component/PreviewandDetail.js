import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { Component } from "react";

import Slider from "react-slick";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "black" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "black" }}
      onClick={onClick}
    />
  );
}

export default class PreviewandDetail extends Component {
  render() {
    const { preview, detailTopicList, initialDetailTopic, changeDetailTopic } = this.props;
    const initialId = initialDetailTopic;

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      // nextArrow: <SampleNextArrow />,
      // prevArrow: <SamplePrevArrow />,
      // arrows: true,
    };
    return (
      <div className="border m-6 object-fill h-96 mt-20 rounded-lg">
        <Slider {...settings}>
          <div onClick={() => changeDetailTopic(0)} className="text-center pt-4 pb-4">
            <div className="text-3xl mt-16 font-bold"> 본문 </div>
            <div className="text-xl mt-10">{preview.context}</div>
          </div>
          <div onClick={() => changeDetailTopic(initialId)} className="text-center pt-4 pb-4">
            <div className="text-3xl mt-16 font-bold"> 한국어 상세 토픽 </div>
            <div className="text-xl mt-10">{detailTopicList[0].context}</div>
          </div>
          <div onClick={() => changeDetailTopic(initialId + 1)} className="text-center pt-4 pb-4">
            <div className="text-3xl mt-16 font-bold"> 영어 상세 토픽</div>
            <div className="text-xl mt-10">{detailTopicList[0].context}</div>
          </div>
        </Slider>
      </div>
    );
  }
}
