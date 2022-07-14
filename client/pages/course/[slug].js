import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Context } from '../../context';
import SingleCourseJumbotron from '../../components/cards/SingleCourseJumbotron';
import PreviewModal from '../../components/modal/PreviewModal';
import SingleCourseLessons from '../../components/cards/SingleCourseLessons';
import { toast } from 'react-toastify';
import { getErrMsg } from '../../utils';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import Head from 'next/head'

const SingleCourse = ({course}) => {
    const [showModal, setShowModal] = useState(false);
    const [preview, setPreview] = useState('');
    const [modalTitle, setModalTitle] = useState(null);
    const [loading, setLoading] = useState(false);
    const [enrolled, setEnrolled] = useState({});

    const router = useRouter();

    const { state: { user } } = useContext(Context);

    const checkEnrolment = async() => {
      try {
        const { data } = await axios.get(`/api/check-enrolment/${course._id}`);
        //console.log(data);
        setEnrolled(data);
      } catch (error) {
        toast.error(getErrMsg(err));
      }
    };

    useEffect(() => {
      user && course && checkEnrolment();
    }, [user, course]);

    const handlePaidEnrollment = async(e) => {
      e.preventDefault();
      if (!user) {
        router.push('/login');
        return;
      }
      if (enrolled.status) {
        router.push(`/user/course/${enrolled.course.slug}`);
        return;
      }
      try {
        setLoading(true);
        const { data } = await axios.post(`/api/paid-enrolment/${course._id}`);
        setLoading(false);
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
        stripe.redirectToCheckout({ sessionId: data });
      } catch (error) {
        toast.error(getErrMsg(error));
        setLoading(false);
      }
    };

    const handleFreeEnrollment = async(e) => {
      e.preventDefault();
      if (!user) {
        router.push('/login');
        return;
      }
      if (enrolled.status) {
        router.push(`/user/course/${enrolled.course.slug}`);
        return;
      }
      try {
        setLoading(true);
        const { data } = await axios.post(`/api/free-enrolment/${course._id}`);
        setLoading(false);
        toast.success(data.message);
        router.push(`/user/course/${data.course.slug}`);
      } catch (error) {
        toast.error(getErrMsg(error));
        setLoading(false);
      }
    };

    return (
      <>
        {
          course &&
          <Head>
            <title>{course.title}</title>
            <meta name="description" content={course.description}></meta>
          </Head>
        }
        <SingleCourseJumbotron
        course={course} 
        showModal={showModal} 
        setShowModal={setShowModal}
        setPreview={setPreview}
        setModalTitle={setModalTitle}
        user={user}
        loading={loading}
        handlePaidEnrollment={handlePaidEnrollment}
        handleFreeEnrollment={handleFreeEnrollment}
        enrolled={enrolled}
        setEnrolled={setEnrolled}
        />
        <PreviewModal
        showModal={showModal} 
        setShowModal={setShowModal} 
        preview={preview}
        modalTitle={modalTitle}
        />
        {
            course.lessons &&
            <SingleCourseLessons 
            lessons={course.lessons}
            setPreview={setPreview}
            showModal={showModal} 
            setShowModal={setShowModal} 
            setModalTitle={setModalTitle}
            />
        }
      </>
    );
};

export const getServerSideProps = async(context) => {
    const { query } = context;
    const { data } = await axios.get(`${process.env.API}/course/${query.slug}`);
    return {
      props: {
        course: data
      }
    };
  };

export default SingleCourse;