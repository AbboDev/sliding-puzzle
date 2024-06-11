import { GridSize, Matrix } from "../types";

export interface Props extends React.HTMLAttributes<HTMLDivElement>, GridSize {
  matrix: Matrix<number | null>;
  movePiece: (y: number, x: number) => void;
}

const Grid: React.FC<Props> = ({
  width,
  height,
  matrix,
  movePiece,
  className,
  ...props
}) => {
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
