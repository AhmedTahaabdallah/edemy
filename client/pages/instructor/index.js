import axios from "axios";
import { useEffect, useState } from "react";
import InstructorRoute from "../../components/routes/InstructorRoute";
import { toast } from 'react-toastify';
import { getErrMsg } from "../../utils";
import OneCourse from "../../components/OneCourse";
import { SyncOutlined } from "@ant-design/icons";

const InstructorIndex = () => {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);

    const loadCourses = async() => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/instructor-courses');
            setLoading(false);
            setCourses(data);
        } catch (err) {
            setLoading(false);
            toast.error(getErrMsg(err));
        }
    };

    useEffect(() => {
        loadCourses();
    }, []);

    return (
        <InstructorRoute>
            <div className="jumbotron">
                <h1 className="display-4 text-center square">Instructor</h1>
            </div>
            {
                loading ? 
                <SyncOutlined
                span='true'
                className="d-flex justify-content-center display-1 text-danger pt-5"
                />
                : courses.map(course => <OneCourse course={course} key={course._id}/>)
            }
        </InstructorRoute>
    );
};

export default InstructorIndex;