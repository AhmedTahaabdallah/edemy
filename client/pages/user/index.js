import axios from "axios";
import { useContext, useEffect, useState} from "react";
import UserRoute from "../../components/routes/UserRoute";
import { Context } from "../../context";
import { Avatar } from 'antd';
import Link from "next/link";
import { SyncOutlined, PlayCircleOutlined } from "@ant-design/icons";

const UserIndex = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { state: { user } } = useContext(Context);

    const loadCourses = async() => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/user-courses');
            setCourses(data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourses();
    }, []);
    return (
        <UserRoute>
            {
                loading && <SyncOutlined
                span="true"
                className="d-flex justify-content-center display-1 text-danger p-5"
                />
            }
            <div className="jumbotron">
                <h1 className="display-4 text-center square">User Dashboard</h1>
            </div>
            {
                courses && courses.map(course => (
                    <div key={course._id} className='media d-flex pt-2 pb-1 ps-2 row'>
                        <Avatar 
                        size={80}
                        shape='square'
                        src={course.image ? course.image.Location : '/course.png'}
                        />
                        <div className="media-body ps-3 pe-2 row" style={{ display: 'contents' }}>
                            <div className="col">
                                <Link href={`/user/course/${course.slug}`}
                                className='pointer'>
                                    <a><h5 className="mt-2 text-primary">{course.title}</h5></a>
                                </Link>
                                <p style={{ marginTop: '-10px' }}>{course.lessons.length} Lessons</p>
                                <p className="text-muted" style={{ marginTop: '-15px', fontSize: '12px' }}>By {course.instructor.name}</p>
                            </div>
                            <div className="col-md-1 mt-3 text-center">
                            <Link href={`/user/course/${course.slug}`}>
                                    <a><PlayCircleOutlined className="h2 pointer text-primary"/></a>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))
            }
        </UserRoute>
    );
};

export default UserIndex;