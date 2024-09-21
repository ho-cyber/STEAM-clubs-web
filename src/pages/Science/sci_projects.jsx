import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase'; // Firebase config
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore'; // Firebase Firestore
import { CTA } from '../../components';
import { arrow } from '../../assets/icons';

const SciProjects = () => {
  const [loggedIn, setLoggedIn] = useState(false); // Track if user is logged in
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    link: ''
  });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in using localStorage
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    setLoggedIn(isLoggedIn === "true");
  }, []);

  // Fetch projects from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'science_projects'), (querySnapshot) => {
      const projectList = [];
      querySnapshot.forEach((doc) => {
        projectList.push({ id: doc.id, ...doc.data() });
      });
      setProjects(projectList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching projects: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle form submission to add new project
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newProject.name && newProject.description && newProject.link) {
      try {
        await addDoc(collection(db, 'science_projects'), newProject);
        setShowForm(false);
        setNewProject({ name: '', description: '', link: '' });
      } catch (error) {
        console.error("Error adding project: ", error);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  // Handle deletion of a project
  const handleDelete = async (projectId) => {
    try {
      await deleteDoc(doc(db, 'science_projects', projectId));
    } catch (error) {
      console.error("Error deleting project: ", error);
    }
  };

  return (
    <section className='max-container'>
      <div className='flex items-center justify-between'>
        {/* Go Back Button at the Top */}
        <Link
          to="/science"
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
          Go Back to Science Page
        </Link>

        <h1 className='head-text'>
          <span className='blue-gradient_text drop-shadow font-semibold'>
            Science projects that we have planned
          </span>
        </h1>
      </div>

      <p className='text-slate-500 mt-2 leading-relaxed'>
        lorem ipsum dolor sit amet
      </p>

      {/* Show create new component button if the user is logged in */}
      {loggedIn && (
        <>
          <button
            onClick={() => setShowForm(!showForm)}
            className='btn text-white bg-blue-600'
          >
            {showForm ? 'Cancel' : 'Create New Component'}
          </button>

          {/* Form to create a new project */}
          {showForm && (
            <form onSubmit={handleSubmit} className='mt-5'>
              <input
                type='text'
                placeholder='Project Name'
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className='border p-2 mb-2 w-full'
              />
              <textarea
                placeholder='Description'
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className='border p-2 mb-2 w-full'
              />
              <input
                type='text'
                placeholder='Link'
                value={newProject.link}
                onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
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
          projects.map((project) => (
            <div className='lg:w-[400px] w-full' key={project.id}>
              <div className='block-container w-12 h-12'>
                <div className={`btn-back rounded-xl ${project.theme || 'btn-back-blue'}`} />
                <div className='btn-front rounded-xl flex justify-center items-center'>
                  <img
                    src={project.iconUrl || 'default-icon-url'}
                    alt={project.name}
                    className='w-1/2 h-1/2 object-contain'
                  />
                </div>
              </div>

              <div className='mt-5 flex flex-col'>
                <h4 className='text-2xl font-poppins font-semibold'>
                  {project.name}
                </h4>
                <p className='mt-2 text-slate-500'>{project.description}</p>
                <div className='mt-5 flex items-center gap-2 font-poppins'>
                  <a
                    href={project.link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='font-semibold text-blue-600'
                  >
                    Link
                  </a>
                  <img
                    src={arrow}
                    alt='arrow'
                    className='w-4 h-4 object-contain'
                  />
                  {/* Show delete button if the user is logged in */}
                  {loggedIn && (
                    <button
                      onClick={() => handleDelete(project.id)}
                      className='btn text-white bg-red-600'
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

export default SciProjects;
