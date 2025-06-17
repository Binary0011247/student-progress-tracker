// services/codeforcesService.js
const axios = require('axios');

const CF_API_BASE = 'https://codeforces.com/api';

const cfApi = axios.create({
    baseURL: CF_API_BASE,
    // Set a longer timeout. The value is in milliseconds. 30000ms = 30 seconds.
    // The default is often 0 (no timeout) or a few seconds, but it's good to be explicit.
    timeout: 30000, 
});

const fetchUserInfo = async (handle) => {
    const { data } = await axios.get(`${CF_API_BASE}/user.info?handles=${handle}`);
    if (data.status !== 'OK') throw new Error('Failed to fetch user info');
    return data.result[0];
};

const fetchUserRating = async (handle) => {
    const { data } = await axios.get(`${CF_API_BASE}/user.rating?handle=${handle}`);
    if (data.status !== 'OK') throw new Error('Failed to fetch user rating');
    return data.result;
};

const fetchUserSubmissions = async (handle) => {
    const { data } = await axios.get(`${CF_API_BASE}/user.status?handle=${handle}`);
    if (data.status !== 'OK') throw new Error('Failed to fetch user submissions');
    return data.result;
};

const syncStudentData = async (student) => {
    try {
        console.log(`Syncing data for ${student.codeforcesHandle}...`);
        const [userInfo, contests, submissions] = await Promise.all([
            fetchUserInfo(student.codeforcesHandle),
            fetchUserRating(student.codeforcesHandle),
            fetchUserSubmissions(student.codeforcesHandle)
        ]);
  const uniqueContests = Array.from(new Map(contests.map(c => [c.contestId, c])).values());
   const validSubmissions = submissions.filter(sub => sub.id != null);
        student.currentRating = userInfo.rating || 0;
        student.maxRating = userInfo.maxRating || 0;
        student.contests = uniqueContests;
        student.submissions = validSubmissions;
        student.lastUpdated = new Date();

        await student.save();
        console.log(`Successfully synced data for ${student.codeforcesHandle}`);
        return student;
    } catch (error) {
        console.error(`Error syncing data for ${student.codeforcesHandle}: ${error.message}`);
        // Don't throw, just log the error so cron job can continue with other students
    }
};


module.exports = { syncStudentData };