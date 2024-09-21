import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc } from "firebase/firestore"; // Firestore functions
import { CTA } from "../../components";
import { arrow } from "../../assets/icons";

const db = getFirestore(); // Ensure this is your Firestore instance

const EngCompetitions = () => {
  const [competitions, setCompetitions] = useState([]);
  const [newCompetition, setNewCompetition] = useState({ name: "", description: "", link: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  // Check if user is logged in
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);
  }, []);

  // Fetch competitions from Firestore
  useEffect(() => {
    const fetchCompetitions = () => {
      const competitionsCollection = collection(db, "engineering_competitions");
      const unsubscribe = onSnapshot(competitionsCollection, (snapshot) => {
        const fetchedCompetitions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCompetitions(fetchedCompetitions);
      });

      return () => unsubscribe();
    };

    fetchCompetitions();
  }, []);

  // Handle input change for new competition
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCompetition((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle creating a new competition
  const handleCreateCompetition = async () => {
    if (newCompetition.name && newCompetition.description && newCompetition.link) {
      const docRef = await addDoc(collection(db, "engineering_competitions"), newCompetition);
      setCompetitions(prev => [
        ...prev,
        { id: docRef.id, ...newCompetition } // Update the state with the new competition immediately
      ]);
      setNewCompetition({ name: "", description: "", link: "" }); // Clear input fields
    }
  };

  // Handle deleting a competition
  const handleDeleteCompetition = async (competitionId) => {
    await deleteDoc(doc(db, "engineering_competitions", competitionId));
  };

  return (
    <section className='max-container'>
      {/* Go Back Button at the Top */}
      <div className="flex items-center justify-between">
        <Link
          to="/engineering"
          className='inline-flex items-center px-6 py-2 bg-blue-500 text-white font-medium rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:shadow-lg'
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Go Back to Engineering Page
        </Link>

        <h1 className='head-text'>
          <span className='blue-gradient_text drop-shadow font-semibold'>
            Engineering Competitions
          </span>
        </h1>
      </div>

      <p className='text-slate-500 mt-2 leading-relaxed'>
        Lorem ipsum dolor sit amet
      </p>

      {isEditing && isLoggedIn && ( // Check if logged in to show input fields
        <div className="mb-4">
          <input
            type="text"
            name="name"
            value={newCompetition.name}
            onChange={handleInputChange}
            placeholder="Competition Name"
            className="border p-2 mt-2 w-full"
          />
          <textarea
            name="description"
            value={newCompetition.description}
            onChange={handleInputChange}
            placeholder="Competition Description"
            className="border p-2 mt-2 w-full"
            rows={4}
          />
          <input
            type="text"
            name="link"
            value={newCompetition.link}
            onChange={handleInputChange}
            placeholder="Competition Link"
            className="border p-2 mt-2 w-full"
          />
          <button
            onClick={handleCreateCompetition}
            className='mt-2 bg-blue-600 text-white px-4 py-2 rounded'
          >
            Create Competition
          </button>
        </div>
      )}

      {isLoggedIn && ( // Show edit button only if logged in
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className='mb-4 bg-blue-600 text-white px-4 py-2 rounded'
        >
          {isEditing ? "Done Editing" : "Add New Competition"}
        </button>
      )}

      <div className='flex flex-wrap my-20 gap-16'>
        {competitions.map((competition) => (
          <div className='lg:w-[400px] w-full' key={competition.id}>
            <div className='block-container w-12 h-12'>
              <div className={`btn-back rounded-xl`} />
              <div className='btn-front rounded-xl flex justify-center items-center'>
                <img
                  src={competition.iconUrl} // Ensure iconUrl is available in your Firestore documents
                  alt={competition.name}
                  className='w-1/2 h-1/2 object-contain'
                />
              </div>
            </div>

            <div className='mt-5 flex flex-col'>
              <h4 className='text-2xl font-poppins font-semibold'>
                {competition.name}
              </h4>
              <p className='mt-2 text-slate-500'>{competition.description}</p>

              <div className='mt-5 flex items-center gap-2 font-poppins'>
                {competition.link.startsWith("/") ? (
                  <Link
                    to={competition.link}  // For internal navigation
                    className='font-semibold text-blue-600'
                  >
                    Learn More
                  </Link>
                ) : (
                  <a
                    href={competition.link}  // For external navigation
                    target='_blank'
                    rel='noopener noreferrer'
                    className='font-semibold text-blue-600'
                  >
                    Learn More
                  </a>
                )}
                <img
                  src={arrow}
                  alt='arrow'
                  className='w-4 h-4 object-contain'
                />
              </div>
              {isLoggedIn && ( // Show delete button only if logged in
                <button
                  onClick={() => handleDeleteCompetition(competition.id)}
                  className='mt-2 bg-red-600 text-white px-4 py-2 rounded'
                >
                  Delete Competition
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <hr className='border-slate-200' />

      <CTA />
    </section>
  );
};

export default EngCompetitions;
