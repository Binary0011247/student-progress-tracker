// src/components/profile/ProblemSolvingData.js
import React, { useState, useMemo } from 'react';
import { Box, Paper, Typography, ToggleButtonGroup, ToggleButton, Grid, Card, CardContent } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css'; // Import heatmap styles
import { format, subDays, startOfDay } from 'date-fns';

const ProblemSolvingData = ({ submissions }) => {
    const [daysFilter, setDaysFilter] = useState(30);

    const handleFilterChange = (event, newFilter) => {
        if (newFilter !== null) {
            setDaysFilter(newFilter);
        }
    };

    const { filteredSubmissions, startDate, endDate } = useMemo(() => {
        const end = new Date();
        const start = subDays(end, daysFilter);
        const filtered = submissions
            .filter(s => {
                const subDate = new Date(s.creationTimeSeconds * 1000);
                return subDate >= start && subDate <= end;
            })
            .filter(s => s.verdict === 'OK'); // Only count accepted submissions
        return { filteredSubmissions: filtered, startDate: start, endDate: end };
    }, [submissions, daysFilter]);

    // Calculate stats
    const totalSolved = filteredSubmissions.length;
    const mostDifficult = filteredSubmissions.reduce((max, sub) => (sub.problem.rating > max.problem.rating ? sub : max), { problem: { rating: 0 } });
    const avgRating = totalSolved > 0 ? Math.round(filteredSubmissions.reduce((sum, sub) => sum + (sub.problem.rating || 0), 0) / totalSolved) : 0;
    const avgPerDay = totalSolved > 0 ? (totalSolved / daysFilter).toFixed(2) : 0;

    // Data for bar chart
    const ratingBuckets = useMemo(() => {
        const buckets = {};
        filteredSubmissions.forEach(sub => {
            const rating = sub.problem.rating;
            if (rating) {
                const bucket = Math.floor(rating / 100) * 100;
                buckets[bucket] = (buckets[bucket] || 0) + 1;
            }
        });
        return Object.keys(buckets).map(key => ({ rating: key, count: buckets[key] })).sort((a,b) => a.rating - b.rating);
    }, [filteredSubmissions]);

    // Data for heatmap
    const heatmapData = useMemo(() => {
        const counts = {};
        filteredSubmissions.forEach(sub => {
            const date = format(startOfDay(new Date(sub.creationTimeSeconds * 1000)), 'yyyy-MM-dd');
            counts[date] = (counts[date] || 0) + 1;
        });
        return Object.keys(counts).map(date => ({ date, count: counts[date] }));
    }, [filteredSubmissions]);

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <ToggleButtonGroup value={daysFilter} exclusive onChange={handleFilterChange}>
                    <ToggleButton value={7}>7 Days</ToggleButton>
                    <ToggleButton value={30}>30 Days</ToggleButton>
                    <ToggleButton value={90}>90 Days</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}><Card><CardContent><Typography>Total Solved</Typography><Typography variant="h4">{totalSolved}</Typography></CardContent></Card></Grid>
                <Grid item xs={12} sm={6} md={3}><Card><CardContent><Typography>Avg Problems/Day</Typography><Typography variant="h4">{avgPerDay}</Typography></CardContent></Card></Grid>
                <Grid item xs={12} sm={6} md={3}><Card><CardContent><Typography>Average Rating</Typography><Typography variant="h4">{avgRating || 'N/A'}</Typography></CardContent></Card></Grid>
                <Grid item xs={12} sm={6} md={3}><Card><CardContent><Typography>Hardest Solved</Typography><Typography variant="h4">{mostDifficult.problem.rating || 'N/A'}</Typography></CardContent></Card></Grid>
            </Grid>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Problems by Rating</Typography>
            <Paper sx={{ p: 2, mb: 4, height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ratingBuckets}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="rating" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </Paper>

            <Typography variant="h5" gutterBottom>Submission Heatmap</Typography>
            <Paper sx={{ p: 2, '.react-calendar-heatmap .color-scale-1': { fill: '#d6e685' }, '.react-calendar-heatmap .color-scale-2': { fill: '#8cc665' }, '.react-calendar-heatmap .color-scale-3': { fill: '#44a340' }, '.react-calendar-heatmap .color-scale-4': { fill: '#1e6823' }}}>
                <CalendarHeatmap
                    startDate={startDate}
                    endDate={endDate}
                    values={heatmapData}
                    classForValue={(value) => {
                        if (!value) return 'color-empty';
                        return `color-scale-${Math.min(4, Math.ceil(value.count / 2))}`;
                    }}
                    tooltipDataAttrs={value => ({ 'data-tip': `${value.date}: ${value.count} submissions` })}
                />
            </Paper>
        </Box>
    );
};

export default ProblemSolvingData;