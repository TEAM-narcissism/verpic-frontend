import React, { useState, useEffect } from 'react';
import Card from './Card';

const CardList = React.memo(({ onChange }) => {
    const [topics, setTopic] = useState([{ topicId: "", theme: "", numOfParticipant: 0, studyDate: "" }]);
    useEffect(() => {
        fetch('/topic/MON')
            .then(response => response.json())
            .then(topics => {
                setTopic(topics)
            });
    }, []);

    const topic = topics.map((topic, i) => {
        console.log(topic)
        return (
            <label>
                <input type="radio" name="topic" value={topic.topicId} onChange={onChange} />
                &nbsp;
                <Card topic={topic} key={i} />
            </label>
        );
    });

    return (
        <>{topic}</>
    );
});

export default CardList;