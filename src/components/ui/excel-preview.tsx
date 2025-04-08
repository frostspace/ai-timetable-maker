"use client";

import { useState, useEffect } from "react";

interface Cell {
  value: string;
  editable?: boolean;
  highlighted?: boolean;
}

interface ExcelPreviewProps {
  data: Cell[][];
  onCellChange?: (rowIndex: number, colIndex: number, value: string) => void;
}

export function ExcelPreview({ data, onCellChange }: ExcelPreviewProps) {
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [cellValue, setCellValue] = useState("");

  const handleCellClick = (rowIndex: number, colIndex: number, cell: Cell) => {
    if (!cell.editable) return;
    
    setEditingCell({ row: rowIndex, col: colIndex });
    setCellValue(cell.value);
  };

  const handleCellBlur = () => {
    if (editingCell && onCellChange) {
      onCellChange(editingCell.row, editingCell.col, cellValue);
    }
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCellBlur();
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full">
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex === 0 ? "bg-gray-100" : ""}>
              {row.map((cell, colIndex) => (
                <td
                  key={`${rowIndex}-${colIndex}`}
                  className={`border px-4 py-2 ${cell.highlighted ? "bg-blue-50" : ""} ${
                    cell.editable ? "cursor-text hover:bg-gray-50" : ""
                  }`}
                  onClick={() => handleCellClick(rowIndex, colIndex, cell)}
                >
                  {editingCell &&
                  editingCell.row === rowIndex &&
                  editingCell.col === colIndex ? (
                    <input
                      type="text"
                      value={cellValue}
                      onChange={(e) => setCellValue(e.target.value)}
                      onBlur={handleCellBlur}
                      onKeyDown={handleKeyDown}
                      className="w-full p-0 border-none focus:outline-none bg-transparent"
                      autoFocus
                    />
                  ) : (
                    cell.value
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 