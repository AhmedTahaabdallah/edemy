import { CloudSyncOutlined } from "@ant-design/icons";
import UserRoute from "../../components/routes/UserRoute";

const StripeCancel = () => {
    return (
        <UserRoute showNav={false}>
            <div className="row text-center">
                <div className="col-md-9">
                    <CloudSyncOutlined className="display text-danger p-5"
                    style={{ fontSize: '5rem' }}
                    />
                    <p className="lead">Payment Failed. Try Again.</p>
                </div>
                <div className="col-md-3"></div>
            </div>
        </UserRoute>
    );
};

export default StripeCancel;