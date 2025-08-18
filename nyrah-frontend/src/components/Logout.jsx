import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser } from "../redux/apis/userApi";
import { useEffect } from "react";
import Loader from "./Loader";

function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const toastId = "logout-toast";

    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        toast.dismiss(toastId); // prevent duplicates
        toast.success("Logged out successfully", { toastId });
        navigate("/");
      })
      .catch((err) => {
        toast.dismiss(toastId);
        toast.error(err || "Logout failed", { toastId });
        navigate("/");
      });
  }, []);

  return (
    <Loader/>
  );
}

export default Logout;
