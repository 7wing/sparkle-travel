✨ **Sparkle Travel Planner**

Sparkle Travel Planner is a fast, elegant full‑stack application that transforms simple inputs such as *origin, destination and desired experience* into deeply personalized travel intelligence.

Powered by the Gemini API, it generates structured reports covering logistics, safety and cultural insights, making trip planning smarter, safer and more inspiring.

🚀 **Live Demo**

[Sparkle Travel](https://sparkle-travel.vercel.app/)

📷 **Screenshots**

![Sparkle Laptop Query](/public/assets/Sparkle%20Laptop%20Query.png)
![Sparkle Laptop Answer](/public/assets/Sparkle%20Laptop%20Answer.png)


💡 **Features**

💻 *Client-Side (Frontend)*

Intelligent Input: Simple, intuitive fields for origin, destination and experience type.

Secure Rendering: Uses `marked` and `DOMPurify` to securely and cleanly render the markdown output from the API.

User Feedback: Clear loading states, error handling and source attribution for a smooth user experience.

🧠 *Server-Side (Backend)*

Express API: A dedicated `/api/plan-trip` endpoint to handle all travel planning requests.

Robust AI Integration: Seamless integration with the Gemini API using structured prompting to ensure high-quality output.

Resilience:  Includes built-in retry logic for enhanced API call reliability.

Structured Reports: Generates clearly formatted reports covering three key areas:
- Logistics: Transportation, visas, currency.
- Safety Advisories: Health alerts, local laws, emergency contacts.
- Cultural Recommendations: Etiquette, dining, unique activities.


🧰 **Tech Stack**

| Core Technology | Frontend | Backend |
| :--- | :--- | :--- |
| **Google AI** | **Plain HTML/CSS/JS** | **Node.js (Express)** |
| **Key Service** | **Gemini API** | **`dotenv`, `marked`, `DOMPurify`** |


⚙️ **Setup & Installation**

Follow these steps to get the Sparkle Travel Planner running on your local machine.

1. *Clone the Repository*

- git clone https://github.com/your-username/sparkle-travel.git
- cd sparkle-travel

2. *Install Dependencies*

- npm install

3. *Configure Environment Variables*

- Create a file named .env in the root directory and add your configuration details. You must obtain your GEMINI_API_KEY from Google AI Studio.

- Get your API key from Google AI Studio
- GEMINI_API_KEY=your_api_key_here

4. Port for the Express server to run on
- PORT=3000

5. *Run the Server*

- Start the application with a single command:
- npm start
The server will typically start on http://localhost:3000.

💡 **Why This Matters**

Beyond logistics and safety, Sparkle Travel helps users discover where they truly want to go. By combining cultural insights with practical guidance, it transforms vague ideas into concrete, inspiring destinations.