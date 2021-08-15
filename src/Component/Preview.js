import React, { useEffect, useState } from "react";

import Axios from "axios";
import ExpressionList from "./ExpressionList";
import Navigator from "../Component/Navigator";
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
      <Navigator />
      <div className="pt-4 pb-4">
        <div className="text-3xl font-bold mb-1">예습하기</div>
        <div className="text-gray-600 mb-3">Topic 주제</div>
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
            {/* <input placeholder="예시답안 작성란"></input> */}
            <UserAnswerList />
          </div>
        </div>
      </div>
    </>
  );
}

export default Preview;
