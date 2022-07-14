import React from "react";
import { Avatar, Tooltip } from 'antd';
import Link from "next/link";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const OneCourse = ({ course }) => {
    const myStyle = { marginTop: '-15px', fontSize: '12px' };

    return (
        <div className="media d-flex pt-2 row" >
            <Avatar
            src={course.image && course.image.Location ? course.image.Location : '/course.jpeg'}
            size={{
                xs: 44,
                sm: 52,
                md: 60,
                lg: 84,
                xl: 100,
                xxl: 120,
            }}/>

            <div className="media-body ps-3 row" style={{ display: 'contents' }}>
                <div className="col">
                    <Link
                    href={`/instructor/course/view/${course.slug}`}
                    className='pointer'
                    >
                        <a className="mt-2 text-primary">
                            <h5 className="pt-2">{course.title}</h5>
                        </a>
                    </Link>
                    <p style={{ marginTop: '-5px'}}>
                        {course.lessons && course.lessons.length} Lessons
                    </p>

                    {
                        course.lessons.length < 5 ?
                        (<p style={myStyle} className="text-warning">
                            At least 5 lessons are required to publish a course
                        </p>)
                        : course.publish ?
                        (<p style={myStyle} className="text-success">Your course is live in the marketplace</p>)
                        : (<p style={myStyle} className="text-success">Your course is ready to be published</p>)
                    }
                </div>
                <div className="col-md-1 mt-3 text-center">
                    {
                        course.publish ?
                        (
                            <Tooltip title='Published'>
                                <CheckCircleOutlined className="h5 pointer text-success"/>
                            </Tooltip>
                        )
                        : 
                        (
                            <Tooltip title='Unpublished'>
                                <CloseCircleOutlined className="h5 pointer text-warning"/>
                            </Tooltip>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default OneCourse;