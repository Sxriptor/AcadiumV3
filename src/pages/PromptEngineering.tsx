import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FileText, CheckCircle, XCircle, Sparkles, Book, PenTool as Tool, ArrowRight, Copy, RefreshCw } from 'lucide-react';
import { useTheme } from '../components/ui/ThemeProvider';

const PromptEngineering: React.FC = () => {
  const { theme } = useTheme();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 1500);
  };

  const examples = [
    {
      good: "Create a detailed marketing plan for a sustainable fashion brand targeting millennials, including social media strategy and content calendar",
      bad: "Make a marketing plan",
      explanation: "The good prompt is specific, includes target audience, and outlines desired components"
    },
    {
      good: "Design a logo for a tech startup that combines elements of artificial intelligence (circuit patterns) with organic shapes, using blue and silver as primary colors",
      bad: "Design a logo",
      explanation: "The good prompt provides specific design elements, color preferences, and context"
    }
  ];

  const tools = [
    {
      name: "GPT-4 Prompt Optimizer",
      description: "Enhance your prompts with AI-powered suggestions and improvements",
      icon: <Sparkles className="h-5 w-5" />
    },
    {
      name: "Prompt Templates Library",
      description: "Access pre-built templates for common use cases and industries",
      icon: <Book className="h-5 w-5" />
    },
    {
      name: "Context Builder",
      description: "Create rich context for more accurate and relevant AI responses",
      icon: <Tool className="h-5 w-5" />
    }
  ];

  return (
    <div className="py-6 space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mt-20 -mr-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center text-indigo-200 mb-4">
            <FileText className="h-6 w-6 mr-2" />
            <span className="text-sm font-medium">PROMPT ENGINEERING</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Master the Art of AI Prompting
          </h1>
          
          <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mb-8">
            Learn to craft effective prompts that unlock the full potential of AI models. 
            Transform vague ideas into precise, actionable instructions.
          </p>
        </div>
      </div>

      {/* Interactive Prompt Generator */}
      <Card className={
        theme === 'gradient' 
          ? 'bg-indigo-600/20 border-indigo-500/30' 
          : 'bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900/20'
      }>
        <div className="space-y-4">
          <h2 className={`text-xl font-bold ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Interactive Prompt Generator
          </h2>
          
          <div className="space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your base prompt here..."
              className={`w-full h-32 p-4 rounded-lg border resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                theme === 'gradient'
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-300'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
              }`}
            />
            
            <div className="flex gap-3">
              <Button 
                className="flex-1"
                onClick={handleGenerate}
                disabled={!prompt || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Enhance Prompt
                  </>
                )}
              </Button>
              
              <Button variant="outline">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Examples Section */}
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Good vs. Bad Prompts
        </h2>
        
        <div className="space-y-6">
          {examples.map((example, index) => (
            <Card key={index}>
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-green-900 dark:text-green-300 mb-2">
                        Good Prompt
                      </h4>
                      <p className="text-green-800 dark:text-green-200">
                        {example.good}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50">
                  <div className="flex items-start">
                    <XCircle className="h-5 w-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-red-900 dark:text-red-300 mb-2">
                        Bad Prompt
                      </h4>
                      <p className="text-red-800 dark:text-red-200">
                        {example.bad}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className={`text-sm ${
                  theme === 'gradient' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
                }`}>
                  <strong className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Why it works: </strong>
                  {example.explanation}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Tools Section */}
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Prompt Engineering Tools
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col h-full">
                <div className="p-3 mb-4 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 w-12 h-12 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  {tool.icon}
                </div>
                
                <h3 className={`text-lg font-semibold mb-2 ${
                  theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {tool.name}
                </h3>
                
                <p className={`text-sm mb-4 flex-grow ${
                  theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {tool.description}
                </p>
                
                <Button variant="outline" className="mt-auto">
                  Try Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <Card className="bg-gradient-to-br from-indigo-600 to-blue-700 border-none text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Master Prompt Engineering?
          </h3>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Join our community of prompt engineers and unlock the full potential of AI technology.
          </p>
          <Button className="bg-white text-indigo-700 hover:bg-indigo-50">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PromptEngineering;