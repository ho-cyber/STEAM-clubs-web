import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

const Dashboard = () => {
  const db = getFirestore();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [usernamesList, setUsernamesList] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [introduction, setIntroduction] = useState({
    name: "",
    classDivision: "",
    hobbies: "",
  });
  const [hasIntroCard, setHasIntroCard] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
      navigate("/contact");
    } else {
      const storedUsername = localStorage.getItem("username");
      setUsername(storedUsername);

      const fetchAdminStatus = async () => {
        const q = query(collection(db, "usernames"), where("username", "==", storedUsername));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0].data();
          setIsAdmin(userDoc.admin);
        }
      };

      const fetchAllUsernames = async () => {
        if (isAdmin) {
          const allUsernamesSnapshot = await getDocs(collection(db, "usernames"));
          const usernames = allUsernamesSnapshot.docs.map((doc) => doc.data().username);
          setUsernamesList(usernames);
        }
      };

      const fetchIntroCard = async () => {
        const q = query(collection(db, "userintros"), where("username", "==", storedUsername));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setHasIntroCard(true);
          const doc = querySnapshot.docs[0].data();
          setIntroduction({
            name: doc.name,
            classDivision: doc.classDivision,
            hobbies: doc.hobbies,
          });
        }
      };

      fetchAdminStatus();
      fetchAllUsernames();
      fetchIntroCard();
    }
  }, [navigate, isAdmin, db]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIntroduction({ ...introduction, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "userintros"), {
        username,
        ...introduction,
      });
      setIsCreating(false);
      setHasIntroCard(true);
      setIntroduction({ name: "", classDivision: "", hobbies: "" });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleBlockUser = async (uname) => {
    try {
      // Delete the user's intro card
      const userIntroQuery = query(collection(db, "userintros"), where("username", "==", uname));
      const introSnapshot = await getDocs(userIntroQuery);
      introSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // Delete the username
      const usernameQuery = query(collection(db, "usernames"), where("username", "==", uname));
      const usernameSnapshot = await getDocs(usernameQuery);
      usernameSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // Refresh the usernames list
      const updatedUsernamesSnapshot = await getDocs(collection(db, "usernames"));
      const updatedUsernames = updatedUsernamesSnapshot.docs.map((doc) => doc.data().username);
      setUsernamesList(updatedUsernames);
    } catch (error) {
      console.error("Error blocking user: ", error);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6'>
      <div className='bg-white shadow-md rounded-lg p-8 w-full max-w-md'>
        <h1 className='text-3xl font-bold text-center mb-6'>Welcome, {username}!</h1>
        <p className='text-lg text-gray-700 mb-6 text-center'>
          You have successfully logged in. Use the buttons below to navigate to different pages.
        </p>

        {!hasIntroCard && (
          <button
            onClick={() => setIsCreating((prev) => !prev)}
            className='w-full bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600 transition mb-4'
          >
            {isCreating ? "Cancel" : "Create Introduction"}
          </button>
        )}

        {isCreating && (
          <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-4">
            <label className="text-black-500 font-semibold">
              Name
              <input
                type="text"
                name="name"
                className="input"
                placeholder="Enter your name"
                required
                value={introduction.name}
                onChange={handleChange}
              />
            </label>
            <label className="text-black-500 font-semibold">
              Class & Division
              <input
                type="text"
                name="classDivision"
                className="input"
                placeholder="Enter your class and division"
                required
                value={introduction.classDivision}
                onChange={handleChange}
              />
            </label>
            <label className="text-black-500 font-semibold">
              Hobbies
              <input
                type="text"
                name="hobbies"
                className="input"
                placeholder="Enter your hobbies"
                required
                value={introduction.hobbies}
                onChange={handleChange}
              />
            </label>
            <button type="submit" className="bg-green-600 text-white py-2 rounded-md">
              Submit
            </button>
          </form>
        )}

        {hasIntroCard && (
          <div className="introduction-card border p-4 rounded mt-4">
            <h2 className="text-xl font-semibold">Your Introduction Card</h2>
            <p><strong>Name:</strong> {introduction.name}</p>
            <p><strong>Class & Division:</strong> {introduction.classDivision}</p>
            <p>
              <strong>Hobbies:</strong>
              {introduction.hobbies} 
              <button onClick={() => handleEditHobbies(introduction.hobbies)} className="ml-2 text-blue-500">Edit</button>
            </p>
          </div>
        )}

        {/* Stylish Display of All Usernames for Admins */}
        {isAdmin && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">List of All Usernames:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {usernamesList.map((uname, index) => (
                <div key={index} className="flex justify-between items-center p-4 border rounded shadow">
                  <span className="font-medium">{uname}</span>
                  <button 
                    onClick={() => handleBlockUser(uname)} 
                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition"
                  >
                    Block
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className='space-y-4'>
          <button
            onClick={() => handleNavigation('/science')}
            className='w-full bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600 transition'
          >
            Science Page
          </button>
          <button
            onClick={() => handleNavigation('/technology')}
            className='w-full bg-green-500 text-white py-2 rounded-md shadow-md hover:bg-green-600 transition'
          >
            Technology Page
          </button>
          <button
            onClick={() => handleNavigation('/engineering')}
            className='w-full bg-red-500 text-white py-2 rounded-md shadow-md hover:bg-red-600 transition'
          >
            Engineering Page
          </button>
          <button
            onClick={() => handleNavigation('/arts')}
            className='w-full bg-yellow-500 text-white py-2 rounded-md shadow-md hover:bg-yellow-600 transition'
          >
            Arts Page
          </button>
          <button
            onClick={() => handleNavigation('/maths')}
            className='w-full bg-purple-500 text-white py-2 rounded-md shadow-md hover:bg-purple-600 transition'
          >
            Mathematics Page
          </button>
          <button
            onClick={() => handleNavigation('/introduction-cards')}
            className='w-full bg-indigo-500 text-white py-2 rounded-md shadow-md hover:bg-indigo-600 transition'
          >
            View Introduction Cards
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
