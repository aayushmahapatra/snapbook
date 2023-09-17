import { signout, useAuth } from "../config/firebase";

const Navbar = () => {
  const currentUser: any = useAuth();

  const handleSignout = async () => {
    try {
      await signout();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="fixed w-full flex justify-between items-center">
      <div>SnapBook</div>
      <div className="flex items-center text-sm mr-16">
        <div className="mr-4">{currentUser?.email}</div>
        {currentUser && (
          <button
            onClick={handleSignout}
            className="border border-violet-700 rounded font-semibold py-1 px-4 text-violet-700 hover:bg-violet-700 hover:text-white"
          >
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
