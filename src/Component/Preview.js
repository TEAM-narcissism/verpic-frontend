import React, { useEffect, useState } from "react";

import Axios from "axios";
import ExpressionList from "./ExpressionList";
import Navigator from "../Component/Navigator";
import PreviewandDetail from "./PreviewandDetail";
import UserAnswerList from "./UserAnswerList";
import styled from "@emotion/styled";
import tw from "twin.macro";

const PreviewSetText = styled.div`
  ${tw`text-3xl font-bold mb-1 mx-10 select-none`};
`;

const PreviewSetWrapper = styled.div`
  font-family: "NanumGothic-Regular";
  ${tw`container mx-auto my-auto`}
`;

const PreviewandDetailWrapper = styled.div`
  ${tw` mx-10 overflow-hidden rounded-lg border shadow-sm cursor-pointer sm:flex mb-10 hover:shadow-lg duration-500`}
`;

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
      <PreviewSetText>예습하기</PreviewSetText>
      <div class="text-gray-600 mb-3 mx-10 select-none">Topic 주제</div>

      <PreviewSetWrapper>
        <div className="grid grid-cols-2 space-x-2">
          <div className="border rounded-lg">
            <PreviewandDetail
              preview={previewset.preview}
              detailTopicList={previewset.detailTopicList}
            />
          </div>

          <div className="space-y-2">
            <div className="border rounded-lg">
              <h1 className="border-b-2 border-black">표현학습 List</h1>
              <ExpressionList expressionList={previewset.expressionList} />
            </div>

            <div className="border rounded-lg">
              <h1 className="border-b-2 border-black">질문</h1>
              {/* <input placeholder="예시답안 작성란"></input> */}
              <UserAnswerList />
            </div>
          </div>
        </div>
      </PreviewSetWrapper>
    </>
  );
}

export default Preview;
