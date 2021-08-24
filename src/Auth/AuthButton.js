import React from "react";
import oc from "open-color";
import styled from "styled-components";
import tw from "twin.macro";

const Wrapper = styled.div`
  margin-top: 1rem;
  padding-top: 0.6rem;
  padding-bottom: 0.5rem;
  font-family: 'NanumGothic-Regular';
  color: #DEDEE2;

  text-align: center;
  font-size: 1.25rem;
  font-weight: 700;

  cursor: pointer;
  user-select: none;
  transition: 0.2s all;
  background: #0D0D0E;
  &:hover {
    color: #DEDEE2;
    background: ${oc.indigo[7]};
  }

  &:active {
    background: ${oc.indigo[7]};
  }
  ${tw`rounded-lg`}
`;

const AuthButton = ({ children, onClick }) => (
  <Wrapper onClick={onClick}>{children}</Wrapper>
);

export default AuthButton;
