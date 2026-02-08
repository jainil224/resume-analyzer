# 📄 AI Resume Analyzer

🚀 **Live Demo:**  
👉https://resume-analyzerai.vercel.app/

An intelligent, AI-powered tool designed to analyze resumes against job descriptions, providing detailed insights, scores, and actionable suggestions to improve your hiring potential.

---

## 🖼️ Preview

<img width="1448" height="904" alt="image" src="https://github.com/user-attachments/assets/0c27aa88-3684-4a49-b878-1ba0b6e1a10f" />


## ✨ Features

- **🤖 AI-Powered Analysis**: Utilizes advanced LLMs (Groq/Llama 3) to deeply analyze resume content against specific job requirements.
- **📊 Detailed Scoring**: Get a breakdown of your resume's performance in key areas:
  - **Overall Score**
  - **Skills Match**
  - **Experience Relevance**
  - **ATS Compatibility**
  - **Formatting & Structure**
- **💡 Actionable Insights**: Receive personalized suggestions, strong points, and areas for improvement.
- **📝 Multi-Format Support**: Upload resumes in **PDF** or **DOCX** formats.
- **🕒 Analysis History**: Keep track of your past analyses (requires Supabase configuration) or use local storage.
- **💬 3D AI Chatbot**: Interactive assistant to help answer career-related questions.
- **🌓 Dark/Light Mode**: Beautiful, responsive UI with theme support.
- **📱 Mobile Responsive**: optimized for all devices with a collapsible sidebar.

## 🛠️ Tech Stack

- **Frontend**: [React](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **AI Integration**: [Groq API](https://groq.com/) (Llama-3 models)
- **Document Processing**: `pdfjs-dist`, `mammoth`
- **Backend (Optional)**: [Supabase](https://supabase.com/) (for history persistence)

## 🚀 Getting Started

Follow these steps to get the project up and running locally.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/resume-analyzer.git
    cd resume-analyzer
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add your API keys:

    ```env
    VITE_GROQ_API_KEY=your_groq_api_key_here
    
    # Optional: For persistent history
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
    
    > **Note:** You can get a free Groq API key from [console.groq.com](https://console.groq.com/).

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

## 📖 Usage

1.  **Dashboard**: Start at the dashboard to get an overview.
2.  **Analyze**:
    - Upload your Resume (PDF/DOCX).
    - Paste the Job Description (Title & Details).
    - Click "Analyze Resume".
3.  **Review Results**: View your scores, matching skills, and specific AI-generated suggestions.
4.  **Export**: Download a PDF report of your analysis.
5.  **History**: View your past analyses in the History tab.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
