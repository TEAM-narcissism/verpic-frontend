

import Cookies from 'universal-cookie';
import axios from 'axios';



function isAuthorized() {
     
    const cookies = new Cookies();
    const token = cookies.get('vtoken');

    if(!token) {
        console.log("토큰 없어")
        return false;
    } else {
        // try{
        //     const userObject =  await axios.get('/users/current-login-user', {headers: {
        //         'Authorization': token
        //     }});
        //     console.log("여기!");
        //     return true;
        // }
        // catch(error) {

        //     return false;
        // }

        return true;
    }
}




export default isAuthorized;