import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileIcon, defaultStyles } from "react-file-icon";
import MoreOptions from "./MoreOptions";
import { FaFolder } from "react-icons/fa";
import { useFetch } from "../hooks/useFetch";
import { base_url } from "../utils/base_url";
import toast from "react-hot-toast";
import RenameFileModal from "./Modals/RenameFileModal";
import RenameFolderModal from "./Modals/RenameFolderModal";

const ViewFolderContent = ({ folderInfo, doFetch }) => {
  const navigate = useNavigate();
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const { doFetch: deleteFolderFetch, fetchState: deleteFolderState } =
    useFetch({
      url: base_url + "/folder/",
      authorized: true,
      method: "DELETE",
      onSuccess: (data) => {
        toast.dismiss("deleting");
        toast.success("Folder deleted");
        doFetch();
      },
      onError: (err) => {
        toast.dismiss("deleting");
        toast.error(err.message, { duration: 4000 });
      },
    });
  const { doFetch: deleteFileFetch, fetchState: deleteFileState } = useFetch({
    url: base_url + "/file/delete-file/",
    authorized: true,
    method: "DELETE",
    onSuccess: (data) => {
      toast.dismiss("deleting");
      toast.success("File deleted");
      doFetch();
    },
    onError: (err) => {
      toast.dismiss("deleting");
      toast.error(err.message, { duration: 4000 });
    },
  });

  const handleFolderClick = (folderId) => {
    navigate("/folder/" + folderId);
  };

  const handleFileClick = (e) => {};

  const handleFileMoreOptionsClick = (option, file) => {
    if (option === "Delete") {
      toast.loading(`Deleting file`, {
        id: "deleting",
      });
      deleteFileFetch({ file: file._id });
    } else if (option === "Download") {
      window.open(file.signedUrl, "_blank");
    } else if (option === "Rename") {
      setIsRenameModalOpen(true);
    }
  };

  const handleFolderMoreOptionsClick = (option, folder) => {
    if (option === "Delete") {
      toast.loading(`Deleting folder`, {
        id: "deleting",
      });
      deleteFolderFetch({ folder: folder._id });
    } else if (option === "Rename") {
      setIsRenameModalOpen(true);
    }
  };

  if (folderInfo?.folders?.length === 0 && folderInfo?.files?.length === 0) {
    return (
      <div className="ml-4">
        <h2 className="font-semibold">No Files in this folder</h2>
      </div>
    );
  }

  return (
    <div className="ml-4 w-full">
      {folderInfo?.files?.length > 0 && (
        <h3 className="font-semibold text-xl">Files</h3>
      )}
      <div className="flex flex-wrap gap-5">
        {folderInfo?.files.map((el) => {
          const ext = el.name.split(".").pop();
          return (
            <div
              onClick={handleFileClick}
              key={el._id}
              className="border-2 px-4 pt-2 pb-4 w-[260px] gap-x-2 rounded-md hover:bg-slate-200 my-3 bg-slate-400 cursor-pointer"
            >
              <div className="flex justify-between">
                <p className="py-1 text-left">{el.name.substring(0, 23)}...</p>
                <MoreOptions
                  entity={el}
                  onClick={handleFileMoreOptionsClick}
                  options={["Rename", "Delete", "Download", "Share"]}
                />
              </div>
              {el?.signedUrl ? (
                <div
                  style={{
                    background: `url(${el.signedUrl})`,
                    height: "200px",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                ></div>
              ) : (
                <div className="bg-white rounded-md h-[200px] flex items-center justify-center">
                  <span className="w-[60px] flex items-center justify-center">
                    <FileIcon extension={ext} {...defaultStyles[ext]} />
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {folderInfo?.folders?.length > 0 && (
        <h3 className="font-semibold text-xl">Folders</h3>
      )}
      <div className="flex items-center gap-x-4 flex-wrap pr-4">
        {folderInfo?.folders.map((el) => {
          return (
            <div
              onDoubleClick={() => handleFolderClick(el._id)}
              key={el._id}
              className="border-2 pl-4 pr-3 py-2 flex items-center justify-between rounded-md hover:bg-stone-100 my-3 w-[250px] select-none relative"
            >
              <span className="flex items-center gap-x-2">
                <FaFolder size={"18px"} />
                <span>{el.name}</span>
              </span>
              <MoreOptions
                entity={el}
                onClick={handleFolderMoreOptionsClick}
                options={["Rename", "Delete"]}
              />
            </div>
          );
        })}
      </div>
      <RenameFileModal />
      <RenameFolderModal />
    </div>
  );
};

export default ViewFolderContent;
