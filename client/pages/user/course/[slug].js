import { useState, useEffect, createElement } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import StudentRoute from "../../../components/routes/StudentRoute";
import { Avatar, Button, Menu } from 'antd';
import ReactPlayer from 'react-player';
import ReactMarkdown from "react-markdown";
import { 
    PlayCircleOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
    CheckCircleFilled,
    MinusCircleFilled,
    SyncOutlined
} from "@ant-design/icons";
import { getErrMsg } from "../../../utils";
import { toast } from "react-toastify";

const SingleCourse = () => {
    const [clicked, setClicked] = useState(-1);
    const [collapsed, setCollapsed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [course, setCourse] = useState({ lessons: [] });

    const router = useRouter();
    const { slug } = router.query;

    const loadCourse = async() => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/user/course/${slug}`);
            setCourse(data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (slug) loadCourse();
    }, [slug]);

    const loadCompletedLessons = async() => {
        try {
            const { data } = await axios.post(`/api/list-completed`, {
                courseId: course._id
            });
            setCompletedLessons(data);
        } catch (error) {
            toast.error(getErrMsg(error));
        }
    };

    useEffect(() => {
        if (course) loadCompletedLessons();
    }, [course]);

    const items = [];

    course && course.lessons && course.lessons.map((lesson, index) => {
        items.push({
            key: index,
            icon: <Avatar onClick={() => setClicked(index)} className="ms-1 ps-1">{index + 1}</Avatar>,
            label: (
                <div
                onClick={() => setClicked(index)}
                key={index}
                className=''
                >
                    {
                        !collapsed ? 
                        (
                            <>
                                <span className="float-start"
                                style={{ overflow: 'hidden', width: '80%', textOverflow: 'ellipsis' }}
                                >{lesson.title}</span>
                                {completedLessons.includes(lesson._id) ? 
                                (<CheckCircleFilled
                                    className="float-end text-primary ms-2 me-2"
                                    style={{ marginTop: '10px', fontSize: '1.3rem' }}
                                />)
                                : (<MinusCircleFilled
                                    className="float-end text-danger ms-2 me-2"
                                    style={{ marginTop: '10px', fontSize: '1.3rem' }}
                                />)
                                }
                            </>
                        )
                        : (
                            <span>{lesson.title}</span>
                        )
                    }
                </div>
            ),
            //onClick: (e) => setCurrent(e.key)
        });
    });

    const markIncomplete = async() => {
        try {
            const { data } = await axios.post(`/api/mark-incomplete`, {
                courseId: course._id,
                lessonId: course.lessons[clicked]._id,
            });
            setCompletedLessons(data);
            toast.success('Mark Incomplete Successful.')
        } catch (err) {
            toast.error(getErrMsg(err));
        }
    }; 

    const markComplete = async({ showToast = true}) => {
        try {
            const { data } = await axios.post(`/api/mark-complete`, {
                courseId: course._id,
                lessonId: course.lessons[clicked]._id,
            });
            setCompletedLessons(data);
            showToast && toast.success('Mark Complete Successful.')
        } catch (err) {
            showToast && toast.error(getErrMsg(err));
        }
    }; 

    if (loading) return (
        <StudentRoute>
            <SyncOutlined
            span='true'
            className="d-flex justify-content-center display-1 text-primary pt-5"
            />
        </StudentRoute>
    );

    return (
        <StudentRoute>
            <div className="row">
                <div style={{ maxWidth: collapsed ? 'max-content' : '25%' }}>
                    <Button
                    onClick={() => setCollapsed(!collapsed)}
                    //style={{ width: '-webkit-fill-available' }}
                    block={collapsed ? false : true}
                    className='text-primary mt-1 mb-2 text-center'
                    >
                        {
                            createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)
                        }
                        {' '}
                        {!collapsed && 'Lessons'}
                    </Button>
                    <Menu
                    className={`${collapsed ? 'collapsed-lessons-list' : 'lessons-list'}`}
                    mode='inline'
                    defaultSelectedKeys={[clicked]}
                    inlineCollapsed={collapsed}
                    style={{ height: clicked < 0 ? '85vh' : '100%',  }}
                    items={items}
                    />
                </div>
                <div className="col">
                    {
                        clicked < 0 ?
                        (
                            <div className="d-flex justify-content-center p-5">
                                <div className="text-center p-5">
                                    <PlayCircleOutlined className="text-primary display-1 p-5"/>
                                    <p className="lead">Click on the lesson to start learning</p>
                                </div>
                            </div>
                        )
                        : (
                            <>
                                <div 
                                className="col alert alert-primary square">
                                    <b>{course.lessons[clicked].title}</b>
                                    {
                                        completedLessons.includes(course.lessons[clicked]._id) ?
                                        <span className="float-end pointer"
                                        onClick={markIncomplete}>
                                            Mark as Incomplete
                                        </span>
                                        : <span className="float-end pointer"
                                        onClick={markComplete}>
                                            Mark as Complete
                                        </span>
                                    }
                                </div>
                                {
                                    course.lessons[clicked].video && course.lessons[clicked].video.Location && (
                                        <>
                                            <div className="wrapper">
                                                <ReactPlayer
                                                className='player'
                                                url={course.lessons[clicked].video.Location}
                                                width='100%'
                                                height='80vh'
                                                controls
                                                onProgress={({ played }) => {
                                                    if (played > .95 && !completedLessons.includes(course.lessons[clicked]._id)) {
                                                        markComplete({ showToast: false });
                                                    }
                                                }}
                                                />
                                            </div>                                       
                                        </>
                                    )    
                                }
                                <ReactMarkdown
                                className='single-post mt-3 mb-3'
                                >{course.lessons[clicked].content}</ReactMarkdown>
                            </>
                        )
                    }
                </div>
            </div>
        </StudentRoute>
    );
};

export default SingleCourse;