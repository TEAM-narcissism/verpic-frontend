import React from "react";
import SimpleSlider from "./Carousel";

function Preview() {
  return (
    <>
      <div className="pt-4 pb-4">
        <h2>예습하기</h2>
        <h4>Topic 주제</h4>
      </div>

      <div className="grid grid-cols-2 space-x-2">
        <div className="border-2 border-black">
          <h1 className="border-b-2 border-black">Topic or 질문사항</h1>
          <SimpleSlider />
        </div>

        <div className="space-y-2">
          <div className="border-2 border-black">
            <h1 className="border-b-2 border-black">표현학습 List</h1>
            <h4>단어</h4>
            <h4>뜻</h4>
            <h4>예문</h4>
          </div>

          <div className="border-2 border-black">
            <h1 className="border-b-2 border-black">질문</h1>
            <input placeholder="예시답안 작성란"></input>
          </div>
        </div>
      </div>
    </>
  );
}

export default Preview;
