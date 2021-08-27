import React from 'react';
import { useTranslation } from 'react-i18next';

import styled from '@emotion/styled';
import tw from 'twin.macro';

const PageUl = styled.ul`

  font-family: 'NanumGothic-Regular';
  ${tw`w-full text-gray-400 bg-white border-2 rounded-lg text-center mb-5 flex-col py-1`}
`;

const PageLi = styled.li`
  display:inline-block;

  &:hover{
    color:white;
    background-color:#263A6C;
    border-radius:10%;
  }
  &:focus::after{
    color:white;
    background-color:#263A6C;
    border-radius:10%;
  }
  ${tw`bg-white cursor-pointer py-2`}
`;

const PageSpan = styled.span`

  ${tw`p-1 w-full mx-3`}
`;

const DaySorting = ({ dayPaginate, today }) => {
  const dayList = ["MON", "TUES", "WED", "THUR", "FRI", "SAT", "SUN"];
  const { t, i18n } = useTranslation('daysorting');

  return (
    <div className="">
      <nav>
        <PageUl className="pagination">
          {dayList.map(day => (
            <PageLi key={day} onClick={() => dayPaginate(day)} className={today === day ? "text-indigo-700 font-semibold" : "page-item"}>
              <PageSpan className="page-link" >
                {t(day)}
              </PageSpan>
            </PageLi>
          ))}
        </PageUl>
      </nav>
    </div>
  );
};

export default React.memo(DaySorting);