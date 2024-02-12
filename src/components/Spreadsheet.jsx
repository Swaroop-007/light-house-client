import { ReactGrid } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import React,{useState,useEffect} from 'react'
import '../Styles/Spreadsheet.css'

const Spreadsheet = () => {
  const [columns, setColumns] = useState([]);
  const [rowsData, setRowsData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("column.json");
        const columnNames = await response.json();
        const dynamicColumns = columnNames.map((columnName, index) => ({
          columnId: columnName,
          width: index === 0 ? 100 : 150 // Adjust width of the first column
        }));
        setColumns(dynamicColumns);

        const initialRowsData = {};
        for (let i = 0; i < 100; i++) {
          const id = String(i + 1);
          initialRowsData[id] = dynamicColumns.map((column, index) => ({
            type: "text",
            text: index === 0 ? id : "", // Fill only the first column with id
            nonEditable: index===0? true:false,
            
          
          }));
        }
        setRowsData(initialRowsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getRows = (rowsData, columns) => {
    // Create header row with disabled cells for column names
    const headerRow = {
      rowId: "header",
      cells: columns.map(column => ({
        type: "header",
        text: column.columnId,
        disabled: true // Disable cells in the header row
      }))
    };

    // Create data rows
    const dataRows = Object.entries(rowsData).map(([rowId, cells]) => ({
      rowId,
      cells : cells.map(cell => ({ ...cell, className: "cell-text" }))
    }));

    return [headerRow, ...dataRows];
  };

  return (
    <div className="data-grid">
       
      <ReactGrid rows={getRows(rowsData, columns)} columns={columns}  stickyLeftColumns={5}
      stickyRightColumns={1} />
    </div>
  )
}

export default Spreadsheet