import { FormEvent, useEffect, useRef, useState } from "react";
import { GridSize, Matrix } from "../types";
import { getRandomSortedValues } from "../Utilities/getRandomSortedValues";
import Grid from "./Grid";

const Game: React.FC = () => {
  const [matrix, setMatrix] = useState<Matrix<number | null>>([[]]);
  const correctMatrix = useRef<Matrix<number | null>>([[]]);
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

    setSize({ width, height });
  }

  useEffect(() => {
    const { width, height } = size;

    const length = width * height;
    const last = length - 1;

    const values = getRandomSortedValues(length, (_, index) =>
      index === last ? null : index + 1
    );

    const assembledMatrix: Matrix<number | null> = [];
    const endMatrix: Matrix<number | null> = [];

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
  }, [size]);

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
    const diff = Math.abs(diffX) + Math.abs(diffY);
    if (diff > 1) {
      // TODO: feedback for no movement
      return;
    }

    const newX = currentX + diffX;
    const newY = currentY + diffY;

    const newMatrix = [...matrix];
    newMatrix[newY][newX] = newMatrix[currentY][currentX];
    newMatrix[currentY][currentX] = null;

    setMatrix(newMatrix);
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
          <div className="absolute inset-0 z-1 uppercase flex justify-center items-center">
            You Won!
          </div>
        )}
      </section>
    </>
  );
};

export default Game;
