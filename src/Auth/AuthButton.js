import React from 'react';
import styled from 'styled-components';
import oc from 'open-color';
import tw from 'twin.macro';

const Wrapper = styled.div`
    margin-top: 1rem;
    padding-top: 0.6rem;
    padding-bottom: 0.5rem;

    color: white;

    text-align: center;
    font-size: 1.25rem;
    font-weight: 500;

    cursor: pointer;
    user-select: none;
    transition: .2s all;

    &:hover {
        background: ${oc.blue[5]};
    }

    &:active {
        background: ${oc.blue[7]};
    }
    ${tw`bg-blue-400`}
`;

const AuthButton = ({children, onClick}) => (
    <Wrapper onClick={onClick}>
        {children}
    </Wrapper>
);

export default AuthButton;