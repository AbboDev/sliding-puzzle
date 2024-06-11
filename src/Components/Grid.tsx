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

  const gridClassName = `${className} grid gap-4 *:aspect-square *:rounded-md *:flex *:justify-center *:items-center *:bg-amber-700 dark:*:bg-amber-300`;

  const style = {
    "--puzzle-width": width,
    "--puzzle-height": height,
    "grid-template-columns": "repeat(var(--puzzle-width, 1), minmax(0, 1fr))",
    "grid-template-rows": "repeat(var(--puzzle-height, 1), minmax(0, 1fr))",
  } as React.CSSProperties;

  return (
    <>
      <div {...props} className={gridClassName} style={style}>
        {matrix.map((columns, y) =>
          columns.map((cell, x) =>
            cell !== null ? (
              <div
                className={`row-start-${y + 1} row-end-${y + 2} col-start-${
                  x + 1
                } col-end-${x + 2}`}
                key={x}
              >
                {cell}
              </div>
            ) : null
          )
        )}
      </div>
    </>
  );
};

export default Grid;
