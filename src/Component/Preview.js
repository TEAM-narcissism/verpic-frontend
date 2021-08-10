import React, { useEffect, useState } from "react";

import Axios from "axios";
import ExpressionList from "./ExpressionList";
import PreviewandDetail from "./PreviewandDetail";
import UserAnswerList from "./UserAnswerList";

function Preview() {
  const [previewset, setPreviewset] = useState({
    preview: {
      context: "",
    },
    detailTopicList: [
      {
        context: "",
      },
    ],
    expressionList: [
      {
        word: "",
        meaning: "",
        example: "",
        pronounce: "",
      },
    ],
  });

  useEffect(() => {
    Axios.get("/previewsets/1").then((response) => {
      if (response.data) {
        console.log(response.data);
        setPreviewset(response.data);
      } else {
        alert("fail");
      }
    });
  }, []);

  return (
    <>
      <div className="pt-4 pb-4">
        <h2>예습하기</h2>
        <h4>Topic 주제</h4>
      </div>

      <div className="grid grid-cols-2 space-x-2">
        <div className="border-2 border-black">
          <h1 className="border-b-2 border-black">Topic or 질문사항</h1>
          <PreviewandDetail
            preview={previewset.preview}
            detailTopicList={previewset.detailTopicList}
          />
        </div>

        <div className="space-y-2">
          <div className="border-2 border-black">
            <h1 className="border-b-2 border-black">표현학습 List</h1>
            <ExpressionList expressionList={previewset.expressionList} />
          </div>

          <div className="border-2 border-black">
            <h1 className="border-b-2 border-black">질문</h1>
            <input placeholder="예시답안 작성란"></input>
            {/* <UserAnswerList userAnswerList={previewset.} /> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Preview;
