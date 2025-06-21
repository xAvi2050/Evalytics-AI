
import './About.css'
const About = () => {
  return (
    <>
      <div className="about-container">
        <div className="about-card">
          <div className="about-header">
            <h1>Evalytics-AI</h1>
            <p className="subtitle">The Future of Intelligent Assessment</p>
          </div>
          
          <div className="about-content">
            <div className="about-section">
              <h2>About Me</h2>
              <p>
                Hello! This is Avijit & Shubham. We are a passionate and creative web developer dedicated to building elegant and efficient solutions for the modern web. With a strong foundation in front-end and back-end technologies, I specialize in crafting seamless user experiences and robust, scalable applications. This platform is a testament to my dedication to pushing the boundaries of what's possible with code.
              </p>
            </div>

            <div className="about-section">
              <h2>About the Platform</h2>
              <p>
                <strong>Evalytics-AI</strong> is an advanced, AI-powered exam platform designed to redefine the landscape of online assessments. Our mission is to provide an intuitive, fair, and insightful evaluation experience for both educators and students. From automated proctoring to in-depth performance analytics, we are building a comprehensive tool for the future of education.
              </p>
            </div>
          </div>

          <div className="footer-status">
            <p>This project is currently in the development phase. <span>Launching Soon!</span></p>
          </div>
        </div>
      </div>
    </>
  )
}

export default About