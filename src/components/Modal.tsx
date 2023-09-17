import { FC, useRef, useState } from "react";
import { editData, storeData, upload, useAuth } from "../config/firebase";

export enum ModalEnum {
  UPLOAD = "upload",
  EDIT = "edit",
}

interface IModal {
  modalType: ModalEnum;
  setShowModal: (showModal: boolean) => void;
  originalItem: any;
}

const Modal: FC<IModal> = ({ modalType, setShowModal, originalItem }) => {
  const currentUser = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState<string>(
    originalItem?.name ? originalItem?.name : ""
  );
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    switch (modalType) {
      case ModalEnum.UPLOAD:
        const photoURL = await upload(file, name);
        await storeData(currentUser, name, photoURL);
        break;
      case ModalEnum.EDIT:
        if (file) {
          const photoURL = await upload(file, name);
          await editData(originalItem.id, name, photoURL);
        } else {
          await editData(originalItem.id, name);
        }
        break;
    }

    setName("");
    setFile(null);
    setLoading(false);
    setShowModal(false);
  };

  return (
    <div className="fixed flex justify-center items-center z-50 w-full p-4 md:inset-0 h-screen backdrop-filter backdrop-blur backdrop-brightness-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-white opacity-50 w-full h-full"
        onClick={() => setShowModal(false)}
      />
      <div className="relative w-full max-w-lg max-h-full">
        {/* Modal content */}
        <div className="relative bg-gray-800 rounded-lg shadow">
          <button
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={() => setShowModal(false)}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
              {modalType === ModalEnum.UPLOAD ? "Add New User" : "Edit User"}
            </h3>
            <section className="space-y-6">
              <div>
                <label
                  htmlFor="file"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Image
                </label>
                <div className="flex gap-32">
                  <div className="cursor-pointer">
                    <div className="" onClick={handleSelectFile}>
                      <input
                        id="file"
                        name="file"
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="w-full h-full"
                        style={{ display: "none" }}
                      />
                      <div className="bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
                        {file ? file?.name : "No file selected"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name
                </label>
                <input
                  name="name"
                  id="name"
                  className="bg-gray-50 border border-gray-500 text-gray-900 text-sm rounded block w-full p-2.5 focus:border-lime-500 focus:outline-none dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <button
                className="bg-blue-600 text-white py-1 px-4 rounded font-semibold flex items-center"
                onClick={handleSubmit}
              >
                {loading && (
                  <div
                    className="h-3 w-3 mr-2 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-white"
                    role="status"
                  />
                )}
                Submit
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
