import React from "react";

export function Table({
  columns,
  rows,
}: {
  columns: string[];
  rows: Array<Array<string | number>>;
}) {
  return (
    <div className="glass rounded-2xl p-4">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-[0.2em] text-muted">
            {columns.map((col) => (
              <th key={col} className="pb-2">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-foreground">
          {rows.map((row, idx) => (
            <tr key={idx} className="border-t border-border/60">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
