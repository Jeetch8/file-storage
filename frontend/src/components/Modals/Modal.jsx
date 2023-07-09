import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { clsx } from "clsx";

const Modal = ({
  modalContent,
  modalTitle,
  openModalBtnContent,
  openModalBtnStyle,
  isModalOpen,
  setIsModalOpen,
}) => {
  const modalRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const handler = (event) => {
      if (!modalRef.current || !btnRef.current) return;
      if (
        !modalRef.current.contains(event.target) &&
        !btnRef.current.contains(event.target)
      ) {
        closeModal();
      }
    };

    document.addEventListener("click", handler);

    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  const closeModal = useCallback(() => {
    document.body.style.overflow = "visible";
    setIsModalOpen(false);
  }, []);

  const openModal = useCallback(() => {
    document.body.style.overflow = "hidden";
    setIsModalOpen(true);
  }, []);

  return (
    <>
      <button ref={btnRef} onClick={openModal} className={openModalBtnStyle}>
        {openModalBtnContent}
      </button>
      {isModalOpen && (
        <div className="absolute bg-[rgba(0,0,0,0.2)] h-screen w-full top-0 left-0 flex justify-center items-center z-50">
          <div
            className="border-[1px] border-black min-w-[450px] min-h-[250px] rounded-md px-2 py-2 bg-white"
            ref={modalRef}
          >
            <div className="flex justify-between">
              <h2 className=" font-semibold">{modalTitle}</h2>
              <IoIosClose
                size={"20px"}
                className="cursor-pointer"
                onClick={closeModal}
              />
            </div>
            {modalContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
