import Link from 'next/link';

const UserNav = () => {
    return (
        <div className='nav flex-column nav-pills'>
            <Link href='/user'>
                <a 
                className={`nav-link ${window.location.pathname === '/user' && 'active'}`}>Dashboard</a>
            </Link>
        </div>
    );
};

export default UserNav;