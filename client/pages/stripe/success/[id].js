import { useEffect } from "react";
import { SyncOutlined } from "@ant-design/icons";
import UserRoute from "../../../components/routes/UserRoute";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from 'react-toastify';
import { getErrMsg } from "../../../utils";

const StripeSuccess = () => {
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id) successRequest();
    }, [id]);

    const successRequest = async() => {
        try {
            const { data } = await axios.get(`/api/stripe-success/${id}`);
            //console.log(data.course)
            router.push(`/user/course/${data.course.slug}`);
        } catch (error) {
            toast.error(getErrMsg(error));
        }
    };

    return (
        <UserRoute showNav={false}>
            <div className="row text-center">
                <div className="col-md-9">
                    <SyncOutlined span="true" className="display text-danger p-5"
                    style={{ fontSize: '5rem' }}
                    />
                </div>
                <div className="col-md-3"></div>
            </div>
        </UserRoute>
    );
};

export default StripeSuccess;