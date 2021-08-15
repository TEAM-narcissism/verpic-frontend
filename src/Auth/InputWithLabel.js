import React from "react";
import oc from "open-color";
import styled from "@emotion/styled";
import tw from "twin.macro";

// 두개가 함께 있을땐 상단 (그 사이) 에 여백을 준다
const Wrapper = styled.div`
  ${tw``}
`;

const Label = styled.div`
  font-size: 1rem;
  color: ${oc.gray[6]};
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  width: 100%;
  outline: none;
  line-height: 2.5rem;
  font-size: 1.2rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;

  ${tw`border rounded-md mb-3`}
`;

const InputWithLabel = ({ label, ...rest }) => (
  <Wrapper>
    <Label>{label}</Label>
    <Input {...rest} />
  </Wrapper>
);

export default InputWithLabel;
