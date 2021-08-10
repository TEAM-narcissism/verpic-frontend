import Navigator from '../Component/Navigator';
import ReservationForm from '../Component/ReservationForm';
import CardList from '../Component/CardList';
import styled from '@emotion/styled';

import tw from 'twin.macro';

function MainPage() {

    const HomeComponentWrapper = styled.div`

        ${tw `container mx-auto flex my-10`}
    `;

    return (
        <>
            <Navigator/>
            <HomeComponentWrapper>
                <CardList />
                <ReservationForm/>

                {/* <div class="mt-5">
                    <button class="p-1 border text-white border-black bg-black rounded" onClick={() => window.open('/studychat', '_blank')}>VideoChat</button>
                </div> */}

            </HomeComponentWrapper>
        </>
    );
}

export default MainPage;