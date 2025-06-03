import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import app from "../firebase";

const auth = getAuth(app);
const db = getFirestore(app);

export default function Auth() {
  const [mode, setMode] = useState("signup");
  const [emailOrUsername, setEmailOrUsername] = useState(""); // used for login
  const [email, setEmail] = useState(""); // used for signup
  const [username, setUsername] = useState(""); // used for signup
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const allowedDomains = ["sussex.ac.uk", "brighton.ac.uk", "gmail.com"]; // TEMP: include gmail for testing

  const navigate = useNavigate();

  const handleSignup = async () => {
    const emailDomain = email.split("@")[1];
    setLoading(true);
    setMessage("");
  
    if (!allowedDomains.includes(emailDomain)) {
      setMessage("Only @sussex.ac.uk and @brighton.ac.uk emails are allowed.");
      setMessageType("error");
      setLoading(false);
      return;
    }
  
    if (!username.trim()) {
      setMessage("Username is required.");
      setMessageType("error");
      setLoading(false);
      return;
    }
  
    try {
      // Check if username already exists
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username));
      const snapshot = await getDocs(q);
  
      if (!snapshot.empty) {
        setMessage("Username is already taken. Please choose another.");
        setMessageType("error");
        setLoading(false);
        return;
      }
  
      // Proceed with signup
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
  
      await sendEmailVerification(user);
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
      });
  
      setMessage("Signup successful! Check your inbox to verify your email.");
      setMessageType("success");
      setEmail("");
      setPassword("");
      setUsername("");
      navigate("/home");
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };
  

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    try {
      let emailToUse = emailOrUsername;

      // If input is not an email, treat it as username and look up email
      if (!emailOrUsername.includes("@")) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", emailOrUsername));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          throw new Error("Username not found.");
        }

        emailToUse = snapshot.docs[0].data().email;
      }

      const userCred = await signInWithEmailAndPassword(auth, emailToUse, password);
      const user = userCred.user;

      await user.reload();
      if (!user.emailVerified) {
        setMessage("Please verify your email before logging in.");
        setMessageType("error");
        return;
      }

      setMessage("Logged in!");
      setMessageType("success");
      navigate("/home");
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    setMessage("");

    try {
      let emailToUse = emailOrUsername;

      if (!emailOrUsername.includes("@")) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", emailOrUsername));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          throw new Error("Username not found.");
        }

        emailToUse = snapshot.docs[0].data().email;
      }

      const userCred = await signInWithEmailAndPassword(auth, emailToUse, password);
      const user = userCred.user;

      if (user.emailVerified) {
        setMessage("Your email is already verified.");
        setMessageType("success");
        return;
      }

      await sendEmailVerification(user);
      setMessage("Verification email sent again. Check your inbox.");
      setMessageType("success");
    } catch (error) {
      setMessage("Resend failed: " + error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {mode === "signup" ? "Create Account" : "Log In"}
      </h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded text-sm border ${
            messageType === "success"
              ? "bg-green-100 text-green-800 border-green-300"
              : "bg-red-100 text-red-800 border-red-300"
          }`}
        >
          {message}
        </div>
      )}

      {mode === "signup" && (
        <>
          <input
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            className="w-full p-2 border mb-2 rounded"
          />
          <input
            type="email"
            placeholder="University Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border mb-2 rounded"
          />
        </>
      )}

      {mode === "login" && (
        <input
          type="text"
          placeholder="Username or Email"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          className="w-full p-2 border mb-2 rounded"
        />
      )}

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border mb-4 rounded"
      />

      <button
        onClick={mode === "signup" ? handleSignup : handleLogin}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={
          loading ||
          !password ||
          (mode === "signup"
            ? !username || !email
            : !emailOrUsername)
        }
      >
        {loading ? "Processing..." : mode === "signup" ? "Sign Up" : "Log In"}
      </button>

      {mode === "login" && (
        <button
          onClick={handleResendVerification}
          className="mt-2 text-sm text-blue-500 underline w-full text-center disabled:opacity-50"
          disabled={loading || !emailOrUsername || !password}
        >
          {loading ? "Sending..." : "Resend verification email"}
        </button>
      )}

      <p className="mt-4 text-sm text-center text-gray-600">
        {mode === "signup" ? (
          <>
            Made an account already?{" "}
            <button
              className="text-blue-600 underline"
              onClick={() => {
                setMode("login");
                setMessage("");
              }}
            >
              Log in
            </button>
          </>
        ) : (
          <>
            Don’t have an account yet?{" "}
            <button
              className="text-blue-600 underline"
              onClick={() => {
                setMode("signup");
                setMessage("");
              }}
            >
              Sign up
            </button>
          </>
        )}
      </p>
    </div>
  );
}
