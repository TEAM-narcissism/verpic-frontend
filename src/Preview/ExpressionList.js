import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { Component } from "react";

import Slider from "react-slick";

function Expression({ expression }) {
  return (
    <div className="pt-4 pb-4 pl-2 text-xl">
      <div className="pt-2 pb-2 pl-2"><strong>단어: </strong>{expression.word}</div>
      <div className="pt-2 pb-2 pl-2"><strong>뜻: </strong>{expression.meaning}</div>
      <div className="pt-2 pb-2 pl-2"><strong>예문: </strong>{expression.example}</div>
      <div className="pt-2 pb-2 pl-2">
        <strong>발음:</strong>
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
              <Expression expression={expression} key={expression.id} />
            </div>
          ))}
        </Slider>
      </div>
    );
  }
}
