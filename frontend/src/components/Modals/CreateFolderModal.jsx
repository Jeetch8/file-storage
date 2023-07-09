import React, { useState } from "react";
import Modal from "./Modal";
import { AiOutlineFolderAdd } from "react-icons/ai";
import { base_url } from "../../utils/base_url";
import { useFetch } from "../../hooks/useFetch";
import ScaleLoader from "react-spinners/ScaleLoader";
import toast from "react-hot-toast";

const CreateFolderModal = ({ parentFolderId, doFetch }) => {
  const [userInput, setUserInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { doFetch: createFolderFetch, fetchState: createFolderState } =
    useFetch({
      url: base_url + "/folder/create-folder",
      authorized: true,
      method: "POST",
      onSuccess: (data) => {
        doFetch();
        setIsModalOpen(false);
        setUserInput("");
      },
      onError: (err) => {
        toast.error(err.message, { duration: 4000 });
      },
    });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    createFolderFetch({ folderName: userInput, parentFolderId });
  };

  return (
    <Modal
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      modalTitle={<span className="text-xl">Create Folder</span>}
      openModalBtnContent={
        <>
          <AiOutlineFolderAdd size={26} />
          <span>Add Folder</span>
        </>
      }
      openModalBtnStyle="border-2 border-stone-500 rounded-md px-3 py-1 flex items-center gap-x-1 hover:bg-slate-100 bg-transparent text-black"
      modalContent={
        <div className="flex flex-col h-[180px] justify-between mt-3">
          <div className="flex items-baseline gap-x-2">
            <p>New Folder Name</p>
            <input
              onChange={(e) => setUserInput(e.target.value)}
              value={userInput}
              type="text"
              placeholder="Enter folder name"
              className="border-2 border-stone-500 rounded-md px-3 py-1 outline-none"
            />
          </div>
          <div className="flex justify-end mt-auto">
            <button
              onClick={handleFormSubmit}
              type="submit"
              className="px-5 py-2 rounded-md bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold"
              disabled={createFolderState === "loading" || !userInput}
            >
              {createFolderState === "loading" ? (
                <ScaleLoader height={13} />
              ) : (
                "Create Folder"
              )}
            </button>
          </div>
        </div>
      }
    />
  );
};

export default CreateFolderModal;
