import Auth from "./components/Auth";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <main className="py-4 px-6 h-[100vh]">
      <Navbar />
      <Auth />
    </main>
  );
};

export default App;
