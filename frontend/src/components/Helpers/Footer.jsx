import React from 'react';
// import { SocialIcon } from 'react-social-icons';
import 'assets/Helpers/css/footerStyle.css';
//import logo from 'assets/Helpers/images/White.svg';

// const logo = "";

const Footer = () => (
    <div id="footer-container">
        {/* <div className="footer-item">
            <div className="footer-inner-item">
                <div className="footer-section" style={{ flexGrow: 1, textAlign: 'center' }}>
                    <img className="footer-logo" src={logo} alt="HexiPi Logo" />
                    <h4 className="footer-heading">Support Hours</h4>
                    <div className="footer-heading-underline"></div>
                    <br />
                    <p><strong>Every Day 24/7</strong></p>
                </div>
                <div className="footer-section" style={{ flexGrow: 2 }}>
                    <h4 className="footer-heading">Contact Info</h4>
                    <div className="footer-heading-underline"></div>
                    <br />
                    <p><u>Address</u><br /><span>123 Elm Street, Houston, TX 77001</span></p>
                    <p><u>Email</u><br /><span><a href="mailto:info@hexipi.com" style={{ color: '#ffffff' }}>INFO@HEXIPI.COM</a></span></p>
                    <p><u>Phone</u><br /><span><a href="tel: +17135555555" style={{ color: '#ffffff' }}>
                            TEL: 713-555-5555
                        </a></span></p>
                    <p>
                        <SocialIcon id="social-icons" bgColor="#ffffff" style={{ height: 40, width: 40 }} url="https://www.facebook.com/hexipi.dev" target="new_tab" />
                        <SocialIcon id="social-icons" bgColor="#ffffff" style={{ height: 40, width: 40 }} url="https://www.youtube.com/channel/UCxJUbbqJ_3hpaL53vn2EFVA" target="new_tab" />
                        <SocialIcon bgColor="#ffffff" style={{ height: 40, width: 40 }} url="https://www.instagram.com/hexipi/" target="new_tab" />
                    </p>
                </div>
                <div className="footer-section" style={{ flexGrow: 2, textAlign: 'center' }}>
                    <h4 className="footer-heading">Location</h4>
                    <div className="footer-heading-underline"></div>
                    <br />
                    <iframe title="HexiPi Location Map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d443087.54862463806!2d-95.68147474760514!3d29.81747821723016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640b8b4488d8501%3A0xca0d02def365053b!2sHouston%2C%20TX!5e0!3m2!1sen!2sus!4v1592852179374!5m2!1sen!2sus" frameborder="0" style={{ border: '0', width: '25rem', height: '15rem', maxWidth: '100%' }} allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
                </div>
            </div>
        </div> */}
        <div className="footer-item copyright-container" style={{ textAlign: 'center' }}>
            <br/>
            <p id="copyright">
                &copy; J.A.A. Productions {new Date().getFullYear()}<br />All Rights Reserved
                {/* <br />
                Powered by <a href="https://hexipi.com" target="new_tab" style={{ color: 'white', textDecoration: 'none', fontStyle: 'italic' }}>#HexiPi</a> */}
            </p>
        </div>
    </div>
);



export default Footer;