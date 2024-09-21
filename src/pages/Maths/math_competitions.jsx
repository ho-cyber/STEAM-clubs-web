import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase'; // Import Firebase configuration
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore'; // Firebase Firestore functions
import { CTA } from '../../components';
import { arrow } from '../../assets/icons';

const MathCompetitions = () => {
  const [loggedIn, setLoggedIn] = useState(false); // State to track if the user is logged in
  const [showForm, setShowForm] = useState(false); // State to toggle the add form
  const [newCompetition, setNewCompetition] = useState({
    name: '',
    description: '',
    link: ''
  }); // State for the new competition form
  const [competitions, setCompetitions] = useState([]); // State to store the fetched competitions
  const [loading, setLoading] = useState(true); // State to show loading

  // Check if user is logged in using localStorage
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    setLoggedIn(isLoggedIn === "true");
  }, []);

  // Fetch competitions from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'math_competitions'), (querySnapshot) => {
      const competitionList = [];
      querySnapshot.forEach((doc) => {
        competitionList.push({ id: doc.id, ...doc.data() });
      });
      setCompetitions(competitionList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching competitions: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle form submission to add new competition
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newCompetition.name && newCompetition.description && newCompetition.link) {
      try {
        await addDoc(collection(db, 'math_competitions'), newCompetition);
        setShowForm(false);
        setNewCompetition({ name: '', description: '', link: '' });
      } catch (error) {
        console.error("Error adding competition: ", error);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  // Handle deletion of a competition
  const handleDelete = async (competitionId) => {
    try {
      await deleteDoc(doc(db, 'math_competitions', competitionId));
    } catch (error) {
      console.error("Error deleting competition: ", error);
    }
  };

  return (
    <section className='max-container'>
      <div className='flex items-center justify-between'>
        {/* Go Back Button at the Top */}
        <Link
          to="/maths"
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
          Go Back to Math Page
        </Link>

        <h1 className='head-text'>
          <span className='blue-gradient_text drop-shadow font-semibold'>
            Math Competitions
          </span>
        </h1>
      </div>

      <p className='text-slate-500 mt-2 leading-relaxed'>
        Explore Math competitions that we have planned.
      </p>

      {/* Show create new competition button if the user is logged in */}
      {loggedIn && (
        <>
          <button
            onClick={() => setShowForm(!showForm)}
            className='btn text-white bg-blue-600 mt-4'
          >
            {showForm ? 'Cancel' : 'Create New Competition'}
          </button>

          {/* Form to create a new competition */}
          {showForm && (
            <form onSubmit={handleSubmit} className='mt-5'>
              <input
                type='text'
                placeholder='Competition Name'
                value={newCompetition.name}
                onChange={(e) => setNewCompetition({ ...newCompetition, name: e.target.value })}
                className='border p-2 mb-2 w-full'
              />
              <textarea
                placeholder='Description'
                value={newCompetition.description}
                onChange={(e) => setNewCompetition({ ...newCompetition, description: e.target.value })}
                className='border p-2 mb-2 w-full'
              />
              <input
                type='text'
                placeholder='Link'
                value={newCompetition.link}
                onChange={(e) => setNewCompetition({ ...newCompetition, link: e.target.value })}
                className='border p-2 mb-2 w-full'
              />
              <button type='submit' className='btn text-white bg-green-600'>
                Submit
              </button>
            </form>
          )}
        </>
      )}

      <div className='flex flex-wrap my-20 gap-16'>
        {loading ? (
          <p>Loading...</p>
        ) : (
          competitions.map((competition) => (
            <div className='lg:w-[400px] w-full' key={competition.id}>
              <div className='block-container w-12 h-12'>
                <div className={`btn-back rounded-xl ${competition.theme || 'btn-back-blue'}`} />
                <div className='btn-front rounded-xl flex justify-center items-center'>
                  <img
                    src={competition.iconUrl || 'default-icon-url'}
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
                  {/* Internal or external link handling - always use <a> */}
                  <a
                    href={competition.link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='font-semibold text-blue-600'
                  >
                    Learn More
                  </a>
                  <img
                    src={arrow}
                    alt='arrow'
                    className='w-4 h-4 object-contain'
                  />

                  {/* Show delete button if the user is logged in */}
                  {loggedIn && (
                    <button
                      onClick={() => handleDelete(competition.id)}
                      className='btn text-white bg-red-600 ml-4'
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <hr className='border-slate-200' />

      <CTA />
    </section>
  );
};

export default MathCompetitions;
