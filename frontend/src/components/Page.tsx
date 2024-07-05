import Header from "./header/Header";
import Footer from "./footer/Footer";
import "../styles/index.css";
import Body from "./body/Body";

// Page component
function Page() {
  return (
    <div className="flex flex-col min-h-screen font-libre">
      <header className="text-white">
        <Header />
      </header>
      <main className="flex flex-1">
        <Body />
      </main>
      <footer className="text-black">
        <Footer />
      </footer>
    </div>
  );
}

export default Page;
