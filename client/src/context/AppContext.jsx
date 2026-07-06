import { createContext, useState ,useEffect} from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from 'humanize-duration';
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";    
import { toast } from "react-toastify";

export const AppContext = createContext()

export const AppContextProvider = (props)=>{

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()

    const {getToken} = useAuth()
    const { user, isLoaded } = useUser();

    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(false)
    const [educatorRequestStatus, setEducatorRequestStatus] = useState(null)
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [userData, setUserData] = useState(null)

    //Featch All Courses
    const fetchAllCourses = async ()=>{
        try {
           const{data} = await axios.get(backendUrl + '/api/course/all' );

           if(data.success){
            setAllCourses(data.courses)
           }else{
            toast.error(data.message)
           }

        } catch (error) {
            toast.error(error.message)
        }
    }

// Fetch User Data
    const fetchUserData = async () => {
    try {
        if (!user) return;

        if (user?.publicMetadata?.role === 'educator') {
            setIsEducator(true);
        }

        const token = await getToken();

        const { data } = await axios.get(
            backendUrl + '/api/user/data',
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
            setUserData(data.user);
        }

    } catch (error) {
        toast.error(error.message);
    }
};

const fetchEducatorRequest = async () => {
    try {

        const token = await getToken();

        const { data } = await axios.get(
            backendUrl + "/api/educator/request-status",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (data.success) {
            setEducatorRequestStatus(data.status);
        }

    } catch (error) {
        console.log(error);
    }
};
    //Function to calculate average rating of course

    const calculateRating = (course)=>{
        if(course.courseRatings.length === 0){
            return 0;
        }
        let totalRating = 0
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating
        })
        return Math.floor(totalRating / course.courseRatings.length)
    }

    // Function to claculate course chapter Time
    const calculateChapterTime = (chapter)=>{
        let time =0
        chapter.chapterContent.map((lecture)=>time += lecture.lectureDuration)
        return humanizeDuration(time * 60 * 1000, {units: ["h","m"]})
    }

    // Function to claculate course duration

 const calculateCourseDuration = (course) => {
    let time = 0;

    course.courseContent.forEach((chapter) => {
        if (Array.isArray(chapter.chapterContent)) {
            chapter.chapterContent.forEach((lecture) => {
                time += lecture.lectureDuration;
            });
        }
    });

    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
};


    // Function to no of lecture in the course

    const calculateNoOfLectures = (course)=>{
        let totalLectures = 0;
        course.courseContent.forEach(chapter =>{
            if(Array.isArray(chapter.chapterContent)){
                totalLectures += chapter.chapterContent.length;
            }
        });
        return totalLectures;
    }

    // Fetch user Enrolled courses
    const fetchUserEnrolledCourses = async ()=>{
        try {
            const token = await getToken()
        const {data} = await axios.get(backendUrl + '/api/user/enrolled-courses', {headers : {
            Authorization: `Bearer ${token}` }})
            if(data.success){
                setEnrolledCourses(data.enrolledCourses.reverse())
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        fetchAllCourses()
    },[])

  useEffect(() => {
    if (isLoaded && user) {
        fetchUserData();
        fetchUserEnrolledCourses();
        fetchEducatorRequest();
    }
}, [isLoaded, user]);
            
   const value = {
    currency,
    allCourses,
    navigate,
    calculateRating,

    isEducator,
    setIsEducator,

    educatorRequestStatus,
    setEducatorRequestStatus,
    fetchEducatorRequest,

    calculateNoOfLectures,
    calculateCourseDuration,
    calculateChapterTime,

    enrolledCourses,
    fetchUserEnrolledCourses,

    backendUrl,
    userData,
    setUserData,

    getToken,
    fetchAllCourses
}

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
