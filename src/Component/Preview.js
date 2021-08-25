import React, { useEffect, useState } from "react";

import Axios from "axios";
import ExpressionList from "./ExpressionList";
import Navigator from "../Component/Navigator";
import PreviewandDetail from "./PreviewandDetail";
import UserAnswerList from "./UserAnswerList";
import { useParams } from "react-router";

function Preview() {
  const [detailTopicId, setDetailTopicId] = useState(0);
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

  const { previewId } = useParams();

  useEffect(() => {
    Axios.get("/previewsets/" + previewId).then((response) => {
      if (response.data) {
        console.log(response.data);
        setPreviewset(response.data);
      } else {
        alert("fail");
      }
    });
  }, []);

  return (
    <div className="bg-gray-200">
      <Navigator />
      <div className="pt-4 pb-4 pl-12">
        <div className="text-3xl font-bold mb-1">예습하기</div>
        <div className="text-gray-600 mb-3">Topic 주제</div>
      </div>

      <div className="grid grid-cols-2 space-x-6">
        <div className="border-4 border-white bg-white rounded-lg ml-8 mb-8 shadow-lg">
          <div
            style={{ "font-family": "NanumGothic-Bold" }}
            className="border-b-4 text-4xl text-center pt-4 pb-4"
          >
            Topic or 질문사항
          </div>
          <PreviewandDetail
            preview={previewset.preview}
            detailTopicList={previewset.detailTopicList}
            initialDetailTopic={(previewId - 1) * 2 + 1}
            changeDetailTopic={setDetailTopicId}
          />
        </div>

        <div className="space-y-6 mb-8">
          <div className="border-4 border-white bg-white rounded-lg mr-8 shadow-lg">
            <div
              style={{ "font-family": "NanumGothic-Bold" }}
              className="border-b-4 text-4xl text-center pt-4 pb-4"
            >
              표현학습 List
            </div>
            <ExpressionList expressionList={previewset.expressionList} />
          </div>

          <div className="border-4 border-white bg-white rounded-lg mr-8 shadow-lg">
            <div
              style={{ "font-family": "NanumGothic-Bold" }}
              className="border-b-4 text-4xl text-center pt-4 pb-4"
            >
              질문
            </div>
            {/* <input placeholder="예시답안 작성란"></input> */}
            <UserAnswerList whichDetailTopic={detailTopicId} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Preview;
