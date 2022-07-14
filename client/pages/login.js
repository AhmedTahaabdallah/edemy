import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Context } from "../context";
import { useRouter } from "next/router";
import { getErrMsg } from "../utils";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { state: { user }, dispatch } = useContext(Context);

    const router = useRouter();

    useEffect(() => {
        user && router.push('/user');
    }, [user]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(`/api/login`, {
                email,
                password
            });
            dispatch({
                type: 'LOGIN',
                payload: data.user
            });
            setLoading(false);
            toast.success('Login Successful.');
            router.push('/user');
        } catch (error) {
            setLoading(false);
            console.log('error : ', getErrMsg(error));
            toast.error(getErrMsg(error));
        }
    };

    return (
        <>
            <div className="jumbotron">
                <h1 className="display-4 text-center square">Login</h1>
            </div>
            <div
            className="container col-md-4 offset-md-4 pb-5">
                <form onSubmit={handleSubmit}>
                    <input
                    type='email'
                    className="form-control mb-4 p-4"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder='Enter Email'
                    required
                    />
                    <input
                    type='password'
                    className="form-control mb-4 p-4"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder='Enter Password'
                    required
                    autoComplete="on"
                    />
                    <div className="d-grid gap-2">
                        <button
                        type="submit"
                        className="btn btn-block btn-primary"
                        disabled={!email || !password || loading}>
                            {loading ? <SyncOutlined spin /> : 'Submit'}
                        </button>
                    </div>                    
                </form>
                <p className="text-center pt-3">
                    Not Yet Registered?{' '}
                    <Link href='/register'>
                        <a>Register</a>
                    </Link>
                </p>
                <p className="text-center">
                    <Link href='/forgot-password'>
                        <a className="text-danger">Forgot Password</a>
                    </Link>
                </p>
            </div>
        </>
    );
};

export default Login;