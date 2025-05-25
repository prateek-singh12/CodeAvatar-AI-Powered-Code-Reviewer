import React, { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Editor from '@monaco-editor/react';
import Select from 'react-select';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown'
import HashLoader from "react-spinners/HashLoader";
import { Code2, FileCheck } from 'lucide-react';
import { Clipboard } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ai = new GoogleGenAI({ apiKey: "AIzaSyDv3vQLN6Mj_0w93qJU-qSYFiWMnDn2w4o" });

// Add this import at the top with your other imports
import { useContext } from 'react';
import { ThemeContext } from './context/ThemeContext';

// Then in your App component, add this line near the top
const App = () => {
  const { theme } = useContext(ThemeContext);
  const options = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'rust', label: 'Rust' },
    { value: 'dart', label: 'Dart' },
    { value: 'scala', label: 'Scala' },
    { value: 'perl', label: 'Perl' },
    { value: 'haskell', label: 'Haskell' },
    { value: 'elixir', label: 'Elixir' },
    { value: 'r', label: 'R' },
    { value: 'matlab', label: 'MATLAB' },
    { value: 'bash', label: 'Bash' }
  ];
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [isFixing, setIsFixing] = useState(false); // New state to track if we're fixing or reviewing

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff',
      borderColor: theme === 'dark' ? '#3f3f46' : '#e2e8f0',
      color: theme === 'dark' ? '#fff' : '#1a1a1a',
      width: "100%",
      minHeight: '38px',
      boxShadow: 'none',
      '&:hover': {
        borderColor: theme === 'dark' ? '#CDC1FF' : '#4f46e5'
      }
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff',
      color: theme === 'dark' ? '#fff' : '#1a1a1a',
      width: "100%",
      zIndex: 10
    }),
    singleValue: (provided) => ({
      ...provided,
      color: theme === 'dark' ? '#fff' : '#1a1a1a',
      width: "100%"
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused 
        ? theme === 'dark' ? '#27272a' : '#f1f5f9'
        : theme === 'dark' ? '#18181b' : '#ffffff',
      color: theme === 'dark' ? '#fff' : '#1a1a1a',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme === 'dark' ? '#27272a' : '#f1f5f9'
      }
    }),
    input: (provided) => ({
      ...provided,
      color: theme === 'dark' ? '#fff' : '#1a1a1a',
      width: "100%"
    }),
    placeholder: (provided) => ({
      ...provided,
      color: theme === 'dark' ? '#a1a1aa' : '#94a3b8',
      width: "100%"
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: theme === 'dark' ? '#CDC1FF' : '#4f46e5',
      '&:hover': {
        color: theme === 'dark' ? '#ebbcff' : '#6366f1'
      }
    }),
  };

  async function reviewCode() {
    setResponse("");
    setLoading(true);
    setIsFixing(false); // We're reviewing, not fixing
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `You are a senior software engineer and expert code reviewer with deep knowledge of ${selectedOption.value}.

I am providing you with a piece of code written in ${selectedOption.value}. Your task is to conduct a **comprehensive code review** as if you were reviewing a pull request for a professional software project.

Please return your feedback in the following structure:

---

📊 **1. Code Quality Assessment**  
Rate the overall quality as: Excellent, Good, Average, or Poor  
Briefly explain why you assigned this rating.

🔍 **2. Functional Analysis**  
Provide a step-by-step explanation of what the code does. Highlight the core logic, structure, and flow.

⚠️ **3. Identified Issues**  
List any of the following, if present:  
- Bugs or logic errors  
- Syntax or runtime issues  
- Violations of coding standards or conventions  
- Security or performance concerns

💡 **4. Suggestions for Improvement**  
Give specific, actionable recommendations to improve:  
- Code readability  
- Performance  
- Maintainability  
- Error handling  
- Use of modern or idiomatic ${selectedOption.value} features

🧠 **5. Best Practices**  
Mention any applicable ${selectedOption.value} best practices that were followed or should be adopted.

✅ **6. Summary Verdict**  
Conclude with a quick summary — is the code production-ready, needs minor refactoring, or requires major revisions?

---

📌 **Note:** Be thorough, constructive, and professional — your goal is to help the developer write better, cleaner, and more reliable code.

Here is the code to review:

${code}
`,
      });
      console.log(response.text);
      setResponse(response.text);
    } catch (error) {
      console.error("Error reviewing code:", error);
      setResponse("An error occurred while reviewing the code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // New function to fix code
  async function fixCodeFunction() {
    if (code === "") {
      alert("Please enter code first");
      return;
    }
    
    setResponse("");
    setLoading(true);
    setIsFixing(true); // We're fixing, not reviewing
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `You are a senior software engineer and expert code refactorer.

I am sharing a piece of code written in ${selectedOption.value}. Your task is to automatically **fix and optimize** this code while maintaining its original functionality.

Please provide:

---

✅ **1. Fully Fixed & Optimized Code**  
- Return only the **complete corrected version** of the code.  
- Format it properly and include helpful inline comments (if necessary).  
- Use modern syntax and features relevant to ${selectedOption.value}.  
- Avoid unnecessary libraries unless clearly beneficial.

🚀 **2. Improvements Applied (in bullet points)**  
Explain **what changes** you made and **why**. Focus on:  
- Bug fixes or logical corrections  
- Code style and readability  
- Error handling and edge case coverage  
- Performance optimizations  
- Security or best practice improvements  

---

⚠️ **Constraints**:
- Maintain the original logic and intent of the code
- Follow idiomatic and modern ${selectedOption.value} standards
- Ensure the final code is production-ready
- Avoid over-engineering unless necessary

---

🔍 **Code to fix and improve:**

${code}

  `,
      });
      
      console.log(response.text);
      setResponse(response.text);
    } catch (error) {
      console.error("Error fixing code:", error);
      setResponse("An error occurred while fixing the code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="main flex justify-between" style={{ height: "calc(100vh - 50px)" }}>
        <div className="left h-full w-[50%] !ml-5">
          <div className="editor-header flex items-center justify-between w-full !gap-[4px] !px-4 bg-white dark:bg-purple-900 dark:border-none h-[50px] !rounded-md !mt-5">
            <Select
              value={selectedOption}
              onChange={(e) => { setSelectedOption(e) }}
              options={options}
              styles={customStyles}
              className='w-[90%] !text-white p-[2px] light:!bg-white dark:!bg-zinc-900 !rounded-md ml-2'
              isSearchable
            />
            <div className="tabs w-full flex items-center gap-[8px] justify-end">
              <button 
                onClick={fixCodeFunction}
                className={`btnNormal ${isFixing ? 'bg-indigo-600 text-white dark:bg-purple-800 border-[1px] border-indigo-200 dark:border-[#CDC1FF]' : 'bg-gray-100 text-indigo-600 dark:text-white dark:bg-zinc-900'} min-w-[160px] transition-all hover:bg-indigo-700 hover:text-white dark:hover:bg-zinc-800`}>
                <Code2 size={18} /> Fix Code
              </button>
              <button 
                onClick={() => {
                  if (code === "") {
                    alert("Please enter code first");
                  } else {
                    reviewCode();
                  }
                }} 
                className={`btnNormal ${!isFixing ? 'bg-indigo-600 text-white dark:bg-purple-800 border-[1px] border-indigo-200 dark:border-[#CDC1FF]' : 'bg-gray-100 text-indigo-600 dark:text-white dark:bg-zinc-900'} min-w-[160px] transition-all hover:bg-indigo-700 hover:text-white dark:hover:bg-zinc-800`}>
                <FileCheck size={18} /> Review
              </button>
            </div>
          </div>
          <div className="editor-container" style={{ height: "100%", borderRadius: "8px", overflow: "hidden" }}>
            <Editor
              height="100%"
              theme='vs-dark'
              language={selectedOption.value}
              value={code}
              onChange={(value) => setCode(value)}
              defaultValue='// Write your code here...'
              options={{
                fontSize: 14,
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                lineNumbers: 'on',
                folding: true,
                automaticLayout: true,
                theme: theme === 'dark' ? 'vs-dark' : 'vs-light'
              }}
            />
          </div>
        </div>
        <div className="right overflow-auto !p-[15px] bg-zinc-900 w-[46%] h-[96%] !rounded-md !mt-5 !mr-5 ">
          <div className="topTab border-b-[2px] border-[#CDCIFF] flex items-center justify-between h-[40px]">
            <p className='font-[700] text-[17px] text-[#CDC1FF]'>
              {isFixing ? 'Fixed Code' : 'Review'}
            </p>
          </div>
          {loading && (
            <div className="hash-loader-center ">
              <HashLoader color="rgb(193, 122, 255)" size={50} />
            </div>
          )}
          <div className="markdown-content">
            <Markdown
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '');
                  const [copied, setCopied] = useState(false);
                  const handleCopy = () => {
                    navigator.clipboard.writeText(String(children));
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  };
                  return !inline && match ? (
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={handleCopy}
                        className="clipboard-btn"
                        style={{ position: 'absolute', top: 8, right: 8, zIndex: 2, display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Clipboard size={14} className="clipboard-icon" />
                        {/* <span>Copy</span> */}
                      </button>
                      {copied && (
                        <span className="copied-message" style={{ position: 'absolute', top: 6, right: 30, background: '#52525c', color: '#fff', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', zIndex: 3 }}>Copied to Clipboard!</span>
                      )}
                      <SyntaxHighlighter
                        style={theme === 'dark' ? oneDark : oneLight}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >{response}</Markdown>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
