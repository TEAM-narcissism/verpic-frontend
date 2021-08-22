import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { Component } from "react";

import Slider from "react-slick";

// function SampleNextArrow(props) {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{ ...style, display: "block", background: "black" }}
//       onClick={onClick}
//     />
//   );
// }

// function SamplePrevArrow(props) {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{ ...style, display: "block", background: "black" }}
//       onClick={onClick}
//     />
//   );
// }

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
      arrows: false,
    };
    return (
      <div>
        <Slider {...settings}>
          <div onClick={() => changeDetailTopic(0)} className="text-center pt-4 pb-4">
            <div className="text-2xl"> 본문 </div>
            <h3>{preview.context}</h3>
          </div>
          <div onClick={() => changeDetailTopic(initialId)} className="text-center pt-4 pb-4">
            <div className="text-2xl"> 한국어 상세 토픽 </div>
            <h3>{detailTopicList[0].context}</h3>
          </div>
          <div onClick={() => changeDetailTopic(initialId + 1)} className="text-center pt-4 pb-4">
            <div className="text-2xl"> 영어 상세 토픽</div>
            <h3>{detailTopicList[0].context}</h3>
          </div>
        </Slider>
      </div>
    );
  }
}
