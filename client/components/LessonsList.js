import React from "react";
import { Avatar, List } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import Item from "antd/lib/list/Item";

const LessonsList = ({ 
    lessons, isCourseEdit = false, values, setValues, 
    finishUpdateCourse, handleLessonDelete, showUpdatedLesson
}) => {

    const handleDrag = (e, index) => {
        e.dataTransfer.setData('itemIndex', index);
    };

    const rearrangeLessons =  ({ allLessons, movingItemIndex, targetItemIndex }) => {        
        let movingItem = allLessons[movingItemIndex];
        allLessons.splice(movingItemIndex, 1);
        allLessons.splice(targetItemIndex, 0, movingItem);
        setValues({ ...values, lessons: [...allLessons] });
    };

    const handleDrop = async(e, index) => {        
        const movingItemIndex = +e.dataTransfer.getData('itemIndex');
        const targetItemIndex = index;
        if (movingItemIndex === targetItemIndex) return;
        let allLessons = values.lessons;

        rearrangeLessons({
            allLessons, movingItemIndex, targetItemIndex
        });
        await finishUpdateCourse({ 
            type: 'rearrange', 
            rearrangeLessonsFunc: () => rearrangeLessons({
                allLessons, movingItemIndex: targetItemIndex, targetItemIndex: movingItemIndex
            }) 
        });
    };
    
    return (
        <div className="row pb-5">
            <div className="col lesson-list">
                <h4 className="mt-2">
                    {lessons.length} Lessons
                </h4>
                <List
                onDragOver={e => e.preventDefault()}
                itemLayout='horizontal'
                dataSource={lessons}
                renderItem={(item, index) => (
                    <Item
                    draggable={isCourseEdit && !values.loading}
                    onDragStart={e => handleDrag(e, index)}
                    onDrop={e => handleDrop(e, index)}
                    >
                        <Item.Meta
                        onClick={() => isCourseEdit && showUpdatedLesson(item)}
                        avatar={<Avatar>{index + 1}</Avatar>}
                        title={item.title}
                        />
                        {
                            isCourseEdit && !values.loading &&
                            <DeleteOutlined
                            className='text-danger float-end'
                            onClick={() => handleLessonDelete(index, item)}
                            />
                        }
                    </Item>
                )}
                />
            </div>
        </div>
    );
};

export default LessonsList;