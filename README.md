# ✨ Sparkle Travel Planner – AI-Powered Travel Intelligence


## ✈️ Project Overview

The **Sparkle Travel Planner** is a full-stack demonstration application that leverages the power of the Gemini API to generate highly **personalized and intelligent travel reports**.

This tool transforms simple inputs (origin, destination and desired experience) into comprehensive reports covering **logistics, safety and deep cultural recommendations**, making travel planning smarter and safer.

| Core Technology | Frontend | Backend |
| :--- | :--- | :--- |
| **Google AI** | **Plain HTML/CSS/JS** | **Node.js (Express)** |
| **Key Service** | **Gemini API** | **`dotenv`, `marked`, `DOMPurify`** |

---

## 🚀 Live Demo
👉 **[Live Demo Link Here](#)**

---

## 📷 Screenshots

![Sparkle Laptop Query](/public/assets/Sparkle%20Laptop%20Query.png)
![Sparkle Laptop Answer](/public/assets/Sparkle%20Laptop%20Answer.png)

---

## 💡 Key Features

### 💻 Client-Side (Frontend)

* **Intelligent Input:** Simple, intuitive fields for **Origin, Destination and Experience Type**.
* **Secure Rendering:** Uses **`marked`** and **`DOMPurify`** to securely and cleanly render the Markdown output from the API.
* **User Feedback:** Clear **loading states, error handling** and **source attribution** for a smooth user experience.

### 🧠 Server-Side (Backend)

* **Express API:** A dedicated `/api/plan-trip` endpoint to handle all travel planning requests.
* **Robust AI Integration:** Seamless integration with the **Gemini API** using **structured prompting** to ensure high-quality output.
* **Resilience:** Includes built-in **retry logic** for enhanced API call reliability.
* **Structured Reports:** Generates clearly formatted reports covering three key areas:
    * **Logistics:** Transportation, visas, currency.
    * **Safety Advisories:** Health alerts, local laws, emergency contacts.
    * **Cultural Recommendations:** Etiquette, dining, unique activities.

---

## ⚙️ Setup & Installation

Follow these steps to get the Sparkle Travel Planner running on your local machine.

### 1. Clone the Repository

- git clone https://github.com/your-username/plan-my-trip.git
- cd plan-my-trip

### 2. Install Dependencies

- npm install

### 3. Configure Environment Variables

Create a file named .env in the root directory and add your configuration details. You must obtain your GEMINI_API_KEY from Google AI Studio.

Get your API key from Google AI Studio
- GEMINI_API_KEY=your_api_key_here

Port for the Express server to run on
- PORT=3000

### 4. Run the Server
Start the application with a single command:
- npm start
The server will typically start on http://localhost:3000.