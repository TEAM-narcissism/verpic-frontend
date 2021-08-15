import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { Component } from "react";

import Slider from "react-slick";

function Expression({ expression }) {
  return (
    <div>
      <h4>단어 {expression.word}</h4>
      <h4>뜻 {expression.meaning}</h4>
      <h4>예문 {expression.example}</h4>
      <h4>발음 {expression.pronounce}</h4>
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
