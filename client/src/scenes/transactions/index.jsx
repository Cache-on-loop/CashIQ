import React, { useState, useRef,useEffect } from "react";
import { Box, useTheme, Button, Modal, TextField, Select, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetTransactionsQuery } from "state/api";
import Header from "components/Header";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import DatePicker from "react-datepicker";
import { useNavigate } from 'react-router-dom';
// Import the Transaction schema

const Transactions = () => {
  const theme = useTheme();
  const [selectDate, setSelectedDate] = useState(new Date());
  const [amount , setAmount] = useState(0);
  const [category , setCategory] = useState("Select Category");
  const [vendor, setVendor] = useState("");
  const [cardId, setCardId] = useState("");
  const [userdata , ] = useState(JSON.parse(localStorage.getItem('User')));
  const [openModal, setOpenModal] = useState(false);
  const ref = useRef(null);

  // Values to be sent to the backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading } = useGetTransactionsQuery({
    page,
    pageSize,
    sort: JSON.stringify(sort),
    search,
  });
  useEffect(() => {
    if (!openModal) {
      // Reset the values when the modal is closed
      setAmount(0);
      setCategory("");
      setVendor("");
      setCardId("");
      setSelectedDate(new Date());
    }
  }, [openModal]);
  const columns = [
    {
      field: "transactionId",
      headerName: "Transaction ID",
      flex: 1,
    },
    {
      field: "cardId",
      headerName: "Card ID",
      flex: 1,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
    },
    {
      field: "vendor",
      headerName: "Vendor",
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      valueGetter: (params) => new Date(params.value).toLocaleDateString(),
    },
  ];

  const handleCreateTransaction = () => {
    const newTransaction = {
      userId: userdata._id,
      cardId,
      transactionId: '', // Fill with appropriate transaction ID
      vendor,
      category,
      date: selectDate,
      amount
    };
    ref.current.staticStart();
    // Save new transaction logic goes here
    
    ref.current.complete();
    setOpenModal(false); // Close the modal after creating the transaction

  };

  return (
    <Box m="1.5rem 2.5rem" position="relative">
      <Header title="TRANSACTIONS" subtitle="Entire list of transactions" />
      <Box
        height="80vh"
        sx={{
          position: 'relative',
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={(data && data.transactions) || []}
          columns={columns}
          rowCount={(data && data.total) || 0}
          rowsPerPageOptions={[20, 50, 100]}
          pagination
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          sortingMode="server"
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onSortModelChange={(newSortModel) => setSort(...newSortModel)}
          components={{ Toolbar: DataGridCustomToolbar }}
          componentsProps={{
            toolbar: { searchInput, setSearchInput, setSearch },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ position: 'absolute', top: '-2rem', right: '0rem', zIndex: 1000 }}
          onClick={() => setOpenModal(true)}
        >
          Create Transaction
        </Button>
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          aria-labelledby="create-transaction-modal"
        >
          <Box
            sx={{
              position: 'relative',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '500px',
              height:'400px', // Adjusted width
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: '8px',
            }}
          >
            <div className="font-bold  mb-4 pb-2 gap-4  ">Create Transaction</div>
            <div className="flex flex-col gap-4">
              <TextField
                type="number"
                label="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                variant="outlined"
                fullWidth
                className="mb-4"
              />
              <Select
                label="Category"
                value={category || "Select Category"}
                onChange={(e) => setCategory(e.target.value)}
                variant="outlined"
                fullWidth
                className="mb-4"
                
              >
                <MenuItem value="Select Category" disabled>-Select Category-</MenuItem>
                <MenuItem value="Grocery">Grocery</MenuItem>
                <MenuItem value="Vehicle">Vehicle</MenuItem>
                <MenuItem value="Shopping">Shopping</MenuItem>
                <MenuItem value="Travel">Travel</MenuItem>
                <MenuItem value="Food">Food</MenuItem>
                <MenuItem value="Fun">Fun</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
              <TextField
                label="Vendor"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                variant="outlined"
                fullWidth
                className="mb-4"
              />
              <TextField
                label="Card ID"
                value={cardId}
                onChange={(e) => setCardId(e.target.value)}
                variant="outlined"
                fullWidth
                className="mb-6"
              />
              <div className="w-full">
                <DatePicker
                  selected={selectDate}
                  onChange={(date) => setSelectedDate(date)}
                  className="p-2 w-full text-base rounded-md outline-none bg-gray-200 placeholder-black text-gray-900 focus:focus-animation"
                  placeholderText="Date"
                  showYearDropdown
                />
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateTransaction}
              >
                Create
              </Button>
            </div>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default Transactions;