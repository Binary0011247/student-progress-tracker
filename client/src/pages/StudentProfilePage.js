// pages/StudentProfilePage.js - A skeleton to show the structure
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, CircularProgress, Tabs, Tab, Paper } from '@mui/material';
import { fetchStudentById } from '../features/students/studentSlice';
// Import your component sections
import ContestHistory from '../components/profile/ContestHistory';
import ProblemSolvingData from '../components/profile/ProblemSolvingData';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const StudentProfilePage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { currentStudent: student, status } = useSelector((state) => state.students);
    const [tabValue, setTabValue] = useState(0);

   useEffect(() => {
        // Prevent re-fetching if we already have the correct student data
        if (!student || student._id !== id) {
           dispatch(fetchStudentById(id));
        }
    }, [id, dispatch, student]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    if (status === 'loading' || !student) {
        return <CircularProgress />;
    }
    console.log("PROFILE PAGE is rendering with student data:", student);

    return (
        <Box>
            <Typography variant="h3" gutterBottom>{student.name}'s Profile</Typography>
            <Paper>
                <Tabs value={tabValue} onChange={handleTabChange} centered>
                    <Tab label="Contest History" />
                    <Tab label="Problem Solving Data" />
                </Tabs>
                <TabPanel value={tabValue} index={0}>
                    <ContestHistory contests={student.contests || []} />
                    Contest History Component Goes Here
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <ProblemSolvingData submissions={student.submissions || []} />
                    Problem Solving Data Component Goes Here
                </TabPanel>
            </Paper>
        </Box>
    );
};

export default StudentProfilePage;