const INITIAL_STATE = {
    user: {
        id: "",
        firstName: "",
        lastName: "",
        birthDate: "",
        email: "",
        firstLanguage: "",
        learnLanguage: ""
    }
}

export const getUsers = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case "GET_USER" :
            if(action.key === 'USER') {
                console.log("유저등록...");
                console.log(action.payload.id);
                return {
                    user: {
                        ...action.payload
                    }
                }
            }
            else if(action.key === 'ID') {
                console.log('id');
                return {
                    user: {
                        ...state.user,
                        id: action.payload
                    }
                }
            }

        default:
            return state;
    }
}