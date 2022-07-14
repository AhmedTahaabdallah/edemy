import { Modal } from 'antd';
import { useState } from 'react';
import ReactPlayer from 'react-player';

const PreviewModal = ({
    showModal, setShowModal, preview, modalTitle
}) => {
    return (
        <>
            {
                showModal &&
                <Modal
                title={modalTitle || 'Course Preview'}
                visible={showModal}
                onCancel={() => {
                    setShowModal(!setShowModal);                
                }}
                width='50%'
                height='60vh'
                style={{ height: '60vh !important' }}
                footer={null}
                >
                    <div className='wrapper'>
                        <ReactPlayer
                        url={preview}
                        playing={showModal}
                        controls
                        width='100%'
                        height='100%'
                        />
                    </div>
                </Modal>
            }
        </>
    );
};

export default PreviewModal;