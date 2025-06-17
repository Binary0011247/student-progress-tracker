// services/cronService.js
const cron = require('node-cron');
const { subDays } = require('date-fns');
const Student = require('../models/Student');
const { syncStudentData } = require('./codeforcesService');
const { sendInactivityReminder } = require('./emailService');

const checkInactivity = (student) => {
    if (!student.emailRemindersEnabled || !student.submissions.length) {
        return;
    }

    const lastSubmissionTime = new Date(student.submissions[0].creationTimeSeconds * 1000);
    const sevenDaysAgo = subDays(new Date(), 7);

    if (lastSubmissionTime < sevenDaysAgo) {
        console.log(`${student.name} is inactive. Sending reminder.`);
        sendInactivityReminder(student);
    }
};

const startDailySync = () => {
    // Run job based on schedule in .env (e.g., '0 2 * * *' for 2 AM daily)
    cron.schedule(process.env.CRON_SCHEDULE, async () => {
        console.log('--- Starting Daily Cron Job: Syncing all students ---');
        const students = await Student.find({});
        
        for (const student of students) {
            // We wrap this in a try-catch to ensure one student's failure doesn't stop the whole process.
            try {
                const updatedStudent = await syncStudentData(student);
                if (updatedStudent) {
                    checkInactivity(updatedStudent);
                }
            } catch (error) {
                console.error(`CRON: Failed to process student ${student.codeforcesHandle}:`, error);
            }
        }
        console.log('--- Daily Cron Job Finished ---');
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata" // Set to your preferred timezone
    });
};

module.exports = { startDailySync };