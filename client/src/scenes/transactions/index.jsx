import React, { useState, useRef, useEffect } from "react";
import { Box, useTheme, Button, Modal, TextField, Select, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Edit } from '@mui/icons-material'; // Import the Edit icon
import IconButton from '@mui/material/IconButton'; // Import IconButton component
import { useGetTransactionsQuery, useAddTransactionMutation } from "state/api";
import Header from "components/Header";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import DatePicker from "react-datepicker";
import { useNavigate } from 'react-router-dom';
// Import the Transaction schema

const Transactions = () => {
  const addTransactionMutation = useAddTransactionMutation();

  const theme = useTheme();
  const [selectDate, setSelectedDate] = useState(new Date());
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("Select Category");
  const [vendor, setVendor] = useState("");
  const [cardId, setCardId] = useState("");
  const [userdata,] = useState(JSON.parse(localStorage.getItem('User')));
  const [openModal, setOpenModal] = useState(false);
  const [editedTransaction, setEditedTransaction] = useState(null);
  const ref = useRef(null);

  // Values to be sent to the backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading } = useGetTransactionsQuery({
    userId: "661b0357d1e7a45088b26b1d",
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
      field: "transactionName",
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
    {
      field: "edit",
      headerName: "Edit",
      flex: 1,
      renderCell: (params) => (
        <IconButton onClick={() => handleEditTransaction(params.row)}>
          <Edit />
        </IconButton>
      ),
    },
  ];
  const handleEditTransaction = (transaction) => {
    setEditedTransaction(transaction); // Set the edited transaction
    setAmount(transaction.amount);
    setCategory(transaction.category);
    setVendor(transaction.vendor);
    setCardId(transaction.cardId);
    setSelectedDate(new Date(transaction.date));

    setOpenModal(true);
  };

  const handleCreateTransaction = () => {
    const transactionData = {
      userId: "661b0357d1e7a45088b26b1d",
      cardId,
      transactionName: 'xyz', // Fill with appropriate transaction ID
      vendor,
      category,
      date: selectDate,
      amount
    };

    const url = editedTransaction ? `http://localhost:5001/client/transactions/update/${editedTransaction._id}` : 'http://localhost:5001/client/transactions/add';
    // Calling the mutation function
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to save transaction');
        }
        return response.json();
      })
      .then(data => {
        console.log('Transaction saved successfully:', data);
        setOpenModal(false);
        setEditedTransaction(null);
      })
      .catch(error => {
        console.error('Error saving transaction:', error);
      });
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
          open={openModal || !!editedTransaction}
          onClose={() => {
            setOpenModal(false);
            setEditedTransaction(null); // Reset edited transaction state
          }}
          aria-labelledby="create-transaction-modal"
        >
          <Box
            sx={{
              position: 'relative',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '500px',
              height: 'auto', // Change height to 'auto' to allow the modal to adjust its height based on content
              bgcolor: 'background.paper',
              borderRadius: '8px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Add a subtle box shadow
              padding: '24px', // Add padding for space inside the modal
              border: '1px solid #e0e0e0', // Add a border
              outline: 'none', // Remove default outline
            }}
          >
            {editedTransaction ? (
              <h2 className="font-bold text-xl text-center mb-2">Edit Transaction</h2>
            ) : (
              <h2 className="font-bold text-xl text-center mb-2">Create Transaction</h2>
            )}
            <br /> {/* Line break */}
            <div className="flex flex-col gap-6">
              <TextField
                type="number"
                label="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                variant="outlined"
                fullWidth

              />
              <Select
                label="Category"
                value={category || "Select Category"}
                onChange={(e) => setCategory(e.target.value)}
                variant="outlined"
                fullWidth


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

              />
              <TextField
                label="Card ID"
                value={cardId}
                onChange={(e) => setCardId(e.target.value)}
                variant="outlined"
                fullWidth

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
              <div className="flex justify-end mt-auto"> {/* Adjusted alignment */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCreateTransaction}
                >
                  {editedTransaction ? (
                    <>Save</>
                  ) : (
                    <>Create</>
                  )}
                </Button>
              </div>
            </div>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default Transactions;