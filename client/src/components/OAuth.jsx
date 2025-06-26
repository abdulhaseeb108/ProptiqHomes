import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from 'react-router-dom';

const OAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const { user } = await signInWithPopup(auth, provider);

      const { data } = await axios.post(
        "http://localhost:3000/api/auth/google",
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
      console.error("Could not sign in with Google:", err);
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
