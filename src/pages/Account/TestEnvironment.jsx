// src/pages/Test/TestEnvironment.jsx
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '../../utils/api';
import { Check, X, Clock, AlertCircle, Award, Play, Save } from 'lucide-react';

// --- UI Components ---
const LoadingSpinner = ({ text }) => (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        {text}
    </div>
);

const ErrorDisplay = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-8">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h2 className="text-2xl font-bold mb-2">Error</h2>
        <p className="text-center text-gray-300 mb-6">{message}</p>
        <button onClick={onRetry} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">
            Return to Tests
        </button>
    </div>
);

const TestCaseResult = ({ result, index }) => (
    <div className={`p-3 rounded-md ${result.status?.description === 'Accepted' ? 'bg-green-900/30' : 'bg-red-900/30'} mb-2`}>
        <div className="flex items-center font-semibold">
            {result.status?.description === 'Accepted' ? 
                <Check size={16} className="text-green-400 mr-2" /> : 
                <X size={16} className="text-red-400 mr-2" />
            }
            Test Case #{index + 1}: {result.status?.description || 'Error'}
        </div>
        {result.stdout && (
            <div className="text-sm text-gray-300 mt-1">
                Output: {atob(result.stdout)}
            </div>
        )}
        {result.stderr && (
            <pre className="text-xs text-red-300 mt-1 whitespace-pre-wrap">{atob(result.stderr)}</pre>
        )}
        {result.time && (
            <div className="text-xs text-gray-400 mt-1">
                Time: {result.time}s | Memory: {result.memory}KB
            </div>
        )}
    </div>
);

// --- Main Test Component ---
const TestEnvironment = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    
    // State
    const [test, setTest] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [code, setCode] = useState('');
    const [testResults, setTestResults] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [questionStatuses, setQuestionStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [score, setScore] = useState(null);

    // Get current question
    const currentQuestion = test?.questions?.[currentQuestionIndex];

    // Handlers
    const handleCodeChange = useCallback((value) => {
        setCode(value || '');
        // Save answer for current question
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: value || ''
        }));
    }, [currentQuestion]);

    const runCodeWithTestCases = async (testCases) => {
        if (!code.trim() || !testCases || testCases.length === 0) {
            return { results: [] };
        }

        try {
            const encodedCode = btoa(unescape(encodeURIComponent(code)));
            const { data } = await api.post('/exams/run-code', {
                source_code: encodedCode,
                language_id: 71, // Python
                test_cases: testCases
            });
            return data;
        } catch (error) {
            console.error("Error running code:", error);
            const errorMessage = error.response?.data?.detail || 'Failed to run code.';
            return { results: [{ status: { description: 'Error' }, stderr: btoa(errorMessage) }] };
        }
    };

    const handleRunCode = async () => {
        if (!code.trim()) return;
        
        setIsRunning(true);
        setTestResults([]);
        
        try {
            // Run only non-hidden test cases for testing
            const visibleTestCases = currentQuestion.test_cases?.filter(tc => !tc.hidden) || [];
            const data = await runCodeWithTestCases(visibleTestCases);
            setTestResults(data.results || []);
        } catch (error) {
            console.error("Error running code:", error);
            setTestResults([{ status: { description: 'Error' }, stderr: btoa('Failed to run code') }]);
        } finally {
            setIsRunning(false);
        }
    };

    const handleSaveAnswer = () => {
        // Update question status to attempted
        const newStatuses = [...questionStatuses];
        newStatuses[currentQuestionIndex] = 'attempted';
        setQuestionStatuses(newStatuses);
        
        // Show confirmation
        alert('Answer saved! You can come back to this question later.');
    };

    const handleSubmitAll = async () => {
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            // Calculate score based on all answers
            let totalScore = 0;
            let totalQuestions = test.questions.length;
            
            // For each question, evaluate the answer
            for (const question of test.questions) {
                const answer = answers[question.id];
                
                if (question.question_type === 'mcq') {
                    // For MCQ questions, check if answer matches correct_answer
                    if (answer && answer === question.correct_answer) {
                        totalScore += 1;
                    }
                } else if (question.question_type === 'coding') {
                    // For coding questions, we need to run all test cases
                    try {
                        const allTestCases = question.test_cases || [];
                        const data = await runCodeWithTestCases(allTestCases);
                        const passedCount = data.results?.filter(res => res.status?.description === 'Accepted').length || 0;
                        const questionScore = allTestCases.length > 0 ? (passedCount / allTestCases.length) : 0;
                        totalScore += questionScore;
                    } catch (error) {
                        console.error(`Error evaluating coding question ${question.id}:`, error);
                    }
                }
            }

            // Calculate final percentage score
            const finalScore = (totalScore / totalQuestions) * 100;
            setScore(finalScore);

            // Submit all answers to backend
            try {
                const submitResponse = await api.post(`/tests/${testId}/submit`, {
                    answers: answers,
                    score: finalScore
                });

                if (finalScore >= 80) {
                    // Award certification
                    await api.post('/tests/user/certification', {
                        test_id: testId,
                        score: finalScore,
                        test_name: test.title
                    });
                }
            } catch (submitError) {
                console.error("Error submitting to backend:", submitError);
                // Continue even if backend submission fails
            }

        } catch (error) {
            console.error("Error in test submission:", error);
            const errorMessage = error.response?.data?.detail || 'Failed to submit test. Please try again.';
            alert(`Error: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleQuestionChange = (index) => {
        if (index >= 0 && index < test.questions.length) {
            setCurrentQuestionIndex(index);
            // Load saved answer for the question
            const questionId = test.questions[index].id;
            setCode(answers[questionId] || test.questions[index]?.starter_code || '');
            setTestResults([]);
            
            // Update question status if not visited
            const newStatuses = [...questionStatuses];
            if (newStatuses[index] === 'notAttempted') {
                newStatuses[index] = 'notAnswered';
                setQuestionStatuses(newStatuses);
            }
        }
    };

    // Effects
    useEffect(() => {
        const loadTest = async () => {
            try {
                const response = await api.get(`/tests/${testId}`);
                setTest(response.data);
                setTimeLeft(response.data.duration_minutes * 60);
                
                // Initialize question statuses and answers
                const initialStatuses = response.data.questions.map(() => 'notAttempted');
                initialStatuses[0] = 'notAnswered'; // First question is visited
                setQuestionStatuses(initialStatuses);
                
                // Initialize answers object with starter codes
                const initialAnswers = {};
                response.data.questions.forEach(question => {
                    initialAnswers[question.id] = question.starter_code || '';
                });
                setAnswers(initialAnswers);
                
                // Set initial code for first question
                if (response.data.questions.length > 0) {
                    setCode(response.data.questions[0]?.starter_code || '');
                }
            } catch (err) {
                console.error("Failed to load test:", err);
                setError("Could not load the test. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        loadTest();
    }, [testId]);

    useEffect(() => {
        if (!timeLeft || !test) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmitAll();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, test]);

    // Render Logic
    if (loading) return <LoadingSpinner text="Loading Test..." />;
    if (error) return <ErrorDisplay message={error} onRetry={() => navigate('/dashboard/tests')} />;
    if (!test) return <LoadingSpinner text="Preparing test environment..." />;

    if (score !== null) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl max-w-md">
                    <Award className="mx-auto mb-4 text-yellow-400" size={64} />
                    <h1 className="text-3xl font-bold mb-4">Test Completed!</h1>
                    <p className="text-2xl mb-6">Your Score: <span className="font-bold">{score.toFixed(1)}%</span></p>
                    
                    {score >= 80 ? (
                        <div className="bg-green-900/30 p-4 rounded-lg mb-6">
                            <Check className="mx-auto mb-2 text-green-400" size={32} />
                            <p className="text-green-400 font-semibold">Congratulations! You earned a certification!</p>
                        </div>
                    ) : (
                        <div className="bg-red-900/30 p-4 rounded-lg mb-6">
                            <X className="mx-auto mb-2 text-red-400" size={32} />
                            <p className="text-red-400">Score below 80%. Try again to earn certification.</p>
                        </div>
                    )}
                    
                    <button
                        onClick={() => navigate('/dashboard/tests')}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg"
                    >
                        Return to Tests
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-900 text-white p-4 gap-4">
            {/* Left Panel - Questions and Description */}
            <div className="w-1/3 flex flex-col gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="font-bold text-lg mb-4">Questions</h3>
                    <div className="space-y-2">
                        {test.questions.map((question, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuestionChange(index)}
                                className={`w-full text-left p-3 rounded-md flex items-center justify-between ${
                                    currentQuestionIndex === index ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                            >
                                <span className="flex items-center">
                                    <span className={`w-3 h-3 rounded-full ${
                                        questionStatuses[index] === 'solved' ? 'bg-green-500' :
                                        questionStatuses[index] === 'attempted' ? 'bg-yellow-500' : 
                                        questionStatuses[index] === 'notAnswered' ? 'bg-blue-500' : 'bg-gray-600'
                                    } mr-3`}></span>
                                    Q{index + 1}: {question.difficulty}
                                </span>
                                <span className={`text-xs font-semibold ${
                                    question.difficulty === 'Easy' ? 'text-green-400' :
                                    question.difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                                }`}>
                                    {question.difficulty}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4 flex-grow overflow-y-auto">
                    <h3 className="font-bold text-lg mb-4">Question {currentQuestionIndex + 1}</h3>
                    <div className="mb-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            currentQuestion.difficulty === 'Easy' ? 'bg-green-900 text-green-300' :
                            currentQuestion.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                            'bg-red-900 text-red-300'
                        }`}>
                            {currentQuestion.difficulty}
                        </span>
                    </div>
                    <div className="prose prose-invert prose-sm">
                        <p className="whitespace-pre-wrap">{currentQuestion.text}</p>
                    </div>
                    
                    {currentQuestion.options && currentQuestion.options.length > 0 && (
                        <div className="mt-6">
                            <h4 className="font-semibold mb-2">Options:</h4>
                            {currentQuestion.options.map((option, index) => (
                                <div key={index} className="bg-gray-700 p-3 rounded-md mb-2">
                                    <p className="text-sm font-mono text-gray-300">
                                        {String.fromCharCode(65 + index)}. {option}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {currentQuestion.test_cases && currentQuestion.test_cases.length > 0 && (
                        <div className="mt-6">
                            <h4 className="font-semibold mb-2">Test Cases:</h4>
                            {currentQuestion.test_cases.map((testCase, index) => (
                                <div key={index} className="bg-gray-700 p-3 rounded-md mb-2">
                                    <p className="text-sm font-mono text-gray-300">
                                        Input: {testCase.input}
                                    </p>
                                    {!testCase.hidden && (
                                        <p className="text-sm font-mono text-gray-300">
                                            Expected Output: {testCase.output}
                                        </p>
                                    )}
                                    {testCase.hidden && (
                                        <p className="text-sm font-mono text-gray-500">
                                            Hidden test case
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel - Code Editor and Results */}
            <div className="w-2/3 flex flex-col gap-4">
                <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center">
                        <Clock className="text-red-400 mr-2" size={20} />
                        <span className="font-bold text-red-400">
                            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">
                            Question {currentQuestionIndex + 1} of {test.questions.length}
                        </span>
                        <button
                            onClick={handleSaveAnswer}
                            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg flex items-center"
                        >
                            <Save size={16} className="mr-2" />
                            Save Answer
                        </button>
                        <button
                            onClick={handleSubmitAll}
                            disabled={isSubmitting}
                            className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 flex items-center"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Test'}
                        </button>
                    </div>
                </div>

                <div className="flex-grow border border-gray-700 rounded-lg overflow-hidden">
                    {currentQuestion.question_type === 'coding' ? (
                        <Editor
                            height="100%"
                            language="python"
                            theme="vs-dark"
                            value={code}
                            onChange={handleCodeChange}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                wordWrap: 'on'
                            }}
                        />
                    ) : (
                        <div className="p-4 h-full bg-gray-800">
                            <h4 className="font-semibold mb-3">Your Answer:</h4>
                            <select
                                value={code}
                                onChange={(e) => handleCodeChange(e.target.value)}
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white"
                            >
                                <option value="">Select an option</option>
                                {currentQuestion.options?.map((option, index) => (
                                    <option key={index} value={option}>
                                        {String.fromCharCode(65 + index)}. {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {currentQuestion.question_type === 'coding' && (
                    <>
                        <div className="flex gap-4">
                            <button
                                onClick={handleRunCode}
                                disabled={isRunning || !code.trim()}
                                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg disabled:opacity-50 flex items-center justify-center"
                            >
                                {isRunning ? 'Running...' : (
                                    <>
                                        <Play size={16} className="mr-2" />
                                        Run Code
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-4 h-64 overflow-y-auto">
                            <h4 className="font-semibold mb-3">Test Results</h4>
                            {testResults.length > 0 ? (
                                <div className="space-y-2">
                                    {testResults.map((result, index) => (
                                        <TestCaseResult key={index} result={result} index={index} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">Run your code to see test results.</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TestEnvironment;