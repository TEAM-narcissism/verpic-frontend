import React, { useState, useRef } from "react";
import tw from "twin.macro";




const ProgressNode = React.memo(function ProgressNode({ active, name }) {

    if (active) {
        return <li class="step step-primary">{name}</li>
    }
    else {
        return <li class="step">{name}</li>
    }
})

function ProgressBar({ step }) {
    // step : 0 ~ 4
    const [nodeNames, setNodeNames] = useState([
        {
            id: 1,
            name: "자기소개"
        },
        {
            id: 2,
            name: "한국어세션"
        },
        {
            id: 3,
            name: "영어세션"
        },
        {
            id: 4,
            name: "마무리"
        },
    ]);
    return <ul class="w-full steps">
        {nodeNames.map((nodeName) => (
            <ProgressNode active={nodeName.id <= step} name={nodeName.name} key={nodeName.id}/>
        ))}
    </ul>
}

export default React.memo(ProgressBar);