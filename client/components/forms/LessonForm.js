import { CloseCircleFilled } from "@ant-design/icons";
import { Button, Progress, Switch, Tooltip } from "antd";
import React from "react";
import ReactPlayer from 'react-player';

const LessonForm = ({
    values, setValues, handleChange, handleVideo,handleVideoRemove,
    handleSubmit, uploading, progress
}) => {
    
    return (
        <div className="container pt-3">
            <form onSubmit={handleSubmit} id='lesson-form'>
                <input
                type='text'
                className="form-control square"
                name="title"
                onChange={handleChange}
                value={values.title}
                placeholder='Title'
                autoFocus
                required
                />
                <textarea
                rows={7}
                cols={7}
                className="form-control mt-3 mb-3"
                name="content"
                onChange={handleChange}
                value={values.content}
                placeholder='Content'
                />
                <div className="d-flex mb-4">
                    <label className="btn btn-dark btn-block tex-left mt-2">
                        Upload Video
                        <input 
                        onChange={handleVideo}
                        type='file'
                        accept="video/*"
                        hidden
                        />
                    </label>
                    {
                        !uploading && values.video.Location && (
                            <Tooltip 
                            title='Remove'                           
                            >
                                <span 
                                onClick={handleVideoRemove}
                                className='ps-3'>
                                    <CloseCircleFilled
                                    className="text-danger d-flex justify-content-center pt-3 pointer"
                                    style={{ cursor: 'pointer', fontSize: '22px' }}
                                    />
                                </span>
                            </Tooltip>
                        )
                    }
                </div>
                {
                    progress > 0 && uploading && 
                    (
                        <Progress
                        className="d-flex justify-content-center"
                        percent={progress}
                        steps={10}
                        />
                    )
                }
                {
                    !uploading && values && values.video && values.video.Location &&
                    <div className='d-flex justify-content-center'>
                        <ReactPlayer                        
                        url={values.video.Location}
                        width='100%'
                        height='30vh'
                        controls
                        />
                    </div>
                }

                <div className="d-flex justify-content-between">
                    <span className="pt-3 ps-0 badge" style={{ color: '#000', fontSize: '14px' }}>Preview</span>
                    <Switch
                    className="float-right mt-2"
                    disabled={uploading}
                    checked={values.free_preview}
                    name='free_preview'
                    onChange={v => setValues({ ...values, free_preview: v })}
                    />
                </div>

                <Button
                onClick={handleSubmit}
                className='col-md-6 offset-md-3 mt-4 mb-2 tex-center'
                size="large"
                type="primary"
                loading={uploading}
                shape='round'
                >
                    {values._id ? 'Update' : 'Save'}
                </Button>
            </form>
        </div>
    );
};

export default LessonForm;