// Use at least Nodemailer v4.1.0
const nodemailer = require('nodemailer');
import { logMessage } from '../util/helpers';

// Generate SMTP service account from ethereal.email
export const createTestAccount = () => nodemailer.createTestAccount();

export default async (account, fromEmail, formData) => {
    return new Promise((resolve, _) => {
        console.log('Credentials obtained, sending message...');

        // Create a SMTP transporter object
        let transporter = nodemailer.createTransport({
            host: account.smtp.host,
            // port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass
            }
        });

        const emailHTML = `
        <html>
            <style>
                p {
                    margin-left: 1.5rem;
                    color: #ffffff;
                }

                #body-container {
                    font-family: "Roboto Condensed", sans-serif;
                    background-color: #000000;
                }

                .italic-title {
                    font-size: 1.8rem;
                    color: #B69C7B;
                    font-style: italic;
                }
                
                .bold-title {
                    color: #ffffff;
                    background-color: #C0C0C0;
                    font-weight: 700;
                    font-size: 1.5rem;
                    border-radius: 30px;
                    width: fit-content;
                    padding-top: 0.5rem;
                    padding-bottom: 0.5rem;
                    padding-left: 1rem;
                    padding-right: 1rem;
                }

                .sub-title {
                    font-size: 1.8rem;
                    color: #000000;
                    font-style: bold;
                }

                #header-container {
                    background-color: #000000ec;
                    width: 100%;
                    display: inline-block;
                    text-align: center;
                    left: 0;
                    right: 0;
                    top: 0;
                }

                #sub-header-container {
                    background-color: #C0C0C0;
                    width: 100%;
                    display: inline-block;
                    text-align: center;
                    left: 0;
                    right: 0;
                    top: 0;
                }

                .footer-item {
                    height: auto;
                    max-width: 100%;
                    background-color: #1A1A1A;
                    color: white;
                    padding-bottom: 1%;
                    position: relative;
                }

                .copyright-container {
                    background-color: #263238;
                }

                #copyright {
                    width: 80%;
                    margin-left: auto;
                    margin-right: auto;
                    border-style: dotted;
                    border-width: 1px;
                    border-left: 0;
                    border-right: 0;
                    border-bottom: 0;
                    border-color: #d1d1d1;
                    padding-top: 30px;
                    text-align: center;
                    font-family: sans-serif;
                    color: white;
                    position: relative;
                }
            </style>
            <body>
                <div id="body-container">
                    <header>
                        <div id="header-container">
                            <img id="header-img" src="https://hexipitemplate.tk/static/media/White.7be1eea5.svg" height="auto" width="30%" alt="HexiPi Logo" />
                        </div>
                        <div id="sub-header-container" class="sub-title">
                            Contact Form
                        </div>
                    </header>
                    <br /><br />
                    <div class="bold-title">Time & Date Sent:</div>
                    <p>${(new Date(formData.timestamp)).toString()}</p>

                    <div class="bold-title">Sender:</div>
                    <p>${formData.name}</p>

                    <div class="bold-title">Sender's Email:</div>
                    <p>${formData.email}</p>

                    <div class="bold-title">Sender's Phone Number:</div>
                    <p>${(formData.phone_number) ? formData.phone_number : 'N/A' }</p>

                    <div class="bold-title">Sender's Message:</div>
                    <p>${formData.message}</p>
                    <br /><br />
                    <div class="footer-item copyright-container" style="text-align: center;">
                        <br/>
                        <p id="copyright">
                            Copyright &copy; <span id="copyright-year">${new Date().getFullYear()}</span> #HexiPi<br />All Rights Reserved
                            <br />
                            Powered by <a href="https://hexipi.com" target="new_tab" style="color: white; text-decoration: none; font-style: italic">#HexiPi</a>
                        </p>
                    </div>
                </div>
            </body>
        </html>
        `;

        // Message object
        let message = {
            from: `HexiPiTemplate <${fromEmail}>`,
            to: formData.recipient,
            subject: `${formData.name} - HexiPiTemplate Website Contact Form`,
            html: emailHTML
        };

        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log('Error occurred. ' + err.message);
                resolve(err.message);
            }
            else {
                console.log('Message sent: %s', info.messageId);
                logMessage('Form Emailed!');
                // Preview only available when sending through an Ethereal account
                // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                resolve(false);
            }
        });
    })
}