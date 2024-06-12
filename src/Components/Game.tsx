import { FormEvent, useEffect, useRef, useState } from "react";
import { GridSize, Matrix } from "../types";
import { getRandomSortedValues } from "../Utilities/getRandomSortedValues";
import Grid from "./Grid";

type GameMatrix = Matrix<number | null>;

const Game: React.FC = () => {
  const [matrix, setMatrix] = useState<GameMatrix>([[]]);
  const [history, setHistory] = useState<Array<GameMatrix>>([]);

  const correctMatrix = useRef<GameMatrix>([[]]);

  const [win, setWin] = useState<boolean>(false);
  const [size, setSize] = useState<GridSize>({
    width: 3,
    height: 3,
  });

  function updateSize(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const width = parseInt(formData.get("width") as string);
    const height = parseInt(formData.get("height") as string);

    if (size.width !== width || size.height !== height) {
      setSize({ width, height });
    }

    restartGame();
  }

  function restartGame() {
    setWin(false);
    setHistory([]);
    setupGame();
  }

  function setupGame() {
    const { width, height } = size;

    const length = width * height;
    const last = length - 1;

    const values = getRandomSortedValues(length, (_, index) =>
      index === last ? null : index + 1
    );

    const assembledMatrix: GameMatrix = [];
    const endMatrix: GameMatrix = [];

    for (let y = 0; y < height; y++) {
      assembledMatrix[y] = [];
      endMatrix[y] = [];

      for (let x = 0; x < width; x++) {
        const index = x + y * width;

        assembledMatrix[y][x] = values[index];
        endMatrix[y][x] = index === last ? null : index + 1;
      }
    }

    setMatrix(assembledMatrix);
    correctMatrix.current = endMatrix;
  }

  useEffect(setupGame, [size]);

  useEffect(() => {
    const final = correctMatrix.current.every((row, y) =>
      row.every((column, x) => {
        return matrix[y][x] === column;
      })
    );

    if (final) {
      setWin(true);
    }
  }, [matrix]);

  const movePiece = (currentY: number, currentX: number) => {
    const [y, x] = findEmptyCell();

    if (y === null || x === null) {
      // TODO: feedback for missing empty slot
      return;
    }

    const diffX = x - currentX;
    const diffY = y - currentY;
    const movement = Math.abs(diffX) + Math.abs(diffY);

    const isMovingX = diffX !== 0;
    const isMovingY = diffY !== 0;
    // The movement can be in only one direction
    if (isMovingX && isMovingY) {
      // TODO: feedback for no movement
      return;
    }

    // Create a copy of the matrix
    const newMatrix = [...matrix];

    // For each movement requested translate the block of one index
    for (let index = movement; index > 0; index--) {
      let movementX = 0;
      if (isMovingX) {
        movementX += index * Math.sign(diffX);
      }

      let movementY = 0;
      if (isMovingY) {
        movementY += index * Math.sign(diffY);
      }

      const newX = currentX + movementX;
      const newY = currentY + movementY;
      const newX2 = newX - Math.sign(diffX);
      const newY2 = newY - Math.sign(diffY);

      newMatrix[newY][newX] = newMatrix[newY2][newX2];
      newMatrix[newY2][newX2] = null;
    }

    setMatrix(newMatrix);
    setHistory((history) => [...history, matrix]);
  };

  const findEmptyCell = () => {
    let x: number | null = null;

    const row = matrix.find((row) => {
      const index = row.indexOf(null);
      if (index > -1) {
        x = index;
        return true;
      }

      return false;
    });

    if (!row || x === null) {
      return [null, null];
    }

    const y = matrix.indexOf(row);

    return [y, x];
  };

  return (
    <>
      <form
        action=""
        method="GET"
        onSubmit={updateSize}
        className="max-w-2xl mx-auto mt-3 flex justify-between items-center gap-2 *:text-sky-700 dark:*:text-sky-950 *:py-2 *:px-4 *:rounded-md"
      >
        <label htmlFor="width" className="!text-black dark:!text-white !p-0">
          Width:
        </label>
        <input
          className="border-0 flex-1"
          name="width"
          type="number"
          defaultValue={size.width}
          min={1}
          max={99}
        />

        <label htmlFor="height" className="!text-black dark:!text-white !p-0">
          Height:
        </label>
        <input
          className="border-0 flex-1"
          name="height"
          type="number"
          defaultValue={size.height}
          min={1}
          max={99}
        />
        <button
          className="bg-amber-700 dark:bg-amber-300 hover:shadow-amber-900 hover:dark:shadow-amber-500 cursor-pointer hover:shadow-sm transition-shadow flex-shrink-0"
          type="submit"
        >
          New game
        </button>
      </form>

      <section className="max-w-2xl mx-auto mt-3 text-xl relative select-none">
        <Grid
          width={size.width}
          height={size.height}
          matrix={matrix}
          movePiece={movePiece}
          className={`relative z-0 ${win ? "blur-sm" : "blur-none"}`}
        />
        {win && (
          <div className="absolute inset-0 z-1 uppercase flex justify-center items-center flex-col gap-2">
            You Won in {history.length} moves!
            <button
              type="button"
              onClick={restartGame}
              className="rounded-md bg-sky-700 dark:*:bg-sky-950 hover:shadow-sky-900 hover:dark:shadow-sky-500 cursor-pointer hover:shadow-sm transition-shadow py-2 px-4"
            >
              Restart!
            </button>
          </div>
        )}

        <div>
          {history.length
            ? `Move N #${history.length}`
            : "Make your first move!"}
        </div>
      </section>
    </>
  );
};

export default Game;
