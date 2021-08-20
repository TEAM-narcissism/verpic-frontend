

import { useContext, useEffect } from 'react';

import { UserContext } from '../Home/MainPage';

function TestingComponent() {
    const [user, setUser] = useContext(UserContext)


    console.log(user);

    return (
        <>
            {/* <div>{user.id}</div> */}
        </>
    );

}

export default TestingComponent;



