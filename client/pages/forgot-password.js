import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import { Context } from "../context";
import { useRouter } from "next/router";
import { getErrMsg } from "../utils";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { state: { user, csrfToken }, dispatch } = useContext(Context);

    const router = useRouter();

    useEffect(() => {
        user && router.push('/');
    }, [user]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (success) {
                const { data } = await axios.post(`/api/reset-password`, {
                    email,
                    code,
                    newPassword
                });
                setLoading(false);
                setSuccess(true);
                toast.success('Great!! Now You can login with new password.');
                router.push('/login');
            } else {
                const { data } = await axios.post(`/api/forgot-password`, {
                    email
                });
                setLoading(false);
                setSuccess(true);
                toast.success('Check your email for the secret code.');
            }
        } catch (error) {
            setLoading(false);
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
                    {/* {
                        csrfToken && <input type="hidden" name="_csrf" value={csrfToken}></input>
                    } */}
                    {
                        success ?
                        <>
                            <input
                            type='text'
                            className="form-control mb-4 p-4"
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            placeholder='Enter Secret Code'
                            required
                            autoComplete="new-password"
                            />
                            <input
                            type='password'
                            className="form-control mb-4 p-4"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            placeholder='Enter New Password'
                            required
                            autoComplete="new-password"
                            />
                        </>
                        : <input
                        type='email'
                        className="form-control mb-4 p-4"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder='Enter Email'
                        required
                        />
                    }
                    <div className="d-grid gap-2">
                        <button
                        type="submit"
                        className="btn btn-block btn-primary"
                        disabled={loading || (success ? (!code || !newPassword) : !email)}>
                            {loading ? <SyncOutlined spin /> : 'Submit'}
                        </button>
                    </div>                    
                </form>
            </div>
        </>
    );
};

export default ForgotPassword;