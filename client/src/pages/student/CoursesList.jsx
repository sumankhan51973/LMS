import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import SearchBar from "../../components/student/SearchBar";
import CourseCard from "../../components/student/CourseCard";
import Footer from "../../components/student/Footer";
import Loading from "../../components/student/Loading";
import { assets } from "../../assets/assets";

const CoursesList = () => {
  const { navigate, allCourses, calculateRating } = useContext(AppContext);

  const { input } = useParams();

  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [selectedRating, setSelectedRating] = useState(0);

  const categories = [
    "All",
    ...new Set(
      allCourses
        .map((course) => course.courseCategory)
        .filter(Boolean)
    ),
  ];

  useEffect(() => {
    if (!allCourses.length) return;

    let temp = [...allCourses];

    // Search
    if (input) {
      temp = temp.filter((course) =>
        course.courseTitle
          .toLowerCase()
          .includes(input.toLowerCase())
      );
    }

    // Category
    if (selectedCategory !== "All") {
      temp = temp.filter(
        (course) =>
          course.courseCategory === selectedCategory
      );
    }

    // Price
    if (selectedPrice === "Free") {
      temp = temp.filter(
        (course) => Number(course.coursePrice) === 0
      );
    }

    if (selectedPrice === "Paid") {
      temp = temp.filter(
        (course) => Number(course.coursePrice) > 0
      );
    }

    // Rating
    if (selectedRating > 0) {
      temp = temp.filter(
        (course) =>
          calculateRating(course) >= selectedRating
      );
    }

    setFilteredCourses(temp);
    setLoading(false);
  }, [
    allCourses,
    input,
    selectedCategory,
    selectedPrice,
    selectedRating,
    calculateRating,
  ]);

  if (loading) return <Loading />;

  return (
    <>
      <div className="md:px-36 px-6 pt-20 pb-16">

        {/* Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">

          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Course List
            </h1>

            <p className="text-gray-500 mt-2">
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => navigate("/")}
              >
                Home
              </span>{" "}
              / Course List
            </p>
          </div>

          <SearchBar data={input} />
        </div>

        {/* Search Tag */}
        {input && (
          <div className="inline-flex items-center gap-3 border rounded-lg px-4 py-2 mt-8">
            <span>{input}</span>

            <img
              src={assets.cross_icon}
              alt=""
              className="cursor-pointer w-4"
              onClick={() => navigate("/course-list")}
            />
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-8 mt-10">

          {/* Sidebar */}
          <div className="border rounded-xl shadow-sm p-5 h-fit bg-white">

            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-semibold">
                Filters
              </h2>

              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedPrice("All");
                  setSelectedRating(0);
                }}
                className="text-sm text-blue-600"
              >
                Clear
              </button>
            </div>
            
            {/* Price */}
            <div className="mb-8">

              <h3 className="font-semibold mb-3">
                Price
              </h3>

              <label className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  name="price"
                  checked={selectedPrice === "All"}
                  onChange={() =>
                    setSelectedPrice("All")
                  }
                />
                All
              </label>

              <label className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  name="price"
                  checked={selectedPrice === "Free"}
                  onChange={() =>
                    setSelectedPrice("Free")
                  }
                />
                Free
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="price"
                  checked={selectedPrice === "Paid"}
                  onChange={() =>
                    setSelectedPrice("Paid")
                  }
                />
                Paid
              </label>

            </div>

            {/* Rating */}
            <div>

              <h3 className="font-semibold mb-3">
                Rating
              </h3>

              {[4, 3, 2, 1].map((star) => (
                <label
                  key={star}
                  className="flex items-center gap-2 mb-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={
                      selectedRating === star
                    }
                    onChange={() =>
                      setSelectedRating(star)
                    }
                  />

                  {"⭐".repeat(star)} & Up
                </label>
              ))}

              <label className="flex items-center gap-2 mt-2">
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRating === 0}
                  onChange={() =>
                    setSelectedRating(0)
                  }
                />
                All Ratings
              </label>

            </div>

          </div>

          {/* Course List */}
          <div className="md:col-span-3">

            <p className="mb-5 text-gray-600">
              Showing{" "}
              <span className="font-semibold">
                {filteredCourses.length}
              </span>{" "}
              Courses
            </p>

            {filteredCourses.length === 0 ? (
              <div className="text-center py-20 text-gray-500 text-lg">
                No Courses Found
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                  />
                ))}
              </div>
            )}

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default CoursesList;