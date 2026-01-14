// Email Notification Service
class EmailNotificationService {
    constructor() {
        // Replace these with your actual EmailJS credentials
        this.emailJSPublicKey = 'user_abcdef123456'; // From Account → General
        this.serviceID = 'service_tiicq37'; // From Email Services
        this.templateID = 'template_xyz789'; // From Email Templates
        this.init();
    }
    
    init() {
        // Initialize EmailJS
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.emailJSPublicKey);
        }
    }
    
    async sendInquiryNotification(inquiryData) {
        try {
            if (typeof emailjs === 'undefined') {
                console.warn('EmailJS not loaded, skipping email notification');
                return;
            }
            
            const templateParams = {
                to_email: 'admin@michu.com',
                from_name: inquiryData.name,
                from_email: inquiryData.email,
                company: inquiryData.company || 'Not specified',
                country: inquiryData.country || 'Not specified',
                inquiry_type: inquiryData.type,
                message: inquiryData.message,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString()
            };
            
            await emailjs.send(this.serviceID, this.templateID, templateParams);
            console.log('Email notification sent successfully');
            
        } catch (error) {
            console.error('Failed to send email notification:', error);
        }
    }
}

// Initialize email service
window.emailService = new EmailNotificationService();