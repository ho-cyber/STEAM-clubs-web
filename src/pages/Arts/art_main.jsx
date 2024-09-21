import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFirestore, collection, onSnapshot, updateDoc, doc, writeBatch } from "firebase/firestore"; // Firestore functions
import { CTA } from "../../components";
import { arrow } from "../../assets/icons";

const db = getFirestore(); // Ensure this is your Firestore instance

const ArtMain = () => {
  const [sections, setSections] = useState({
    projects: { description: "" },
    competitions: { description: "" },
    workshops: { description: "" },
  });
  const [isEditing, setIsEditing] = useState(false); // State to track editing mode
  const [loggedIn, setLoggedIn] = useState(false); // State to track if the user is logged in

  // Check if the user is logged in using localStorage
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    setLoggedIn(isLoggedIn === "true");
  }, []);

  // Fetch section descriptions from Firestore
  useEffect(() => {
    const fetchSections = () => {
      const sectionsCollection = collection(db, "arts");
      const unsubscribe = onSnapshot(sectionsCollection, (snapshot) => {
        const fetchedSections = {};
        snapshot.docs.forEach((doc) => {
          fetchedSections[doc.id] = { description: doc.data().description };
        });
        setSections(fetchedSections);
      });

      return () => unsubscribe();
    };

    fetchSections();
  }, []);

  // Handle description change
  const handleChange = (section) => (e) => {
    setSections((prev) => ({
      ...prev,
      [section]: { description: e.target.value },
    }));
  };

  // Handle save changes for all sections
  const handleSave = async () => {
    const batch = writeBatch(db); // Create a batch for multiple updates
    Object.keys(sections).forEach((section) => {
      const sectionRef = doc(db, "arts", section);
      batch.update(sectionRef, {
        description: sections[section].description,
      });
    });
    await batch.commit();
    setIsEditing(false); // Exit editing mode after saving
  };

  return (
    <section className='max-container'>
      <h1 className='head-text'>
        <span className='blue-gradient_text drop-shadow font-semibold'>
          Arts
        </span>
      </h1>

      <p className='text-slate-500 mt-2 leading-relaxed'>
        lorem ipsum dolor set
      </p>

      {/* Show edit button only if user is logged in */}
      {loggedIn && (
        <>
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className='mb-4 bg-blue-600 text-white px-4 py-2 rounded'
          >
            {isEditing ? "Done Editing" : "Edit Descriptions"}
          </button>

          {isEditing && (
            <button
              onClick={handleSave}
              className='mb-4 bg-green-600 text-white px-4 py-2 rounded'
            >
              Save Changes
            </button>
          )}
        </>
      )}

      <div className='flex flex-wrap my-20 gap-16'>
        {Object.keys(sections).map((section) => (
          <div className='lg:w-[400px] w-full' key={section}>
            <div className='block-container w-12 h-12'>
              <div className={`btn-back rounded-xl`} />
              <div className='btn-front rounded-xl flex justify-center items-center'>
                <img
                  src="" // Ensure iconUrl is available in the section data
                  alt={section}
                  className='w-1/2 h-1/2 object-contain'
                />
              </div>
            </div>

            <div className='mt-5 flex flex-col'>
              <h4 className='text-2xl font-poppins font-semibold capitalize'>
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </h4>
              {isEditing ? (
                <textarea
                  value={sections[section].description}
                  onChange={handleChange(section)}
                  className='border p-2 mt-2 w-full'
                  rows={4}
                />
              ) : (
                <p className='mt-2 text-slate-500'>{sections[section].description}</p>
              )}
              <div className='mt-5 flex items-center gap-2 font-poppins'>
                <Link to={`/arts/${section}`} className='font-semibold text-blue-600'>
                  Learn More
                </Link>
                <img
                  src={arrow}
                  alt='arrow'
                  className='w-4 h-4 object-contain'
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <hr className='border-slate-200' />

      <CTA />
    </section>
  );
};

export default ArtMain;
