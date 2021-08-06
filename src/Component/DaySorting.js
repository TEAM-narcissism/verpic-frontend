import React from 'react';
import styled from '@emotion/styled';

const PageUl = styled.ul`
  float:left;
  list-style: none;
  text-align:center;
  border-radius:3px;
  color:white;
  padding:1px;
  margin:10px;
  border-top:3px solid #186EAD;
  border-bottom:3px solid #186EAD;
  background-color: rgba( 0, 0, 0, 0.4 );
`;

const PageLi = styled.li`
  display:inline-block;
  font-size:17px;
  font-weight:600;
  padding:5px;
  border-radius:5px;
  width:50px;
  &:hover{
    cursor:pointer;
    color:white;
    background-color:#263A6C;
  }
  &:focus::after{
    color:white;
    background-color:#263A6C;
  }
`;

const PageSpan = styled.span`
  &:hover::after,
  &:focus::after{
    border-radius:100%;
    color:white;
    background-color:#263A6C;
  }
`;

const DaySorting = ({ dayPaginate, resetAll }) => {
  const dayList = ["MON", "TUES", "WED", "THUR", "FRI", "SAT", "SUN"];

  return (
    <div>
      <nav>
        <PageUl className="pagination">
          {dayList.map(day => (
            <PageLi key={day} className="page-item">
              <PageSpan className="page-link" onClick={() => dayPaginate(day)} onChange={resetAll}>
                {day}
              </PageSpan>
            </PageLi>
          ))}
        </PageUl>
      </nav>
    </div>
  );
};

export default DaySorting;