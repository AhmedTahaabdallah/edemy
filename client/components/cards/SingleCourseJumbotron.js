import { Badge, Button } from 'antd';
import { useRef } from 'react';
import ReactPlayer from 'react-player';
import { currencyFormatter } from '../../utils';
import { LoadingOutlined, SafetyOutlined } from "@ant-design/icons";

const SingleCourseJumbotron = ({
    course, showModal, setShowModal,
    setModalTitle, setPreview,
    user, loading, handlePaidEnrollment, handleFreeEnrollment,
    enrolled, setEnrolled
}) => {
    const playerRef = useRef(null);

    const { 
        title, description, instructor,
        updatedAt, lessons, image,
        price, paid, category
    } = course;

    return (
        <div className="jumbotron bg-primary square pt-5 pb-5">
            <div className='row ps-3 pe-3' style={{ '--bs-gutter-x': '0rem' }}>
                <div className='col-md-8 pe-5'>
                    <h1 className='text-light font-weight-bold'>{title}</h1>
                    <p className='lead'>{description && description.substring(0, 160)}...</p>
                    <Badge
                    count={category}
                    style={{ backgroundColor: '#03a9f4' }}
                    className='pb-4 me-2'
                    />
                    <p>Created By {instructor.name}</p>
                    <p>Last Updated {new Date(updatedAt).toLocaleDateString()}</p>
                    <h4 className='text-light'>
                        {
                            paid ?
                            currencyFormatter({
                                amount: price,
                                currency: 'usd'
                            })
                            : 'Free'
                        }
                    </h4>
                </div>
                <div className='col-md-4'>
                    {
                        lessons[0] && lessons[0].video && lessons[0].video.Location ?
                        <div 
                        onClick={() => {
                            setPreview(lessons[0].video.Location);
                            setShowModal(!showModal);
                            setModalTitle(null);
                            if (playerRef) {
                                playerRef.current.showPreview();
                            }
                        }}
                        >
                            <ReactPlayer
                            ref={playerRef}
                            className='react-player-div'
                            url={lessons[0].video.Location}
                            light={image.Location}                            
                            width='100%'
                            height='225px'
                            playing={false}
                            />
                        </div>
                        : (
                            <img
                            src={image.Location}
                            alt={title}
                            className='img img-fluid'
                            />
                        )
                    }
                    {
                        user && (user.role.includes('Instructor')
                        || user.role.includes('Admin')) ?
                        null
                        : loading ?
                        <div className='d-flex justify-content-center'>
                            <LoadingOutlined className='h1 text-danger'/>
                        </div>
                        : <Button
                        className='mb-3 mt-3 bg-danger'
                        type='primary'
                        block
                        shape='round'
                        icon={<SafetyOutlined/>}
                        size='large'
                        disabled={loading}
                        onClick={paid ? handlePaidEnrollment : handleFreeEnrollment}
                        >
                            {
                                user ? 
                                enrolled.status ? 
                                'Go To Course' 
                                : 'Enroll' 
                                : 'Login To Enroll'
                            }
                        </Button>
                    }
                </div>    
            </div>            
        </div>
    );
};

export default SingleCourseJumbotron;