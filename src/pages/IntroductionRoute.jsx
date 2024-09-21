import React, { useEffect, useState } from "react";
import { getFirestore, collection, onSnapshot, updateDoc, doc } from "firebase/firestore";

const IntroductionCards = () => {
  const db = getFirestore();
  const [introCards, setIntroCards] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "userintros"), (snapshot) => {
      const cards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setIntroCards(cards);
    });

    return () => unsubscribe();
  }, []);

  const handleEditHobbies = async (id, hobbies) => {
    const newHobbies = prompt("Edit your hobbies:", hobbies);
    if (newHobbies) {
      const introRef = doc(db, "userintros", id);
      await updateDoc(introRef, { hobbies: newHobbies });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
        <br/>
      <h1 className="text-4xl font-bold text-center mb-8">Introduction Cards</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {introCards.map(card => (
          <div key={card.id} className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-semibold mb-2">{card.name}</h2>
            <p className="text-gray-700 mb-2">
              <strong>Class & Division:</strong> {card.classDivision}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Hobbies:</strong> {card.hobbies}
            </p>
            {isLoggedIn && card.username === localStorage.getItem("username") && (
              <button 
                onClick={() => handleEditHobbies(card.id, card.hobbies)} 
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
              >
                Edit
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntroductionCards;
