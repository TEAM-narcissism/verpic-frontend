import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';

function Logout(){
    const cookies = new Cookies;
    const options = {
      path: '/',
    };
    cookies.remove('vtoken', options);
    //cookies.set('vtoken', '', {path: '/'});

    return <Redirect to="/"></Redirect>

}

export default Logout;