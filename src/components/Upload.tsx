import { FC } from "react";
import { ModalEnum } from "./Modal";

export interface IUpload {
  handleShowModal: (type: ModalEnum) => void;
}

const Upload: FC<IUpload> = ({ handleShowModal }) => {
  return (
    <>
      <section className="mt-12 flex justify-end">
        <button
          type="button"
          className="mr-4 bg-violet-700 text-white hover:bg-violet-600 focus:outline-none rounded px-8 py-2 text-center font-semibold"
          onClick={() => handleShowModal(ModalEnum.UPLOAD)}
        >
          + Add User
        </button>
      </section>
    </>
  );
};

export default Upload;
