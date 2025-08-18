const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const nodemailer = require("nodemailer");

exports.submitContactMessage = catchAsyncErrors(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }
 
  // STEP ①: Create transporter (use your email credentials)
  const transporter = nodemailer.createTransport({
    service: "Gmail", // or 'Outlook', 'Yahoo', or a custom SMTP
    auth: {
      user: process.env.SMTP_USER, // your email
      pass: process.env.SMTP_PASS, // your app password or email password
    },
  });

  // STEP ②: Email content
  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.CONTACT_RECEIVER || "yourstore@gmail.com", // ← receiver address
    subject: `New Contact Message: ${subject}`,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  // STEP ③: Send email
  await transporter.sendMail(mailOptions);

  res.status(200).json({ success: true, message: "Message sent successfully" });
});
