import { useEffect, useState } from "react";
import { getRandomSortedValues } from "../Utilities/getRandomSortedValues";

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  width?: number;
  height?: number;
}

interface Matrix<T = unknown> extends Array<Array<T>> {}

const Grid: React.FC<Props> = ({
  width = 3,
  height = 3,
  className,
  ...props
}) => {
  const [matrix, setMatrix] = useState<Matrix<number | null>>([[]]);

  useEffect(() => {
    const length = width * height;
    const last = length - 1;

    const values = getRandomSortedValues(length, (_, index) =>
      index === last ? null : index + 1
    );

    const assembledMatrix: Matrix<number | null> = [];

    for (let y = 0; y < width; y++) {
      assembledMatrix[y] = [];

      for (let x = 0; x < height; x++) {
        const index = x + y * width;

        assembledMatrix[y][x] = values[index];
      }
    }

    setMatrix(assembledMatrix);
  }, [width, height]);

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

  const gridClassName = `${className} grid gap-4 *:aspect-square *:rounded-md *:flex *:justify-center *:items-center text-sky-700 dark:text-sky-950 *:bg-amber-700 dark:*:bg-amber-300 hover:*:shadow-amber-900 hover:dark:*:shadow-amber-500 *:cursor-pointer hover:*:shadow-sm *:transition-shadow`;

  const style = {
    "--puzzle-width": width,
    "--puzzle-height": height,
    gridTemplateColumns: "repeat(var(--puzzle-width, 1), minmax(0, 1fr))",
    gridTemplateRows: "repeat(var(--puzzle-height, 1), minmax(0, 1fr))",
  } as React.CSSProperties;

  return (
    <>
      <div {...props} className={gridClassName} style={style}>
        {matrix.map((columns, y) =>
          columns.map((cell, x) => {
            if (cell === null) {
              return null;
            }

            const style = {
              gridRowStart: y + 1,
              gridRowEnd: y + 2,
              gridColumnStart: x + 1,
              gridColumnEnd: x + 2,
            } as React.CSSProperties;

            return (
              <button
                key={x}
                type="button"
                style={style}
                onClick={() => movePiece(y, x)}
              >
                {cell}
              </button>
            );
          })
        )}
      </div>
    </>
  );
};

export default Grid;
