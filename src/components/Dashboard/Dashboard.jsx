import React from "react";
import "./Dashboard.css";
import { FaLightbulb, FaLaptopCode, FaChartLine } from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "../../ui_components/bg/bg.css";
import GridDistortion from "../../ui_components/bg/bg";
import bgdash from "../../assets/blackorange.png"; // Use your preferred image
import "../../ui_components/heading/heading.css";
import "../../ui_components/heading/heading.jsx";
import TextType from "../../ui_components/heading/heading.jsx";
import { useEffect } from "react";

const Dashboard = () => {
  return (
    <div
      className="dashboard-container"
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <GridDistortion
          imageSrc={bgdash}
          grid={10}
          mouse={0.1}
          strength={0.15}
          relaxation={0.9}
          className="custom-class"
        />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar />

        <header className="dashboard-header">
          <TextType
            className="dashboard-texttype"
            text={[
              "Welcome to MockTank AI",
              "Your partner in pitch excellence",
              "Practice. Perfect. Pitch. Succeed.",
            ]}
            typingSpeed={60}
            pauseDuration={2000}
            showCursor={true}
            cursorCharacter="|"
            textColors={["#f3ec78"]}
            deletingSpeed={60}
          />
          <p>Your personal AI-powered pitch coach</p>
        </header>

        <main className="dashboard-main">
          <div className="feature-cards">
            <div className="feature-card">
              <div className="card-icon">
                <FaLightbulb size={70} />
              </div>
              <h2>AI-Powered Feedback</h2>
              <p>
                Get instant, personalized feedback on your pitch delivery and
                content.
              </p>
            </div>
            <div className="feature-card">
              <div className="card-icon">
                <FaLaptopCode size={70} />
              </div>
              <h2>Practice Simulations</h2>
              <p>
                Hone your skills in realistic simulations with virtual
                audiences.
              </p>
            </div>
            <div className="feature-card">
              <div className="card-icon">
                <FaChartLine size={70} />
              </div>
              <h2>Performance Analytics</h2>
              <p>
                Track your progress with detailed analytics and identify areas
                for improvement.
              </p>
            </div>
          </div>
          <div className="cta-section">
            <Link to="/signin">
              <button className="cta-button">Get Started</button>
            </Link>
          </div>
          {/* Pricing Section */}
          <section className="pricing-section">
            <h2 className="pricing-heading">Pricing Plans</h2>
            <div className="pricing-cards">
              <div className="pricing-card free">
                <h3>Free</h3>
                <p className="price">₹0</p>
                <ul>
                  <li>10 min session</li>
                  <li>1 investor</li>
                  <li>No insights or body language analysis</li>
                </ul>
                <Link to="/signin">
                  <button className="pricing-button">Start Free</button>
                </Link>
              </div>

              <div className="pricing-card popular">
                <h3>Pro</h3>
                <p className="price">₹799/month</p>
                <ul>
                  <li>40 sessions/month</li>
                  <li>3 investors</li>
                  <li>Premium insights & speech analysis</li>
                </ul>
                <Link to="/signin">
                  <button className="pricing-button">Go Pro</button>
                </Link>
              </div>

              <div className="pricing-card elite">
                <h3>Elite</h3>
                <p className="price">₹2499/month</p>
                <ul>
                  <li>Unlimited sessions</li>
                  <li>Access to 6 investors</li>
                  <li>Body language & premium insights</li>
                  <li>Early access to new models</li>
                </ul>
                <Link to="/signin">
                  <button className="pricing-button">Join Elite</button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <footer className="dashboard-footer">
          <p>© 2025 MockTank AI. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
