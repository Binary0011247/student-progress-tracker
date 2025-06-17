// src/components/profile/ContestHistory.js
import React, { useState, useMemo } from 'react';
import { Box, Paper, Typography, ToggleButtonGroup, ToggleButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

const ContestHistory = ({ contests }) => {
    const [daysFilter, setDaysFilter] = useState(365);

    const handleFilterChange = (event, newFilter) => {
        if (newFilter !== null) {
            setDaysFilter(newFilter);
        }
    };

    const filteredContests = useMemo(() => {
        const filterDate = subDays(new Date(), daysFilter);
        return contests
            .filter(c => new Date(c.ratingUpdateTimeSeconds * 1000) >= filterDate)
            .sort((a, b) => a.ratingUpdateTimeSeconds - b.ratingUpdateTimeSeconds);
    }, [contests, daysFilter]);

    // Data for the rating graph
    const chartData = filteredContests.map(c => ({
        name: format(new Date(c.ratingUpdateTimeSeconds * 1000), 'MMM dd'),
        Rating: c.newRating,
    }));

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <ToggleButtonGroup
                    value={daysFilter}
                    exclusive
                    onChange={handleFilterChange}
                    aria-label="time filter"
                >
                    <ToggleButton value={30} aria-label="last 30 days">30 Days</ToggleButton>
                    <ToggleButton value={90} aria-label="last 90 days">90 Days</ToggleButton>
                    <ToggleButton value={365} aria-label="last 365 days">365 Days</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Typography variant="h5" gutterBottom>Rating Graph</Typography>
            <Paper sx={{ p: 2, mb: 4, height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={['dataMin - 100', 'dataMax + 100']} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Rating" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </Paper>

            <Typography variant="h5" gutterBottom>Contest Details</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Contest Name</TableCell>
                            <TableCell align="right">Rank</TableCell>
                            <TableCell align="right">Rating Change</TableCell>
                            <TableCell align="right">Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredContests.map((contest) => (
                            <TableRow key={contest.contestId}>
                                <TableCell component="th" scope="row">{contest.contestName}</TableCell>
                                <TableCell align="right">{contest.rank}</TableCell>
                                <TableCell align="right" sx={{ color: contest.newRating > contest.oldRating ? 'success.main' : 'error.main' }}>
                                    {contest.newRating - contest.oldRating > 0 ? '+' : ''}{contest.newRating - contest.oldRating} ({contest.oldRating} → {contest.newRating})
                                </TableCell>
                                <TableCell align="right">{format(new Date(contest.ratingUpdateTimeSeconds * 1000), 'yyyy-MM-dd')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ContestHistory;