import React, { useState } from "react";
import { Modal } from "antd";
import AddLessonForm from "./forms/LessonForm";
import axios from "axios";
import { toast } from 'react-toastify';
import { getErrMsg } from "../utils";

const LessonModal = ({ 
    visible, setVisible, values, originalVideo,
    setValues, slug, course, setCourse,
    initValues ={
        title: '',
        content: '',
        video: {},
    }
}) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleChange = e => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleVideo = async(e) => {        
        try {
            if (uploading) return;
            const file = e.target.files[0];
            if (!file) return;
            setUploading(true);
            const videoData = new FormData();
            videoData.append('video', file);
            videoData.append('courseId', course._id);
            const { data } = await axios.post(`/api/course/video-upload/${course.instructor._id}`, videoData, {
                onUploadProgress: e => setProgress(Math.round((100 * e.loaded) / e.total))
            });
            if (
                originalVideo && originalVideo.Key && values && values.video
                && values.video.Key && originalVideo.Key !== values.video.Key
            ) {
                await handleVideoRemove();
            }  
            setProgress(0);
            setUploading(false);
            setValues({ ...values, video: data });
        } catch (err) {
            setProgress(0);
            setUploading(false);
            toast.error(getErrMsg(err));
        }
    };

    const handleVideoRemove = async() => {  
        if (
            originalVideo && originalVideo.Key && values && values.video
            && values.video.Key && originalVideo.Key === values.video.Key
        ) {
            console.log(originalVideo.Key, values.video.Key);
            setValues({ ...values, video: {} });
            return;
        }      
        try {
            if (uploading || !values || !values.video || !values.video.Key) return;
            setUploading(true);
            const { data } = await axios.post(`/api/course/remove-file`, {
                file: values.video
            });
            setUploading(false);
            setValues({ ...values, video: {} });
        } catch (err) {
            setUploading(false);
            toast.error(getErrMsg(err));
        }
    };

    const finishAxiosRequest = async() => {
        if (values._id) {
            const { data } = await axios.put(`/api/course/lesson/${slug}`, {
                values
            });
            return data;
        } else {
            const { data } = await axios.post(`/api/course/lesson/${slug}/${course.instructor._id}`, {
                values
            });
            return data;
        }
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (uploading) return;
        if (!values.video) toast.error('Please Select Video.');
        try {
            setUploading(true);
            const data = await finishAxiosRequest();
            setUploading(false);
            setVisible(false);
            setValues(initValues);
            //console.log(data)
            console.log(course)
            setCourse({ ...course, lessons: data});
            toast.success(`Lesson ${values._id ? 'Updated' : 'Added'}.`);
        } catch (err) {
            setUploading(false);
            toast.error(getErrMsg(err));
        }
    };

    return visible && (
        <Modal
        title={`${values._id ? 'Edit' : 'Add'} Lesson`}
        centered
        visible={visible}
        onCancel={() => {
            setVisible(false);
            if (
                (originalVideo && originalVideo.Key && values && values.video
                && values.video.Key && originalVideo.Key !== values.video.Key) ||
                (!originalVideo && values && values.video && values.video.Key)
            ) {
                handleVideoRemove();
            } 
        }}
        footer={null}
        >
            <AddLessonForm
            values={values}
            setValues={setValues}
            handleChange={handleChange} 
            handleVideo={handleVideo}
            handleVideoRemove={handleVideoRemove}
            handleSubmit={handleSubmit}
            uploading={uploading}
            progress={progress}
            />
        </Modal>
    );
};

export default LessonModal;