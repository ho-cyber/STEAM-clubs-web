import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'; // Firebase Firestore
import { db } from '../../firebase'; // Firebase config
import Loader from '../../components/Loader'; // Assuming you have a loader component

const MathMain = () => {
  const [editMode, setEditMode] = useState(false);
  const [projects, setProjects] = useState({});
  const [competitions, setCompetitions] = useState({});
  const [workshops, setWorkshops] = useState({});
  const [loading, setLoading] = useState(true); // Loader state
  const [loggedIn, setLoggedIn] = useState(false); // Track if user is logged in

  // Check if user is logged in using localStorage
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    setLoggedIn(isLoggedIn === "true");
  }, []);

  // Use Firestore onSnapshot to listen for real-time updates
  useEffect(() => {
    const unsubscribeProjects = onSnapshot(doc(db, 'maths', 'projects'), (docSnapshot) => {
      setProjects(docSnapshot.data());
      setLoading(false); // Remove loader once data is fetched
    });

    const unsubscribeCompetitions = onSnapshot(doc(db, 'maths', 'competitions'), (docSnapshot) => {
      setCompetitions(docSnapshot.data());
    });

    const unsubscribeWorkshops = onSnapshot(doc(db, 'maths', 'workshops'), (docSnapshot) => {
      setWorkshops(docSnapshot.data());
    });

    return () => {
      unsubscribeProjects();
      unsubscribeCompetitions();
      unsubscribeWorkshops();
    };
  }, []);

  // Save changes to Firestore
  const handleSave = async () => {
    if (editMode) {
      await updateDoc(doc(db, 'maths', 'projects'), { description: projects.description });
      await updateDoc(doc(db, 'maths', 'competitions'), { description: competitions.description });
      await updateDoc(doc(db, 'maths', 'workshops'), { description: workshops.description });
      setEditMode(false);
    } else {
      setEditMode(true);
    }
  };

  return (
    <section className="max-container">
      <h1 className="head-text">
        <span className="blue-gradient_text drop-shadow font-semibold">
          Maths
        </span>
      </h1>

      {/* Show loader while data is being fetched */}
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex justify-end mt-5">
            {/* Show edit button if the user is logged in */}
            {loggedIn && (
              <button
                onClick={handleSave}
                className="btn text-white bg-blue-600"
              >
                {editMode ? "Save Changes" : "Edit Descriptions"}
              </button>
            )}
          </div>

          <div className="flex flex-wrap my-20 gap-16">
            {/* Display and edit Projects */}
            <div className="lg:w-[400px] w-full">
              <div className="block-container w-12 h-12">
                <div className="btn-back-red rounded-xl" />
                <div className="btn-front rounded-xl flex justify-center items-center">
                  <img src="your-icon-url" alt="projects" className="w-1/2 h-1/2 object-contain" />
                </div>
              </div>

              <div className="mt-5 flex flex-col">
                <h4 className="text-2xl font-poppins font-semibold">Projects</h4>
                {editMode ? (
                  <textarea
                    className="textarea"
                    value={projects.description || ""}
                    onChange={(e) => setProjects({ ...projects, description: e.target.value })}
                  />
                ) : (
                  <p className="mt-2 text-slate-500">{projects.description || "No description available."}</p>
                )}
                <div className="mt-5 flex items-center gap-2 font-poppins">
                  <Link
                    to="/maths/projects"
                    className="font-semibold text-blue-600"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>

            {/* Display and edit Competitions */}
            <div className="lg:w-[400px] w-full">
              <div className="block-container w-12 h-12">
                <div className="btn-back-green rounded-xl" />
                <div className="btn-front rounded-xl flex justify-center items-center">
                  <img src="your-icon-url" alt="competitions" className="w-1/2 h-1/2 object-contain" />
                </div>
              </div>

              <div className="mt-5 flex flex-col">
                <h4 className="text-2xl font-poppins font-semibold">Competitions</h4>
                {editMode ? (
                  <textarea
                    className="textarea"
                    value={competitions.description || ""}
                    onChange={(e) => setCompetitions({ ...competitions, description: e.target.value })}
                  />
                ) : (
                  <p className="mt-2 text-slate-500">{competitions.description || "No description available."}</p>
                )}
                <div className="mt-5 flex items-center gap-2 font-poppins">
                  <Link
                    to="/maths/competitions"
                    className="font-semibold text-blue-600"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>

            {/* Display and edit Workshops */}
            <div className="lg:w-[400px] w-full">
              <div className="block-container w-12 h-12">
                <div className="btn-back-blue rounded-xl" />
                <div className="btn-front rounded-xl flex justify-center items-center">
                  <img src="your-icon-url" alt="workshops" className="w-1/2 h-1/2 object-contain" />
                </div>
              </div>

              <div className="mt-5 flex flex-col">
                <h4 className="text-2xl font-poppins font-semibold">Workshops</h4>
                {editMode ? (
                  <textarea
                    className="textarea"
                    value={workshops.description || ""}
                    onChange={(e) => setWorkshops({ ...workshops, description: e.target.value })}
                  />
                ) : (
                  <p className="mt-2 text-slate-500">{workshops.description || "No description available."}</p>
                )}
                <div className="mt-5 flex items-center gap-2 font-poppins">
                  <Link
                    to="/maths/workshops"
                    className="font-semibold text-blue-600"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default MathMain;
