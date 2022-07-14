import React from 'react';
import { Avatar, Badge, Button, Select } from 'antd';
import { SyncOutlined } from "@ant-design/icons";

const { Option } = Select;

const CourseForm = ({
    handleSubmit, handleChange, handleImage, handleImageRemove,
    values, setValues, preview, uploadButtonText
}) => {
    const priceChildren = [];
    priceChildren.push(<Option key='0' value={0}>$0</Option>);
    for (let i = 9.99; i <= 99.99; i++) {
        priceChildren.push(<Option key={i.toFixed(2)} value={i.toFixed(2)}>${i.toFixed(2)}</Option>);
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group mb-2">
                <input
                type='text'
                name="title"
                className="form-control"
                placeholder="Title"
                value={values.title}
                onChange={handleChange}
                />
            </div>
            <div className="form-group mb-2">
                <textarea
                name="description"
                className="form-control"
                placeholder="Description"
                value={values.description}
                onChange={handleChange}
                cols="7"
                rows="7"
                />
            </div>
            <div className="form-row mb-2">
                <div className="col d-inline-flex">
                    <div className="form-group">
                        <Select
                        style={{ width: '100%'}}
                        size="large"
                        value={values.paid}
                        onChange={v => setValues({ ...values, paid: v, price: 0 })}
                        >
                            <Option value={true}>Paid</Option>
                            <Option value={false}>Free</Option>
                        </Select>
                    </div>
                </div>
                {
                values.paid && 
                <div className="form-group d-inline-flex ms-1">
                    <Select
                    size="large"
                    value={values.price}
                    onChange={v => setValues({ ...values, price: v})}
                    >
                        {priceChildren}
                    </Select>
                </div>
            }
            </div>
            <div className="form-group mb-2">
                <input
                type='text'
                name="category"
                className="form-control"
                placeholder="Category"
                value={values.category}
                onChange={handleChange}
                />
            </div>            
            <div className="form-row mb-2">
                <div className="col">
                    <div className="form-group">
                        <label
                        className="btn btn-outline-secondary btn-block text-left"
                        >
                            {values.loading ? 'Uploading' : uploadButtonText}
                            <input 
                            type='file'
                            name="image"
                            onChange={handleImage}
                            accept='image/*'
                            hidden
                            />
                        </label>
                    </div>
                </div>
                {
                    preview &&
                    <div className='text-center'>
                        <Badge count='X' onClick={handleImageRemove}
                        style={{ cursor: values.loading ? 'default' : 'pointer' }}
                        >
                            <Avatar 
                            src={preview}
                            size={{
                                xs: 124,
                                sm: 132,
                                md: 140,
                                lg: 164,
                                xl: 180,
                                xxl: 200,
                            }}/>
                        </Badge>
                    </div>
                }
            </div>
            <div className="form-row mb-2">
                <div className="col">
                    <Button
                    onClick={handleSubmit}
                    disabled={values.loading || values.uploading}
                    className='btn btn-primary'
                    type='primary'
                    size="large"
                    shape="round"
                    >
                        {values.loading ? <SyncOutlined spin /> : values._id ? 'Update' : 'Save & Continue'}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default CourseForm;