import React, { useState, useEffect } from 'react';
import Card from './Card';
import Pagination from './Pagination';
import DaySorting from './DaySorting';

function CardList({ onChange, resetAll }) {

    const [topics, setTopics] = useState([{ topicId: "", theme: "", numOfParticipant: 0, studyDate: "" }]);
    const [currentPage, setCurrentPage] = useState(1);
    const [topicsPerPage, setTopicsPerPage] = useState(5);
    const [day, setDay] = useState("MON");

    useEffect(() => {
        fetch('/topic/' + day)
            .then(response => response.json())
            .then(topics => {
                setTopics(topics)
            })
            .then(console.log(day));
    }, [day]);

    const indexOfLast = currentPage * topicsPerPage;
    const indexOfFirst = indexOfLast - topicsPerPage;
    function currentTopics(tmp) {
        let currentTopics = 0;
        currentTopics = tmp.slice(indexOfFirst, indexOfLast);
        return currentTopics;
    }

    const filteredTopics = topics.filter((topic) =>
        topic.theme !== "" && topic.topicId !== "" && topic.studyDate !== ""
    )

    const filteredTopicsByPaging = currentTopics(filteredTopics);

    const topic = filteredTopicsByPaging.map((topic, i) => {
        console.log(topic)
        return (
            <label key={i}>
                <input type="radio" name="topic" value={topic.topicId} onClick={onChange} />
                <Card topic={topic} />
            </label>
        );
    });

    return (
        <>
            <DaySorting dayPaginate={setDay} resetAll={resetAll} />
            {topic}
            <Pagination topicsPerPage={topicsPerPage} totalTopics={topics.length} paginate={setCurrentPage}></Pagination>
        </>
    );
}

export default CardList;