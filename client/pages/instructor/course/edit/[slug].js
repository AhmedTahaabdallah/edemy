import axios from "axios";
import { useEffect, useState } from "react";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import CourseForm from "../../../../components/forms/CourseForm";
import Resizer from "react-image-file-resizer";
import { toast } from 'react-toastify';
import { getErrMsg } from "../../../../utils";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";
import LessonsList from "../../../../components/LessonsList";
import LessonModal from "../../../../components/LessonModal";

const CourseEdit = () => {
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [currentUpdatedLesson, setCurrentUpdatedLesson] = useState({});
    const [originalValues, setOriginalValues] = useState({});
    const [originalVideo, setOriginalVideo] = useState({});
    const [values, setValues] = useState({
        title: '',
        description: '',
        category: '',
        price: '9.99',
        uploading: false,
        paid: true,
        loading: false,
        image: '',
    });
    const [image, setImage] = useState({});
    const [preview, setPreview] = useState('');
    const [uploadButtonText, setUploadButtonText] = useState('Upload Image');

    const router = useRouter();
    const { slug } = router.query;

    const loadCourse = async() => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/course/${slug}`);
            setLoading(false);
            setValues({ ...values, ...data});
            setOriginalValues({ ...data });
            data && data.image && setImage({...data.image});
            data && data.image && data.image.Location && setPreview(data.image.Location);
        } catch (err) {
            setLoading(false);
            toast.error(getErrMsg(err));
        }
    };

    useEffect(() =>{
        slug && loadCourse();
    }, [slug]);

    const handleChange = e => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleImage = (e) => {
        if (values.loading) return;
        const file = e.target.files[0];
        if (!file) return;
        //setPreview(window.URL.createObjectURL(file));  
        //setUploadButtonText(file.name);
        setPreview('');
        setValues({ ...values, loading: true });

        Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async(uri) => {
            try {
                const { data } = await axios.post('/api/course/upload-image', {
                    image: uri
                });
                setValues({ ...values, loading: false }); 
                if (image && image.Location && values.image.Location !== image.Location) {                    
                    await handleImageRemove();
                }                     
                setPreview(data.Location);
                setImage(data);
            } catch (err) {
                setValues({ ...values, loading: false });
                toast.error(getErrMsg(err));
            }
        });
    };

    const handleImageRemove = async () => {
        if (values.loading || !image || !image.key) return;
        if (preview === values.image.Location) {
            setPreview('');
            setImage({});
            return;
        }
        try {
            setValues({ ...values, loading: true });
            const { data } = await axios.post('/api/course/remove-file', {
                file: image
            });
            setValues({ ...values, loading: false });
            setPreview('');
            setImage({});
        } catch (err) {
            setValues({ ...values, loading: false });
            toast.error(getErrMsg(err));
        }
    }; 

    const handleLessonDelete = async (index, item) => {
        if (values.loading) return;
        const answer = window.confirm(`Are You Sure About Deleting ${item.title}?`);
        if (!answer) return;
        let allLessons = values.lessons;
        const removed = allLessons.splice(index, 1);
        try {           
            setValues({ ...values, lessons: [...allLessons] });
            const { data } = await axios.put(`/api/course/${slug}/${removed[0]._id}`);
            toast.success('Delete Lesson Successfully.');
        } catch (err) {
            allLessons.splice(index, 0, removed[0]);
            setValues({ ...values, lessons: [...allLessons] });
            toast.error(getErrMsg(err));
        }
    }; 

    const showUpdatedLesson = oneLesson => {
        setVisible(true);
        setCurrentUpdatedLesson(oneLesson);
        setOriginalVideo(oneLesson.video);
    }

    const finishUpdateCourse = async({ type, rearrangeLessonsFunc }) => {
        try {
            const { data } = await axios.put(`/api/course/${slug}`, type === 'edit' ? {
                ...values,
                image
            } : {
                ...originalValues,
                image
            });
            type === 'edit' && setValues({ ...values, loading: false });
            toast.success(type === 'edit' ? 'Course Updated.' : 'Lessons Rearrange Successfully.');
            type === 'edit' && router.push('/instructor');
        } catch (err) {
            type === 'edit' && setValues({ ...values, loading: false });
            type === 'rearrange' && rearrangeLessonsFunc();
            toast.error(getErrMsg(err));
        }
        
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (values.loading) return;
        if (!image || !image.key) {
            toast.error('Please Select Image.');
            return;
        }
        try {
            setValues({ ...values, loading: true });
            await finishUpdateCourse({ type: 'edit' });
        } catch (err) {
            setValues({ ...values, loading: false });
            toast.error(getErrMsg(err));
        }
    };

    

    return (
        loading ?
        <SyncOutlined
        span='true'
        className="d-flex justify-content-center display-1 text-danger pt-5"
        />
        : <InstructorRoute>
            <div className="jumbotron">
                <h1 className="display-4 text-center square">Update Course</h1>
            </div>
            <div className="pt-3 pb-3">
                <CourseForm
                handleSubmit={handleSubmit} 
                handleChange={handleChange} 
                handleImage={handleImage} 
                handleImageRemove={handleImageRemove}
                values={values} 
                setValues={setValues}
                preview={preview}
                uploadButtonText={uploadButtonText}
                />
            </div>
            {
                values && values.lessons && 
                <div>
                    <hr/>
                    <LessonsList 
                    lessons={values.lessons} 
                    isCourseEdit={true}
                    values={values}
                    setValues={setValues}
                    finishUpdateCourse={finishUpdateCourse}
                    handleLessonDelete={handleLessonDelete}
                    showUpdatedLesson={showUpdatedLesson}
                    />
                </div>
            }
            <LessonModal
            visible={visible} 
            setValues={setCurrentUpdatedLesson}
            setVisible={setVisible} 
            values={currentUpdatedLesson}
            slug={slug} 
            course={values}
            setCourse={setValues}
            originalVideo={originalVideo}
            />
        </InstructorRoute>
    );
};

export default CourseEdit;