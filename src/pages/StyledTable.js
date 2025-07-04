import { Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer } from "@mui/material";

const StyledTable = ({ columns, data, actions }) => {
  return (
    <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f4f4f4" }}>
            {columns.map((col, index) => (
              <TableCell key={index} sx={{ fontWeight: "bold", fontSize: "1rem", textAlign: "center" }}>
                {col}
              </TableCell>
            ))}
            {actions && <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", textAlign: "center" }}>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
              {Object.values(row).map((value, colIndex) => (
                <TableCell key={colIndex} sx={{ textAlign: "center", padding: "12px" }}>
                  {value}
                </TableCell>
              ))}
              {actions && (
                <TableCell sx={{ textAlign: "center" }}>
                  {actions(row)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StyledTable;
