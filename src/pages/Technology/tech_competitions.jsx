import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase"; // Import your Firebase configuration
import { collection, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore"; // Firestore functions
import { CTA } from "../../components";
import { arrow } from "../../assets/icons";

const TechCompetitions = () => {
  const [competitions, setCompetitions] = useState([]);
  const [newCompetition, setNewCompetition] = useState({
    name: "",
    description: "",
    link: "",
  });
  const [loggedIn, setLoggedIn] = useState(false);

  // Check if the user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    setLoggedIn(isLoggedIn === "true");
  }, []);

  // Fetch existing competitions from Firestore
  useEffect(() => {
    const fetchCompetitions = () => {
      const competitionsCollection = collection(db, "technology_competitions");
      const unsubscribe = onSnapshot(competitionsCollection, (snapshot) => {
        const fetchedCompetitions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCompetitions(fetchedCompetitions);
      });

      return () => unsubscribe();
    };

    fetchCompetitions();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const competitionsCollection = collection(db, "technology_competitions");
      await addDoc(competitionsCollection, newCompetition);
      setNewCompetition({ name: "", description: "", link: "" }); // Reset form
    } catch (error) {
      console.error("Error adding competition: ", error);
    }
  };

  // Handle competition deletion
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "technology_competitions", id));
    } catch (error) {
      console.error("Error deleting competition: ", error);
    }
  };

  return (
    <section className="max-container">
      <div className="flex items-center justify-between">
        {/* Go Back Button at the Top */}
        <Link
          to="/technology"
          className="inline-flex items-center px-6 py-2 bg-blue-500 text-white font-medium rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:shadow-lg"
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
          Go Back to Technology Page
        </Link>

        <h1 className="head-text">
          <span className="blue-gradient_text drop-shadow font-semibold">
            Technology Competitions
          </span>
        </h1>
      </div>

      <p className="text-slate-500 mt-2 leading-relaxed">lorem ipsum dolor sit amet</p>

      {/* Form for creating a new competition */}
      {loggedIn && (
        <form onSubmit={handleSubmit} className="mt-10">
          <h2 className="text-2xl font-poppins font-semibold">Create a New Competition</h2>
          <input
            type="text"
            placeholder="Competition Name"
            value={newCompetition.name}
            onChange={(e) => setNewCompetition({ ...newCompetition, name: e.target.value })}
            className="border p-2 mt-2 w-full"
            required
          />
          <textarea
            placeholder="Competition Description"
            value={newCompetition.description}
            onChange={(e) => setNewCompetition({ ...newCompetition, description: e.target.value })}
            className="border p-2 mt-2 w-full"
            required
          />
          <input
            type="url"
            placeholder="Competition Link"
            value={newCompetition.link}
            onChange={(e) => setNewCompetition({ ...newCompetition, link: e.target.value })}
            className="border p-2 mt-2 w-full"
            required
          />
          <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
            Add Competition
          </button>
        </form>
      )}

      <div className="flex flex-wrap my-20 gap-16">
        {competitions.map((competition) => (
          <div className="lg:w-[400px] w-full" key={competition.id}>
            <div className="block-container w-12 h-12">
              <div className={`btn-back rounded-xl bg-blue-500`} />
              <div className="btn-front rounded-xl flex justify-center items-center">
                <img
                  src="/assets/icons/competitions-icon.svg" // Placeholder icon URL
                  alt={competition.name}
                  className="w-1/2 h-1/2 object-contain"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-col">
              <h4 className="text-2xl font-poppins font-semibold">{competition.name}</h4>
              <p className="mt-2 text-slate-500">{competition.description}</p>
              <div className="mt-5 flex items-center gap-2 font-poppins">
                <a
                  href={competition.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600"
                >
                  Learn More
                </a>
                <img src={arrow} alt="arrow" className="w-4 h-4 object-contain" />
              </div>
              {loggedIn && (
                <button
                  onClick={() => handleDelete(competition.id)}
                  className="mt-2 bg-red-600 text-white px-4 py-1 rounded"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <hr className="border-slate-200" />

      <CTA />
    </section>
  );
};

export default TechCompetitions;
