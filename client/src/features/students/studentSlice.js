// client/src/features/students/studentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// --- NO CHANGE HERE ---
export const fetchStudents = createAsyncThunk('students/fetchAll', async () => {
    const response = await api.get('/students');
    return response.data;
});

export const fetchStudentById = createAsyncThunk('students/fetchById', async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
});

// --- NEW CODE BLOCK: The missing createStudent thunk ---
// This function handles the API call to create a new student.
export const createStudent = createAsyncThunk(
    'students/create',
    async (studentData, { rejectWithValue }) => {
        try {
            // It sends a POST request to our backend with the form data
            const response = await api.post('/students', studentData);
            return response.data; // This will contain the success message and new student
        } catch (err) {
            // If the API returns an error (e.g., duplicate email), pass it on
            return rejectWithValue(err.response.data);
        }
    }
);

export const updateStudent = createAsyncThunk(
    'students/update',
    async ({ id, studentData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/students/${id}`, studentData);
            return response.data; // This will be the updated student object
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);
export const deleteStudent = createAsyncThunk(
    'students/delete',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/students/${id}`);
            return id; // Return the ID of the deleted student on success
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

// --- NO CHANGE HERE ---
const studentSlice = createSlice({
    name: 'students',
    initialState: {
        list: [],
        currentStudent: null,
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers(builder) {
        builder
            // --- NO CHANGE TO THESE ---
            .addCase(fetchStudents.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchStudents.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchStudents.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchStudentById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchStudentById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentStudent = action.payload;
            })
            .addCase(fetchStudentById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // --- NEW CODE BLOCK: Handle the states of our new createStudent thunk ---
            .addCase(createStudent.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createStudent.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // We don't need to add the student to the list here,
                // because our form logic already re-fetches the entire list
                // for simplicity and to ensure data is fresh from the DB.
            })
            .addCase(createStudent.rejected, (state, action) => {
                state.status = 'failed';
                // The `action.payload` will contain the error message from our backend
                state.error = action.payload.message || 'Could not create student';
            })
            .addCase(deleteStudent.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteStudent.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Remove the student from the list by filtering by the returned ID
                state.list = state.list.filter(student => student._id !== action.payload);
            })
            .addCase(deleteStudent.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message || 'Could not delete student';
            });
    }
});

export default studentSlice.reducer;