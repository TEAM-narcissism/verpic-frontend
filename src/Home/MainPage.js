import Navigator from '../Component/Navigator';
import ReservationForm from '../Component/ReservationForm';
import CardList from '../Component/CardList';
import styled from '@emotion/styled';
import {useState, useRef} from 'react';
import tw from 'twin.macro';

function MainPage() {
    const [topicId, setTopicId] = useState("");

    const HomeComponentWrapper = styled.div`
        ${tw `container mx-auto flex my-10`}
    `;

    const cardRef = useRef();


    const topicOnClick = (e) => {
        e.preventDefault();
        setTopicId(e.target.value);
        console.log(e.target.value);
        cardRef.current.focus();
    };

    return (
        <>
            <Navigator/>
            <HomeComponentWrapper>
                <CardList onCardClick={topicOnClick} cardRef={cardRef}/>
                <ReservationForm/>

                {/* <div class="mt-5">
                    <button class="p-1 border text-white border-black bg-black rounded" onClick={() => window.open('/studychat', '_blank')}>VideoChat</button>
                </div> */}

            </HomeComponentWrapper>
        </>
    );
}

export default MainPage;