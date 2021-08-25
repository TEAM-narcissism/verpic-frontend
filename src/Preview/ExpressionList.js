import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { Component } from "react";

import Slider from "react-slick";

function Expression({ expression }) {
  return (
    <div className="pt-4 pb-4 text-xl">
      <div className="pt-2 pb-2">단어: {expression.word}</div>
      <div className="pt-2 pb-2">뜻: {expression.meaning}</div>
      <div className="pt-2 pb-2">예문: {expression.example}</div>
      <div className="pt-2 pb-2">
        발음:
        <audio controls className="pt-2 pb-2">
          <source src={"data:audio/mpeg;base64," + expression.pronounce} type="audio/mpeg" />
          <p>Your browser does not support the audio element.!</p>
        </audio>
      </div>

    </div>
  );
}

export default class ExpressionList extends Component {
  render() {
    const { expressionList } = this.props;

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
          {expressionList.map((expression) => (
            <div>
              <Expression expression={expression} />
            </div>
          ))}
        </Slider>
      </div>
    );
  }
}
