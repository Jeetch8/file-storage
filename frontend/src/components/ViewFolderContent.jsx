import React from "react";
import { CiFileOn, CiFolderOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const ViewFolderContent = ({ folderInfo }) => {
  const navigate = useNavigate();

  const handleFolderClick = (folderId) => {
    navigate("/" + folderId);
  };

  const handleFileClick = (e) => {};

  if (folderInfo?.folders?.length === 0 && folderInfo?.files?.length === 0) {
    return (
      <div>
        <h2 className="font-semibold">No Files in this folder</h2>
      </div>
    );
  }

  return (
    <div>
      {folderInfo?.files.map((el) => {
        return (
          <button
            onClick={handleFileClick}
            key={el._id}
            className="border-2 px-4 py-2 w-fit flex items-center gap-x-2 rounded-md hover:bg-stone-100 my-3"
          >
            <CiFileOn size={"18px"} />
            <span>{el.name}</span>
          </button>
        );
      })}
      {folderInfo?.folders.map((el) => {
        return (
          <button
            onClick={() => handleFolderClick(el._id)}
            key={el._id}
            className="border-2 px-4 py-2 w-fit flex items-center gap-x-2 rounded-md hover:bg-stone-100 my-3"
          >
            <CiFolderOn size={"18px"} />
            <span>{el.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ViewFolderContent;
