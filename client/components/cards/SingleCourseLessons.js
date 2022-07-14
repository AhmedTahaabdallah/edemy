import { List, Avatar } from "antd";
import Item from "antd/lib/list/Item";

const SingleCourseLessons = ({ 
    lessons, setPreview, setShowModal, setModalTitle
}) => {
    return (
        <div className="container">
            <div className="row">
                <div className="col lesson-list">
                    {lessons && <h4>{lessons.length} Lessons</h4>}
                    <hr/>
                    <List
                    itemLayout='horizontal'
                    dataSource={lessons}
                    renderItem={(item, index) => (
                        <Item>
                            <Item.Meta
                            avatar={<Avatar>{index + 1}</Avatar>}
                            title={item.title}
                            />
                            {
                                item.video && item.video !== null 
                                && item.video.Location && item.free_preview &&
                                <span
                                className="text-primary"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    setPreview(item.video.Location);
                                    setShowModal(true);
                                    setModalTitle(item.title);
                                }}
                                >
                                    Preview
                                </span>
                            }
                        </Item>
                    )}
                    />
                </div>
            </div>
        </div>
    );
};

export default SingleCourseLessons;