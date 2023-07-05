import React, { useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MoonLoader from "react-spinners/MoonLoader";

const Home = () => {
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.root_folder_id)
      navigate(`/folder/${currentUser?.root_folder_id}`);
  }, [currentUser]);

  return (
    <div>
      <MoonLoader />
    </div>
  );
};

export default Home;
