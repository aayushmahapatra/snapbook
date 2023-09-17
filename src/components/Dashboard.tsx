import { FC, useEffect, useState } from "react";
import { deleteData, fetchData, useAuth } from "../config/firebase";
import Modal, { ModalEnum } from "./Modal";

interface IDashboard {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  handleShowModal: (type: ModalEnum) => void;
  modalType: ModalEnum;
}

const Dashboard: FC<IDashboard> = ({
  showModal,
  setShowModal,
  handleShowModal,
  modalType,
}) => {
  const currentUser: any = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [originalItem, setOriginalItem] = useState<any>();

  useEffect(() => {
    const fetchDataAndUpdateData = async () => {
      const result = await fetchData();
      setData(result);
    };

    fetchDataAndUpdateData();
  }, [showModal]);

  const handleDelete = async (id: string) => {
    await deleteData(id);
    window.location.reload();
  };

  const handleOnEdit = (item: any) => {
    handleShowModal(ModalEnum.EDIT);
    setOriginalItem(item);
  };

  return (
    <section className="flex flex-wrap gap-4 mt-8">
      {!data.filter((item) => item.uid === currentUser.uid)[0] && (
        <div className="flex justify-center w-full">No Users added.</div>
      )}
      {data
        .filter((item) => item.uid === currentUser.uid)
        .map((item, i) => (
          <div key={i} className="w-[31vw]">
            <div className="border p-4 rounded shadow">
              <div className="w-full bg-black rounded relative">
                <img
                  src={item.photoURL}
                  alt={item.name}
                  className="mb-4 rounded h-80 mx-auto"
                />
                <div className="flex absolute top-2 right-2">
                  <button
                    className="text-black bg-gray-100 opacity-50 cursor-pointer rounded py-1 px-4 mr-2 text-sm hover:bg-violet-700 hover:text-white hover:opacity-100"
                    onClick={() => handleOnEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    type="submit"
                    className="text-black bg-gray-200 opacity-50 cursor-pointer rounded py-1 px-4 text-sm hover:bg-violet-700 hover:text-white hover:opacity-100"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="font-bold text-center">{item.name}</div>
            </div>
          </div>
        ))}
      {showModal && (
        <Modal
          modalType={modalType}
          setShowModal={setShowModal}
          originalItem={originalItem}
        />
      )}
    </section>
  );
};

export default Dashboard;
