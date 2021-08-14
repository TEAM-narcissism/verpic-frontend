import React from 'react';
import styled from '@emotion/styled';
import tw from 'twin.macro';

const PageUl = styled.ul`
  font-family: 'NanumGothic-Regular';
  ${tw`text-gray-400 bg-white border rounded-lg text-center mx-10 mb-5 flex-col py-1`}
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
${tw`p-1 w-full mx-3 font-semibold`}
`;

const Pagination = ({ topicsPerPage, totalTopics, paginate }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalTopics / topicsPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <div>
      <nav>
        <PageUl className="pagination">
          {pageNumbers.map(number => (
            <PageLi key={number} className="page-item">
              <PageSpan onClick={() => paginate(number)} className="page-link">
                {number}
              </PageSpan>
            </PageLi>
          ))}
        </PageUl>
      </nav>
    </div>
  );
};

export default React.memo(Pagination);