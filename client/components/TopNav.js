import { useContext, useEffect, useState } from "react";
import { Menu } from "antd";
import Link from "next/link";
import {
    AppstoreOutlined,
    UserOutlined,
    LoginOutlined,
    UserAddOutlined
} from "@ant-design/icons";
import { Context } from "../context";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const TopNav = () => {
    const [current, setCurrent] = useState('');

    const { state: { user }, dispatch } = useContext(Context);

    const router = useRouter();

    useEffect(() => {
        const pathname = window.location.pathname;
        if (current !== pathname)
        process.browser && setCurrent(pathname);
    });

    const logout = async() => {
        dispatch({ type: 'LOGOUT' });
        const { data } = await axios.post('/api/logout');
        toast.success(data.message);
        router.push('/login')
    };

    const items = [
        {
            key: '/',
            icon: <AppstoreOutlined/>,
            label: (
                <Link href='/'>
                    <a>App</a>
                </Link>
            ),
            //onClick: (e) => setCurrent(e.key)
        },        
    ];
    user && items.push({
        label: user && user.name,
        key: 'SubMenu',
        style: { float: 'right'},
        children: [
            {
                key: '/user',
                label: (
                    <Link href='/user'>
                        <a>Dashboard</a>
                    </Link>
                ),
                className: window.location.pathname.includes('/user') && "ant-menu-item-selected"    
            },
            {
                key: 'logout',
                icon: <LoginOutlined/>,
                label: 'Logout',            
                onClick: () => logout()
            }
        ]
    });
    !user && items.push({
        key: '/register',
        icon: <UserAddOutlined/>,
        label: (
            <Link href='/register'>
                <a>Register</a>
            </Link>
        ),
        style: { float: 'right'},   
        //onClick: (e) => setCurrent(e.key)
    });
    !user && items.push({
        key: '/login',
        icon: <LoginOutlined/>,
        label: (
            <Link href='/login'>
                <a>Login</a>
            </Link>
        ),
        style: { float: 'right'},   
        //onClick: (e) => setCurrent(e.key)
    });
    user && user.role && user.role.includes('Instructor') ?
    items.push({
        key: '/instructor',
        icon: <UserOutlined/>,
        label: (
            <Link href='/instructor' >
                <a>Instructor</a>
            </Link>
        ),  
        style: { float: 'right'},   
        className: window.location.pathname.includes('/instructor') && "ant-menu-item-selected"
        //onClick: (e) => setCurrent(e.key)
    })
    : user && items.push({
        key: '/user/become-instructor',
        icon: <UserAddOutlined/>,
        label: (
            <Link href='/user/become-instructor'>
                <a>Become Instructor</a>
            </Link>
        ),
        //onClick: (e) => setCurrent(e.key)
    });

    return (
        <Menu 
        className="mb-2"
        mode="horizontal" 
        items={items} 
        selectedKeys={[current]} 
        style={{ display: 'flow-root'}}
        />
    );
};

export default TopNav;