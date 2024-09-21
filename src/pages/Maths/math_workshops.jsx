import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase'; // Import Firebase configuration
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore'; // Firebase Firestore functions
import { CTA } from '../../components';
import { arrow } from '../../assets/icons';

const MathWorkshops = () => {
  const [loggedIn, setLoggedIn] = useState(false); // State to track if the user is logged in
  const [showForm, setShowForm] = useState(false); // State to toggle the add form
  const [newWorkshop, setNewWorkshop] = useState({
    name: '',
    description: '',
    link: ''
  }); // State for the new workshop form
  const [workshops, setWorkshops] = useState([]); // State to store the fetched workshops
  const [loading, setLoading] = useState(true); // State to show loading

  // Check if the user is logged in using localStorage
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    setLoggedIn(isLoggedIn === "true");
  }, []);

  // Fetch workshops from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'math_workshops'), (querySnapshot) => {
      const workshopList = [];
      querySnapshot.forEach((doc) => {
        workshopList.push({ id: doc.id, ...doc.data() });
      });
      setWorkshops(workshopList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching workshops: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle form submission to add new workshop
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newWorkshop.name && newWorkshop.description && newWorkshop.link) {
      try {
        await addDoc(collection(db, 'math_workshops'), newWorkshop);
        setShowForm(false);
        setNewWorkshop({ name: '', description: '', link: '' });
      } catch (error) {
        console.error("Error adding workshop: ", error);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  // Handle deletion of a workshop
  const handleDelete = async (workshopId) => {
    try {
      await deleteDoc(doc(db, 'math_workshops', workshopId));
    } catch (error) {
      console.error("Error deleting workshop: ", error);
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
          Go Back to Maths Page
        </Link>

        <h1 className='head-text'>
          <span className='blue-gradient_text drop-shadow font-semibold'>
            Maths Workshops
          </span>
        </h1>
      </div>

      <p className='text-slate-500 mt-2 leading-relaxed'>
        Explore Maths workshops that we have planned.
      </p>

      {/* Show create new workshop button if the user is logged in */}
      {loggedIn && (
        <>
          <button
            onClick={() => setShowForm(!showForm)}
            className='btn text-white bg-blue-600 mt-4'
          >
            {showForm ? 'Cancel' : 'Create New Workshop'}
          </button>

          {/* Form to create a new workshop */}
          {showForm && (
            <form onSubmit={handleSubmit} className='mt-5'>
              <input
                type='text'
                placeholder='Workshop Name'
                value={newWorkshop.name}
                onChange={(e) => setNewWorkshop({ ...newWorkshop, name: e.target.value })}
                className='border p-2 mb-2 w-full'
              />
              <textarea
                placeholder='Description'
                value={newWorkshop.description}
                onChange={(e) => setNewWorkshop({ ...newWorkshop, description: e.target.value })}
                className='border p-2 mb-2 w-full'
              />
              <input
                type='text'
                placeholder='Link'
                value={newWorkshop.link}
                onChange={(e) => setNewWorkshop({ ...newWorkshop, link: e.target.value })}
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
          workshops.map((workshop) => (
            <div className='lg:w-[400px] w-full' key={workshop.id}>
              <div className='block-container w-12 h-12'>
                <div className={`btn-back rounded-xl ${workshop.theme || 'btn-back-blue'}`} />
                <div className='btn-front rounded-xl flex justify-center items-center'>
                  <img
                    src={workshop.iconUrl || 'default-icon-url'}
                    alt={workshop.name}
                    className='w-1/2 h-1/2 object-contain'
                  />
                </div>
              </div>

              <div className='mt-5 flex flex-col'>
                <h4 className='text-2xl font-poppins font-semibold'>
                  {workshop.name}
                </h4>
                <p className='mt-2 text-slate-500'>{workshop.description}</p>

                <div className='mt-5 flex items-center gap-2 font-poppins'>
                  {/* Internal or external link handling */}
                  {workshop.link.startsWith("/") ? (
                    <Link
                      to={workshop.link}
                      className='font-semibold text-blue-600'
                    >
                      Learn More
                    </Link>
                  ) : (
                    <a
                      href={workshop.link}
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

                  {/* Show delete button if the user is logged in */}
                  {loggedIn && (
                    <button
                      onClick={() => handleDelete(workshop.id)}
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

export default MathWorkshops;
