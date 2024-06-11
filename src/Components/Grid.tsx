import { useEffect, useState } from "react";

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  width?: number;
  height?: number;
}

interface Matrix extends Array<Array<number | null>> {}

const Grid: React.FC<Props> = ({
  width = 3,
  height = 3,
  className,
  ...props
}) => {
  const [matrix, setMatrix] = useState<Matrix>([]);

  useEffect(() => {
    const assembledMatrix: Matrix = [];
    const max = width * height;

    for (let y = 0; y < width; y++) {
      assembledMatrix[y] = [];

      for (let x = 0; x < height; x++) {
        const index = x + y * width;
        assembledMatrix[y][x] = max - 1 === index ? null : index + 1;
      }
    }

    setMatrix(assembledMatrix);
  }, [width, height]);

  const gridClassName = `${className} grid gap-4 *:aspect-square *:rounded-md *:flex *:justify-center *:items-center *:bg-amber-700 dark:*:bg-amber-300 hover:*:shadow-amber-900 hover:dark:*:shadow-amber-500 *:cursor-pointer hover:*:shadow-sm *:transition-shadow`;

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
            if (!cell) {
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
