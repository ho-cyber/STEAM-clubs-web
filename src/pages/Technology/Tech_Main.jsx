import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { db } from '../../firebase'; // Import Firebase configuration
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'; // Firebase Firestore functions
import { CTA } from "../../components";

const TechMain = () => {
  const [loggedIn, setLoggedIn] = useState(false); // State to track if the user is logged in
  const [descriptions, setDescriptions] = useState({
    projectsDescription: '',
    competitionsDescription: '',
    workshopsDescription: '',
  }); // State to store the fetched descriptions
  const [editing, setEditing] = useState(false); // Toggle for editing state

  // Check if the user is logged in using localStorage
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    setLoggedIn(isLoggedIn === "true");
  }, []);

  // Fetch descriptions for each section from Firestore
  useEffect(() => {
    const fetchDescriptions = () => {
      // Fetch the projects description
      const projectsDocRef = doc(db, 'technology', 'projects');
      const unsubscribeProjects = onSnapshot(projectsDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          setDescriptions((prevState) => ({
            ...prevState,
            projectsDescription: docSnapshot.data().description,
          }));
        }
      });

      // Fetch the competitions description
      const competitionsDocRef = doc(db, 'technology', 'competitions');
      const unsubscribeCompetitions = onSnapshot(competitionsDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          setDescriptions((prevState) => ({
            ...prevState,
            competitionsDescription: docSnapshot.data().description,
          }));
        }
      });

      // Fetch the workshops description
      const workshopsDocRef = doc(db, 'technology', 'workshops');
      const unsubscribeWorkshops = onSnapshot(workshopsDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          setDescriptions((prevState) => ({
            ...prevState,
            workshopsDescription: docSnapshot.data().description,
          }));
        }
      });

      // Cleanup subscriptions
      return () => {
        unsubscribeProjects();
        unsubscribeCompetitions();
        unsubscribeWorkshops();
      };
    };

    fetchDescriptions();
  }, []);

  // Handle updating the Firestore documents
  const handleUpdate = async () => {
    try {
      const projectsDocRef = doc(db, 'technology', 'projects');
      const competitionsDocRef = doc(db, 'technology', 'competitions');
      const workshopsDocRef = doc(db, 'technology', 'workshops');

      // Update descriptions in Firestore
      await updateDoc(projectsDocRef, {
        description: descriptions.projectsDescription,
      });
      await updateDoc(competitionsDocRef, {
        description: descriptions.competitionsDescription,
      });
      await updateDoc(workshopsDocRef, {
        description: descriptions.workshopsDescription,
      });

      setEditing(false); // Exit editing mode after update
    } catch (error) {
      console.error('Error updating descriptions: ', error);
    }
  };

  return (
    <section className='max-container'>
      <h1 className='head-text'>
        <span className='blue-gradient_text drop-shadow font-semibold'>
          Technology
        </span>
      </h1>

      <p className='text-slate-500 mt-2 leading-relaxed'>
        Explore the various aspects of technology including projects, competitions, and workshops.
      </p>

      {/* Card for Projects */}
      <div className='flex flex-wrap my-20 gap-16'>
        <div className='lg:w-[400px] w-full'>
          <div className='block-container w-12 h-12'>
            <div className='btn-back rounded-xl bg-blue-500' />
            <div className='btn-front rounded-xl flex justify-center items-center'>
              <img
                src='/assets/icons/projects-icon.svg' // Placeholder icon URL
                alt='Projects'
                className='w-1/2 h-1/2 object-contain'
              />
            </div>
          </div>
          <div className='mt-5 flex flex-col'>
            <h4 className='text-2xl font-poppins font-semibold'>
              Projects
            </h4>
            {editing ? (
              <textarea
                value={descriptions.projectsDescription}
                onChange={(e) => setDescriptions({ ...descriptions, projectsDescription: e.target.value })}
                className='border p-2 mt-2 w-full'
              />
            ) : (
              <p className='mt-2 text-slate-500'>{descriptions.projectsDescription}</p>
            )}
            <div className='mt-5 flex items-center gap-2 font-poppins'>
              <Link
                to='/technology/projects'
                className='font-semibold text-blue-600'
              >
                Learn More
              </Link>
              <img
                src='/assets/icons/arrow.svg'
                alt='arrow'
                className='w-4 h-4 object-contain'
              />
            </div>
          </div>
        </div>

        {/* Card for Competitions */}
        <div className='lg:w-[400px] w-full'>
          <div className='block-container w-12 h-12'>
            <div className='btn-back rounded-xl bg-green-500' />
            <div className='btn-front rounded-xl flex justify-center items-center'>
              <img
                src='/assets/icons/competitions-icon.svg' // Placeholder icon URL
                alt='Competitions'
                className='w-1/2 h-1/2 object-contain'
              />
            </div>
          </div>
          <div className='mt-5 flex flex-col'>
            <h4 className='text-2xl font-poppins font-semibold'>
              Competitions
            </h4>
            {editing ? (
              <textarea
                value={descriptions.competitionsDescription}
                onChange={(e) => setDescriptions({ ...descriptions, competitionsDescription: e.target.value })}
                className='border p-2 mt-2 w-full'
              />
            ) : (
              <p className='mt-2 text-slate-500'>{descriptions.competitionsDescription}</p>
            )}
            <div className='mt-5 flex items-center gap-2 font-poppins'>
              <Link
                to='/technology/competitions'
                className='font-semibold text-blue-600'
              >
                Learn More
              </Link>
              <img
                src='/assets/icons/arrow.svg'
                alt='arrow'
                className='w-4 h-4 object-contain'
              />
            </div>
          </div>
        </div>

        {/* Card for Workshops */}
        <div className='lg:w-[400px] w-full'>
          <div className='block-container w-12 h-12'>
            <div className='btn-back rounded-xl bg-yellow-500' />
            <div className='btn-front rounded-xl flex justify-center items-center'>
              <img
                src='/assets/icons/workshops-icon.svg' // Placeholder icon URL
                alt='Workshops'
                className='w-1/2 h-1/2 object-contain'
              />
            </div>
          </div>
          <div className='mt-5 flex flex-col'>
            <h4 className='text-2xl font-poppins font-semibold'>
              Workshops
            </h4>
            {editing ? (
              <textarea
                value={descriptions.workshopsDescription}
                onChange={(e) => setDescriptions({ ...descriptions, workshopsDescription: e.target.value })}
                className='border p-2 mt-2 w-full'
              />
            ) : (
              <p className='mt-2 text-slate-500'>{descriptions.workshopsDescription}</p>
            )}
            <div className='mt-5 flex items-center gap-2 font-poppins'>
              <Link
                to='/technology/workshops'
                className='font-semibold text-blue-600'
              >
                Learn More
              </Link>
              <img
                src='/assets/icons/arrow.svg'
                alt='arrow'
                className='w-4 h-4 object-contain'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Show edit button if logged in */}
      {loggedIn && (
        <>
          {editing ? (
            <button
              onClick={handleUpdate}
              className='btn bg-green-600 text-white mt-4'
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className='btn bg-blue-600 text-white mt-4'
            >
              Edit Descriptions
            </button>
          )}
        </>
      )}

      <hr className='border-slate-200 mt-8' />

      <CTA />
    </section>
  );
};

export default TechMain;
