import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Context } from "../context";
import { useRouter } from "next/router";
import { getErrMsg } from "../utils";

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { state: { user } } = useContext(Context);
    
    const router = useRouter();

    useEffect(() => {
        user && router.push('/');
    }, [user]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(`/api/register`, {
                name,
                email,
                password
            });
            //console.log('data : ', data);
            setLoading(false);
            toast.success('Registration successful. please login.');
        } catch (error) {
            setLoading(false);
            console.log('error : ', getErrMsg(error));
            toast.error(getErrMsg(error));
        }
    };

    return (
        <>
            <div className="jumbotron">
                <h1 className="display-4 text-center square">Register</h1>
            </div>
            <div
            className="container col-md-4 offset-md-4 pb-5">
                <form onSubmit={handleSubmit}>
                    <input
                    type='text'
                    className="form-control mb-4 p-4"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder='Enter Name'
                    required
                    />
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
                    autoComplete="new-password"
                    />
                    <div className="d-grid gap-2">
                        <button
                        type="submit"
                        className="btn btn-block btn-primary"
                        disabled={!name || !email || !password || loading}>
                            {loading ? <SyncOutlined spin /> : 'Submit'}
                        </button>
                    </div>                    
                </form>
                <p className="text-center p-3">
                    Already Registered?{' '}
                    <Link href='/login'>
                        <a>Login</a>
                    </Link>
                </p>
            </div>
        </>
    );
};

export default Register;