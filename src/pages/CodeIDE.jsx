import React, { useState, useEffect } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import axios from 'axios';
import { themeOptions, registerMonacoThemes } from '../assets/monacoThemes';
import './CodeIDE.css';
import { useNavigate } from 'react-router-dom';

const languageOptions = [
  { id: 50, name: 'C (GCC 12.2.0)', monacoLang: 'c', version: '12.2.0', sample: '#include <stdio.h>\nint main() { printf("Hello, World!"); return 0; }' },
  { id: 54, name: 'C++ (GCC 12.2.0)', monacoLang: 'cpp', version: '12.2.0', sample: '#include <iostream>\nint main() { std::cout << "Hello, World!"; return 0; }' },
  { id: 62, name: 'Java (17.0.6)', monacoLang: 'java', version: '17.0.6', sample: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}' },
  { id: 71, name: 'Python (3.11.2)', monacoLang: 'python', version: '3.11.2', sample: 'print("Hello, World!")' },
  { id: 63, name: 'JavaScript (Node.js 18)', monacoLang: 'javascript', version: '18', sample: 'console.log("Hello, World!");' },
  { id: 74, name: 'TypeScript (5.0.3)', monacoLang: 'typescript', version: '5.0.3', sample: 'console.log("Hello, World!");' },
  { id: 78, name: 'Kotlin', monacoLang: 'kotlin', version: '1.8', sample: 'fun main() { println("Hello, World!") }' },
  { id: 60, name: 'Go (1.20.1)', monacoLang: 'go', version: '1.20.1', sample: 'package main\nimport "fmt"\nfunc main() { fmt.Println("Hello, World!") }' },
  { id: 51, name: 'C# (Mono 6.12)', monacoLang: 'csharp', version: '6.12', sample: 'using System;\nclass Program {\n  static void Main() {\n    Console.WriteLine("Hello, World!");\n  }\n}' },
  { id: 77, name: 'R (4.2.0)', monacoLang: 'r', version: '4.2.0', sample: 'print("Hello, World!")' },
  { id: 76, name: 'Rust (1.66.1)', monacoLang: 'rust', version: '1.66.1', sample: 'fn main() {\n    println!("Hello, World!");\n}' },
  { id: 84, name: 'Bash (5.1)', monacoLang: 'shell', version: '5.1', sample: 'echo "Hello, World!"' },
  { id: 82, name: 'Ruby (3.2.1)', monacoLang: 'ruby', version: '3.2.1', sample: 'puts "Hello, World!"' },
  { id: 85, name: 'Haskell (9.2.5)', monacoLang: 'haskell', version: '9.2.5', sample: 'main = putStrLn "Hello, World!"' },
  { id: 86, name: 'Perl (5.34.0)', monacoLang: 'perl', version: '5.34.0', sample: 'print "Hello, World!\\n";' },
  { id: 88, name: 'PHP (8.2.3)', monacoLang: 'php', version: '8.2.3', sample: '<?php echo "Hello, World!"; ?>' },
  { id: 93, name: 'Swift (5.8.1)', monacoLang: 'swift', version: '5.8.1', sample: 'print("Hello, World!")' },
];

const themes = [
  'vs-dark',            
  'vs-light',           
  'light',              
  'vs',                 
  'hc-black',           
  'hc-light',           
  'solarized-dark',     
  'solarized-light',    
  'monokai',            
  'dracula',            
  'github-dark',        
  'github-light',       
  'one-dark-pro',       
  'nord',               
  'evalytics-dark'      
];
const fonts = ['Fira Code', 'JetBrains Mono', 'Monaco', 'Courier New', 'Ubuntu Mono'];

const CodeIDE = () => {
  const [language, setLanguage] = useState(71);
  const [code, setCode] = useState('');
  const [theme, setTheme] = useState('evalytics-dark');
  const [font, setFont] = useState('Fira Code');
  const [fontSize, setFontSize] = useState(14);
  const [output, setOutput] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const monaco = useMonaco();
  const navigate = useNavigate();

  useEffect(() => {
    const lang = languageOptions.find((l) => l.id === language);
    setCode(lang.sample);
  }, [language]);

  useEffect(() => {
  if (monaco) {
    registerMonacoThemes(monaco);
  }
}, [monaco]);


  const runCode = async () => {
    setIsSubmitting(true);
    setOutput('⏳ Running...');
    try {
      const { data } = await axios.post(
        'https://judge0-ce.p.rapidapi.com/submissions',
        {
          source_code: code,
          language_id: language,
          stdin: userInput,
        },
        {
          params: {
            base64_encoded: 'false',
            wait: 'true', // Changed to wait for completion
          },
          headers: {
            'x-rapidapi-key': import.meta.env.VITE_JUDGE0_API_KEY,
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json',
          },
        }
      );

      // Handle the response directly since we're waiting for completion
      const result = data;
      setOutput(
        result.stdout || 
        result.stderr || 
        result.compile_output || 
        (result.message ? `Error: ${result.message}` : 'No output')
      );
    } catch (err) {
      setOutput(`❌ Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="code-ide-container">
      <div className="ide-toolbar">

        <button id="homebtn" onClick={() => navigate('/')}><img src="../public/eai.png" width={50}/></button>

        <select onChange={(e) => setLanguage(Number(e.target.value))} value={language}>
          {languageOptions.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>

        <span className="lang-version">
          {languageOptions.find((l) => l.id === language)?.version}
        </span>

        <select onChange={(e) => setTheme(e.target.value)} value={theme}>
          {themeOptions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>


        <select onChange={(e) => setFont(e.target.value)} value={font}>
          {fonts.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        <input
          type="number"
          min="10"
          max="30"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
        />

        <button id='runbtn' onClick={runCode} disabled={isSubmitting}>
          {isSubmitting ? 'Running...' : '▷ Run Code'}
        </button>
      </div>

      <div className="editor-output-wrapper">
        <div className="code-editor">
          <Editor
            height="100%"
            width="100%"
            theme={theme}
            language={languageOptions.find((l) => l.id === language)?.monacoLang || 'plaintext'}
            value={code}
            onChange={(value) => setCode(value)}
            options={{
              fontSize,
              fontFamily: font,
              minimap: { enabled: false },
            }}
          />
        </div>

        <div className="code-output">
          <h2>Terminal</h2>
          <hr />
          <h3>Input</h3>
          <textarea
            rows="5"
            placeholder="Enter input here (e.g., John)"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />

          <h3>Output</h3>
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default CodeIDE;