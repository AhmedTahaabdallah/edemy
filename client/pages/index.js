import { SyncOutlined } from "@ant-design/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import CourseCard from "../components/cards/CourseCard";
import { getErrMsg } from "../utils";

export default function Home({courses}) {
//   const [loading, setLoading] = useState(true);
//   const [courses, setCourses] = useState([]);
  
//   const loadCourses = async() => {
//     try {
//         setLoading(true);
//         const { data } = await axios.get('/api/courses');
//         setLoading(false);
//         setCourses(data);
//     } catch (err) {
//         setLoading(false);
//         toast.error(getErrMsg(err));
//     }
// };

// useEffect(() => {
//     loadCourses();
// }, []);

  return (
    <div>
      <div className="jumbotron">
        <h1 className="display-4 text-center square">
          Online Education Marketplace
        </h1>
      </div>
      {
                /*loading ? 
                <SyncOutlined
                span='true'
                className="d-flex justify-content-center display-1 text-danger pt-5"
                />
                : */<div className="container-fluid">
                  <div className="row">
                    {
                      courses.map(course => <CourseCard course={course} key={course._id}/>)
                    }
                  </div>
                </div>
            }
    </div>
  )
};

export const getServerSideProps = async() => {
  const { data } = await axios.get(`${process.env.API}/courses`);
  return {
    props: {
      courses: data
    }
  };
};
