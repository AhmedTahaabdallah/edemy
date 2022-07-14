import axios from "axios";
import { useState } from "react";
import InstructorRoute from "../../../components/routes/InstructorRoute";
import CourseForm from "../../../components/forms/CourseForm";
import Resizer from "react-image-file-resizer";
import { toast } from 'react-toastify';
import { getErrMsg } from "../../../utils";
import { useRouter } from "next/router";

const CourseCreate = () => {
    const [values, setValues] = useState({
        title: '',
        description: '',
        category: '',
        price: '9.99',
        uploading: false,
        paid: true,
        loading: false,
        imagePreview: '',
    });
    const [image, setImage] = useState({});
    const [preview, setPreview] = useState('');
    const [uploadButtonText, setUploadButtonText] = useState('Upload Image');

    const router = useRouter();

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
                setPreview(data.Location);
                if (image) {
                    await handleImageRemove();
                }
                setImage(data);
            } catch (err) {
                setValues({ ...values, loading: false });
                toast.error(getErrMsg(err));
            }
        });
    };

    const handleImageRemove = async () => {
        if (values.loading) return;
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

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!image || !image.key) {
            toast.error('Please Select Image.');
            return;
        }
        try {
            setValues({ ...values, loading: true });
            const { data } = await axios.post('/api/course', {
                ...values,
                image
            });
            setValues({ ...values, loading: false });
            toast.success('Great! Now you can start adding lessons.');
            router.push('/instructor');
        } catch (err) {
            setValues({ ...values, loading: false });
            toast.error(getErrMsg(err));
        }
    };

    

    return (
        <InstructorRoute>
            <div className="jumbotron">
                <h1 className="display-4 text-center square">Course Create</h1>
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
        </InstructorRoute>
    );
};

export default CourseCreate;