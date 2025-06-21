import { useEffect } from 'react';
import './Privacy.css'; // Link to your CSS (you can design it or ask me to generate it)

const Privacy = () => {
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); // ensure it's at the top
    }, 0);
  }, []);
  return (
    <div className="privacy-page">
        <div className="privacy-container">
            <h1>Privacy Policy</h1>
            <p>Last updated: June 17, 2025</p>

            <section>
                <h2>1. Introduction</h2>
                <p>
                At Evalytics-AI, your privacy is important to us. This privacy policy explains how we collect,
                use, disclose, and safeguard your information when you use our platform. By accessing or using
                Evalytics-AI, you agree to the terms outlined in this policy.
                </p>
            </section>

            <section>
                <h2>2. Information We Collect</h2>
                <ul>
                <li><strong>Personal Information:</strong> Name, email address, and other details you provide during signup.</li>
                <li><strong>Usage Data:</strong> Pages visited, features used, browser type, and device information.</li>
                <li><strong>Cookies:</strong> We use cookies to enhance your experience and analyze site traffic.</li>
                </ul>
            </section>

            <section>
                <h2>3. How We Use Your Information</h2>
                <p>We use your data to:</p>
                <ul>
                <li>Provide and maintain our services</li>
                <li>Improve user experience and product development</li>
                <li>Send you relevant updates and notifications</li>
                <li>Ensure compliance with legal requirements</li>
                </ul>
            </section>

            <section>
                <h2>4. Sharing Your Information</h2>
                <p>
                We do not sell your personal information. We may share data with trusted third parties for hosting,
                analytics, and service delivery — all under strict confidentiality agreements.
                </p>
            </section>

            <section>
                <h2>5. Data Security</h2>
                <p>
                We implement industry-standard security measures to protect your data, including encryption,
                firewalls, and access controls. However, no online system is 100% secure.
                </p>
            </section>

            <section>
                <h2>6. Your Rights</h2>
                <p>You have the right to:</p>
                <ul>
                <li>Access or update your personal information</li>
                <li>Request data deletion</li>
                <li>Opt-out of certain communications</li>
                </ul>
            </section>

            <section>
                <h2>7. Changes to This Policy</h2>
                <p>
                We may update this policy from time to time. We’ll notify you of significant changes and post
                the new policy on this page.
                </p>
            </section>

            <section>
                <h2>8. Contact Us</h2>
                <p>
                If you have any questions or concerns about this Privacy Policy, please contact us at:
                <br />
                <a href="mailto:avijitrajak1111@gmail.com">Avijit</a>
                </p>
            </section>
        </div>
    </div>
  );
};

export default Privacy;