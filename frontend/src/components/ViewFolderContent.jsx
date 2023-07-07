import React from "react";
import { CiFileOn, CiFolderOn } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const ViewFolderContent = ({ folderInfo }) => {
  const navigate = useNavigate();

  const handleFolderClick = (folderId) => {
    navigate("/folder/" + folderId);
  };

  const handleFileClick = (e) => {};

  if (folderInfo?.folders?.length === 0 && folderInfo?.files?.length === 0) {
    return (
      <div className="ml-4">
        <h2 className="font-semibold">No Files in this folder</h2>
      </div>
    );
  }

  return (
    <div className="ml-4">
      {folderInfo?.files?.length > 0 && (
        <h3 className="font-semibold text-xl">Files</h3>
      )}
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
      {folderInfo?.folders?.length > 0 && (
        <h3 className="font-semibold text-xl">Folders</h3>
      )}
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
