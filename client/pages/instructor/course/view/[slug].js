import { 
    CheckOutlined, CloseCircleOutlined, EditOutlined, QuestionOutlined, 
    SyncOutlined, UploadOutlined, UserSwitchOutlined
} from "@ant-design/icons";
import { Avatar, Tooltip, Button } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import { getErrMsg } from "../../../../utils";
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import LessonsList from "../../../../components/LessonsList";
import LessonModal from "../../../../components/LessonModal";

const initValues = {
    title: '',
    content: '',
    video: {},
};

const CourseView = () => {
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [course, setCourse] = useState({});
    const [values, setValues] = useState(initValues);
    const [students, setStudents] = useState(0);

    const router = useRouter();
    const { slug } = router.query;

    const loadCourse = async() => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/course/${slug}`);
            setLoading(false);
            setCourse(data);
        } catch (err) {
            setLoading(false);
            toast.error(getErrMsg(err));
        }
    };

    useEffect(() => {
        slug && loadCourse();
    }, [slug]);

    const loadStudentsCount = async() => {
        try {
            const { data } = await axios.post(`/api/instructor/students-count`, {
                courseId: course._id
            });
            setStudents(data);
        } catch (err) {
            
        }
    };

    useEffect(() => {
        course && loadStudentsCount();
    }, [course]);

    const handlePublish = async(e, courseId) => {        
        try {
            const answer = window.confirm(
                'Once You publish your course, it will be live in the marketplace for users to enroll'
            );
            if (!answer) return;
            const { data } = await axios.post(`/api/course/publish/${courseId}`);
            setCourse(data);
            toast.success('Congrats! Your Course is Live.');
        } catch (err) {
            toast.error(getErrMsg(err));
        }
    };

    const handleUnpublish = async(e, courseId) => {        
        try {
            const answer = window.confirm(
                'Once You unpublish your course, it will no be available for users to enroll'
            );
            if (!answer) return;
            const { data } = await axios.post(`/api/course/unpublish/${courseId}`);
            setCourse(data);
            toast.success('Your course is Unpublish.');
        } catch (err) {
            toast.error(getErrMsg(err));
        }
    };

    return (
        <InstructorRoute>
            <div className="container-fluid pt-3">
                {
                    loading ?
                    <SyncOutlined
                    span='true'
                    className="d-flex justify-content-center display-1 text-danger pt-5"
                    />
                    : course && <div className="container-fluid pt-1 col">
                        <div className="media-body ps-3 pt-2 row" >
                            <Avatar
                            //className="d-flex"
                            src={course.image && course.image.Location ? course.image.Location : '/course.jpeg'}
                            size={{
                                xs: 84,
                                sm: 92,
                                md: 100,
                                lg: 124,
                                xl: 140,
                                xxl: 160,
                            }}/>
                            <div className="row" style={{ display: 'contents'}}>
                                <div className="col">
                                    <h5 className="mt-4 text-primary">{course.title}</h5>
                                    <p style={{ marginTop: '-10px'}}>
                                        {course.lessons && course.lessons.length} Lessons
                                    </p>
                                    <p style={{ marginTop: '-15px', fontSize: '12px'}}>
                                        {course.category}
                                    </p>                                    
                                </div>

                                <div style={{ display: 'contents' }}>
                                <Tooltip 
                                    title={`${students} Enrolled`}>
                                        <UserSwitchOutlined 
                                        className="h5 pointer text-info me-3 mt-4"
                                        style={{ cursor: 'pointer' }}/>
                                    </Tooltip>
                                    <Tooltip 
                                    title='Edit'
                                    onClick={() => router.push(`/instructor/course/edit/${course.slug}`)}>
                                        <EditOutlined 
                                        className="h5 pointer text-warning me-4 mt-4"
                                        style={{ cursor: 'pointer' }}/>
                                    </Tooltip>
                                    {
                                        course.lessons && course.lessons.length < 5 ?
                                        <Tooltip 
                                        title='Min 5 Lessons Required to publish'>
                                            <QuestionOutlined 
                                            className="h5 pointer text-danger mt-4"/>
                                        </Tooltip>
                                        :                                     
                                        <Tooltip title={course.publish ? 'unpublish' : 'Publish'}>
                                            {
                                                course.publish ? 
                                                <CloseCircleOutlined 
                                                onClick={e => handleUnpublish(e, course._id)}
                                                className="h5 pointer text-danger mt-4"
                                                style={{ cursor: 'pointer' }}/>
                                                : <CheckOutlined
                                                onClick={e => handlePublish(e, course._id)}
                                                className="h5 pointer text-success mt-4"
                                                style={{ cursor: 'pointer' }}/>
                                            }
                                        </Tooltip>

                                    }
                                </div>
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col">
                                <ReactMarkdown>{course.description}</ReactMarkdown>
                            </div>
                        </div>

                        <div className="row">
                            <Button 
                            onClick={() => {
                                setValues(initValues);
                                setVisible(true);
                            }}
                            className='col-md-6 offset-md-3 text-center mt-2 mb-2'
                            type="primary"
                            shape="round"
                            icon={<UploadOutlined/>}
                            size='large'
                            >
                                Add Lesson
                            </Button>                            
                        </div>

                        <LessonModal
                        visible={visible} 
                        setValues={setValues}
                        setVisible={setVisible} 
                        values={values}
                        slug={slug} 
                        course={course}
                        setCourse={setCourse}
                        />

                        {
                            course && course.lessons && 
                            <LessonsList lessons={course.lessons}/>
                        }
                    </div>
                }
            </div>
        </InstructorRoute>
    );
};

export default CourseView;