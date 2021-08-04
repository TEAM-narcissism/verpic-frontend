import React, { useState, useEffect } from 'react';
import Card from './Card';

function CardList() {
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
                <input type="checkbox" name="topic" value="{topic.topicId}" />
                <Card topic={topic} key={i} />
            </label>
        );
    });

    return (
        <div>{topic}</div>
    );
}

export default CardList;