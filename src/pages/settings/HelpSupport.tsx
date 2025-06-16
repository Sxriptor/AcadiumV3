import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  HelpCircle, 
  MessageSquare, 
  Bug, 
  Lightbulb,
  ExternalLink,
  Send
} from 'lucide-react';
import { useTheme } from '../../components/ui/ThemeProvider';

const HelpSupport: React.FC = () => {
  const [showContactModal, setShowContactModal] = useState(false);
  const { theme } = useTheme();

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription from the Billing Settings page."
    },
    {
      question: "How do I download my course certificates?",
      answer: "Certificates can be downloaded from your Profile page under the Achievements section."
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-xl font-bold ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>Help & Support</h2>
        <p className={`text-sm mt-1 ${
          theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
        }`}>
          Get help and find answers to common questions.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <div className="flex flex-col h-full">
            <div className="p-3 mb-4 rounded-lg bg-blue-100 dark:bg-blue-900/30 w-12 h-12 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${
              theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              Contact Support
            </h3>
            <p className={`text-sm mb-4 flex-grow ${
              theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
            }`}>
              Get in touch with our support team for personalized assistance.
            </p>
            <Button onClick={() => setShowContactModal(true)}>
              Contact Support
            </Button>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <div className="flex flex-col h-full">
            <div className="p-3 mb-4 rounded-lg bg-purple-100 dark:bg-purple-900/30 w-12 h-12 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${
              theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              Help Center
            </h3>
            <p className={`text-sm mb-4 flex-grow ${
              theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'
            }`}>
              Browse our comprehensive documentation and guides.
            </p>
            <Button variant="outline">
              Visit Help Center <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* FAQs */}
      <Card>
        <h3 className={`text-lg font-medium mb-6 ${
          theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}>
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className={`p-4 rounded-lg ${
              theme === 'gradient' ? 'bg-gray-700' : 'bg-gray-50 dark:bg-gray-800'
            }`}>
              <h4 className={`text-sm font-medium mb-2 ${
                theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                {faq.question}
              </h4>
              <p className={`text-sm ${
                theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Report & Suggest */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className={`text-lg font-medium mb-4 ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Report a Bug
          </h3>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'
              }`}>
                Title
              </label>
              <input
                type="text"
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  theme === 'gradient'
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-300'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}
                placeholder="Brief description of the issue"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'
              }`}>
                Description
              </label>
              <textarea
                rows={4}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  theme === 'gradient'
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-300'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}
                placeholder="Detailed description of the bug..."
              />
            </div>
            <Button>
              <Bug className="h-4 w-4 mr-2" />
              Submit Bug Report
            </Button>
          </div>
        </Card>

        <Card>
          <h3 className={`text-lg font-medium mb-4 ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Feature Request
          </h3>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'
              }`}>
                Feature Title
              </label>
              <input
                type="text"
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  theme === 'gradient'
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-300'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}
                placeholder="Name your feature suggestion"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'
              }`}>
                Description
              </label>
              <textarea
                rows={4}
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  theme === 'gradient'
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-300'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}
                placeholder="Describe your feature idea..."
              />
            </div>
            <Button>
              <Lightbulb className="h-4 w-4 mr-2" />
              Submit Feature Request
            </Button>
          </div>
        </Card>
      </div>

      {/* Contact Support Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-[500px] p-6">
            <h3 className={`text-lg font-medium mb-4 ${
              theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
            }`}>
              Contact Support
            </h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Subject
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    theme === 'gradient'
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-300'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                  }`}
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === 'gradient' ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Message
                </label>
                <textarea
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                    theme === 'gradient'
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-300'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                  }`}
                  placeholder="Describe your issue..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowContactModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowContactModal(false)}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default HelpSupport;