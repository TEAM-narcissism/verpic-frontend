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
    const { 
      preview, 
      detailTopicList, 
      initialDetailTopic, 
      changeDetailTopic,
      selectedDetailTopic
    } = this.props;
    const initialId = initialDetailTopic;

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      // nextArrow: <SampleNextArrow />,
      // prevArrow: <SamplePrevArrow />,
      arrows: false,
    };
    return (
      <div className="object-fill h-96 rounded-lg ">
        <Slider {...settings}>
          <div onClick={() => changeDetailTopic(0)} className="text-center pb-4">
            <div className="p-1 border-b-2 text-2xl font-semibold"> 본문 </div>
            <div className="text-gray-700 my-10 mx-3 text-2xl pt-20 pb-20" >
                {preview.context}
            </div>
          </div>
          <div onClick={() => changeDetailTopic(detailTopicList[0].id)} className="text-center pb-4">
            <div className="p-1 border-b-2 text-2xl font-semibold"> 한국어 상세 토픽 </div>
            <div className={selectedDetailTopic === detailTopicList[0].id ? 
              "cursor-pointer ring-4 shadow-lg ring-gray-300 rounded-xl text-gray-700 text-2xl my-10 mx-3 py-20": 
              "cursor-pointer text-gray-700 my-10 mx-3 text-2xl pt-20 pb-20"}>
              {detailTopicList[0].context}
            </div>
          </div>
          <div onClick={() => changeDetailTopic(detailTopicList[1].id)} className="text-center pb-4">
            <div className="p-1 border-b-2 text-2xl font-semibold"> 영어 상세 토픽</div>
            <div className={selectedDetailTopic === detailTopicList[1].id ? 
              "cursor-pointer ring-4 shadow-lg ring-gray-300 rounded-xl text-gray-700 text-2xl my-10 mx-3 py-20": 
              "cursor-pointer text-gray-700 my-10 mx-3 text-2xl pt-20 pb-20"}>
              {detailTopicList[1].context}
            </div>
          </div>
        </Slider>
      </div>
    );
  }
}
