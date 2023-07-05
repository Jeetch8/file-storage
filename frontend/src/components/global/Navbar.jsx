import React from "react";
import AvatarImage from "./AvatarImage";
import { useAuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { currentUser } = useAuthContext();

  return (
    <div className="flex items-center justify-between px-5 py-2 bg-blue-500 text-white">
      <div className="font-semibold">Logo</div>
      <div>
        <AvatarImage diameter={"40px"} url={currentUser?.profile_img} />
      </div>
    </div>
  );
};

export default Navbar;
