import { useContext, useState } from "react";
import { Context } from "../../context";
import { Button } from "antd";
import axios from "axios";
import { SettingOutlined, UserSwitchOutlined, LoadingOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import UserRoute from '../../components/routes/UserRoute';
import { getErrMsg } from "../../utils";

const BecomeInstructor = () => {
    const [loading, setLoading] = useState(false);
    const {state: { user }} = useContext(Context);

    const becomeInstructor = async() => {        
        try {
            setLoading(true);
            const { data } = await axios.post(`/api/make-instructor`);
            setLoading(false);
            //console.log(data);
            window.location.href = data;
        } catch (error) {
            setLoading(false);
            toast.error(getErrMsg(error));
        }
    };

    return (
        <>
            <div className="jumbotron">
                <h1 className="display-4 text-center square">Become Instructor</h1>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-md-6 offset-md-3 text-center">
                        <div className="pt-4">
                            <UserSwitchOutlined className="display-1 pb-3"/>
                            <br/>
                            <h2>Setup payout to publish course on Edemy</h2>
                            <p className="lead text-warning">
                                Edemy partners with stripe to transfer earnings to you back account
                            </p>

                            <Button
                            className="mb-3"
                            type="primary"
                            block
                            shape="round"
                            icon={loading ? <LoadingOutlined/> : <SettingOutlined/>}
                            size='large'
                            onClick={becomeInstructor}
                            disabled={
                                (user && user.role && user.role.includes('Instructor') || loading)
                            }
                            >
                                {loading ? 'Processing....' : 'Payout Setup'}
                            </Button>

                            <p className="lead">
                                You will be redirect to stripe to complete onboarding process.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BecomeInstructor;