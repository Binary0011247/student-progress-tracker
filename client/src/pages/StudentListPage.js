// src/pages/StudentListPage.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { formatDistanceToNow } from 'date-fns';
import { Visibility, Add, CloudDownload, Edit, Delete } from '@mui/icons-material';
import { fetchStudents, deleteStudent } from '../features/students/studentSlice';
import api from '../api/axios'; // This can be removed if not used elsewhere, but is harmless
import StudentFormModal from '../components/StudentFormModal';
import { useSnackbar } from 'notistack';
import ConfirmationDialog from '../components/ConfirmationDialog';

const StudentListPage = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { list: students, status } = useSelector((state) => state.students);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentToEdit, setStudentToEdit] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [studentToDeleteId, setStudentToDeleteId] = useState(null);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchStudents());
        }
    }, [status, dispatch]);
     const handleDeleteClick = (id) => {
        setStudentToDeleteId(id); // Store the ID of the student to be deleted
        setIsConfirmOpen(true);   // Open the confirmation dialog
    };

    const handleConfirmDelete = async () => {
        if (studentToDeleteId) {
            const resultAction = await dispatch(deleteStudent(studentToDeleteId));
            if (deleteStudent.fulfilled.match(resultAction)) {
                enqueueSnackbar('Student deleted successfully', { variant: 'success' });
            } else {
                enqueueSnackbar('Failed to delete student', { variant: 'error' });
            }
        }
        // Reset state and close the dialog
        setIsConfirmOpen(false);
        setStudentToDeleteId(null);
    };

    const handleCloseConfirm = () => {
        setIsConfirmOpen(false);
        setStudentToDeleteId(null);
    };

    
    // --- THIS IS THE CORRECTED FUNCTION ---
    const handleDownloadCSV = () => {
         const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
         window.open(`${API_BASE_URL}/students/download`); // Your backend server URL

        // Create a temporary link element
        const link = document.createElement('a');
        
        // Set its href to the full URL of your download endpoint
        link.href = `${API_URL}/api/students/download`; 
        
        // This attribute tells the browser to download the file instead of navigating to it
        link.setAttribute('download', 'students.csv'); 

        // Append the link to the document
        document.body.appendChild(link);
        
        // Programmatically click the link to trigger the download
        link.click();
        
        // Clean up by removing the temporary link
        document.body.removeChild(link);
    };
    
    const handleOpenModal = () => {
        setStudentToEdit(null); // Clear any previous student data for "add" mode
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleEditClick = (student) => {
        setStudentToEdit(student); // Set the specific student to be edited
        setIsModalOpen(true);      // Open the modal
    };

    const columns = [
        { field: 'name', headerName: 'Name', flex: 1.5, minWidth: 150 },
        { field: 'email', headerName: 'Email', flex: 2, minWidth: 200 },
        { field: 'phone', headerName: 'Phone', flex: 1, minWidth: 120 },
        {
            field: 'codeforcesHandle',
            headerName: 'CF Handle',
            flex: 1,
            renderCell: (params) => (
                <a href={`https://codeforces.com/profile/${params.value}`} target="_blank" rel="noopener noreferrer">
                    {params.value}
                </a>
            ),
        },
        { field: 'currentRating', headerName: 'Rating', type: 'number', width: 100 },
        { field: 'maxRating', headerName: 'Max Rating', type: 'number', width: 120 },
        {
            field: 'lastUpdated',
            headerName: 'Last Synced',
            flex: 1,
            minWidth: 150,
            renderCell: (params) => (
                params.value ? `${formatDistanceToNow(new Date(params.value))} ago` : 'Never'
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            width: 150,
            renderCell: (params) => (
                <Box>
                    <IconButton component={Link} to={`/student/${params.row._id}`} color="primary">
                        <Visibility />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleEditClick(params.row)}>
                        <Edit />
                    </IconButton>
                   <IconButton sx={{ color: 'error.main' }} onClick={() => handleDeleteClick(params.row._id)}>
                        <Delete />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box>
            <Box sx={{ height: '75vh', width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" component="h1">
                        Enrolled Students
                    </Typography>
                    <Box>
                        <Button variant="contained" startIcon={<Add />} sx={{ mr: 1 }} onClick={handleOpenModal}>
                            Add Student
                        </Button>
                        <Button variant="outlined" startIcon={<CloudDownload />} onClick={handleDownloadCSV}>
                            Download CSV
                        </Button>
                    </Box>
                </Box>
                <DataGrid
                    rows={students}
                    columns={columns}
                    getRowId={(row) => row._id}
                    loading={status === 'loading'}
                    pageSizeOptions={[10, 25, 50]}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                      },
                    }}
                    sx={{
                        '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                            outline: 'none !important',
                        },
                    }}
                />
            </Box>
            <StudentFormModal 
                open={isModalOpen} 
                onClose={handleCloseModal}
                studentToEdit={studentToEdit} 
            />
            <ConfirmationDialog
                open={isConfirmOpen}
                onClose={handleCloseConfirm}
                onConfirm={handleConfirmDelete}
                title="Delete Student"
                message={`Are you sure you want to delete this student? All associated data will be lost.`}
            />
        </Box>
    );
};

export default StudentListPage;