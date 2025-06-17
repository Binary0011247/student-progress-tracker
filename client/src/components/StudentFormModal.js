// src/components/StudentFormModal.js
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogTitle, 
    TextField, 
    Box 
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { createStudent, fetchStudents, updateStudent } from '../features/students/studentSlice'; // Make sure you have a createStudent thunk

// You'll need to create this thunk in studentSlice.js if it doesn't exist
// Example createStudent thunk in studentSlice.js:
/*
export const createStudent = createAsyncThunk('students/create', async (studentData, { rejectWithValue }) => {
    try {
        const response = await api.post('/students', studentData);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});
*/

const StudentFormModal = ({ open, onClose, studentToEdit }) => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        codeforcesHandle: '',
    });

    const isEditMode = Boolean(studentToEdit);

    useEffect(() => {
        if (isEditMode) {
            setFormData({
                name: studentToEdit.name,
                email: studentToEdit.email,
                phone: studentToEdit.phone,
                codeforcesHandle: studentToEdit.codeforcesHandle,
            });
        } else {
            // Reset form when opening for a new student
            setFormData({ name: '', email: '', phone: '', codeforcesHandle: '' });
        }
    }, [studentToEdit, open]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 3. Add the if/else logic for submitting
        if (isEditMode) {
            const resultAction = await dispatch(updateStudent({ id: studentToEdit._id, studentData: formData }));
            if (updateStudent.fulfilled.match(resultAction)) {
                enqueueSnackbar('Student updated successfully!', { variant: 'success' });
                // No need to re-fetch; the slice updates the state directly
                onClose();
            } else {
                enqueueSnackbar(resultAction.payload.message || 'Failed to update student', { variant: 'error' });
            }
        } else {
            const resultAction = await dispatch(createStudent(formData));
            if (createStudent.fulfilled.match(resultAction)) {
                enqueueSnackbar(resultAction.payload.message || 'Student added successfully!', { variant: 'success' });
                dispatch(fetchStudents()); // Re-fetch students to update the list
                onClose();
            } else {
                enqueueSnackbar(resultAction.payload.message || 'Failed to add student', { variant: 'error' });
            }
        }
    };
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
              <DialogTitle>{isEditMode ? 'Edit Student Details' : 'Add New Student'}</DialogTitle>
            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Full Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        margin="dense"
                        name="phone"
                        label="Phone Number"
                        type="tel"
                        fullWidth
                        variant="outlined"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        margin="dense"
                        name="codeforcesHandle"
                        label="Codeforces Handle"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.codeforcesHandle}
                        onChange={handleChange}
                        required
                    />
                </DialogContent>
                <DialogActions sx={{ p: '0 24px 24px' }}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        {isEditMode ? 'Save Changes' : 'Add Student'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default StudentFormModal;