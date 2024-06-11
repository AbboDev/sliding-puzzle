import { FormEvent, useState } from "react";
import { GridSize } from "./types";
import Grid from "./Components/Grid";

function App() {
  const [win, setWin] = useState<boolean>(false);
  const [size, setSize] = useState<GridSize>({
    width: 3,
    height: 3,
  });

  return (
    <>
      <main className="bg-sky-700 dark:bg-sky-950 min-h-screen text-white py-3">
        <section className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold underline">Sliding puzzle</h1>

          <p className="mt-3">
            The classical puzzle game where you have to slide the pieces in the
            empty slot to align the grid
          </p>

          <section className="max-w-2xl mx-auto mt-3 text-xl relative select-none">
            <Grid
              width={size.width}
              height={size.height}
              className={`relative z-0 ${win ? "blur-sm" : "blur-none"}`}
              onWin={() => setWin(true)}
            />
            {win && (
              <div className="absolute inset-0 z-1 uppercase flex justify-center items-center">
                You Won!
              </div>
            )}
          </section>
        </section>
      </main>
    </>
  );
}

export default App;
