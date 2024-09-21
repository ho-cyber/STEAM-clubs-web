import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";
import useAlert from "../hooks/useAlert"; // Assuming you have an alert system
import { Alert } from "../components";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore"; // Firestore functions

const db = getFirestore();

const Contact = () => {
  const [loginState, setLoginState] = useState({
    email: "",
    password: "",
    otp: "",
    username: "", // Add username field
  });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isUsernameSet, setIsUsernameSet] = useState(false); // Track if username is set
  const [generatedOtp, setGeneratedOtp] = useState("");
  const { alert, showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // For redirection after login

  const fixedEmail = "Dhruvdukle@yahoo.com";  // Fixed email for OTP
  const fixedPassword = "Dragonfire146";  // Fixed password

  // Function to generate OTP
  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit random OTP
    return otp;
  };

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginState({ ...loginState, [name]: value });
  };

  // Function to handle login form submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginState.email === fixedEmail && loginState.password === fixedPassword) {
      const otp = generateOtp();
      setGeneratedOtp(otp); // Store generated OTP in state
      sendOtpEmail(otp); // Send OTP to the user's email
      setIsOtpSent(true); // Switch to OTP input form
    } else {
      showAlert({
        show: true,
        text: "Invalid email or password!",
        type: "danger",
      });
    }
  };

  // Function to handle OTP form submission
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (loginState.otp === generatedOtp) {
      setIsUsernameSet(true); // Switch to username input form
    } else {
      showAlert({
        show: true,
        text: "Invalid OTP!",
        type: "danger",
      });
    }
  };

  // Function to handle username form submission
  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    if (loginState.username) {
      const usernamesCollection = collection(db, "usernames");
      const snapshot = await getDocs(usernamesCollection);
      const existingUsernames = snapshot.docs.map(doc => doc.data().username);

      if (!existingUsernames.includes(loginState.username)) {
        // Store username if it doesn't exist
        await addDoc(usernamesCollection, { 
          username: loginState.username, 
          email: loginState.email,
          admin: false // Add the admin field and set to false by default
        });

        showAlert({
          show: true,
          text: "Logged in successfully!",
          type: "success",
        });
      } else {
        // Log in if the username exists
        showAlert({
          show: true,
          text: "Logged in successfully!",
          type: "success",
        });
      }

      // Store login status and username in localStorage
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("loggedInUser", loginState.email);
      localStorage.setItem("username", loginState.username); // Store username

      // Redirect to the dashboard after successful login
      navigate("/dashboard");

    } else {
      showAlert({
        show: true,
        text: "Please enter a username!",
        type: "danger",
      });
    }
  };

  // Function to send OTP email using EmailJS
  const sendOtpEmail = (otp) => {
    setLoading(true);
    emailjs
      .send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          to_email: loginState.email,
          message: otp, // Send OTP in the email
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        setLoading(false);
        showAlert({
          show: true,
          text: "OTP has been sent to your email.",
          type: "success",
        });
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        showAlert({
          show: true,
          text: "Failed to send OTP. Please try again.",
          type: "danger",
        });
      });
  };

  return (
    <section className="relative flex lg:flex-row flex-col max-container">
      {alert.show && <Alert {...alert} />}

      <div className="flex-1 min-w-[50%] flex flex-col">
        {!isOtpSent ? (
          // Login form
          <form onSubmit={handleLoginSubmit} className="w-full flex flex-col gap-7 mt-14">
            <label className="text-black-500 font-semibold">
              Email
              <input
                type="email"
                name="email"
                className="input"
                placeholder="Enter your email"
                required
                value={loginState.email}
                onChange={handleChange}
              />
            </label>
            <label className="text-black-500 font-semibold">
              Password
              <input
                type="password"
                name="password"
                className="input"
                placeholder="Enter your password"
                required
                value={loginState.password}
                onChange={handleChange}
              />
            </label>
            <button type="submit" className="btn">
              {loading ? "Sending OTP..." : "Login"}
            </button>
          </form>
        ) : isUsernameSet ? (
          // Username input form
          <form onSubmit={handleUsernameSubmit} className="w-full flex flex-col gap-7 mt-14">
            <label className="text-black-500 font-semibold">
              Username
              <input
                type="text"
                name="username"
                className="input"
                placeholder="Enter your username"
                required
                value={loginState.username}
                onChange={handleChange}
              />
            </label>
            <button type="submit" className="btn">
              Set Username
            </button>
          </form>
        ) : (
          // OTP form
          <form onSubmit={handleOtpSubmit} className="w-full flex flex-col gap-7 mt-14">
            <label className="text-black-500 font-semibold">
              OTP
              <input
                type="text"
                name="otp"
                className="input"
                placeholder="Enter the OTP"
                required
                value={loginState.otp}
                onChange={handleChange}
              />
            </label>
            <button type="submit" className="btn">
              {loading ? "Verifying OTP..." : "Verify OTP"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Contact;
