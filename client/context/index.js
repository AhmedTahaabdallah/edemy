import axios from 'axios';
import { useRouter } from 'next/router';
import { useReducer, createContext, useEffect } from 'react';
import { getErrMsg } from '../utils';

const initialState = {
    csrfToken: null,
    user: null,
};

const Context = createContext();

const rootReducer = (state, action) => {
    switch (action.type) {
        case "CHANGE_CSRFTOKEN":
            return { ...state, csrfToken: action.payload };
        case "LOGIN":
            window.localStorage.setItem('user', JSON.stringify(action.payload));
            return { ...state, user: action.payload };
        case "LOGOUT":
            window.localStorage.removeItem('user');
            return { ...state, user: null };
        default:
            return state;
    }
};

const Provider = ({ children }) => {

    const [state, dispatch] = useReducer(rootReducer, initialState);
    const router = useRouter();

    useEffect(() => {
        const userData = window.localStorage.getItem('user') || null;
        userData && dispatch({
            type: 'LOGIN',
            payload: JSON.parse(userData)
        });
    }, []);

    useEffect(() => {
        const getCsrfToken = async() => {
            const { data } = await axios.get('/api/csrf-token');
            axios.defaults.headers["X-CSRF-Token"] = data.csrfToken;
            //axios.defaults.headers.common['X-CSRF-TOKEN'] = data.csrfToken;
            dispatch({
                type: 'CHANGE_CSRFTOKEN',
                payload: data.csrfToken
            });
        };
        getCsrfToken();
    }, []);

    axios.interceptors.response.use(
        response => {
            return response;
        },
        error => {
            const res = error.response;
            if (res.status === 401/* && res.config && res.config.__isRetryRequest*/) {
                return new Promise((resolve, reject) => {
                    axios.post('/api/logout')
                    .then(() => {
                        console.log('/401 error > logout');
                        dispatch({ type: 'LOGOUT' });
                        router.push('/login');
                    })
                    .catch(err => {
                        console.log('AXIOS INTERCEPTORS ERR : ', getErrMsg(err));
                        reject(getErrMsg(error));
                    });
                });
            }
            return Promise.reject(error);
        }
    );

    return (
        <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
    );
};

export { Context, Provider };