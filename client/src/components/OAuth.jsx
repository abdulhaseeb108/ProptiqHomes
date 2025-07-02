import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app); // ✅ Make sure 'app' is the default Firebase app

      const result = await signInWithPopup(auth, provider);
      const { user } = result;

      const { data } = await axios.post(
        "http://localhost:5000/api/auth/google",
        {
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        },
        { withCredentials: true }
      );

      dispatch(signInSuccess(data));
      navigate("/");
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        console.warn("🟡 Google popup closed before completion.");
      } else if (err.code === "auth/cancelled-popup-request") {
        console.warn("🔁 Another Google popup request was cancelled.");
      } else if (err.code === "auth/argument-error") {
        console.error("❌ Firebase app was not initialized correctly.");
      } else {
        console.error("❌ Could not sign in with Google:", err);
      }
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-[#294936] text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
    >
      Continue with Google
    </button>
  );
};

export default OAuth;
