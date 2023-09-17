import { useRef, useState } from "react";
import { signin, signup, useAuth } from "../config/firebase";
import Upload from "./Upload";
import Dashboard from "./Dashboard";
import { ModalEnum } from "./Modal";

const Auth = () => {
  const currentUser: any = useAuth();
  const emailRef: any = useRef();
  const passwordRef: any = useRef();
  const [loading, setLoading] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalEnum>(ModalEnum.UPLOAD);

  const handleSignup = async () => {
    setLoading(true);
    try {
      await signup(emailRef.current.value, passwordRef.current.value);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSignin = async () => {
    setLoading(true);
    try {
      await signin(emailRef.current.value, passwordRef.current.value);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleShowModal = (type: ModalEnum) => {
    setShowModal(true);
    setModalType(type);
  };

  return (
    <main className="h-full">
      {!currentUser && (
        <section className="h-full flex justify-center items-center">
          <section className="w-1/2 flex justify-center items-center">
            <aside className="w-1/2">
              <div>
                <h2 className="text-3xl font-semibold mb-2">Welcome Back</h2>
                <p className="text-sm text-gray-500 mb-8">
                  Welcome Back! Please enter your details.
                </p>
              </div>
              <div className="mb-4">
                <label className="text-xs">Email</label>
                <br />
                <input
                  ref={emailRef}
                  placeholder="Email"
                  className="border rounded py-1 px-3 text-base w-full"
                />
              </div>
              <div className="mb-6">
                <label className="text-xs">Password</label>
                <br />
                <input
                  ref={passwordRef}
                  type="password"
                  placeholder="Password"
                  className="border rounded py-1 px-3 text-base w-full"
                />
              </div>
              {newUser ? (
                <>
                  <p onClick={() => setNewUser(false)}>
                    Already have an account? Signin.
                  </p>
                  <button disabled={loading} onClick={handleSignup}>
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <button
                    disabled={loading}
                    onClick={handleSignin}
                    className="bg-violet-700 text-white py-1 px-6 rounded font-semibold w-full mb-4"
                  >
                    Sign In
                  </button>
                  <p
                    onClick={() => setNewUser(true)}
                    className="text-xs cursor-pointer text-center"
                  >
                    Don't have an account? Signup.
                  </p>
                </>
              )}
            </aside>
          </section>
          <section className="w-1/2 flex justify-center items-center relative bg-gray-100 h-full rounded">
            <div className="h-48 w-48 bg-violet-700 rounded-full" />
            <div className="h-48 w-60 bg-gray-100 p-5 rounded-xl bg-opacity-50 backdrop-filter backdrop-blur-lg absolute top-1/2" />
          </section>
        </section>
      )}

      {currentUser && (
        <>
          <Upload handleShowModal={handleShowModal} />
          <Dashboard
            showModal={showModal}
            setShowModal={setShowModal}
            handleShowModal={handleShowModal}
            modalType={modalType}
          />
        </>
      )}
    </main>
  );
};

export default Auth;
