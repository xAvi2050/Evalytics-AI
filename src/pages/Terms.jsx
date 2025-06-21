import React from 'react';
import './Terms.css';

const Terms = () => {
  return (
    <div className="terms-page">
      <div className="terms-container">
        <h1>Terms and Conditions</h1>
        <p>Welcome to Evalytics-AI. By using our platform, you agree to the following terms and conditions.</p>

        <section>
          <h2>1. Use of the Platform</h2>
          <p>
            You agree to use Evalytics-AI only for lawful purposes. You are responsible for any content you submit or
            generate using the platform.
          </p>
        </section>

        <section>
          <h2>2. Account Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials. You must notify us
            immediately if you suspect any unauthorized use of your account.
          </p>
        </section>

        <section>
          <h2>3. Intellectual Property</h2>
          <p>
            All content, branding, and code provided by Evalytics-AI are protected by copyright and intellectual property
            laws. You may not reuse or redistribute them without written permission.
          </p>
        </section>

        <section>
          <h2>4. Limitations of Liability</h2>
          <p>
            Evalytics-AI is provided "as is" without warranties of any kind. We are not liable for any direct or indirect
            damages arising from your use of the platform.
          </p>
        </section>

        <section>
          <h2>5. Changes to Terms</h2>
          <p>
            We reserve the right to update these terms at any time. Continued use of the platform indicates your
            acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2>6. Contact</h2>
          <p>
            For any questions or concerns regarding these terms, please contact us at{' '}
            <a href="mailto:avijitrajak1111@gmail.com">Avijit</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
