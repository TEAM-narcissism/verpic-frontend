import Navigator from '../Component/Navigator';
import ReservationForm from '../Component/ReservationForm';
import CardList from '../Component/CardList';

function MainPage() {

    return (
        <>
            <Navigator/>
            <div class="container flex">
                <CardList />
                <ReservationForm/>
                <div class="mt-5">
                    <button class="p-1 border text-white border-black bg-black rounded" onClick={() => window.open('/studychat', '_blank')}>VideoChat</button>
                </div>
            </div>
        </>
    );
}

export default MainPage;