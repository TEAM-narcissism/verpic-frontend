import React, { useEffect, useState } from "react";

import axios from "axios";
import ExpressionList from "./ExpressionList";
import Navigator from "../Common/Navigator";
import PreviewandDetail from "./PreviewandDetail";
import UserAnswerList from "./UserAnswerList";
import { useParams } from "react-router";
import getuser from "../Api/getuser";
import styled from '@emotion/styled';
import tw from 'twin.macro';

const PreviewWrapper = styled.div`
  font-family: 'NanumGothic-Regular';
  ${tw`container text-black mx-auto`};
`;

const PreviewText = styled.div`
${tw`text-3xl font-semibold mb-1 text-black mt-10`}
`;

const PreviewContextWrapper = styled.div`
  font-family: 'NanumGothic-Regular';
  ${tw`grid grid-cols-2 space-x-6 mx-auto`}
`;

const ContextAndDetailTopicWrapper = styled.div`
  font-family: 'NanumGothic-Regular';
  ${tw`border-2 border-white bg-white rounded-xl shadow-lg w-full m-1 px-2`}
`;

const ExpressionAndQuestionWrapper = styled.div`
  font-family: 'NanumGothic-Regular';
  ${tw`space-y-6 w-full m-1 px-2`}
`;

const ComponentTheme = styled.div`
  ${tw`border-b-2 text-2xl text-center p-1 font-semibold`}
`;



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
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { previewId } = useParams();

  useEffect(() => {
    getuser()
      .then(
        res => {
          setUser(res);
        });

    axios.get("/previewsets/" + previewId).
      then((res) => {
        if (res.data) {
          console.log(res.data);
          setPreviewset(res.data);
          setIsLoading(false);
        } else {
          alert("fail");
        }
      });
  }, []);

  return (
    <div className="max-w-full bg-gray-100 h-120vh">
      <Navigator focus="신청목록" user={user} />
      {isLoading ? <div class="flex btn btn-lg btn-ghost loading mx-auto">loading</div> :
        <>
          <PreviewWrapper>


            <PreviewText>예습하기</PreviewText>
            <div className="text-gray-600 text-lg mb-1">
              {previewset.topicDto.korTheme}
            </div>


            <PreviewContextWrapper>
              <ContextAndDetailTopicWrapper>

                <PreviewandDetail
                  preview={previewset.preview}
                  detailTopicList={previewset.detailTopicList}
                  initialDetailTopic={(previewId - 1) * 2 + 1}
                  changeDetailTopic={setDetailTopicId}
                  selectedDetailTopic={detailTopicId}
                />

              </ContextAndDetailTopicWrapper>

              <ExpressionAndQuestionWrapper>
                <div className="border-2 border-white bg-white rounded-xl shadow-lg">
                  <ComponentTheme>
                    표현 예습하기
                  </ComponentTheme>
                  <ExpressionList expressionList={previewset.expressionList} />
                </div>

                <div className="border-2 border-white bg-white rounded-xl shadow-lg">
                  <ComponentTheme>미리 생각해보기</ComponentTheme>

                  <UserAnswerList whichDetailTopic={detailTopicId} />
                </div>
              </ExpressionAndQuestionWrapper>
            </PreviewContextWrapper>
          </PreviewWrapper>
        </>
      }
    </div>
  );
}

export default Preview;
