import Link from 'next/link';

const InstructorNav = () => {
    return (
        <div className='nav flex-column nav-pills'>
            <Link href='/instructor'>
                <a 
                className={`nav-link ${window.location.pathname === '/instructor' && 'active'}`}>Dashboard</a>
            </Link>
            <Link href='/instructor/course/create'>
                <a 
                className={`nav-link ${window.location.pathname === '/instructor/course/create' && 'active'}`}>Create Course</a>
            </Link>
        </div>
    );
};

export default InstructorNav;