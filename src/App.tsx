import Game from "./Components/Game";

function App() {
  return (
    <>
      <main className="bg-sky-700 dark:bg-sky-950 min-h-screen text-white py-3">
        <section className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold underline">Sliding puzzle</h1>

          <p className="mt-3">
            The classical puzzle game where you have to slide the pieces in the
            empty slot to align the grid
          </p>

          <Game />
        </section>
      </main>
    </>
  );
}

export default App;
