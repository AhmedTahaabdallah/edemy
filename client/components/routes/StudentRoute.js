import { useEffect, useState } from "react";
import axios from "axios";
import { getErrMsg } from "../../utils";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";

const StudentRoute = ({ children }) => {
    const [ok, setOk] = useState(false);

    const router = useRouter();

    const fetchUser = async() => {
        try {
            const { data } = await axios.get(`/api/current-user`);
            //console.log('data : ', data);
            data.ok && setOk(true);
        } catch (error) {
            console.log('error : ', getErrMsg(error));
            setOk(false);
            router.push('/login');
        }
    };

    useEffect(() => {        
        fetchUser();
    }, []);

    return (
        <>
            { 
                !ok ? 
                <SyncOutlined
                span='true'
                className="d-flex justify-content-center display-1 test-primary p-5"
                /> 
                : <div className="container-fluid">
                    {children}
                </div>
            }
        </>
    );
};

export default StudentRoute;