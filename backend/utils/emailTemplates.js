const getPatientEmailHtml = (data) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #2563eb;">✅ Appointment Booked Successfully!</h2>
    <p>Dear <strong>${data.patient.full_name}</strong>,</p>
    <p>Your online consultation appointment has been successfully booked with <strong>${data.consultant.name}</strong>.</p>

    <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
      <h3 style="margin-top: 0; color: #0ea5e9;">📋 Appointment Details:</h3>
      <p><strong>👨‍⚕️ Consultant:</strong> ${data.consultant.name}</p>
      <p><strong>📅 Date:</strong> ${new Date(data.preferredDate).toLocaleDateString()}</p>
      <p><strong>🩺 Symptoms:</strong> ${data.symptoms}</p>
      <p><strong>🔑 Booking Token:</strong> <code style="background: #e5e7eb; padding: 2px 6px; border-radius: 3px;">${data.bookingToken}</code></p>
    </div>

    <div style="background: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b;">
      <p style="margin: 0;"><strong>📞 Next Steps:</strong> Our consultant will contact you shortly to confirm the appointment and discuss your health concerns.</p>
    </div>

    <p>Thank you for choosing Puthuyir Healthcare for your traditional Siddha medicine consultation!</p>

    <p>Best regards,<br><strong>Puthuyir Healthcare Team</strong></p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
    <div style="text-align: center; color: #9ca3af; font-size: 12px;">
      <p>Puthuyir Healthcare | Traditional Siddha Medicine</p>
      <p>For urgent matters, please call us directly.</p>
    </div>
  </div>
`;

const getConsultantEmailHtml = (data) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #2563eb;">🔔 New Appointment Booking</h2>
    <p>Hello <strong>${data.consultant.name}</strong>,</p>
    <p>You have a new online consultation appointment scheduled.</p>

    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
      <h3 style="margin-top: 0; color: #1f2937;">👤 Patient Information:</h3>
      <p><strong>👤 Name:</strong> ${data.patient.full_name}</p>
      <p><strong>📧 Email:</strong> <a href="mailto:${data.patient.email}" style="color: #2563eb;">${data.patient.email}</a></p>
      <p><strong>📱 Phone:</strong> ${data.patient.phone || 'Not provided'}</p>
      <p><strong>📅 Appointment Date:</strong> ${new Date(data.preferredDate).toLocaleDateString()}</p>
      <p><strong>🩺 Symptoms/Concerns:</strong> ${data.symptoms}</p>
    </div>

    <div style="background: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f59e0b;">
      <p style="margin: 0;"><strong>⚡ Action Required:</strong> Please contact the patient to confirm the appointment and prepare for the consultation.</p>
    </div>

    <p>Best regards,<br><strong>Puthuyir Healthcare System</strong></p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
    <div style="text-align: center; color: #9ca3af; font-size: 12px;">
      <p>Puthuyir Healthcare | Traditional Siddha Medicine</p>
    </div>
  </div>
`;

const getContactFormEmailHtml = (data) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #2563eb;">🔔 New Contact Form Submission</h2>
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
      <p><strong>👤 Name:</strong> ${data.name}</p>
      <p><strong>📧 Email:</strong> <a href="mailto:${data.email}" style="color: #2563eb;">${data.email}</a></p>
      <p><strong>📝 Subject:</strong> ${data.subject || 'No subject provided'}</p>
      <p><strong>💬 Message:</strong></p>
      <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #2563eb; margin-top: 10px;">
        ${data.message.replace(/\n/g, '<br>')}
      </div>
      <p><strong>🕒 Submitted:</strong> ${new Date().toLocaleString()}</p>
    </div>
  </div>
`;

module.exports = {
  getPatientEmailHtml,
  getConsultantEmailHtml,
  getContactFormEmailHtml
};
