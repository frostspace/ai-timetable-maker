"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ExcelPreview } from "@/components/ui/excel-preview";
import { downloadTimetableAsExcel } from "@/lib/excel-utils";

interface Cell {
  value: string;
  editable?: boolean;
  highlighted?: boolean;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const PERIODS = Array.from({ length: 8 }, (_, i) => i + 1);

export default function TimetableViewPage() {
  const [timetableData, setTimetableData] = useState<Cell[][]>([]);

  useEffect(() => {
    // Initialize timetable data
    const headerRow: Cell[] = [
      { value: "Period/Day", editable: false, highlighted: true },
      ...DAYS.map((day) => ({ value: day, editable: false, highlighted: true })),
    ];

    const dataRows = PERIODS.map((period) => {
      const row: Cell[] = [
        {
          value: period === 4 ? `Period ${period} (Lunch after)` : `Period ${period}`,
          editable: false,
          highlighted: period === 4,
        },
      ];

      // Add empty cells for each day
      DAYS.forEach(() => {
        row.push({
          value: "",
          editable: true,
          highlighted: period === 4,
        });
      });

      return row;
    });

    setTimetableData([headerRow, ...dataRows]);

    // Try to load subjects from localStorage to populate some sample data
    const storedSubjects = localStorage.getItem("timetableSubjects");
    if (storedSubjects) {
      const subjects = JSON.parse(storedSubjects);
      if (subjects && subjects.length) {
        // Populate with some sample data
        const updatedData = [...timetableData];
        if (subjects.find((s: any) => s.name === "Mathematics")) {
          setCellValue(1, 1, "Mathematics (Dr. Smith)"); // Monday, Period 1
        }
        if (subjects.find((s: any) => s.name === "Physics")) {
          setCellValue(2, 2, "Physics (Prof. Johnson)"); // Tuesday, Period 2
        }
        if (subjects.find((s: any) => s.name === "English")) {
          setCellValue(3, 3, "English (Ms. Thompson)"); // Wednesday, Period 3
        }
      }
    }
  }, []);

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newTimetableData = [...timetableData];
    newTimetableData[rowIndex][colIndex].value = value;
    setTimetableData(newTimetableData);
  };

  const setCellValue = (rowIndex: number, colIndex: number, value: string) => {
    const newTimetableData = [...timetableData];
    if (newTimetableData[rowIndex] && newTimetableData[rowIndex][colIndex]) {
      newTimetableData[rowIndex][colIndex].value = value;
      setTimetableData(newTimetableData);
    }
  };

  const downloadExcel = () => {
    // Generate and download the Excel file directly from the browser
    const today = new Date().toISOString().split('T')[0];
    downloadTimetableAsExcel(timetableData, `timetable-${today}.xlsx`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Editable Timetable View</h1>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <Link
            href="/timetable"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back to Timetable
          </Link>
          <button
            onClick={downloadExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Download as Excel
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Instructions</h2>
          <p className="text-gray-600">
            Click on any cell to edit the content. All cells are editable except for the headers.
            After filling in your timetable, you can download it as an Excel file.
          </p>
        </div>
        
        {timetableData.length > 0 && (
          <ExcelPreview data={timetableData} onCellChange={handleCellChange} />
        )}

        <div className="mt-4 text-sm text-gray-500">
          <strong>Note:</strong> The lunch break is scheduled after Period 4 every day, as highlighted.
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
        <h2 className="text-lg font-semibold mb-2">Need AI assistance?</h2>
        <p className="text-gray-700 mb-4">
          Our AI assistant can help you optimize your timetable based on teacher availability,
          classroom constraints, and subject requirements.
        </p>
        <Link
          href="/chat"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block"
        >
          Ask AI Assistant
        </Link>
      </div>
    </div>
  );
} 