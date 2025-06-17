// services/emailService.js
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendInactivityReminder = async (student) => {
    const msg = {
        to: student.email,
        from: process.env.SENDGRID_FROM_EMAIL, // Use the email you verified in SendGrid
        subject: 'Friendly Reminder: Let\'s Get Back to Coding!',
        html: `
            <p>Hi ${student.name},</p>
            <p>We noticed you haven't made any submissions on Codeforces in the last 7 days.</p>
            <p>Consistency is key to improvement. Why not try solving a problem today?</p>
            <p>Keep up the great work!</p>
            <br/>
            <p>Best,</p>
            <p>The Student Progress Tracker Team</p>
        `,
    };

    try {
        await sgMail.send(msg);
        console.log(`Inactivity email sent to ${student.email} via SendGrid`);
        student.reminderCount = (student.reminderCount || 0) + 1;
        student.lastReminderSentAt = new Date();
        await student.save();
    } catch (error) {
        console.error(`Failed to send email to ${student.email}:`, error);
        if (error.response) {
            console.error(error.response.body)
        }
    }
};

module.exports = { sendInactivityReminder };