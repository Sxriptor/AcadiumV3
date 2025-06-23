import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../components/ui/ThemeProvider';
import { Checklist } from '../../components/shared/Checklist';
import { MiniAppSwitcher } from '../../components/shared/MiniAppSwitcher';
import { MainContentTabs } from '../../components/shared/MainContentTabs';
import { 
  Database, 
  Plug, 
  Lock, 
  Cloud, 
  Webhook,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Minus,
  Server,
  Shield,
  Zap,
  Settings,
  Monitor,
  Code,
  Loader2
} from 'lucide-react';
import { useUserProgress } from '../../hooks/useUserProgress';
import { EnhancedChecklist } from '../../components/shared/EnhancedChecklist';

interface Step {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  estimated_time?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface StepSection {
  id: string;
  title: string;
  description: string;
  steps: Step[];
}

interface LearningPath {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  sections: StepSection[];
}

const WebDevIntegrate: React.FC = () => {
  const { theme } = useTheme();
  const [activeApp, setActiveApp] = useState('database');
  const [openTabs, setOpenTabs] = useState<Array<{id: string, title: string, content: React.ReactNode}>>([]);
  const [activeTab, setActiveTab] = useState('');
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [checklistCollapsed, setChecklistCollapsed] = useState(false);
  
  // Use the custom hook for user progress
  const { 
    completedSteps, 
    loading: progressLoading, 
    markStepComplete, 
    markStepIncomplete, 
    isStepCompleted 
  } = useUserProgress(activeApp);

  const miniApps = [
    { id: 'database', name: 'Database', icon: '🗄️' },
    { id: 'auth', name: 'Authentication', icon: '🔐' },
    { id: 'apis', name: 'APIs', icon: '🔌' },
    { id: 'storage', name: 'Storage', icon: '📦' },
    { id: 'payments', name: 'Payments', icon: '💳' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'ai', name: 'AI Services', icon: '🧠' }
  ];

  const learningPaths: { [key: string]: LearningPath } = {
    database: {
      id: 'database',
      title: 'Step-by-Step Database Integration',
      icon: <Database className="h-5 w-5" />,
      description: 'Master database setup and management',
      sections: [
        {
          id: 'foundation',
          title: '🏗️ Foundation',
          description: 'Database fundamentals and setup',
          steps: [
            {
              id: 'webdev-integrate-db-step-1',
              title: 'Choose Your Database',
              description: 'Understanding different database types and selection',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                        🗄️ Complete Database Selection Guide &amp; Architecture Planning
                      </h4>
                      <p className="mb-4">
                        Master database selection by understanding different database types, their use cases, performance characteristics, 
                        and how to choose the right database for your specific web development project. Learn to analyze requirements 
                        and make informed architectural decisions that will scale with your application.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">📊 Relational Databases (SQL)</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>PostgreSQL (Recommended):</strong> Advanced features, JSON support, excellent for web apps</div>
                            <div><strong>MySQL:</strong> Widely adopted, great ecosystem, good for traditional web apps</div>
                            <div><strong>SQLite:</strong> Serverless, perfect for development and small applications</div>
                            <div><strong>Best for:</strong> ACID compliance, complex relationships, financial data, reporting</div>
                            <div><strong>Use when:</strong> Data structure is well-defined, need strong consistency</div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">🌐 NoSQL Databases</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>MongoDB:</strong> Document-based, flexible schema, great for rapid development</div>
                            <div><strong>Firebase Firestore:</strong> Real-time, serverless, excellent for mobile/web apps</div>
                            <div><strong>DynamoDB:</strong> AWS-managed, serverless, ultra-fast for simple queries</div>
                            <div><strong>Best for:</strong> Flexible schema, horizontal scaling, real-time features</div>
                            <div><strong>Use when:</strong> Rapid prototyping, varying data structures, high scalability needs</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">🔧 Step-by-Step Database Selection Process</h5>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: Analyze Your Data Requirements (5 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Understand your data structure, relationships, and access patterns before choosing a database.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 text-xs">Data Structure Analysis:</div>
                                <div className="text-xs space-y-1">
                                  <div>• <strong>Structured Data:</strong> User profiles, orders, inventory → SQL</div>
                                  <div>• <strong>Semi-structured:</strong> Product catalogs, content → NoSQL</div>
                                  <div>• <strong>Unstructured:</strong> Logs, documents, media → NoSQL/Object Storage</div>
                                  <div>• <strong>Hierarchical:</strong> Comments, categories → Document DB</div>
                                  <div>• <strong>Graph Relations:</strong> Social networks, recommendations → Graph DB</div>
                                </div>
                              </div>
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Access Patterns:</div>
                                <div className="text-xs space-y-1">
                                  <div>• <strong>Complex Queries:</strong> Joins, aggregations → SQL</div>
                                  <div>• <strong>Simple Lookups:</strong> Key-value access → NoSQL</div>
                                  <div>• <strong>Real-time Updates:</strong> Live feeds → Firebase/Supabase</div>
                                  <div>• <strong>Heavy Reads:</strong> Caching layer + any DB</div>
                                  <div>• <strong>Heavy Writes:</strong> NoSQL with partitioning</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Evaluate Scalability Needs (5 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Consider your current and future scaling requirements to choose a database that grows with your application.</p>
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Scaling Considerations:</div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                  <div className="font-medium text-xs mb-1">Small Scale (MVP):</div>
                                  <div className="text-xs space-y-1">
                                    <div>• &lt;10k users</div>
                                    <div>• &lt;100GB data</div>
                                    <div>• SQLite, PostgreSQL</div>
                                    <div>• Single server setup</div>
                                    <div>• Focus on development speed</div>
                                  </div>
                                </div>
                                <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                  <div className="font-medium text-xs mb-1">Medium Scale:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• 10k-1M users</div>
                                    <div>• 100GB-10TB data</div>
                                    <div>• PostgreSQL, MongoDB</div>
                                    <div>• Read replicas</div>
                                    <div>• Caching layer</div>
                                  </div>
                                </div>
                                <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                  <div className="font-medium text-xs mb-1">Large Scale:</div>
                                  <div className="text-xs space-y-1">
                                    <div>• 1M+ users</div>
                                    <div>• 10TB+ data</div>
                                    <div>• Distributed systems</div>
                                    <div>• Horizontal partitioning</div>
                                    <div>• Multiple regions</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: Choose Your Database Technology (10 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Make the final decision based on your analysis and team expertise.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-purple-600 dark:text-purple-400 text-xs">Decision Matrix:</div>
                                <div className="text-xs space-y-1">
                                  <div>• <strong>Team Expertise:</strong> SQL vs NoSQL experience</div>
                                  <div>• <strong>Development Speed:</strong> Firebase &gt; Supabase &gt; Custom</div>
                                  <div>• <strong>Cost Efficiency:</strong> Self-hosted &gt; Managed services</div>
                                  <div>• <strong>Vendor Lock-in:</strong> Open source &gt; Proprietary</div>
                                  <div>• <strong>Ecosystem:</strong> Available tools, libraries, tutorials</div>
                                </div>
                              </div>
                              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-indigo-600 dark:text-indigo-400 text-xs">Recommended Combinations:</div>
                                <div className="text-xs space-y-1">
                                  <div>• <strong>Web App MVP:</strong> Supabase (PostgreSQL + Auth + Storage)</div>
                                  <div>• <strong>Mobile App:</strong> Firebase (Firestore + Real-time + Auth)</div>
                                  <div>• <strong>Enterprise:</strong> PostgreSQL + Redis + Elasticsearch</div>
                                  <div>• <strong>High Performance:</strong> PostgreSQL + TimescaleDB</div>
                                  <div>• <strong>Global Scale:</strong> DynamoDB + CloudFront + Lambda</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">📋 Database Selection Checklist</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Requirements Analysis ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Analyzed data structure and relationships</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Identified access patterns</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Estimated data volume and growth</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Defined consistency requirements</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Technology Evaluation ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Compared SQL vs NoSQL options</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Evaluated managed vs self-hosted</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Considered team expertise</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Reviewed ecosystem and tooling</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Final Decision ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Selected primary database</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Planned architecture diagram</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Documented decision rationale</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Set up development environment</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Real-World Example: E-commerce Platform Database Selection</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Building an e-commerce platform that needs to handle product catalogs, user accounts, orders, 
                            inventory tracking, and real-time analytics. Expected to serve 50k users initially with 
                            potential to scale to 1M+ users globally.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Database Architecture Solution:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Primary Database:</strong> PostgreSQL for orders, users, inventory (ACID compliance needed)</div>
                            <div>• <strong>Product Catalog:</strong> Elasticsearch for search and filtering capabilities</div>
                            <div>• <strong>Session Data:</strong> Redis for fast session management and caching</div>
                            <div>• <strong>Analytics:</strong> ClickHouse for real-time analytics and reporting</div>
                            <div>• <strong>Media Storage:</strong> AWS S3 with CloudFront CDN for product images</div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Performance:</strong> 99.9% uptime with &lt;200ms average response time</div>
                            <div>• <strong>Scalability:</strong> Successfully scaled from 50k to 500k users without architecture changes</div>
                            <div>• <strong>Cost Efficiency:</strong> 40% lower infrastructure costs compared to single-database approach</div>
                            <div>• <strong>Development Speed:</strong> 60% faster feature development with specialized databases</div>
                            <div>• <strong>Search Performance:</strong> Sub-100ms product search across 1M+ products</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-db-step-2',
              title: 'Set Up Supabase',
              description: 'Configure your PostgreSQL database with Supabase',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                        🚀 Complete Supabase Setup &amp; Configuration Guide
                      </h4>
                      <p className="mb-4">
                        Master the complete setup of Supabase as your backend-as-a-service solution. Learn to configure 
                        PostgreSQL database, set up authentication, enable real-time features, and integrate everything 
                        seamlessly into your web application with proper security and optimization.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">🌟 Supabase Features</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>PostgreSQL Database:</strong> Full-featured SQL database with JSON support</div>
                            <div><strong>Authentication:</strong> Built-in user management with social logins</div>
                            <div><strong>Real-time:</strong> Live updates via WebSocket subscriptions</div>
                            <div><strong>Storage:</strong> File upload and management with CDN</div>
                            <div><strong>Edge Functions:</strong> Serverless functions for custom logic</div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">✅ Why Choose Supabase</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Open Source:</strong> No vendor lock-in, can self-host if needed</div>
                            <div><strong>Developer Experience:</strong> Auto-generated APIs and TypeScript support</div>
                            <div><strong>Rapid Development:</strong> Backend ready in minutes, not days</div>
                            <div><strong>Scalable:</strong> Grows from prototype to production seamlessly</div>
                            <div><strong>Cost Effective:</strong> Generous free tier, pay-as-you-scale pricing</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">🔧 Step-by-Step Supabase Implementation</h5>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: Create Supabase Project (5 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Set up your Supabase project and configure initial settings for optimal performance.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 text-xs">Project Setup:</div>
                                <div className="text-xs space-y-1">
                                  <div>1. Go to <strong>supabase.com</strong> and create account</div>
                                  <div>2. Click <strong>"New Project"</strong> in dashboard</div>
                                  <div>3. Choose organization and project name</div>
                                  <div>4. Set strong database password (save securely!)</div>
                                  <div>5. Select region closest to your users</div>
                                </div>
                              </div>
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Configuration Best Practices:</div>
                                <div className="text-xs space-y-1">
                                  <div>• <strong>Project Name:</strong> Use descriptive, environment-specific names</div>
                                  <div>• <strong>Password:</strong> 16+ characters with mixed case, numbers, symbols</div>
                                  <div>• <strong>Region:</strong> Choose based on user geography for low latency</div>
                                  <div>• <strong>Organization:</strong> Separate projects by team/environment</div>
                                  <div>• <strong>Backup:</strong> Note all credentials immediately</div>
                                </div>
                              </div>
                            </div>
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                              <div className="text-xs">
                                <strong>⚠️ Important:</strong> Save your project URL and anon key immediately - you'll need them for your application configuration.
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Install Supabase Client (8 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Install and configure the Supabase JavaScript client in your web application.</p>
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Installation Steps:</div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                  <div className="font-medium text-xs mb-1">1. Install Package:</div>
                                  <div className="text-xs space-y-1">
                                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                      {`npm install @supabase/supabase-js`}
                                    </div>
                                    <div>or with yarn:</div>
                                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                      {`yarn add @supabase/supabase-js`}
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                  <div className="font-medium text-xs mb-1">2. Environment Setup:</div>
                                  <div className="text-xs space-y-1">
                                    <div>Create <code>.env.local</code> file:</div>
                                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono text-xs">
                                      {`NEXT_PUBLIC_SUPABASE_URL=your-url`}<br/>
                                      {`NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key`}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                              <div className="text-xs">
                                <strong>💡 Pro Tip:</strong> Use TypeScript for better development experience. Supabase auto-generates types for your database schema.
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: Initialize Supabase Client (7 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Create and configure the Supabase client with proper error handling and TypeScript support.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-purple-600 dark:text-purple-400 text-xs">Basic Client Setup:</div>
                                <div className="text-xs space-y-1">
                                  <div>Create <code>lib/supabase.ts</code>:</div>
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono text-xs">
                                    {`import { createClient } from '@supabase/supabase-js'`}<br/>
                                    <br/>
                                    {`const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!`}<br/>
                                    {`const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!`}<br/>
                                    <br/>
                                    {`export const supabase = createClient(supabaseUrl, supabaseKey)`}
                                  </div>
                                </div>
                              </div>
                              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-indigo-600 dark:text-indigo-400 text-xs">Advanced Configuration:</div>
                                <div className="text-xs space-y-1">
                                  <div>Enhanced client with options:</div>
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono text-xs">
                                    {`export const supabase = createClient(`}<br/>
                                    {`  supabaseUrl,`}<br/>
                                    {`  supabaseKey,`}<br/>
                                    {`  {`}<br/>
                                    {`    auth: {`}<br/>
                                    {`      persistSession: true,`}<br/>
                                    {`      autoRefreshToken: true`}<br/>
                                    {`    }`}<br/>
                                    {`  }`}<br/>
                                    {`)`}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Step 4: Test Connection &amp; Basic Operations (5 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Verify your Supabase setup with a simple test and explore the database interface.</p>
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-orange-600 dark:text-orange-400 text-xs">Connection Test:</div>
                              <div className="text-xs space-y-1">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                  {`// Test basic connection`}<br/>
                                  {`const { data, error } = await supabase`}<br/>
                                  {`  .from('test')`}<br/>
                                  {`  .select('*')`}<br/>
                                  <br/>
                                  {`console.log('Supabase connected:', !error)`}
                                </div>
                                <div>• Check Supabase dashboard for real-time logs</div>
                                <div>• Explore the Table Editor and SQL Editor</div>
                                <div>• Review API documentation auto-generated from your schema</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">📋 Supabase Setup Checklist</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Project Setup ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Created Supabase account and project</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Configured strong database password</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Selected optimal region</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Saved project credentials securely</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Client Configuration ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Installed Supabase JavaScript client</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Set up environment variables</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Created Supabase client instance</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Configured client options</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Verification ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Tested database connection</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Explored Supabase dashboard</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Reviewed API documentation</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Set up development workflow</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Real-World Example: SaaS Application Supabase Setup</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Building a project management SaaS that needs user authentication, real-time collaboration, 
                            file storage, and a robust database. Team wants to focus on frontend development while having 
                            a production-ready backend with minimal setup and maintenance overhead.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Supabase Implementation:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Database:</strong> PostgreSQL with Row Level Security for multi-tenant data isolation</div>
                            <div>• <strong>Authentication:</strong> Email/password + Google OAuth with team invitations</div>
                            <div>• <strong>Real-time:</strong> Live project updates, comments, and status changes</div>
                            <div>• <strong>Storage:</strong> Secure file uploads with automatic image optimization</div>
                            <div>• <strong>API:</strong> Auto-generated REST and GraphQL APIs with TypeScript types</div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Development Speed:</strong> 80% faster backend development compared to custom solution</div>
                            <div>• <strong>Time to Market:</strong> Launched MVP in 6 weeks instead of planned 16 weeks</div>
                            <div>• <strong>Infrastructure Costs:</strong> 70% lower than equivalent AWS setup for first year</div>
                            <div>• <strong>Real-time Features:</strong> Live collaboration working out-of-the-box</div>
                            <div>• <strong>Security:</strong> Enterprise-grade security with minimal configuration</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          ]
            },
        {
          id: 'configuration',
          title: '⚙️ Configuration',
          description: 'Database setup and optimization',
          steps: [
            {
              id: 'webdev-integrate-db-step-3',
              title: 'Design Your Schema',
              description: 'Create efficient database schemas',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        📊 Complete Database Schema Design &amp; Modeling Guide
                      </h4>
                      <p className="mb-4">
                        Master the art of database schema design by learning to create efficient, scalable, and maintainable 
                        database structures. Understand normalization, denormalization strategies, and how to design schemas 
                        that perform well at scale while maintaining data integrity and consistency.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">🎯 Schema Design Principles</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Normalization:</strong> Eliminate data redundancy and update anomalies</div>
                            <div><strong>Performance:</strong> Design for your query patterns and access needs</div>
                            <div><strong>Scalability:</strong> Plan for growth in data volume and complexity</div>
                            <div><strong>Maintainability:</strong> Keep structure clear and evolution-friendly</div>
                            <div><strong>Integrity:</strong> Enforce business rules at the database level</div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">🔄 Design Process</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Requirements Analysis:</strong> Understand business needs and data flows</div>
                            <div><strong>Conceptual Model:</strong> Create entity-relationship diagrams</div>
                            <div><strong>Logical Design:</strong> Normalize and define table structures</div>
                            <div><strong>Physical Design:</strong> Optimize for performance and storage</div>
                            <div><strong>Validation:</strong> Test with real data and query patterns</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">🔧 Step-by-Step Schema Design Process</h5>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: Business Requirements Analysis (10 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Analyze business requirements to identify entities, attributes, and relationships that your database needs to support.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 text-xs">Entity Identification:</div>
                                <div className="text-xs space-y-1">
                                  <div>• <strong>Nouns in Requirements:</strong> Users, Products, Orders, Categories</div>
                                  <div>• <strong>Business Objects:</strong> What does your business manage?</div>
                                  <div>• <strong>Data Sources:</strong> External systems, user inputs, calculations</div>
                                  <div>• <strong>Reporting Needs:</strong> What reports will you generate?</div>
                                  <div>• <strong>Workflows:</strong> How does data flow through your system?</div>
                                </div>
                              </div>
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Attribute Definition:</div>
                                <div className="text-xs space-y-1">
                                  <div>• <strong>Required Fields:</strong> What data is essential vs optional?</div>
                                  <div>• <strong>Data Types:</strong> Text, numbers, dates, booleans, JSON</div>
                                  <div>• <strong>Constraints:</strong> Unique values, ranges, patterns</div>
                                  <div>• <strong>Computed Fields:</strong> Values calculated from other data</div>
                                  <div>• <strong>Metadata:</strong> Created dates, updated timestamps, versions</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Entity-Relationship Modeling (8 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Create ERD diagrams to visualize relationships and identify the optimal database structure.</p>
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Relationship Types:</div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                  <div className="font-medium text-xs mb-1">One-to-One (1:1):</div>
                                  <div className="text-xs space-y-1">
                                    <div>• User → Profile</div>
                                    <div>• Order → Invoice</div>
                                    <div>• Product → Detail</div>
                                    <div>Use: Extension tables, sensitive data separation</div>
                                  </div>
                                </div>
                                <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                  <div className="font-medium text-xs mb-1">One-to-Many (1:N):</div>
                                  <div className="text-xs space-y-1">
                                    <div>• User → Orders</div>
                                    <div>• Category → Products</div>
                                    <div>• Post → Comments</div>
                                    <div>Use: Most common, hierarchical data</div>
                                  </div>
                                </div>
                                <div className="bg-white dark:bg-gray-600 p-2 rounded">
                                  <div className="font-medium text-xs mb-1">Many-to-Many (M:N):</div>
                                  <div className="text-xs space-y-1">
                                    <div>• Users ↔ Roles</div>
                                    <div>• Products ↔ Tags</div>
                                    <div>• Students ↔ Courses</div>
                                    <div>Use: Junction tables required</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: Normalization Strategy (7 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Apply normalization rules to eliminate redundancy while maintaining performance for your specific use case.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-purple-600 dark:text-purple-400 text-xs">Normalization Levels:</div>
                                <div className="text-xs space-y-1">
                                  <div>• <strong>1NF:</strong> Atomic values, no repeating groups</div>
                                  <div>• <strong>2NF:</strong> Remove partial dependencies</div>
                                  <div>• <strong>3NF:</strong> Remove transitive dependencies</div>
                                  <div>• <strong>BCNF:</strong> Every determinant is a candidate key</div>
                                  <div>• <strong>Practical:</strong> Usually 3NF is sufficient for most applications</div>
                                </div>
                              </div>
                              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-orange-600 dark:text-orange-400 text-xs">When to Denormalize:</div>
                                <div className="text-xs space-y-1">
                                  <div>• <strong>Read-Heavy Workloads:</strong> Optimize for query performance</div>
                                  <div>• <strong>Reporting:</strong> Aggregate tables for analytics</div>
                                  <div>• <strong>Calculated Fields:</strong> Store computed values</div>
                                  <div>• <strong>Caching:</strong> Frequently accessed derived data</div>
                                  <div>• <strong>Performance:</strong> Eliminate expensive joins</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Step 4: Table Design &amp; Implementation (5 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Create actual table definitions with proper data types, constraints, and naming conventions.</p>
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-orange-600 dark:text-orange-400 text-xs">Table Creation Example:</div>
                              <div className="text-xs space-y-1">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                  {`-- Users table with comprehensive design`}<br/>
                                  {`CREATE TABLE users (`}<br/>
                                  {`  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`}<br/>
                                  {`  email VARCHAR(255) UNIQUE NOT NULL,`}<br/>
                                  {`  username VARCHAR(50) UNIQUE NOT NULL,`}<br/>
                                  {`  full_name VARCHAR(100) NOT NULL,`}<br/>
                                  {`  avatar_url TEXT,`}<br/>
                                  {`  is_active BOOLEAN DEFAULT true,`}<br/>
                                  {`  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),`}<br/>
                                  {`  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`}<br/>
                                  {`);`}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">📋 Schema Design Checklist</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Requirements Analysis ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Identified all business entities</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Defined entity attributes</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Mapped business rules</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Analyzed query patterns</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Schema Design ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Created ERD diagrams</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Applied normalization rules</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Defined primary and foreign keys</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Set up proper constraints</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Implementation ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Created table definitions</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Applied naming conventions</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Added sample data for testing</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Validated schema with queries</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Real-World Example: E-Learning Platform Schema Design</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Design a database schema for an e-learning platform that supports users, courses, lessons, 
                            quizzes, progress tracking, and subscription management. Need to handle millions of users 
                            and thousands of courses with complex progress tracking and analytics requirements.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Schema Design Solution:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Core Entities:</strong> users, courses, lessons, quizzes, subscriptions</div>
                            <div>• <strong>Junction Tables:</strong> user_courses, lesson_completions, quiz_attempts</div>
                            <div>• <strong>Denormalized Views:</strong> user_progress, course_stats for reporting</div>
                            <div>• <strong>Partitioning:</strong> User activity tables by date for performance</div>
                            <div>• <strong>Indexing Strategy:</strong> Composite indexes on user_id + course_id queries</div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Scalability:</strong> Supports 5M+ users with sub-200ms query performance</div>
                            <div>• <strong>Data Integrity:</strong> Zero data inconsistency issues in production</div>
                            <div>• <strong>Flexibility:</strong> Easy to add new content types and tracking metrics</div>
                            <div>• <strong>Analytics:</strong> Real-time dashboards with complex progress calculations</div>
                            <div>• <strong>Maintenance:</strong> 90% reduction in schema change complexity</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-db-step-4',
              title: 'Set Up Relationships',
              description: 'Configure table relationships and constraints',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                        🔗 Complete Database Relationships &amp; Constraints Guide
                      </h4>
                      <p className="mb-4">
                        Master database relationships and constraints to ensure data integrity, optimize query performance, 
                        and create robust database architectures. Learn to implement foreign keys, junction tables, 
                        cascading operations, and advanced constraint strategies that scale with your application.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">🎯 Relationship Types</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>One-to-One:</strong> User profiles, sensitive data separation</div>
                            <div><strong>One-to-Many:</strong> Categories to products, users to orders</div>
                            <div><strong>Many-to-Many:</strong> Users to roles, products to tags</div>
                            <div><strong>Self-Referencing:</strong> Employee hierarchy, comment threads</div>
                            <div><strong>Polymorphic:</strong> Comments on multiple entity types</div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">🛡️ Constraint Types</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Primary Key:</strong> Unique row identification</div>
                            <div><strong>Foreign Key:</strong> Referential integrity between tables</div>
                            <div><strong>Unique:</strong> Prevent duplicate values</div>
                            <div><strong>Check:</strong> Validate data against business rules</div>
                            <div><strong>Not Null:</strong> Ensure required data presence</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">🔧 Step-by-Step Relationship Implementation</h5>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: Define Primary &amp; Foreign Keys (8 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Establish the foundation of relationships with properly designed primary and foreign keys.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 text-xs">Primary Key Design:</div>
                                <div className="text-xs space-y-1">
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                    {`-- UUID Primary Key (Recommended)`}<br/>
                                    {`CREATE TABLE users (`}<br/>
                                    {`  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`}<br/>
                                    {`  email VARCHAR(255) UNIQUE NOT NULL,`}<br/>
                                    {`  created_at TIMESTAMP DEFAULT NOW()`}<br/>
                                    {`);`}
                                  </div>
                                  <div>• <strong>UUIDs:</strong> Better for distributed systems</div>
                                  <div>• <strong>Auto-increment:</strong> Simple, sequential numbering</div>
                                </div>
                              </div>
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Foreign Key Implementation:</div>
                                <div className="text-xs space-y-1">
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                    {`-- Orders table with foreign key`}<br/>
                                    {`CREATE TABLE orders (`}<br/>
                                    {`  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`}<br/>
                                    {`  user_id UUID REFERENCES users(id),`}<br/>
                                    {`  total DECIMAL(10,2) NOT NULL,`}<br/>
                                    {`  created_at TIMESTAMP DEFAULT NOW()`}<br/>
                                    {`);`}
                                  </div>
                                  <div>• <strong>REFERENCES:</strong> Creates foreign key constraint</div>
                                  <div>• <strong>Data Type Match:</strong> Must match referenced column</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Implement Many-to-Many Relationships (7 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Create junction tables to handle complex many-to-many relationships efficiently.</p>
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Junction Table Pattern:</div>
                              <div className="text-xs space-y-1">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                  {`-- User roles many-to-many relationship`}<br/>
                                  {`CREATE TABLE roles (`}<br/>
                                  {`  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`}<br/>
                                  {`  name VARCHAR(50) UNIQUE NOT NULL,`}<br/>
                                  {`  permissions JSONB`}<br/>
                                  {`);`}<br/><br/>
                                  {`CREATE TABLE user_roles (`}<br/>
                                  {`  user_id UUID REFERENCES users(id) ON DELETE CASCADE,`}<br/>
                                  {`  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,`}<br/>
                                  {`  assigned_at TIMESTAMP DEFAULT NOW(),`}<br/>
                                  {`  assigned_by UUID REFERENCES users(id),`}<br/>
                                  {`  PRIMARY KEY (user_id, role_id)`}<br/>
                                  {`);`}
                                </div>
                                <div>• <strong>Composite Primary Key:</strong> Prevents duplicate assignments</div>
                                <div>• <strong>Cascade Delete:</strong> Maintains data integrity</div>
                                <div>• <strong>Additional Fields:</strong> When/who assigned the role</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: Configure Cascading Operations (5 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Set up automatic operations when parent records are updated or deleted.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-purple-600 dark:text-purple-400 text-xs">Cascade Options:</div>
                                <div className="text-xs space-y-1">
                                  <div>• <strong>CASCADE:</strong> Delete/update child records automatically</div>
                                  <div>• <strong>RESTRICT:</strong> Prevent parent deletion if children exist</div>
                                  <div>• <strong>SET NULL:</strong> Set foreign key to NULL when parent deleted</div>
                                  <div>• <strong>SET DEFAULT:</strong> Use default value when parent deleted</div>
                                  <div>• <strong>NO ACTION:</strong> Check constraint at end of transaction</div>
                                </div>
                              </div>
                              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-orange-600 dark:text-orange-400 text-xs">Example Implementation:</div>
                                <div className="text-xs space-y-1">
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                    {`-- Order items with cascading`}<br/>
                                    {`CREATE TABLE order_items (`}<br/>
                                    {`  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`}<br/>
                                    {`  order_id UUID REFERENCES orders(id)`}<br/>
                                    {`    ON DELETE CASCADE ON UPDATE CASCADE,`}<br/>
                                    {`  product_id UUID REFERENCES products(id)`}<br/>
                                    {`    ON DELETE RESTRICT,`}<br/>
                                    {`  quantity INTEGER NOT NULL CHECK (quantity > 0),`}<br/>
                                    {`  price DECIMAL(10,2) NOT NULL`}<br/>
                                    {`);`}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Step 4: Add Business Logic Constraints (5 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Implement check constraints and triggers to enforce business rules at the database level.</p>
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-orange-600 dark:text-orange-400 text-xs">Business Rule Examples:</div>
                              <div className="text-xs space-y-1">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                  {`-- User table with business constraints`}<br/>
                                  {`CREATE TABLE users (`}<br/>
                                  {`  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`}<br/>
                                  {`  email VARCHAR(255) UNIQUE NOT NULL`}<br/>
                                  {`    CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),`}<br/>
                                  {`  age INTEGER CHECK (age >= 13 AND age <= 120),`}<br/>
                                  {`  status VARCHAR(20) DEFAULT 'active'`}<br/>
                                  {`    CHECK (status IN ('active', 'inactive', 'suspended')),`}<br/>
                                  {`  created_at TIMESTAMP DEFAULT NOW(),`}<br/>
                                  {`  updated_at TIMESTAMP DEFAULT NOW()`}<br/>
                                  {`);`}
                                </div>
                                <div>• <strong>Email Validation:</strong> Regex pattern for valid emails</div>
                                <div>• <strong>Age Limits:</strong> Business rule for minimum age</div>
                                <div>• <strong>Status Enum:</strong> Limited set of valid values</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">📋 Relationships Implementation Checklist</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Key Design ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Defined all primary keys</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Implemented foreign key constraints</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Created junction tables for M:N</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Validated data type consistency</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Constraints ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Configured cascade operations</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Added check constraints</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Set up unique constraints</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Implemented not null constraints</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Validation ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Tested referential integrity</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Verified cascade behavior</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Validated business rules</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Documented relationship patterns</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Real-World Example: Social Media Platform Relationships</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Design relationships for a social media platform with users, posts, comments, likes, followers, 
                            and groups. Need to handle complex relationships like hierarchical comments, polymorphic likes 
                            (on posts and comments), and bidirectional friendships while maintaining performance.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Relationship Architecture:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>User Following:</strong> Self-referencing M:N with user_followers junction table</div>
                            <div>• <strong>Hierarchical Comments:</strong> Self-referencing with parent_id for thread structure</div>
                            <div>• <strong>Polymorphic Likes:</strong> Generic likes table with likeable_type and likeable_id</div>
                            <div>• <strong>Group Membership:</strong> M:N with roles (admin, member, moderator)</div>
                            <div>• <strong>Cascade Policies:</strong> Soft delete users, hard delete for content moderation</div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Data Integrity:</strong> Zero orphaned records with proper foreign key constraints</div>
                            <div>• <strong>Query Performance:</strong> Optimized joins with composite indexes on junction tables</div>
                            <div>• <strong>Scalability:</strong> Supports 10M+ users with complex social graph queries</div>
                            <div>• <strong>Flexibility:</strong> Easy to add new likeable types without schema changes</div>
                            <div>• <strong>Maintenance:</strong> 95% reduction in data inconsistency issues</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'deployment',
          title: '🚀 Deployment',
          description: 'Production setup and optimization',
          steps: [
            {
              id: 'webdev-integrate-db-step-5',
              title: 'Optimize Performance',
              description: 'Database indexing and query optimization',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400">
                        ⚡ Complete Database Performance Optimization Guide
                      </h4>
                      <p className="mb-4">
                        Master database performance optimization through indexing strategies, query optimization, 
                        connection pooling, and caching techniques. Learn to identify bottlenecks, optimize slow queries, 
                        and scale your database for high-performance applications.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-red-700 dark:text-red-300">🎯 Optimization Areas</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Indexing:</strong> Speed up data retrieval with strategic indexes</div>
                            <div><strong>Query Optimization:</strong> Write efficient SQL and analyze execution plans</div>
                            <div><strong>Connection Pooling:</strong> Manage database connections efficiently</div>
                            <div><strong>Caching:</strong> Reduce database load with intelligent caching</div>
                            <div><strong>Partitioning:</strong> Split large tables for better performance</div>
                          </div>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">📊 Performance Metrics</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Response Time:</strong> Query execution duration</div>
                            <div><strong>Throughput:</strong> Queries per second capacity</div>
                            <div><strong>Resource Usage:</strong> CPU, memory, and I/O utilization</div>
                            <div><strong>Connection Count:</strong> Active database connections</div>
                            <div><strong>Cache Hit Ratio:</strong> Effectiveness of caching strategies</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-red-700 dark:text-red-300">🔧 Step-by-Step Performance Optimization</h5>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: Database Indexing Strategy (15 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Create strategic indexes to dramatically improve query performance and reduce database load.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 text-xs">Index Types &amp; Implementation:</div>
                                <div className="text-xs space-y-1">
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                    {`-- Primary index (automatic)`}<br/>
                                    {`CREATE TABLE users (`}<br/>
                                    {`  id UUID PRIMARY KEY,`}<br/>
                                    {`  email VARCHAR(255) UNIQUE, -- Unique index`}<br/>
                                    {`  created_at TIMESTAMP`}<br/>
                                    {`);`}<br/><br/>
                                    {`-- Composite index for common queries`}<br/>
                                    {`CREATE INDEX idx_user_email_status `}<br/>
                                    {`ON users(email, status) WHERE status = 'active';`}<br/><br/>
                                    {`-- Partial index for large tables`}<br/>
                                    {`CREATE INDEX idx_orders_recent `}<br/>
                                    {`ON orders(created_at) WHERE created_at > NOW() - INTERVAL '30 days';`}
                                  </div>
                                </div>
                              </div>
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Index Best Practices:</div>
                                <div className="text-xs space-y-1">
                                  <div>• <strong>Query-Based:</strong> Index columns used in WHERE, JOIN, ORDER BY</div>
                                  <div>• <strong>Composite Order:</strong> Most selective column first</div>
                                  <div>• <strong>Partial Indexes:</strong> For filtered queries on large tables</div>
                                  <div>• <strong>Unique Indexes:</strong> Enforce constraints and improve lookups</div>
                                  <div>• <strong>Monitor Usage:</strong> Drop unused indexes to save space</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Query Optimization Techniques (10 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Optimize SQL queries using EXPLAIN plans, efficient joins, and proper query structure.</p>
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Query Optimization Examples:</div>
                              <div className="text-xs space-y-1">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                  {`-- Use EXPLAIN to analyze query performance`}<br/>
                                  {`EXPLAIN (ANALYZE, BUFFERS) `}<br/>
                                  {`SELECT u.email, COUNT(o.id) as order_count`}<br/>
                                  {`FROM users u`}<br/>
                                  {`LEFT JOIN orders o ON u.id = o.user_id`}<br/>
                                  {`WHERE u.created_at > NOW() - INTERVAL '30 days'`}<br/>
                                  {`GROUP BY u.id, u.email`}<br/>
                                  {`ORDER BY order_count DESC`}<br/>
                                  {`LIMIT 100;`}<br/><br/>
                                  {`-- Optimize with proper indexing and filtering`}<br/>
                                  {`-- Index: CREATE INDEX idx_users_created ON users(created_at);`}<br/>
                                  {`-- Index: CREATE INDEX idx_orders_user_id ON orders(user_id);`}
                                </div>
                                <div>• <strong>Use LIMIT:</strong> Restrict result sets for pagination</div>
                                <div>• <strong>Filter Early:</strong> Apply WHERE clauses before JOINs when possible</div>
                                <div>• <strong>Avoid SELECT *:</strong> Only select needed columns</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: Connection Pooling Setup (8 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Implement connection pooling to efficiently manage database connections and prevent connection exhaustion.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-purple-600 dark:text-purple-400 text-xs">Supabase Connection Pooling:</div>
                                <div className="text-xs space-y-1">
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                    {`// Configure Supabase client with pooling`}<br/>
                                    {`import { createClient } from '@supabase/supabase-js'`}<br/><br/>
                                    {`const supabase = createClient(`}<br/>
                                    {`  process.env.SUPABASE_URL!,`}<br/>
                                    {`  process.env.SUPABASE_ANON_KEY!,`}<br/>
                                    {`  {`}<br/>
                                    {`    db: {`}<br/>
                                    {`      schema: 'public'`}<br/>
                                    {`    },`}<br/>
                                    {`    global: {`}<br/>
                                    {`      headers: { 'x-my-custom-header': 'my-app-name' },`}<br/>
                                    {`    }`}<br/>
                                    {`  }`}<br/>
                                    {`)`}
                                  </div>
                                </div>
                              </div>
                              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-indigo-600 dark:text-indigo-400 text-xs">Pool Configuration Guidelines:</div>
                                <div className="text-xs space-y-1">
                                  <div>• <strong>Pool Size:</strong> 10-20 connections for most apps</div>
                                  <div>• <strong>Max Connections:</strong> Monitor and set appropriate limits</div>
                                  <div>• <strong>Idle Timeout:</strong> Close unused connections automatically</div>
                                  <div>• <strong>Connection Validation:</strong> Test connections before use</div>
                                  <div>• <strong>Retry Logic:</strong> Handle connection failures gracefully</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Step 4: Caching Implementation (7 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Implement multi-level caching to reduce database load and improve response times.</p>
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-orange-600 dark:text-orange-400 text-xs">Caching Strategy Implementation:</div>
                              <div className="text-xs space-y-1">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                  {`// React Query for client-side caching`}<br/>
                                  {`import { useQuery } from '@tanstack/react-query'`}<br/><br/>
                                  {`function UserProfile({ userId }) {`}<br/>
                                  {`  const { data: user, isLoading } = useQuery({`}<br/>
                                  {`    queryKey: ['user', userId],`}<br/>
                                  {`    queryFn: () => supabase`}<br/>
                                  {`      .from('users')`}<br/>
                                  {`      .select('*')`}<br/>
                                  {`      .eq('id', userId)`}<br/>
                                  {`      .single(),`}<br/>
                                  {`    staleTime: 5 * 60 * 1000, // 5 minutes`}<br/>
                                  {`    cacheTime: 10 * 60 * 1000, // 10 minutes`}<br/>
                                  {`  })`}<br/>
                                  {`}`}
                                </div>
                                <div>• <strong>Application Level:</strong> React Query, SWR for API caching</div>
                                <div>• <strong>Database Level:</strong> PostgreSQL shared_buffers tuning</div>
                                <div>• <strong>CDN Caching:</strong> Static assets and API responses</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">📋 Performance Optimization Checklist</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Database Optimization ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Created indexes for common queries</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Analyzed slow queries with EXPLAIN</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Optimized JOIN operations</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Configured connection pooling</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Caching Strategy ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Implemented client-side caching</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Set up database query caching</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Configured CDN for static assets</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Implemented cache invalidation</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Monitoring ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Set up performance monitoring</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Created performance benchmarks</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Established alerting for slow queries</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Documented optimization strategies</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Real-World Example: High-Traffic News Platform Optimization</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            News platform experiencing slow page loads during traffic spikes (50k+ concurrent users), 
                            with complex queries for personalized content, real-time comments, and analytics. 
                            Database queries taking 2-5 seconds, causing timeouts and poor user experience.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Performance Optimization Strategy:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Strategic Indexing:</strong> Composite indexes on (category_id, published_at, status)</div>
                            <div>• <strong>Query Optimization:</strong> Rewrote N+1 queries, added pagination with cursor-based approach</div>
                            <div>• <strong>Connection Pooling:</strong> PgBouncer with 200 max connections, transaction pooling</div>
                            <div>• <strong>Multi-Level Caching:</strong> Redis for hot articles, CDN for static content, React Query for client</div>
                            <div>• <strong>Read Replicas:</strong> Separated read traffic to dedicated replicas for analytics</div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Response Time:</strong> Reduced from 2-5s to 50-200ms (95% improvement)</div>
                            <div>• <strong>Throughput:</strong> Increased from 1k to 15k requests/second</div>
                            <div>• <strong>Database Load:</strong> Reduced CPU usage by 80% during peak traffic</div>
                            <div>• <strong>Cache Hit Ratio:</strong> Achieved 92% cache hit rate for article content</div>
                            <div>• <strong>User Experience:</strong> Page bounce rate decreased by 65%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-db-step-6',
              title: 'Backup & Security',
              description: 'Implement backup strategies and security measures',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                        🛡️ Complete Database Backup &amp; Security Implementation Guide
                      </h4>
                      <p className="mb-4">
                        Master enterprise-grade database backup strategies and security measures to protect your data 
                        from loss, breaches, and unauthorized access. Learn to implement automated backup systems, 
                        advanced security controls, and compliance frameworks that scale with your business needs.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">💾 Backup Architecture</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Automated Backups:</strong> Scheduled daily/hourly snapshots</div>
                            <div><strong>Point-in-Time Recovery:</strong> Restore to any specific moment</div>
                            <div><strong>Cross-Region Replication:</strong> Geographic redundancy</div>
                            <div><strong>Incremental Backups:</strong> Efficient storage utilization</div>
                            <div><strong>Backup Testing:</strong> Regular recovery validation</div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">🔒 Security Framework</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Row Level Security:</strong> Fine-grained access control</div>
                            <div><strong>Encryption:</strong> Data protection at rest and in transit</div>
                            <div><strong>Authentication:</strong> Multi-factor and SSO integration</div>
                            <div><strong>Authorization:</strong> Role-based permission systems</div>
                            <div><strong>Audit Trails:</strong> Comprehensive activity logging</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">🔧 Step-by-Step Backup &amp; Security Implementation</h5>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: Configure Automated Backup System (12 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Set up comprehensive automated backup strategies with multiple recovery points and geographic redundancy.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 text-xs">Supabase Backup Configuration:</div>
                                <div className="text-xs space-y-1">
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                    {`-- Enable Point-in-Time Recovery`}<br/>
                                    {`-- Go to Supabase Dashboard > Settings > Database`}<br/>
                                    {`-- Enable "Point in time recovery"`}<br/>
                                    {`-- Set retention period: 7-30 days`}<br/><br/>
                                    {`-- Create manual backup script`}<br/>
                                    {`pg_dump -h your-host -U postgres -d your-db \\`}<br/>
                                    {`  --verbose --clean --no-owner --no-acl \\`}<br/>
                                    {`  --format=custom -f backup_$(date +%Y%m%d_%H%M%S).dump`}
                                  </div>
                                  <div>• <strong>Frequency:</strong> Daily automated + manual before changes</div>
                                  <div>• <strong>Retention:</strong> 30 days for production databases</div>
                                </div>
                              </div>
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Backup Validation &amp; Testing:</div>
                                <div className="text-xs space-y-1">
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                    {`// Automated backup testing script`}<br/>
                                    {`const testBackup = async () => {`}<br/>
                                    {`  // 1. Create test database`}<br/>
                                    {`  const testDb = await createTestDatabase()`}<br/>
                                    {`  `}<br/>
                                    {`  // 2. Restore from backup`}<br/>
                                    {`  await restoreFromBackup(testDb, latestBackup)`}<br/>
                                    {`  `}<br/>
                                    {`  // 3. Validate data integrity`}<br/>
                                    {`  const isValid = await validateDataIntegrity(testDb)`}<br/>
                                    {`  `}<br/>
                                    {`  // 4. Report results`}<br/>
                                    {`  await sendBackupReport(isValid)`}<br/>
                                    {`}`}
                                  </div>
                                  <div>• <strong>Weekly Testing:</strong> Restore to staging environment</div>
                                  <div>• <strong>Integrity Checks:</strong> Automated data validation</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Implement Row Level Security (10 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Configure fine-grained access control to ensure users can only access data they're authorized to see.</p>
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">RLS Policy Implementation:</div>
                              <div className="text-xs space-y-1">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                  {`-- Enable RLS on tables`}<br/>
                                  {`ALTER TABLE users ENABLE ROW LEVEL SECURITY;`}<br/>
                                  {`ALTER TABLE orders ENABLE ROW LEVEL SECURITY;`}<br/>
                                  {`ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;`}<br/><br/>
                                  {`-- Users can only see their own data`}<br/>
                                  {`CREATE POLICY "Users can view own profile" ON user_profiles`}<br/>
                                  {`  FOR SELECT USING (auth.uid() = user_id);`}<br/><br/>
                                  {`-- Users can only update their own data`}<br/>
                                  {`CREATE POLICY "Users can update own profile" ON user_profiles`}<br/>
                                  {`  FOR UPDATE USING (auth.uid() = user_id);`}<br/><br/>
                                  {`-- Admin role can see all data`}<br/>
                                  {`CREATE POLICY "Admins can see all profiles" ON user_profiles`}<br/>
                                  {`  FOR ALL USING (`}<br/>
                                  {`    EXISTS (`}<br/>
                                  {`      SELECT 1 FROM user_roles ur`}<br/>
                                  {`      JOIN roles r ON ur.role_id = r.id`}<br/>
                                  {`      WHERE ur.user_id = auth.uid()`}<br/>
                                  {`      AND r.name = 'admin'`}<br/>
                                  {`    )`}<br/>
                                  {`  );`}
                                </div>
                                <div>• <strong>Principle of Least Privilege:</strong> Grant minimal necessary access</div>
                                <div>• <strong>Policy Testing:</strong> Validate with different user roles</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: Configure SSL/TLS &amp; Encryption (8 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Implement end-to-end encryption to protect data in transit and at rest.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-purple-600 dark:text-purple-400 text-xs">Connection Security:</div>
                                <div className="text-xs space-y-1">
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                    {`// Enforce SSL connections`}<br/>
                                    {`const supabase = createClient(`}<br/>
                                    {`  process.env.SUPABASE_URL!,`}<br/>
                                    {`  process.env.SUPABASE_ANON_KEY!,`}<br/>
                                    {`  {`}<br/>
                                    {`    db: {`}<br/>
                                    {`      schema: 'public'`}<br/>
                                    {`    },`}<br/>
                                    {`    global: {`}<br/>
                                    {`      headers: {`}<br/>
                                    {`        'x-client-info': 'my-app@1.0.0'`}<br/>
                                    {`      }`}<br/>
                                    {`    },`}<br/>
                                    {`    // Force SSL connection`}<br/>
                                    {`    realtime: {`}<br/>
                                    {`      params: {`}<br/>
                                    {`        eventsPerSecond: 10`}<br/>
                                    {`      }`}<br/>
                                    {`    }`}<br/>
                                    {`  }`}<br/>
                                    {`)`}
                                  </div>
                                </div>
                              </div>
                              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-orange-600 dark:text-orange-400 text-xs">Data Encryption:</div>
                                <div className="text-xs space-y-1">
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                    {`-- Encrypt sensitive columns`}<br/>
                                    {`CREATE EXTENSION IF NOT EXISTS pgcrypto;`}<br/><br/>
                                    {`-- Store encrypted data`}<br/>
                                    {`INSERT INTO sensitive_data (user_id, encrypted_field)`}<br/>
                                    {`VALUES (`}<br/>
                                    {`  auth.uid(),`}<br/>
                                    {`  crypt('sensitive_value', gen_salt('bf'))`}<br/>
                                    {`);`}<br/><br/>
                                    {`-- Query encrypted data`}<br/>
                                    {`SELECT * FROM sensitive_data`}<br/>
                                    {`WHERE encrypted_field = crypt('query_value', encrypted_field)`}<br/>
                                    {`AND user_id = auth.uid();`}
                                  </div>
                                  <div>• <strong>At Rest:</strong> Database-level encryption enabled</div>
                                  <div>• <strong>In Transit:</strong> TLS 1.3 for all connections</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Step 4: Set Up Audit Logging &amp; Monitoring (5 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Implement comprehensive audit trails and security monitoring for compliance and threat detection.</p>
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-orange-600 dark:text-orange-400 text-xs">Audit System Implementation:</div>
                              <div className="text-xs space-y-1">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                  {`-- Create audit log table`}<br/>
                                  {`CREATE TABLE audit_logs (`}<br/>
                                  {`  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`}<br/>
                                  {`  table_name TEXT NOT NULL,`}<br/>
                                  {`  operation TEXT NOT NULL, -- INSERT, UPDATE, DELETE`}<br/>
                                  {`  old_values JSONB,`}<br/>
                                  {`  new_values JSONB,`}<br/>
                                  {`  user_id UUID REFERENCES users(id),`}<br/>
                                  {`  ip_address INET,`}<br/>
                                  {`  user_agent TEXT,`}<br/>
                                  {`  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()`}<br/>
                                  {`);`}<br/><br/>
                                  {`-- Create audit trigger function`}<br/>
                                  {`CREATE OR REPLACE FUNCTION audit_trigger_function()`}<br/>
                                  {`RETURNS TRIGGER AS $$`}<br/>
                                  {`BEGIN`}<br/>
                                  {`  INSERT INTO audit_logs (`}<br/>
                                  {`    table_name, operation, old_values, new_values, user_id`}<br/>
                                  {`  ) VALUES (`}<br/>
                                  {`    TG_TABLE_NAME, TG_OP,`}<br/>
                                  {`    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) END,`}<br/>
                                  {`    CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW) END,`}<br/>
                                  {`    auth.uid()`}<br/>
                                  {`  );`}<br/>
                                  {`  RETURN COALESCE(NEW, OLD);`}<br/>
                                  {`END;`}<br/>
                                  {`$$ LANGUAGE plpgsql;`}
                                </div>
                                <div>• <strong>All Operations:</strong> Log every create, read, update, delete</div>
                                <div>• <strong>Context Capture:</strong> User, IP, timestamp, old/new values</div>
                                <div>• <strong>Real-time Alerts:</strong> Suspicious activity detection</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">📋 Backup &amp; Security Implementation Checklist</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Backup Strategy ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Configured automated daily backups</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Enabled point-in-time recovery</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Set up cross-region replication</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Implemented backup testing</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Security Controls ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Enabled Row Level Security</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Configured SSL/TLS encryption</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Implemented role-based access</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Set up data encryption</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Monitoring &amp; Compliance ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Implemented audit logging</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Set up security monitoring</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Configured threat detection</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Documented security procedures</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Real-World Example: FinTech Application Security Implementation</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Building a financial technology application handling sensitive customer data, payment information, 
                            and transaction records. Required to meet PCI DSS, SOX, and GDPR compliance standards while 
                            maintaining high availability and disaster recovery capabilities for 500k+ users and $50M+ daily transactions.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Security &amp; Backup Implementation:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Multi-Region Backups:</strong> Real-time replication across 3 geographic regions</div>
                            <div>• <strong>Zero-Downtime Recovery:</strong> Automated failover with &lt;30 second RTO</div>
                            <div>• <strong>Field-Level Encryption:</strong> AES-256 encryption for all PII and financial data</div>
                            <div>• <strong>Advanced RLS:</strong> Multi-tenant isolation with customer-specific encryption keys</div>
                            <div>• <strong>Real-time Monitoring:</strong> ML-powered anomaly detection and fraud prevention</div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Compliance:</strong> Achieved PCI DSS Level 1, SOX, and GDPR certification</div>
                            <div>• <strong>Data Protection:</strong> Zero data breaches in 3+ years of operation</div>
                            <div>• <strong>Recovery Time:</strong> 99.99% uptime with &lt;30 second failover capability</div>
                            <div>• <strong>Audit Success:</strong> 100% audit trail coverage for regulatory compliance</div>
                            <div>• <strong>Cost Efficiency:</strong> 60% lower security infrastructure costs vs traditional solutions</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-db-step-7',
              title: 'Monitor & Scale',
              description: 'Set up monitoring and scaling strategies',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        📊 Complete Database Monitoring &amp; Scaling Mastery Guide
                      </h4>
                      <p className="mb-4">
                        Master enterprise-grade database monitoring, performance optimization, and scaling strategies 
                        to ensure your database performs optimally under any load. Learn to implement real-time monitoring 
                        systems, predictive scaling, and cost-effective optimization techniques that handle millions of users.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">📈 Advanced Monitoring</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Real-time Metrics:</strong> CPU, memory, disk I/O, connections</div>
                            <div><strong>Query Analytics:</strong> Slow query detection and optimization</div>
                            <div><strong>User Activity:</strong> Connection patterns and usage trends</div>
                            <div><strong>Predictive Alerts:</strong> ML-powered anomaly detection</div>
                            <div><strong>Custom Dashboards:</strong> Business-specific KPI tracking</div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">⚡ Intelligent Scaling</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Auto-scaling:</strong> Dynamic resource allocation</div>
                            <div><strong>Read Replicas:</strong> Geographic distribution strategies</div>
                            <div><strong>Connection Pooling:</strong> PgBouncer optimization</div>
                            <div><strong>Sharding Strategies:</strong> Horizontal partitioning</div>
                            <div><strong>Load Balancing:</strong> Intelligent traffic distribution</div>
                          </div>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">🔧 Performance Optimization</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Cache Layers:</strong> Redis/Memcached integration</div>
                            <div><strong>Query Optimization:</strong> Index tuning and execution plans</div>
                            <div><strong>Resource Tuning:</strong> PostgreSQL parameter optimization</div>
                            <div><strong>Cost Management:</strong> Usage-based scaling policies</div>
                            <div><strong>CDN Integration:</strong> Static content optimization</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">🔧 Step-by-Step Monitoring &amp; Scaling Implementation</h5>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: Set Up Comprehensive Monitoring System (10 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Implement real-time monitoring with custom dashboards, alerting systems, and performance analytics.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 text-xs">Database Metrics Monitoring:</div>
                                <div className="text-xs space-y-1">
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                    {`-- Create monitoring views`}<br/>
                                    {`CREATE VIEW db_performance_metrics AS`}<br/>
                                    {`SELECT`}<br/>
                                    {`  datname as database_name,`}<br/>
                                    {`  numbackends as active_connections,`}<br/>
                                    {`  xact_commit as transactions_committed,`}<br/>
                                    {`  xact_rollback as transactions_rolled_back,`}<br/>
                                    {`  blks_read as blocks_read,`}<br/>
                                    {`  blks_hit as blocks_hit,`}<br/>
                                    {`  tup_returned as tuples_returned,`}<br/>
                                    {`  tup_fetched as tuples_fetched,`}<br/>
                                    {`  tup_inserted as tuples_inserted,`}<br/>
                                    {`  tup_updated as tuples_updated,`}<br/>
                                    {`  tup_deleted as tuples_deleted`}<br/>
                                    {`FROM pg_stat_database`}<br/>
                                    {`WHERE datname = current_database();`}
                                  </div>
                                  <div>• <strong>Real-time Tracking:</strong> Performance metrics every 30 seconds</div>
                                  <div>• <strong>Historical Data:</strong> 90-day trend analysis</div>
                                </div>
                              </div>
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Application-Level Monitoring:</div>
                                <div className="text-xs space-y-1">
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                    {`// Monitoring middleware`}<br/>
                                    {`export const databaseMonitor = {`}<br/>
                                    {`  async trackQuery(query: string, duration: number) {`}<br/>
                                    {`    await supabase`}<br/>
                                    {`      .from('query_performance')`}<br/>
                                    {`      .insert({`}<br/>
                                    {`        query_hash: hashQuery(query),`}<br/>
                                    {`        execution_time: duration,`}<br/>
                                    {`        timestamp: new Date(),`}<br/>
                                    {`        user_id: getCurrentUserId(),`}<br/>
                                    {`        query_type: getQueryType(query)`}<br/>
                                    {`      })`}<br/>
                                    {`  },`}<br/>
                                    {`  `}<br/>
                                    {`  async getSlowQueries() {`}<br/>
                                    {`    return await supabase`}<br/>
                                    {`      .from('query_performance')`}<br/>
                                    {`      .select('*')`}<br/>
                                    {`      .gt('execution_time', 1000) // > 1 second`}<br/>
                                    {`      .order('execution_time', { ascending: false })`}<br/>
                                    {`  }`}<br/>
                                    {`}`}
                                  </div>
                                  <div>• <strong>Query Tracking:</strong> Identify performance bottlenecks</div>
                                  <div>• <strong>User Analytics:</strong> Usage patterns and trends</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Implement Intelligent Alerting System (8 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Set up proactive alerting with threshold-based and ML-powered anomaly detection for critical database events.</p>
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Multi-Channel Alert System:</div>
                              <div className="text-xs space-y-1">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                  {`// Alert system configuration`}<br/>
                                  {`export const alertSystem = {`}<br/>
                                  {`  thresholds: {`}<br/>
                                  {`    cpu_usage: { warning: 70, critical: 85 },`}<br/>
                                  {`    memory_usage: { warning: 80, critical: 90 },`}<br/>
                                  {`    connection_count: { warning: 80, critical: 95 },`}<br/>
                                  {`    query_duration: { warning: 5000, critical: 10000 },`}<br/>
                                  {`    error_rate: { warning: 0.01, critical: 0.05 }`}<br/>
                                  {`  },`}<br/>
                                  {`  `}<br/>
                                  {`  async sendAlert(type: string, severity: string, message: string) {`}<br/>
                                  {`    const channels = severity === 'critical' `}<br/>
                                  {`      ? ['email', 'sms', 'slack', 'webhook']`}<br/>
                                  {`      : ['email', 'slack']`}<br/>
                                  {`    `}<br/>
                                  {`    for (const channel of channels) {`}<br/>
                                  {`      await this.sendNotification(channel, {`}<br/>
                                  {`        type, severity, message,`}<br/>
                                  {`        timestamp: new Date(),`}<br/>
                                  {`        priority: severity === 'critical' ? 'high' : 'medium'`}<br/>
                                  {`      })`}<br/>
                                  {`    }`}<br/>
                                  {`  }`}<br/>
                                  {`}`}
                                </div>
                                <div>• <strong>Escalation Rules:</strong> Severity-based notification channels</div>
                                <div>• <strong>Smart Throttling:</strong> Prevent alert fatigue</div>
                                <div>• <strong>Correlation Engine:</strong> Group related alerts</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: Configure Auto-Scaling Infrastructure (7 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Implement intelligent auto-scaling with read replicas, connection pooling, and dynamic resource allocation.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-purple-600 dark:text-purple-400 text-xs">Read Replica Strategy:</div>
                                <div className="text-xs space-y-1">
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                    {`// Intelligent read routing`}<br/>
                                    {`export const DatabaseRouter = {`}<br/>
                                    {`  primary: createClient(PRIMARY_DB_URL),`}<br/>
                                    {`  replicas: [`}<br/>
                                    {`    createClient(REPLICA_1_URL),`}<br/>
                                    {`    createClient(REPLICA_2_URL),`}<br/>
                                    {`    createClient(REPLICA_3_URL)`}<br/>
                                    {`  ],`}<br/>
                                    {`  `}<br/>
                                    {`  async query(sql: string, params: any[], isWrite = false) {`}<br/>
                                    {`    if (isWrite) {`}<br/>
                                    {`      return await this.primary.query(sql, params)`}<br/>
                                    {`    }`}<br/>
                                    {`    `}<br/>
                                    {`    // Load balance read queries`}<br/>
                                    {`    const replica = this.selectOptimalReplica()`}<br/>
                                    {`    return await replica.query(sql, params)`}<br/>
                                    {`  },`}<br/>
                                    {`  `}<br/>
                                    {`  selectOptimalReplica() {`}<br/>
                                    {`    // Round-robin with health checking`}<br/>
                                    {`    return this.replicas.find(r => r.isHealthy()) || this.primary`}<br/>
                                    {`  }`}<br/>
                                    {`}`}
                                  </div>
                                  <div>• <strong>Geographic Distribution:</strong> Replicas near users</div>
                                  <div>• <strong>Load Balancing:</strong> Intelligent query routing</div>
                                </div>
                              </div>
                              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-orange-600 dark:text-orange-400 text-xs">Connection Pool Optimization:</div>
                                <div className="text-xs space-y-1">
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                    {`// PgBouncer configuration`}<br/>
                                    {`[databases]`}<br/>
                                    {`production = host=localhost port=5432 dbname=myapp`}<br/>
                                    {`  pool_size=25`}<br/>
                                    {`  reserve_pool_size=5`}<br/>
                                    {`  max_client_conn=100`}<br/>
                                    {`  `}<br/>
                                    {`[pgbouncer]`}<br/>
                                    {`pool_mode = transaction`}<br/>
                                    {`max_client_conn = 1000`}<br/>
                                    {`default_pool_size = 20`}<br/>
                                    {`max_db_connections = 50`}<br/>
                                    {`max_user_connections = 50`}<br/>
                                    {`server_round_robin = 1`}<br/>
                                    {`ignore_startup_parameters = extra_float_digits`}<br/>
                                    {`server_check_delay = 30`}<br/>
                                    {`server_check_query = select 1`}
                                  </div>
                                  <div>• <strong>Pool Sizing:</strong> Optimal connection management</div>
                                  <div>• <strong>Health Checks:</strong> Automatic failover detection</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Step 4: Implement Performance Optimization (5 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Deploy advanced caching strategies and performance tuning for maximum efficiency and cost optimization.</p>
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-orange-600 dark:text-orange-400 text-xs">Multi-Layer Caching Strategy:</div>
                              <div className="text-xs space-y-1">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                  {`// Intelligent caching system`}<br/>
                                  {`export const CacheManager = {`}<br/>
                                  {`  // L1: In-memory cache (fastest)`}<br/>
                                  {`  memoryCache: new Map(),`}<br/>
                                  {`  `}<br/>
                                  {`  // L2: Redis cache (fast, shared)`}<br/>
                                  {`  redisCache: createRedisClient(),`}<br/>
                                  {`  `}<br/>
                                  {`  async get(key: string) {`}<br/>
                                  {`    // Try L1 cache first`}<br/>
                                  {`    let value = this.memoryCache.get(key)`}<br/>
                                  {`    if (value) return value`}<br/>
                                  {`    `}<br/>
                                  {`    // Try L2 cache`}<br/>
                                  {`    value = await this.redisCache.get(key)`}<br/>
                                  {`    if (value) {`}<br/>
                                  {`      this.memoryCache.set(key, value)`}<br/>
                                  {`      return value`}<br/>
                                  {`    }`}<br/>
                                  {`    `}<br/>
                                  {`    return null`}<br/>
                                  {`  },`}<br/>
                                  {`  `}<br/>
                                  {`  async set(key: string, value: any, ttl: number) {`}<br/>
                                  {`    this.memoryCache.set(key, value)`}<br/>
                                  {`    await this.redisCache.setex(key, ttl, JSON.stringify(value))`}<br/>
                                  {`  }`}<br/>
                                  {`}`}
                                </div>
                                <div>• <strong>Cache Hierarchy:</strong> Memory → Redis → Database</div>
                                <div>• <strong>Smart Invalidation:</strong> Event-driven cache updates</div>
                                <div>• <strong>Query Result Caching:</strong> Automatic expensive query caching</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">📋 Monitoring &amp; Scaling Implementation Checklist</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Monitoring Setup ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Real-time metrics dashboard</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Query performance tracking</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Multi-channel alerting system</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Anomaly detection enabled</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Scaling Infrastructure ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Read replicas configured</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Connection pooling optimized</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Auto-scaling policies defined</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Load balancing implemented</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Performance Optimization ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Multi-layer caching deployed</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Query optimization completed</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Cost optimization configured</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Performance benchmarks established</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Real-World Example: Global Social Media Platform Scaling</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Building a global social media platform handling 50 million daily active users, 
                            500 million posts per day, and 2 billion interactions. Required sub-100ms response times 
                            worldwide with 99.99% uptime and cost-effective scaling that adapts to traffic patterns.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Monitoring &amp; Scaling Implementation:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Global Read Replicas:</strong> 12 regions with intelligent geo-routing</div>
                            <div>• <strong>Real-time Monitoring:</strong> 500+ metrics tracked with ML-powered predictions</div>
                            <div>• <strong>Auto-scaling Groups:</strong> Dynamic capacity based on traffic patterns</div>
                            <div>• <strong>Multi-tier Caching:</strong> 99.8% cache hit rate reducing database load by 95%</div>
                            <div>• <strong>Predictive Scaling:</strong> ML models predict traffic spikes 2 hours ahead</div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Performance:</strong> Global average response time &lt;85ms</div>
                            <div>• <strong>Uptime:</strong> 99.995% availability (2.6 minutes downtime/month)</div>
                            <div>• <strong>Scalability:</strong> Seamlessly handled 10x traffic spikes during viral events</div>
                            <div>• <strong>Cost Efficiency:</strong> 40% reduction in infrastructure costs through intelligent scaling</div>
                            <div>• <strong>Global Reach:</strong> Sub-100ms response times in 150+ countries</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        }
      ]
    },
    auth: {
      id: 'auth',
      title: 'Step-by-Step Authentication Guide',
      icon: <Shield className="h-5 w-5" />,
      description: 'Implement secure user authentication',
      sections: [
        {
          id: 'basics',
          title: '🔐 Basics',
          description: 'Authentication fundamentals',
          steps: [
            {
              id: 'webdev-integrate-auth-step-1',
              title: 'Authentication Types',
              description: 'Understanding different authentication methods',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                        🔐 Complete Authentication Types Mastery Guide
                      </h4>
                      <p className="mb-4">
                        Master the fundamentals of authentication by understanding different authentication methods, 
                        their use cases, security implications, and implementation strategies. Learn to choose the 
                        right authentication approach for your specific application needs.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">🎯 Authentication Methods</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Password-Based:</strong> Traditional username/password authentication</div>
                            <div><strong>Multi-Factor:</strong> Enhanced security with additional verification</div>
                            <div><strong>Social OAuth:</strong> Login through Google, GitHub, Discord, etc.</div>
                            <div><strong>Magic Links:</strong> Passwordless email-based authentication</div>
                            <div><strong>Biometric:</strong> Fingerprint, face recognition, touch ID</div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">🔒 Security Levels</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Basic:</strong> Email + password with validation</div>
                            <div><strong>Enhanced:</strong> Password strength + rate limiting</div>
                            <div><strong>Advanced:</strong> MFA + session management</div>
                            <div><strong>Enterprise:</strong> SSO + role-based access control</div>
                            <div><strong>Zero-Trust:</strong> Continuous verification + risk assessment</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">🔧 Authentication Types Deep Dive</h5>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Password-Based Authentication (Most Common)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Traditional authentication using email/username and password combination with modern security practices.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">✅ Advantages:</div>
                                <div className="text-xs space-y-1">
                                  <div>• Universal user familiarity</div>
                                  <div>• Full control over authentication flow</div>
                                  <div>• Works offline after initial login</div>
                                  <div>• No dependency on third-party services</div>
                                  <div>• Easy to implement and customize</div>
                                </div>
                              </div>
                              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-red-600 dark:text-red-400 text-xs">⚠️ Challenges:</div>
                                <div className="text-xs space-y-1">
                                  <div>• Users forget passwords frequently</div>
                                  <div>• Password reset flows needed</div>
                                  <div>• Vulnerability to brute force attacks</div>
                                  <div>• Password strength enforcement required</div>
                                  <div>• User education about security needed</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">OAuth Social Login (User-Friendly)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Authentication through established providers like Google, GitHub, Discord, reducing friction and improving security.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-purple-600 dark:text-purple-400 text-xs">✅ Advantages:</div>
                                <div className="text-xs space-y-1">
                                  <div>• Eliminates password management</div>
                                  <div>• Faster registration and login</div>
                                  <div>• Leverages provider's security</div>
                                  <div>• Access to profile information</div>
                                  <div>• High user adoption rates</div>
                                </div>
                              </div>
                              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-orange-600 dark:text-orange-400 text-xs">⚠️ Considerations:</div>
                                <div className="text-xs space-y-1">
                                  <div>• Dependency on third-party services</div>
                                  <div>• Limited customization options</div>
                                  <div>• Privacy concerns for some users</div>
                                  <div>• Provider service outages affect login</div>
                                  <div>• Complex permission scopes</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Magic Link Authentication (Passwordless)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Passwordless authentication where users receive secure login links via email, eliminating password management.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-orange-600 dark:text-orange-400 text-xs">✅ Advantages:</div>
                                <div className="text-xs space-y-1">
                                  <div>• No passwords to remember or forget</div>
                                  <div>• Immune to password-based attacks</div>
                                  <div>• Excellent user experience</div>
                                  <div>• Built-in email verification</div>
                                  <div>• Reduced support tickets</div>
                                </div>
                              </div>
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 text-xs">⚠️ Limitations:</div>
                                <div className="text-xs space-y-1">
                                  <div>• Requires email access for each login</div>
                                  <div>• Email delivery delays possible</div>
                                  <div>• Less familiar to some users</div>
                                  <div>• Email security becomes critical</div>
                                  <div>• Mobile app integration complexity</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-red-600 dark:text-red-400">Multi-Factor Authentication (Enterprise-Grade)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Enhanced security through multiple verification factors including SMS, authenticator apps, or hardware tokens.</p>
                            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-red-600 dark:text-red-400 text-xs">🔐 MFA Factor Types:</div>
                              <div className="text-xs space-y-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                                <div>
                                  <div className="font-medium">Something You Know:</div>
                                  <div>• Password</div>
                                  <div>• PIN</div>
                                  <div>• Security questions</div>
                                </div>
                                <div>
                                  <div className="font-medium">Something You Have:</div>
                                  <div>• Phone (SMS)</div>
                                  <div>• Authenticator app</div>
                                  <div>• Hardware token</div>
                                </div>
                                <div>
                                  <div className="font-medium">Something You Are:</div>
                                  <div>• Fingerprint</div>
                                  <div>• Face recognition</div>
                                  <div>• Voice recognition</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">📋 Authentication Method Selection Checklist</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Application Requirements ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Identified target user demographics</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Determined security requirements</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Assessed technical constraints</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Evaluated compliance needs</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Implementation Planning ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Selected primary authentication method</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Planned fallback authentication options</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Designed user experience flow</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Documented security considerations</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Real-World Example: SaaS Platform Authentication Strategy</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Building a B2B SaaS platform requiring both individual user accounts and enterprise team management. 
                            Need to balance security, user experience, and compliance requirements while supporting 50k+ users 
                            across different security profiles from startups to Fortune 500 companies.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Multi-Tier Authentication Strategy:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Individual Users:</strong> Email/password + magic links + Google/GitHub OAuth</div>
                            <div>• <strong>Team Plans:</strong> SSO integration + role-based access + session management</div>
                            <div>• <strong>Enterprise:</strong> SAML/OIDC + MFA requirements + audit logging</div>
                            <div>• <strong>Developer Access:</strong> API keys + webhook signatures + rate limiting</div>
                            <div>• <strong>Admin Panel:</strong> Hardware tokens + IP whitelisting + time-based access</div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>User Adoption:</strong> 94% OAuth adoption rate for individual users</div>
                            <div>• <strong>Security:</strong> Zero authentication-related breaches in 2+ years</div>
                            <div>• <strong>Support Reduction:</strong> 78% fewer password-related support tickets</div>
                            <div>• <strong>Enterprise Sales:</strong> Authentication flexibility closed 40% more enterprise deals</div>
                            <div>• <strong>Compliance:</strong> SOC 2, ISO 27001, and GDPR compliance achieved</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-auth-step-2',
              title: 'Set Up Supabase Auth',
              description: 'Configure Supabase authentication',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                        🚀 Complete Supabase Authentication Setup Guide
                      </h4>
                      <p className="mb-4">
                        Master Supabase authentication by setting up your project, configuring authentication providers, 
                        implementing security policies, and creating a robust authentication system that scales with your application.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">🎯 Setup Components</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Project Creation:</strong> Supabase dashboard setup and configuration</div>
                            <div><strong>Database Schema:</strong> User tables and authentication triggers</div>
                            <div><strong>Client Integration:</strong> JavaScript SDK installation and setup</div>
                            <div><strong>Environment Config:</strong> Secure environment variable management</div>
                            <div><strong>Auth Policies:</strong> Row Level Security implementation</div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">🔧 Authentication Features</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Email/Password:</strong> Traditional authentication with verification</div>
                            <div><strong>Magic Links:</strong> Passwordless email authentication</div>
                            <div><strong>OAuth Providers:</strong> Google, GitHub, Discord, Twitter, etc.</div>
                            <div><strong>Phone Auth:</strong> SMS-based authentication and verification</div>
                            <div><strong>Custom Domains:</strong> Branded authentication experience</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">🔧 Step-by-Step Supabase Authentication Setup</h5>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: Create Supabase Project (8 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Set up your Supabase project with proper configuration for authentication and database access.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 text-xs">Project Setup Process:</div>
                                <div className="text-xs space-y-1">
                                  <div>1. Go to <strong>supabase.com</strong> and create account</div>
                                  <div>2. Click "New project" and choose organization</div>
                                  <div>3. Configure project settings:</div>
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono ml-2">
                                    Name: your-app-name<br/>
                                    Database Password: generate-strong-password<br/>
                                    Region: closest-to-users<br/>
                                    Pricing: Start with Free tier
                                  </div>
                                  <div>4. Wait for project initialization (2-3 minutes)</div>
                                  <div>5. Access project dashboard</div>
                                </div>
                              </div>
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Environment Variables:</div>
                                <div className="text-xs space-y-1">
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                    {`# .env.local`}<br/>
                                    {`NEXT_PUBLIC_SUPABASE_URL=your-project-url`}<br/>
                                    {`NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}<br/>
                                    {`SUPABASE_SERVICE_ROLE_KEY=your-service-key`}
                                  </div>
                                  <div>• <strong>Project URL:</strong> Found in Settings → API</div>
                                  <div>• <strong>Anon Key:</strong> Public key for client-side auth</div>
                                  <div>• <strong>Service Key:</strong> Admin access (server-side only)</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Install and Configure Supabase Client (7 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Install the Supabase JavaScript client and configure it for your application.</p>
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Client Installation &amp; Setup:</div>
                              <div className="text-xs space-y-1">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                  {`# Install Supabase client`}<br/>
                                  {`npm install @supabase/supabase-js`}<br/><br/>
                                  {`# Create lib/supabase.ts`}<br/>
                                  {`import { createClient } from '@supabase/supabase-js'`}<br/><br/>
                                  {`const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!`}<br/>
                                  {`const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!`}<br/><br/>
                                  {`export const supabase = createClient(supabaseUrl, supabaseAnonKey, {`}<br/>
                                  {`  auth: {`}<br/>
                                  {`    autoRefreshToken: true,`}<br/>
                                  {`    persistSession: true,`}<br/>
                                  {`    detectSessionInUrl: true`}<br/>
                                  {`  }`}<br/>
                                  {`})`}
                                </div>
                                <div>• <strong>Auto Refresh:</strong> Automatically refresh expired tokens</div>
                                <div>• <strong>Persist Session:</strong> Remember user across browser sessions</div>
                                <div>• <strong>URL Detection:</strong> Handle auth callbacks from OAuth</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: Configure Authentication Providers (5 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Set up authentication providers in the Supabase dashboard for comprehensive authentication options.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-purple-600 dark:text-purple-400 text-xs">Email Authentication:</div>
                                <div className="text-xs space-y-1">
                                  <div>1. Go to <strong>Authentication → Settings</strong></div>
                                  <div>2. Configure email settings:</div>
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded ml-2">
                                    • Enable email confirmations<br/>
                                    • Set site URL (your domain)<br/>
                                    • Configure redirect URLs<br/>
                                    • Customize email templates
                                  </div>
                                  <div>3. Test email delivery</div>
                                </div>
                              </div>
                              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-orange-600 dark:text-orange-400 text-xs">OAuth Providers:</div>
                                <div className="text-xs space-y-1">
                                  <div>1. Go to <strong>Authentication → Providers</strong></div>
                                  <div>2. Enable desired providers:</div>
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded ml-2">
                                    • Google: Create OAuth 2.0 credentials<br/>
                                    • GitHub: Register OAuth app<br/>
                                    • Discord: Create application<br/>
                                    • Add Client ID &amp; Secret
                                  </div>
                                  <div>3. Configure redirect URLs</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Step 4: Set Up Database Security Policies (5 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Implement Row Level Security policies to protect user data and ensure proper access control.</p>
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-orange-600 dark:text-orange-400 text-xs">RLS Policy Examples:</div>
                              <div className="text-xs space-y-1">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                  {`-- Enable RLS on user profiles table`}<br/>
                                  {`ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;`}<br/><br/>
                                  {`-- Users can only see their own profile`}<br/>
                                  {`CREATE POLICY "Users can view own profile" ON profiles`}<br/>
                                  {`  FOR SELECT USING (auth.uid() = id);`}<br/><br/>
                                  {`-- Users can only update their own profile`}<br/>
                                  {`CREATE POLICY "Users can update own profile" ON profiles`}<br/>
                                  {`  FOR UPDATE USING (auth.uid() = id);`}<br/><br/>
                                  {`-- Users can insert their own profile`}<br/>
                                  {`CREATE POLICY "Users can insert own profile" ON profiles`}<br/>
                                  {`  FOR INSERT WITH CHECK (auth.uid() = id);`}
                                </div>
                                <div>• <strong>Security by Default:</strong> No data access without explicit policies</div>
                                <div>• <strong>User Context:</strong> auth.uid() provides current user ID</div>
                                <div>• <strong>Operation Specific:</strong> Different policies for SELECT, INSERT, UPDATE, DELETE</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">📋 Supabase Authentication Setup Checklist</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Project Setup ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Created Supabase project</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Configured environment variables</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Installed Supabase client</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Set up client configuration</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Authentication Config ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Configured email authentication</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Set up OAuth providers</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Configured redirect URLs</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Customized email templates</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Security Setup ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Enabled Row Level Security</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Created security policies</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Tested authentication flow</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Verified data access controls</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Real-World Example: E-commerce Authentication Setup</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Building an e-commerce platform requiring secure user authentication, guest checkout options, 
                            social login for faster onboarding, and admin access controls. Need to handle 100k+ users 
                            with different permission levels and ensure PCI compliance for payment processing.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Supabase Implementation:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Multi-tier Authentication:</strong> Email/password, Google/Facebook OAuth, guest checkout</div>
                            <div>• <strong>Role-based Access:</strong> Customer, admin, super-admin with different permissions</div>
                            <div>• <strong>Data Segmentation:</strong> Customer profiles, order history, admin dashboards</div>
                            <div>• <strong>Security Policies:</strong> Customers see only their data, admins see filtered data</div>
                            <div>• <strong>Session Management:</strong> Secure sessions with automatic refresh and logout</div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>User Experience:</strong> 87% chose social login, 65% faster registration</div>
                            <div>• <strong>Security:</strong> Zero data breaches, 100% compliance with PCI DSS</div>
                            <div>• <strong>Performance:</strong> &lt;200ms authentication response times globally</div>
                            <div>• <strong>Conversion:</strong> 34% increase in completed registrations</div>
                            <div>• <strong>Support:</strong> 82% reduction in password-related support tickets</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-auth-step-3',
              title: 'Login & Registration',
              description: 'Create login and registration forms',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Login & Registration content</div>
            },
            {
              id: 'webdev-integrate-auth-step-4',
              title: 'Social Login',
              description: 'Implement OAuth providers',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                        🔗 Complete Social Login Implementation Guide
                      </h4>
                      <p className="mb-4">
                        Implement seamless social authentication with OAuth providers including Google, GitHub, Discord, and Twitter. 
                        Create a streamlined user experience with multiple login options and secure token management.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">🎯 OAuth Providers</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Google OAuth:</strong> Gmail integration with profile data</div>
                            <div><strong>GitHub:</strong> Developer-focused authentication</div>
                            <div><strong>Discord:</strong> Gaming and community platforms</div>
                            <div><strong>Twitter/X:</strong> Social media integration</div>
                            <div><strong>Facebook:</strong> Broad social connectivity</div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">🔧 Implementation Features</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>One-Click Login:</strong> Streamlined authentication flow</div>
                            <div><strong>Profile Sync:</strong> Automatic user data population</div>
                            <div><strong>Token Management:</strong> Secure token storage and refresh</div>
                            <div><strong>Fallback Options:</strong> Multiple provider choices</div>
                            <div><strong>Account Linking:</strong> Connect multiple social accounts</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">⚙️ Step-by-Step Social Login Implementation</h5>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: Configure OAuth Applications (8 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Set up OAuth applications for each social provider with proper credentials and redirect URLs.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 text-xs">Google OAuth Setup:</div>
                                <div className="text-xs space-y-1">
                                  <div>1. Go to <strong>Google Cloud Console</strong></div>
                                  <div>2. Create new project or select existing</div>
                                  <div>3. Enable Google+ API</div>
                                  <div>4. Go to Credentials → Create OAuth 2.0 Client ID</div>
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono ml-2">
                                    Application type: Web application<br/>
                                    Authorized redirect URIs:<br/>
                                    {`https://yourproject.supabase.co/auth/v1/callback`}
                                  </div>
                                  <div>5. Copy Client ID and Client Secret</div>
                                </div>
                              </div>
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">GitHub OAuth Setup:</div>
                                <div className="text-xs space-y-1">
                                  <div>1. Go to <strong>GitHub Settings → Developer settings</strong></div>
                                  <div>2. Click OAuth Apps → New OAuth App</div>
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono ml-2">
                                    Application name: Your App Name<br/>
                                    Homepage URL: https://yourapp.com<br/>
                                    Authorization callback URL:<br/>
                                    {`https://yourproject.supabase.co/auth/v1/callback`}
                                  </div>
                                  <div>3. Generate Client Secret</div>
                                  <div>4. Copy Client ID and Secret</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Configure Supabase Auth Providers (7 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Add OAuth provider credentials to your Supabase project and configure authentication settings.</p>
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Supabase Provider Configuration:</div>
                              <div className="text-xs space-y-1">
                                <div>1. Go to <strong>Supabase Dashboard → Authentication → Providers</strong></div>
                                <div>2. Enable each OAuth provider:</div>
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono ml-2">
                                  <strong>Google:</strong><br/>
                                  Client ID: your-google-client-id<br/>
                                  Client Secret: your-google-client-secret<br/><br/>
                                  <strong>GitHub:</strong><br/>
                                  Client ID: your-github-client-id<br/>
                                  Client Secret: your-github-client-secret<br/><br/>
                                  <strong>Discord:</strong><br/>
                                  Client ID: your-discord-client-id<br/>
                                  Client Secret: your-discord-client-secret
                                </div>
                                <div>3. Configure redirect URLs for each provider</div>
                                <div>4. Test OAuth flow in Supabase dashboard</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: Implement Social Login UI Components (8 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Create beautiful social login buttons with proper branding and user experience.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-purple-600 dark:text-purple-400 text-xs">Social Login Component:</div>
                                <div className="text-xs space-y-1">
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                    {`// components/SocialLogin.tsx`}<br/>
                                    {`import { supabase } from '@/lib/supabase';`}<br/><br/>
                                    {`export function SocialLoginButtons() {`}<br/>
                                    {`  const handleSocialLogin = async (provider) => {`}<br/>
                                    {`    const { data, error } = await supabase.auth.signInWithOAuth({`}<br/>
                                    {`      provider,`}<br/>
                                    {`      options: {`}<br/>
                                    {`        redirectTo: window.location.origin + '/auth/callback',`}<br/>
                                    {`        queryParams: {`}<br/>
                                    {`          access_type: 'offline',`}<br/>
                                    {`          prompt: 'consent'`}<br/>
                                    {`        }`}<br/>
                                    {`      }`}<br/>
                                    {`    });`}<br/>
                                    {`    if (error) console.error('OAuth error:', error);`}<br/>
                                    {`  };`}
                                  </div>
                                </div>
                              </div>
                              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-orange-600 dark:text-orange-400 text-xs">Provider Button Styling:</div>
                                <div className="text-xs space-y-1">
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                    {`return (`}<br/>
                                    {`  <div className="space-y-3">`}<br/>
                                    {`    <button`}<br/>
                                    {`      onClick={() => handleSocialLogin('google')}`}<br/>
                                    {`      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"`}<br/>
                                    {`    >`}<br/>
                                    {`      <GoogleIcon className="w-5 h-5 mr-2" />`}<br/>
                                    {`      Continue with Google`}<br/>
                                    {`    </button>`}<br/>
                                    {`    {/* Similar buttons for GitHub, Discord */}`}<br/>
                                    {`  </div>`}<br/>
                                    {`);`}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Step 4: Handle OAuth Callbacks and User Data (7 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Process OAuth callbacks, extract user data, and handle account linking or creation.</p>
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-orange-600 dark:text-orange-400 text-xs">OAuth Callback Handler:</div>
                              <div className="text-xs space-y-1">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                  {`// pages/auth/callback.tsx`}<br/>
                                  {`import { useEffect } from 'react';`}<br/>
                                  {`import { useRouter } from 'next/router';`}<br/>
                                  {`import { supabase } from '@/lib/supabase';`}<br/><br/>
                                  {`export default function AuthCallback() {`}<br/>
                                  {`  const router = useRouter();`}<br/><br/>
                                  {`  useEffect(() => {`}<br/>
                                  {`    const handleAuthCallback = async () => {`}<br/>
                                  {`      const { data, error } = await supabase.auth.getSession();`}<br/>
                                  {`      `}<br/>
                                  {`      if (data.session) {`}<br/>
                                  {`        // Extract user metadata from OAuth provider`}<br/>
                                  {`        const { user } = data.session;`}<br/>
                                  {`        const metadata = user.user_metadata;`}<br/>
                                  {`        `}<br/>
                                  {`        // Update or create user profile`}<br/>
                                  {`        await updateUserProfile(user.id, {`}<br/>
                                  {`          full_name: metadata.full_name,`}<br/>
                                  {`          avatar_url: metadata.avatar_url,`}<br/>
                                  {`          provider: metadata.provider`}<br/>
                                  {`        });`}<br/>
                                  {`        `}<br/>
                                  {`        router.push('/dashboard');`}<br/>
                                  {`      } else {`}<br/>
                                  {`        router.push('/auth?error=oauth_failed');`}<br/>
                                  {`      }`}<br/>
                                  {`    };`}<br/>
                                  {`    `}<br/>
                                  {`    handleAuthCallback();`}<br/>
                                  {`  }, [router]);`}
                                </div>
                                <div>• <strong>Session Validation:</strong> Verify OAuth session creation</div>
                                <div>• <strong>Metadata Extraction:</strong> Get user info from provider</div>
                                <div>• <strong>Profile Creation:</strong> Auto-populate user profile</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">📋 Social Login Implementation Checklist</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h6 className="font-medium mb-2 text-sm">OAuth Setup ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Created Google OAuth app</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Set up GitHub OAuth app</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Configured Discord OAuth</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Set redirect URLs</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Supabase Integration ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Added provider credentials</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Configured callback URLs</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Tested OAuth flows</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Verified token handling</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">UI Components ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Created social login buttons</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Added provider branding</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Implemented callback handler</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Added error handling</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Real-World Example: Developer Portfolio Platform</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Building a developer portfolio platform where users need quick access to showcase their projects. 
                            Target audience expects seamless login with GitHub, Google for broader access, and Discord for community features.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Social Login Implementation:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>GitHub Integration:</strong> Auto-import repositories and contribution data</div>
                            <div>• <strong>Google OAuth:</strong> Professional email access and Google Drive integration</div>
                            <div>• <strong>Discord Connect:</strong> Community features and server integration</div>
                            <div>• <strong>Profile Syncing:</strong> Automatic avatar, bio, and contact info updates</div>
                            <div>• <strong>Account Linking:</strong> Connect multiple providers to single profile</div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>User Adoption:</strong> 89% chose social login over traditional signup</div>
                            <div>• <strong>GitHub Preference:</strong> 67% of developers used GitHub OAuth</div>
                            <div>• <strong>Profile Completion:</strong> 94% profiles auto-populated from social data</div>
                            <div>• <strong>Time to Portfolio:</strong> 85% faster portfolio creation with linked accounts</div>
                            <div>• <strong>Community Engagement:</strong> 43% increase in Discord server activity</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-auth-step-5',
              title: 'Role-Based Access',
              description: 'Implement user roles and permissions',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        🛡️ Complete Role-Based Access Control System
                      </h4>
                      <p className="mb-4">
                        Build a robust role-based access control (RBAC) system with granular permissions, 
                        hierarchical roles, and dynamic authorization that scales with your application's complexity.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">👥 Role Architecture</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Role Hierarchy:</strong> Admin → Manager → User → Guest permissions</div>
                            <div><strong>Permission Matrix:</strong> Granular action-based access control</div>
                            <div><strong>Resource Scoping:</strong> Object-level and attribute-level permissions</div>
                            <div><strong>Dynamic Roles:</strong> Context-aware permissions based on conditions</div>
                            <div><strong>Inheritance:</strong> Automatic permission cascading through hierarchy</div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">🔐 Permission Features</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>CRUD Permissions:</strong> Create, Read, Update, Delete access control</div>
                            <div><strong>Field-level Security:</strong> Restrict access to specific data fields</div>
                            <div><strong>Time-based Access:</strong> Temporary permissions with expiration</div>
                            <div><strong>Conditional Logic:</strong> Permission rules based on business logic</div>
                            <div><strong>Audit Trail:</strong> Complete logging of permission changes</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">⚙️ Step-by-Step Role & Permission Implementation</h5>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: Design Role System Architecture (10 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Create a flexible role system with clear hierarchy and permission inheritance.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 text-xs">Database Schema Design:</div>
                                <div className="text-xs space-y-1">
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                    {`-- User roles table`}<br/>
                                    {`CREATE TABLE user_roles (`}<br/>
                                    {`  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`}<br/>
                                    {`  name VARCHAR(50) UNIQUE NOT NULL,`}<br/>
                                    {`  description TEXT,`}<br/>
                                    {`  level INTEGER NOT NULL,`}<br/>
                                    {`  is_active BOOLEAN DEFAULT true,`}<br/>
                                    {`  created_at TIMESTAMP DEFAULT NOW()`}<br/>
                                    {`);`}<br/><br/>
                                    {`-- Permissions table`}<br/>
                                    {`CREATE TABLE permissions (`}<br/>
                                    {`  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`}<br/>
                                    {`  resource VARCHAR(100) NOT NULL,`}<br/>
                                    {`  action VARCHAR(50) NOT NULL,`}<br/>
                                    {`  conditions JSONB DEFAULT '{}'`}<br/>
                                    {`);`}
                                  </div>
                                  <div>• <strong>Hierarchical Levels:</strong> Numeric levels for role precedence</div>
                                  <div>• <strong>Resource-Action Model:</strong> Granular permission definition</div>
                                  <div>• <strong>Conditions:</strong> JSON-based conditional permissions</div>
                                </div>
                              </div>
                              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Role Hierarchy Example:</div>
                                <div className="text-xs space-y-1">
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                                    <strong>Super Admin (Level 100):</strong><br/>
                                    • Full system access<br/>
                                    • User management<br/>
                                    • System configuration<br/><br/>
                                    <strong>Admin (Level 80):</strong><br/>
                                    • Department management<br/>
                                    • User role assignment<br/>
                                    • Content moderation<br/><br/>
                                    <strong>Manager (Level 60):</strong><br/>
                                    • Team management<br/>
                                    • Report access<br/>
                                    • Limited admin functions<br/><br/>
                                    <strong>User (Level 40):</strong><br/>
                                    • Own data access<br/>
                                    • Basic features<br/>
                                    • Profile management
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Implement Permission Matrix System (10 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Create a comprehensive permission matrix with role assignments and inheritance rules.</p>
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Permission Matrix Implementation:</div>
                              <div className="text-xs space-y-1">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                  {`-- Role permissions junction table`}<br/>
                                  {`CREATE TABLE role_permissions (`}<br/>
                                  {`  role_id UUID REFERENCES user_roles(id),`}<br/>
                                  {`  permission_id UUID REFERENCES permissions(id),`}<br/>
                                  {`  granted BOOLEAN DEFAULT true,`}<br/>
                                  {`  granted_by UUID REFERENCES users(id),`}<br/>
                                  {`  granted_at TIMESTAMP DEFAULT NOW(),`}<br/>
                                  {`  PRIMARY KEY (role_id, permission_id)`}<br/>
                                  {`);`}<br/><br/>
                                  {`-- User role assignments`}<br/>
                                  {`CREATE TABLE user_role_assignments (`}<br/>
                                  {`  user_id UUID REFERENCES users(id),`}<br/>
                                  {`  role_id UUID REFERENCES user_roles(id),`}<br/>
                                  {`  assigned_by UUID REFERENCES users(id),`}<br/>
                                  {`  assigned_at TIMESTAMP DEFAULT NOW(),`}<br/>
                                  {`  expires_at TIMESTAMP NULL,`}<br/>
                                  {`  is_active BOOLEAN DEFAULT true`}<br/>
                                  {`);`}
                                </div>
                                <div>• <strong>Grant/Revoke:</strong> Explicit permission granting with audit trail</div>
                                <div>• <strong>Temporary Roles:</strong> Time-limited role assignments</div>
                                <div>• <strong>Assignment Tracking:</strong> Who assigned what and when</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: Create Permission Checking Functions (10 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Build utility functions for checking permissions with inheritance and conditional logic.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-purple-600 dark:text-purple-400 text-xs">TypeScript Permission Utils:</div>
                                <div className="text-xs space-y-1">
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                    {`// utils/permissions.ts`}<br/>
                                    {`export interface Permission {`}<br/>
                                    {`  resource: string;`}<br/>
                                    {`  action: string;`}<br/>
                                    {`  conditions?: Record<string, any>;`}<br/>
                                    {`}`}<br/><br/>
                                    {`export async function hasPermission(`}<br/>
                                    {`  userId: string,`}<br/>
                                    {`  permission: Permission,`}<br/>
                                    {`  context?: Record<string, any>`}<br/>
                                    {`): Promise<boolean> {`}<br/>
                                    {`  const userRoles = await getUserRoles(userId);`}<br/>
                                    {`  return checkPermissionInRoles(userRoles, permission, context);`}<br/>
                                    {`}`}
                                  </div>
                                </div>
                              </div>
                              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                                <div className="font-medium mb-2 text-orange-600 dark:text-orange-400 text-xs">Row Level Security Integration:</div>
                                <div className="text-xs space-y-1">
                                  <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                    {`-- Dynamic RLS based on roles`}<br/>
                                    {`CREATE OR REPLACE FUNCTION user_has_permission(`}<br/>
                                    {`  user_id UUID,`}<br/>
                                    {`  resource_name TEXT,`}<br/>
                                    {`  action_name TEXT`}<br/>
                                    {`) RETURNS BOOLEAN AS $$`}<br/>
                                    {`BEGIN`}<br/>
                                    {`  RETURN EXISTS (`}<br/>
                                    {`    SELECT 1 FROM user_role_assignments ura`}<br/>
                                    {`    JOIN role_permissions rp ON ura.role_id = rp.role_id`}<br/>
                                    {`    JOIN permissions p ON rp.permission_id = p.id`}<br/>
                                    {`    WHERE ura.user_id = user_id`}<br/>
                                    {`    AND p.resource = resource_name`}<br/>
                                    {`    AND p.action = action_name`}<br/>
                                    {`    AND ura.is_active = true`}<br/>
                                    {`  );`}<br/>
                                    {`END;`}<br/>
                                    {`$$ LANGUAGE plpgsql;`}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Step 4: Implement Role Management Interface (10 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Create React components for managing roles, permissions, and user assignments.</p>
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-orange-600 dark:text-orange-400 text-xs">Role Management Components:</div>
                              <div className="text-xs space-y-1">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                  {`// components/RoleManager.tsx`}<br/>
                                  {`export function RoleManager() {`}<br/>
                                  {`  const [roles, setRoles] = useState<Role[]>([]);`}<br/>
                                  {`  const [permissions, setPermissions] = useState<Permission[]>([]);`}<br/><br/>
                                  {`  const assignRole = async (userId: string, roleId: string) => {`}<br/>
                                  {`    const { error } = await supabase`}<br/>
                                  {`      .from('user_role_assignments')`}<br/>
                                  {`      .insert({`}<br/>
                                  {`        user_id: userId,`}<br/>
                                  {`        role_id: roleId,`}<br/>
                                  {`        assigned_by: currentUser.id`}<br/>
                                  {`      });`}<br/>
                                  {`    if (!error) refreshUserRoles();`}<br/>
                                  {`  };`}<br/><br/>
                                  {`  return (`}<br/>
                                  {`    <RolePermissionMatrix`}<br/>
                                  {`      roles={roles}`}<br/>
                                  {`      permissions={permissions}`}<br/>
                                  {`      onAssignRole={assignRole}`}<br/>
                                  {`    />`}<br/>
                                  {`  );`}<br/>
                                  {`}`}
                                </div>
                                <div>• <strong>Real-time Updates:</strong> Instant permission changes</div>
                                <div>• <strong>Bulk Operations:</strong> Assign multiple roles/permissions</div>
                                <div>• <strong>Visual Matrix:</strong> Clear permission overview</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">📋 Role-Based Access Implementation Checklist</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Role System Design ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Created role hierarchy schema</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Defined permission resources</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Set up role inheritance rules</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Created assignment tracking</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Permission Matrix ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Implemented CRUD permissions</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Added conditional logic</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Set up time-based access</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Created audit trail</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Management Interface ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Built role assignment UI</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Created permission checker</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Added RLS integration</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Tested role inheritance</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Real-World Example: Multi-tenant SaaS Platform</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Building a project management SaaS with multiple organizations, teams, and complex permission requirements. 
                            Need tenant isolation, hierarchical permissions, project-specific access, and role inheritance across 1000+ organizations.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Role System Implementation:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Multi-level Hierarchy:</strong> Organization → Team → Project → Task level permissions</div>
                            <div>• <strong>Role Templates:</strong> Pre-defined roles with customizable permissions per organization</div>
                            <div>• <strong>Context-aware Access:</strong> Permissions based on project membership and team roles</div>
                            <div>• <strong>Temporal Permissions:</strong> Guest access with automatic expiration</div>
                            <div>• <strong>Inheritance Rules:</strong> Automatic permission cascading with override capabilities</div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Security:</strong> Zero unauthorized access incidents across all tenants</div>
                            <div>• <strong>Performance:</strong> &lt;50ms permission checks at 10k concurrent users</div>
                            <div>• <strong>Flexibility:</strong> 95% of permission requests handled without code changes</div>
                            <div>• <strong>Admin Efficiency:</strong> 78% reduction in support tickets for access issues</div>
                            <div>• <strong>Compliance:</strong> SOC 2 Type II certification achieved with automated auditing</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'security',
          title: '🛡️ Security',
          description: 'Advanced security measures',
          steps: [
            {
              id: 'webdev-integrate-auth-step-5',
              title: 'Role-Based Access',
              description: 'Implement user roles and permissions',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>Role-Based Access content</div>
            },
            {
              id: 'webdev-integrate-auth-step-6',
              title: 'Session Management',
              description: 'Secure session handling and JWT tokens',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                        🔐 Complete Session Management System
                      </h4>
                      <p className="mb-4">
                        Implement secure session handling with JWT tokens, automatic token refresh, 
                        session persistence, and comprehensive security measures to protect user sessions.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">🎯 Session Features</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>JWT Management:</strong> Secure token creation and validation</div>
                            <div><strong>Auto-Refresh:</strong> Seamless token renewal process</div>
                            <div><strong>Session Persistence:</strong> Cross-browser session storage</div>
                            <div><strong>Secure Logout:</strong> Complete session cleanup</div>
                            <div><strong>Device Tracking:</strong> Multi-device session management</div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">🛡️ Security Measures</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Token Expiration:</strong> Configurable session timeouts</div>
                            <div><strong>Refresh Rotation:</strong> Security-first token rotation</div>
                            <div><strong>Session Validation:</strong> Real-time session verification</div>
                            <div><strong>Anomaly Detection:</strong> Suspicious activity monitoring</div>
                            <div><strong>Secure Storage:</strong> HttpOnly cookies and secure flags</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">⚙️ Step-by-Step Session Management Implementation</h5>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: JWT Token Configuration (10 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Configure JWT tokens with proper expiration and security settings.</p>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 text-xs">Supabase JWT Configuration:</div>
                              <div className="text-xs space-y-1">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                  {`// lib/auth.ts`}<br/>
                                  {`export const authConfig = {`}<br/>
                                  {`  session: {`}<br/>
                                  {`    expires: 7 * 24 * 60 * 60, // 7 days`}<br/>
                                  {`    refreshThreshold: 60, // Refresh 60s before expiry`}<br/>
                                  {`    persistSession: true,`}<br/>
                                  {`    autoRefreshToken: true`}<br/>
                                  {`  }`}<br/>
                                  {`};`}<br/><br/>
                                  {`// Session state management`}<br/>
                                  {`export function useAuthSession() {`}<br/>
                                  {`  const [session, setSession] = useState(null);`}<br/>
                                  {`  const [loading, setLoading] = useState(true);`}<br/><br/>
                                  {`  useEffect(() => {`}<br/>
                                  {`    supabase.auth.getSession().then(({ data: { session } }) => {`}<br/>
                                  {`      setSession(session);`}<br/>
                                  {`      setLoading(false);`}<br/>
                                  {`    });`}<br/>
                                  {`  }, []);`}<br/>
                                  {`}`}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Automatic Token Refresh (8 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Implement seamless token refresh to maintain user sessions without interruption.</p>
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Token Refresh Implementation:</div>
                              <div className="text-xs space-y-1">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                  {`// hooks/useTokenRefresh.ts`}<br/>
                                  {`export function useTokenRefresh() {`}<br/>
                                  {`  useEffect(() => {`}<br/>
                                  {`    const { data: { subscription } } = supabase.auth.onAuthStateChange(`}<br/>
                                  {`      async (event, session) => {`}<br/>
                                  {`        if (event === 'TOKEN_REFRESHED') {`}<br/>
                                  {`          console.log('Token refreshed successfully');`}<br/>
                                  {`        }`}<br/>
                                  {`        if (event === 'SIGNED_OUT') {`}<br/>
                                  {`          // Clear all session data`}<br/>
                                  {`          localStorage.clear();`}<br/>
                                  {`          sessionStorage.clear();`}<br/>
                                  {`        }`}<br/>
                                  {`      }`}<br/>
                                  {`    );`}<br/><br/>
                                  {`    return () => subscription.unsubscribe();`}<br/>
                                  {`  }, []);`}<br/>
                                  {`}`}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: Session Validation Middleware (9 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Create middleware to validate sessions and protect routes automatically.</p>
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-purple-600 dark:text-purple-400 text-xs">Session Validation Middleware:</div>
                              <div className="text-xs space-y-1">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                  {`// middleware/auth.ts`}<br/>
                                  {`export async function validateSession(req: Request) {`}<br/>
                                  {`  const token = req.headers.authorization?.replace('Bearer ', '');`}<br/>
                                  {`  `}<br/>
                                  {`  if (!token) {`}<br/>
                                  {`    throw new Error('No authorization token provided');`}<br/>
                                  {`  }`}<br/><br/>
                                  {`  const { data: { user }, error } = await supabase.auth.getUser(token);`}<br/>
                                  {`  `}<br/>
                                  {`  if (error || !user) {`}<br/>
                                  {`    throw new Error('Invalid or expired session');`}<br/>
                                  {`  }`}<br/><br/>
                                  {`  return user;`}<br/>
                                  {`}`}<br/><br/>
                                  {`// React route protection`}<br/>
                                  {`export function ProtectedRoute({ children }) {`}<br/>
                                  {`  const { session, loading } = useAuthSession();`}<br/>
                                  {`  `}<br/>
                                  {`  if (loading) return <LoadingSpinner />;`}<br/>
                                  {`  if (!session) return <Navigate to="/auth" />;`}<br/>
                                  {`  `}<br/>
                                  {`  return children;`}<br/>
                                  {`}`}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Step 4: Secure Logout and Session Cleanup (8 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Implement comprehensive logout with complete session cleanup and security measures.</p>
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-orange-600 dark:text-orange-400 text-xs">Secure Logout Implementation:</div>
                              <div className="text-xs space-y-1">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                  {`// utils/logout.ts`}<br/>
                                  {`export async function secureLogout() {`}<br/>
                                  {`  try {`}<br/>
                                  {`    // Sign out from Supabase`}<br/>
                                  {`    const { error } = await supabase.auth.signOut();`}<br/>
                                  {`    `}<br/>
                                  {`    if (error) throw error;`}<br/><br/>
                                  {`    // Clear all local storage`}<br/>
                                  {`    localStorage.clear();`}<br/>
                                  {`    sessionStorage.clear();`}<br/><br/>
                                  {`    // Clear any cached data`}<br/>
                                  {`    if ('caches' in window) {`}<br/>
                                  {`      const cacheNames = await caches.keys();`}<br/>
                                  {`      await Promise.all(`}<br/>
                                  {`        cacheNames.map(cacheName => caches.delete(cacheName))`}<br/>
                                  {`      );`}<br/>
                                  {`    }`}<br/><br/>
                                  {`    // Redirect to login`}<br/>
                                  {`    window.location.href = '/auth';`}<br/>
                                  {`  } catch (error) {`}<br/>
                                  {`    console.error('Logout error:', error);`}<br/>
                                  {`  }`}<br/>
                                  {`}`}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">📋 Session Management Implementation Checklist</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h6 className="font-medium mb-2 text-sm">JWT Configuration ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Configured token expiration</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Set refresh thresholds</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Enabled session persistence</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Created session state management</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Token Refresh ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Implemented auto-refresh</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Added auth state listeners</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Handled refresh errors</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Tested token rotation</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Security & Cleanup ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Created route protection</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Added session validation</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Implemented secure logout</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Tested session cleanup</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Real-World Example: Banking Application</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Building a secure banking application requiring strict session management, automatic logout for idle users, 
                            device tracking, and comprehensive security measures to protect sensitive financial data.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Session Management Implementation:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Short-lived Tokens:</strong> 15-minute access tokens with 24-hour refresh tokens</div>
                            <div>• <strong>Device Fingerprinting:</strong> Track and validate user devices for anomaly detection</div>
                            <div>• <strong>Idle Timeout:</strong> Automatic logout after 5 minutes of inactivity</div>
                            <div>• <strong>Concurrent Sessions:</strong> Limit to 2 active sessions with device management</div>
                            <div>• <strong>Security Headers:</strong> HttpOnly cookies with Secure and SameSite flags</div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Security:</strong> Zero session hijacking incidents with 99.99% uptime</div>
                            <div>• <strong>User Experience:</strong> Seamless authentication with 98% user satisfaction</div>
                            <div>• <strong>Compliance:</strong> Met PCI DSS and SOX requirements for financial data protection</div>
                            <div>• <strong>Performance:</strong> &lt;100ms session validation with global load balancing</div>
                            <div>• <strong>Monitoring:</strong> Real-time fraud detection with 95% accuracy</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-auth-step-7',
              title: 'Security Best Practices',
              description: 'Implement security headers and best practices',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400">
                        🛡️ Complete Security Best Practices Guide
                      </h4>
                      <p className="mb-4">
                        Implement comprehensive security measures including security headers, input validation, 
                        rate limiting, and protection against common vulnerabilities to create a fortress-level secure application.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-red-700 dark:text-red-300">🔒 Security Headers</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Content Security Policy:</strong> Prevent XSS attacks</div>
                            <div><strong>HTTPS Enforcement:</strong> Force secure connections</div>
                            <div><strong>CSRF Protection:</strong> Prevent cross-site request forgery</div>
                            <div><strong>Clickjacking Protection:</strong> X-Frame-Options headers</div>
                            <div><strong>MIME Sniffing:</strong> Prevent content-type confusion</div>
                          </div>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">⚡ Security Practices</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Input Validation:</strong> Sanitize all user inputs</div>
                            <div><strong>Rate Limiting:</strong> Prevent brute force attacks</div>
                            <div><strong>SQL Injection:</strong> Parameterized queries protection</div>
                            <div><strong>Data Encryption:</strong> Encrypt sensitive data at rest</div>
                            <div><strong>Audit Logging:</strong> Track all security events</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-red-700 dark:text-red-300">⚙️ Step-by-Step Security Implementation</h5>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: Security Headers Configuration (8 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Configure comprehensive security headers to protect against common web vulnerabilities.</p>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 text-xs">Security Headers Setup:</div>
                              <div className="text-xs space-y-1">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                  {`// middleware/security.ts`}<br/>
                                  {`export const securityHeaders = {`}<br/>
                                  {`  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co",`}<br/>
                                  {`  'X-Frame-Options': 'DENY',`}<br/>
                                  {`  'X-Content-Type-Options': 'nosniff',`}<br/>
                                  {`  'Referrer-Policy': 'strict-origin-when-cross-origin',`}<br/>
                                  {`  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',`}<br/>
                                  {`  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'`}<br/>
                                  {`};`}<br/><br/>
                                  {`// Next.js configuration`}<br/>
                                  {`const nextConfig = {`}<br/>
                                  {`  async headers() {`}<br/>
                                  {`    return [{`}<br/>
                                  {`      source: '/(.*)',`}<br/>
                                  {`      headers: Object.entries(securityHeaders).map(([key, value]) => ({`}<br/>
                                  {`        key, value`}<br/>
                                  {`      }))`}<br/>
                                  {`    }];`}<br/>
                                  {`  }`}<br/>
                                  {`};`}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Input Validation and Sanitization (7 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Implement comprehensive input validation to prevent injection attacks and data corruption.</p>
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Input Validation System:</div>
                              <div className="text-xs space-y-1">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                  {`// utils/validation.ts`}<br/>
                                  {`import DOMPurify from 'dompurify';`}<br/>
                                  {`import { z } from 'zod';`}<br/><br/>
                                  {`export const userSchema = z.object({`}<br/>
                                  {`  email: z.string().email().max(255),`}<br/>
                                  {`  password: z.string().min(8).max(128).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])/),`}<br/>
                                  {`  name: z.string().min(1).max(100).regex(/^[a-zA-Z\\s]+$/))`}<br/>
                                  {`});`}<br/><br/>
                                  {`export function sanitizeInput(input: string): string {`}<br/>
                                  {`  return DOMPurify.sanitize(input.trim());`}<br/>
                                  {`}`}<br/><br/>
                                  {`export function validateAndSanitize(data: unknown, schema: z.ZodSchema) {`}<br/>
                                  {`  const validated = schema.parse(data);`}<br/>
                                  {`  return Object.fromEntries(`}<br/>
                                  {`    Object.entries(validated).map(([key, value]) => [`}<br/>
                                  {`      key, typeof value === 'string' ? sanitizeInput(value) : value`}<br/>
                                  {`    ])`}<br/>
                                  {`  );`}<br/>
                                  {`}`}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: Rate Limiting and DDoS Protection (8 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Implement rate limiting to prevent abuse and protect against brute force attacks.</p>
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-purple-600 dark:text-purple-400 text-xs">Rate Limiting Implementation:</div>
                              <div className="text-xs space-y-1">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                  {`// utils/rateLimit.ts`}<br/>
                                  {`import { Ratelimit } from '@upstash/ratelimit';`}<br/>
                                  {`import { Redis } from '@upstash/redis';`}<br/><br/>
                                  {`const redis = new Redis({`}<br/>
                                  {`  url: process.env.UPSTASH_REDIS_REST_URL!,`}<br/>
                                  {`  token: process.env.UPSTASH_REDIS_REST_TOKEN!`}<br/>
                                  {`});`}<br/><br/>
                                  {`export const authRateLimit = new Ratelimit({`}<br/>
                                  {`  redis,`}<br/>
                                  {`  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 attempts per minute`}<br/>
                                  {`  analytics: true`}<br/>
                                  {`});`}<br/><br/>
                                  {`export const apiRateLimit = new Ratelimit({`}<br/>
                                  {`  redis,`}<br/>
                                  {`  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute`}<br/>
                                  {`  analytics: true`}<br/>
                                  {`});`}<br/><br/>
                                  {`export async function checkRateLimit(request: Request, identifier: string) {`}<br/>
                                  {`  const { success, pending, limit, reset, remaining } = await apiRateLimit.limit(identifier);`}<br/>
                                  {`  return { success, limit, reset, remaining };`}<br/>
                                  {`}`}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Step 4: Security Monitoring and Logging (7 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Set up comprehensive security monitoring and audit logging for threat detection.</p>
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-orange-600 dark:text-orange-400 text-xs">Security Monitoring System:</div>
                              <div className="text-xs space-y-1">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                  {`// utils/securityLogger.ts`}<br/>
                                  {`export interface SecurityEvent {`}<br/>
                                  {`  type: 'login_attempt' | 'failed_auth' | 'suspicious_activity' | 'data_access';`}<br/>
                                  {`  userId?: string;`}<br/>
                                  {`  ip: string;`}<br/>
                                  {`  userAgent: string;`}<br/>
                                  {`  details: Record<string, any>;`}<br/>
                                  {`  timestamp: Date;`}<br/>
                                  {`}`}<br/><br/>
                                  {`export function logSecurityEvent(event: SecurityEvent) {`}<br/>
                                  {`  // Log to your security monitoring service`}<br/>
                                  {`  console.log('SECURITY_EVENT:', JSON.stringify(event));`}<br/>
                                  {`  `}<br/>
                                  {`  // Send to monitoring service (e.g., Sentry, LogRocket)`}<br/>
                                  {`  if (event.type === 'failed_auth' || event.type === 'suspicious_activity') {`}<br/>
                                  {`    // Trigger alert for security team`}<br/>
                                  {`    triggerSecurityAlert(event);`}<br/>
                                  {`  }`}<br/>
                                  {`}`}<br/><br/>
                                  {`// Middleware for request logging`}<br/>
                                  {`export function securityMiddleware(req: Request) {`}<br/>
                                  {`  const ip = req.headers.get('x-forwarded-for') || 'unknown';`}<br/>
                                  {`  const userAgent = req.headers.get('user-agent') || 'unknown';`}<br/>
                                  {`  `}<br/>
                                  {`  logSecurityEvent({`}<br/>
                                  {`    type: 'data_access',`}<br/>
                                  {`    ip, userAgent,`}<br/>
                                  {`    details: { method: req.method, url: req.url },`}<br/>
                                  {`    timestamp: new Date()`}<br/>
                                  {`  });`}<br/>
                                  {`}`}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">📋 Security Best Practices Implementation Checklist</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Security Headers ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Configured CSP headers</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Set X-Frame-Options</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Enabled HTTPS enforcement</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Added security middleware</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Input Validation ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Implemented Zod schemas</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Added input sanitization</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Created validation middleware</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Tested edge cases</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Monitoring & Protection ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Set up rate limiting</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Implemented security logging</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Added threat monitoring</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Tested security measures</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Real-World Example: Healthcare Platform Security</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Securing a healthcare platform handling sensitive patient data requiring HIPAA compliance, 
                            zero-tolerance for data breaches, comprehensive audit trails, and protection against advanced persistent threats.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Security Implementation:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Defense in Depth:</strong> Multi-layer security with WAF, DDoS protection, and intrusion detection</div>
                            <div>• <strong>Data Encryption:</strong> AES-256 encryption at rest and TLS 1.3 in transit</div>
                            <div>• <strong>Zero Trust Architecture:</strong> Verify every request with contextual authentication</div>
                            <div>• <strong>Real-time Monitoring:</strong> ML-powered anomaly detection with 24/7 SOC monitoring</div>
                            <div>• <strong>Compliance Automation:</strong> Automated HIPAA audit reports and vulnerability scanning</div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Security Rating:</strong> AAA+ rating with 100% HIPAA compliance certification</div>
                            <div>• <strong>Threat Prevention:</strong> Blocked 50,000+ attack attempts with 99.9% accuracy</div>
                            <div>• <strong>Zero Breaches:</strong> No security incidents in 3+ years of operation</div>
                            <div>• <strong>Performance:</strong> &lt;2% performance overhead from security measures</div>
                            <div>• <strong>Audit Success:</strong> Passed all compliance audits with zero findings</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        }
      ]
    },
    apis: {
      id: 'apis',
      title: 'Step-by-Step API Integration',
      icon: <Plug className="h-5 w-5" />,
      description: 'Connect and manage external APIs',
      sections: [
        {
          id: 'foundation',
          title: '🔌 Foundation',
          description: 'API basics and setup',
          steps: [
            {
              id: 'webdev-integrate-api-step-1',
              title: 'Understanding APIs',
              description: 'Learn API fundamentals and types',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>API Fundamentals</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>REST APIs</h3>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• HTTP methods (GET, POST, PUT, DELETE)</li>
                        <li>• JSON data format</li>
                        <li>• Status codes</li>
                        <li>• Best for: Simple, stateless operations</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>GraphQL APIs</h3>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Single endpoint</li>
                        <li>• Query specific data</li>
                        <li>• Type system</li>
                        <li>• Best for: Complex data requirements</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-api-step-2',
              title: 'API Authentication',
              description: 'Secure API access with proper authentication',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                        🔐 Complete API Authentication Mastery Guide
                      </h4>
                      <p className="mb-4">
                        Master all forms of API authentication including API keys, OAuth 2.0, JWT tokens, and OAuth flows. 
                        Learn to implement secure authentication patterns that protect your applications and user data.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">🔑 Authentication Methods</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>API Keys:</strong> Simple token-based authentication</div>
                            <div><strong>OAuth 2.0:</strong> Industry-standard authorization framework</div>
                            <div><strong>JWT Tokens:</strong> JSON Web Tokens for stateless auth</div>
                            <div><strong>Basic Auth:</strong> Username/password over HTTPS</div>
                            <div><strong>Bearer Tokens:</strong> Token-based API access</div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">🛡️ Security Features</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Token Expiration:</strong> Time-limited access tokens</div>
                            <div><strong>Scope Limitations:</strong> Granular permission control</div>
                            <div><strong>Rate Limiting:</strong> Prevent API abuse</div>
                            <div><strong>HTTPS Only:</strong> Encrypted communication</div>
                            <div><strong>Token Rotation:</strong> Regular credential updates</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">⚙️ Step-by-Step Authentication Implementation</h5>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: API Key Authentication (6 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Implement secure API key authentication for simple, fast API access.</p>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 text-xs">API Key Implementation:</div>
                              <div className="text-xs space-y-1">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                  {`// utils/apiClient.ts`}<br/>
                                  {`const API_KEY = process.env.NEXT_PUBLIC_API_KEY;`}<br/><br/>
                                  {`export async function apiRequest(url: string, options: RequestInit = {}) {`}<br/>
                                  {`  const headers = {`}<br/>
                                  {`    'Content-Type': 'application/json',`}<br/>
                                  {`    'X-API-Key': API_KEY,`}<br/>
                                  {`    ...options.headers`}<br/>
                                  {`  };`}<br/><br/>
                                  {`  const response = await fetch(url, {`}<br/>
                                  {`    ...options,`}<br/>
                                  {`    headers`}<br/>
                                  {`  });`}<br/><br/>
                                  {`  if (!response.ok) {`}<br/>
                                  {`    throw new Error('API request failed: ' + response.status);`}<br/>
                                  {`  }`}<br/><br/>
                                  {`  return response.json();`}<br/>
                                  {`}`}
                                </div>
                                <div>• <strong>Environment Variables:</strong> Store API keys securely</div>
                                <div>• <strong>Header Authentication:</strong> X-API-Key or Authorization header</div>
                                <div>• <strong>Error Handling:</strong> Proper error responses for invalid keys</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: OAuth 2.0 Flow Implementation (8 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Implement OAuth 2.0 authorization flow for secure third-party API access.</p>
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">OAuth 2.0 Authorization Code Flow:</div>
                              <div className="text-xs space-y-1">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                  {`// utils/oauth.ts`}<br/>
                                  {`export class OAuthClient {`}<br/>
                                  {`  constructor(`}<br/>
                                  {`    private clientId: string,`}<br/>
                                  {`    private clientSecret: string,`}<br/>
                                  {`    private redirectUri: string`}<br/>
                                  {`  ) {}`}<br/><br/>
                                  {`  getAuthorizationUrl(scopes: string[] = [], state?: string) {`}<br/>
                                  {`    const params = new URLSearchParams({`}<br/>
                                  {`      response_type: 'code',`}<br/>
                                  {`      client_id: this.clientId,`}<br/>
                                  {`      redirect_uri: this.redirectUri,`}<br/>
                                  {`      scope: scopes.join(' '),`}<br/>
                                  {`      state: state || crypto.randomUUID()`}<br/>
                                  {`    });`}<br/>
                                  {`    return 'https://api.example.com/oauth/authorize?' + params;`}<br/>
                                  {`  }`}<br/><br/>
                                  {`  async exchangeCodeForToken(code: string) {`}<br/>
                                  {`    const response = await fetch('https://api.example.com/oauth/token', {`}<br/>
                                  {`      method: 'POST',`}<br/>
                                  {`      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },`}<br/>
                                  {`      body: new URLSearchParams({`}<br/>
                                  {`        grant_type: 'authorization_code',`}<br/>
                                  {`        code,`}<br/>
                                  {`        client_id: this.clientId,`}<br/>
                                  {`        client_secret: this.clientSecret,`}<br/>
                                  {`        redirect_uri: this.redirectUri`}<br/>
                                  {`      })`}<br/>
                                  {`    });`}<br/>
                                  {`    return response.json();`}<br/>
                                  {`  }`}<br/>
                                  {`}`}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: JWT Token Management (6 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Handle JWT tokens with automatic refresh and secure storage.</p>
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-purple-600 dark:text-purple-400 text-xs">JWT Token Handler:</div>
                              <div className="text-xs space-y-1">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                  {`// utils/tokenManager.ts`}<br/>
                                  {`export class TokenManager {`}<br/>
                                  {`  private accessToken: string | null = null;`}<br/>
                                  {`  private refreshToken: string | null = null;`}<br/>
                                  {`  private expiresAt: Date | null = null;`}<br/><br/>
                                  {`  setTokens(tokens: { access_token: string, refresh_token: string, expires_in: number }) {`}<br/>
                                  {`    this.accessToken = tokens.access_token;`}<br/>
                                  {`    this.refreshToken = tokens.refresh_token;`}<br/>
                                  {`    this.expiresAt = new Date(Date.now() + tokens.expires_in * 1000);`}<br/>
                                  {`    `}<br/>
                                  {`    // Store securely`}<br/>
                                  {`    localStorage.setItem('tokens', JSON.stringify({`}<br/>
                                  {`      accessToken: this.accessToken,`}<br/>
                                  {`      refreshToken: this.refreshToken,`}<br/>
                                  {`      expiresAt: this.expiresAt.toISOString()`}<br/>
                                  {`    }));`}<br/>
                                  {`  }`}<br/><br/>
                                  {`  async getValidToken(): Promise<string> {`}<br/>
                                  {`    if (!this.accessToken || this.isTokenExpired()) {`}<br/>
                                  {`      await this.refreshAccessToken();`}<br/>
                                  {`    }`}<br/>
                                  {`    return this.accessToken!;`}<br/>
                                  {`  }`}<br/><br/>
                                  {`  private isTokenExpired(): boolean {`}<br/>
                                  {`    if (!this.expiresAt) return true;`}<br/>
                                  {`    return new Date() >= new Date(this.expiresAt.getTime() - 60000); // 1 min buffer`}<br/>
                                  {`  }`}<br/>
                                  {`}`}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Step 4: Authentication Middleware (5 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Create reusable authentication middleware for consistent API security.</p>
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-orange-600 dark:text-orange-400 text-xs">Auth Middleware:</div>
                              <div className="text-xs space-y-1">
                                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                  {`// middleware/authMiddleware.ts`}<br/>
                                  {`export function withAuth(handler: Function) {`}<br/>
                                  {`  return async (req: Request, res: Response) => {`}<br/>
                                  {`    try {`}<br/>
                                  {`      const authHeader = req.headers.authorization;`}<br/>
                                  {`      `}<br/>
                                  {`      if (!authHeader) {`}<br/>
                                  {`        return res.status(401).json({ error: 'No authorization header' });`}<br/>
                                  {`      }`}<br/><br/>
                                  {`      const token = authHeader.replace('Bearer ', '');`}<br/>
                                  {`      const validatedUser = await validateToken(token);`}<br/>
                                  {`      `}<br/>
                                  {`      req.user = validatedUser;`}<br/>
                                  {`      return handler(req, res);`}<br/>
                                  {`    } catch (error) {`}<br/>
                                  {`      return res.status(401).json({ error: 'Invalid token' });`}<br/>
                                  {`    }`}<br/>
                                  {`  };`}<br/>
                                  {`}`}<br/><br/>
                                  {`// Usage`}<br/>
                                  {`export default withAuth(async (req, res) => {`}<br/>
                                  {`  // Protected endpoint logic`}<br/>
                                  {`  res.json({ message: 'Authenticated request', user: req.user });`}<br/>
                                  {`});`}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">📚 External Learning Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Documentation &amp; Guides</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <strong>OAuth 2.0 RFC:</strong> <a href="https://tools.ietf.org/html/rfc6749" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Official OAuth 2.0 Specification</a></div>
                            <div>• <strong>JWT.io:</strong> <a href="https://jwt.io/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">JWT Token Debugger &amp; Resources</a></div>
                            <div>• <strong>Auth0 Docs:</strong> <a href="https://auth0.com/docs" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Comprehensive Auth Documentation</a></div>
                            <div>• <strong>MDN Web Docs:</strong> <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication" target="_blank" rel="noopener" className="text-blue-500 hover:underline">HTTP Authentication Guide</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🎓 Interactive Learning</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <strong>OAuth Playground:</strong> <a href="https://developers.google.com/oauthplayground" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Google OAuth 2.0 Playground</a></div>
                            <div>• <strong>Postman Learning:</strong> <a href="https://learning.postman.com/docs/sending-requests/authorization/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">API Authorization in Postman</a></div>
                            <div>• <strong>Okta Developer:</strong> <a href="https://developer.okta.com/blog/2017/06/21/what-the-heck-is-oauth" target="_blank" rel="noopener" className="text-blue-500 hover:underline">What the Heck is OAuth?</a></div>
                            <div>• <strong>FreeCodeCamp:</strong> <a href="https://www.freecodecamp.org/news/oauth-2-explained/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">OAuth 2.0 Explained</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">📋 API Authentication Implementation Checklist</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Basic Authentication ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Implemented API key auth</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Added secure headers</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Environment variable config</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Error handling setup</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">OAuth Implementation ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Authorization URL generation</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Token exchange flow</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Scope management</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>State parameter security</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Token Management ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>JWT token handling</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Automatic token refresh</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Secure token storage</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Auth middleware created</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Real-World Example: Social Media API Integration</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Building a social media management dashboard that integrates with Twitter, Instagram, LinkedIn, and Facebook APIs. 
                            Need secure authentication for multiple platforms, token management, and user permission handling.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Authentication Implementation:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Multi-Platform OAuth:</strong> Separate OAuth flows for each social platform</div>
                            <div>• <strong>Token Storage:</strong> Encrypted token storage with per-platform refresh logic</div>
                            <div>• <strong>Scope Management:</strong> Granular permissions for posting, reading, analytics</div>
                            <div>• <strong>Rate Limit Handling:</strong> Platform-specific rate limit management</div>
                            <div>• <strong>Error Recovery:</strong> Automatic re-authentication on token expiry</div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>User Experience:</strong> One-click connection to all social platforms</div>
                            <div>• <strong>Reliability:</strong> 99.8% uptime with automatic token refresh</div>
                            <div>• <strong>Security:</strong> Zero token leaks with encrypted storage</div>
                            <div>• <strong>Performance:</strong> 500ms average response time across all APIs</div>
                            <div>• <strong>Scale:</strong> Supporting 10,000+ connected accounts seamlessly</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'integration',
          title: '🔗 Integration',
          description: 'Connect and consume APIs',
          steps: [
            {
              id: 'webdev-integrate-api-step-3',
              title: 'Fetch & Axios',
              description: 'Make HTTP requests with modern tools',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        🌐 Complete Fetch &amp; Axios Mastery Guide
                      </h4>
                      <p className="mb-4">Master modern HTTP client libraries with Fetch API and Axios for reliable, efficient API communication.</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">📡 Fetch API</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Native Browser API:</strong> Built-in, no dependencies</div>
                            <div><strong>Promise-based:</strong> Modern async/await support</div>
                            <div><strong>Streaming Support:</strong> Handle large responses</div>
                            <div><strong>Request/Response:</strong> Full control over HTTP</div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">⚡ Axios Library</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Request Interceptors:</strong> Transform requests globally</div>
                            <div><strong>Auto JSON Parsing:</strong> Automatic data transformation</div>
                            <div><strong>Timeout Handling:</strong> Built-in timeout support</div>
                            <div><strong>Request Cancellation:</strong> Cancel in-flight requests</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">⚙️ Implementation Steps</h5>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: Fetch API Setup (8 min)</h6>
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                            <div className="text-xs space-y-1">
                              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                {`// utils/fetchClient.ts`}<br/>
                                {`export async function apiRequest(url: string, options: RequestInit = {}) {`}<br/>
                                {`  const config: RequestInit = {`}<br/>
                                {`    headers: {`}<br/>
                                {`      'Content-Type': 'application/json',`}<br/>
                                {`      ...options.headers`}<br/>
                                {`    },`}<br/>
                                {`    ...options`}<br/>
                                {`  };`}<br/><br/>
                                {`  const response = await fetch(url, config);`}<br/>
                                {`  if (!response.ok) throw new Error(response.statusText);`}<br/>
                                {`  return response.json();`}<br/>
                                {`}`}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Axios Configuration (8 min)</h6>
                          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                            <div className="text-xs space-y-1">
                              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                {`// utils/axiosClient.ts`}<br/>
                                {`import axios from 'axios';`}<br/><br/>
                                {`const apiClient = axios.create({`}<br/>
                                {`  baseURL: process.env.NEXT_PUBLIC_API_URL,`}<br/>
                                {`  timeout: 10000,`}<br/>
                                {`  headers: {`}<br/>
                                {`    'Content-Type': 'application/json'`}<br/>
                                {`  }`}<br/>
                                {`});`}<br/><br/>
                                {`// Request interceptor`}<br/>
                                {`apiClient.interceptors.request.use(config => {`}<br/>
                                {`  const token = localStorage.getItem('auth_token');`}<br/>
                                {`  if (token) config.headers.Authorization = 'Bearer ' + token;`}<br/>
                                {`  return config;`}<br/>
                                {`});`}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: Response Interceptors (7 min)</h6>
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                            <div className="text-xs space-y-1">
                              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                {`// Response interceptor for error handling`}<br/>
                                {`apiClient.interceptors.response.use(`}<br/>
                                {`  response => response.data,`}<br/>
                                {`  error => {`}<br/>
                                {`    if (error.response?.status === 401) {`}<br/>
                                {`      // Handle unauthorized`}<br/>
                                {`      localStorage.removeItem('auth_token');`}<br/>
                                {`      window.location.href = '/login';`}<br/>
                                {`    }`}<br/>
                                {`    return Promise.reject(error);`}<br/>
                                {`  }`}<br/>
                                {`);`}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Step 4: Request Cancellation (7 min)</h6>
                          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                            <div className="text-xs space-y-1">
                              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                {`// hooks/useApiRequest.ts`}<br/>
                                {`export function useApiRequest() {`}<br/>
                                {`  const [controller, setController] = useState<AbortController>();`}<br/><br/>
                                {`  const makeRequest = async (url: string, options = {}) => {`}<br/>
                                {`    // Cancel previous request`}<br/>
                                {`    if (controller) controller.abort();`}<br/><br/>
                                {`    const newController = new AbortController();`}<br/>
                                {`    setController(newController);`}<br/><br/>
                                {`    return fetch(url, {`}<br/>
                                {`      ...options,`}<br/>
                                {`      signal: newController.signal`}<br/>
                                {`    });`}<br/>
                                {`  };`}<br/><br/>
                                {`  useEffect(() => () => controller?.abort(), []);`}<br/>
                                {`  return { makeRequest };`}<br/>
                                {`}`}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">📚 External Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Official Docs</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API" target="_blank" rel="noopener" className="text-blue-500 hover:underline">MDN Fetch API Guide</a></div>
                            <div>• <a href="https://axios-http.com/docs/intro" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Axios Documentation</a></div>
                            <div>• <a href="https://javascript.info/fetch" target="_blank" rel="noopener" className="text-blue-500 hover:underline">JavaScript.info Fetch</a></div>
                            <div>• <a href="https://web.dev/introduction-to-fetch/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Web.dev Fetch Introduction</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🎓 Tutorials</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://blog.logrocket.com/axios-vs-fetch-best-http-requests/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Axios vs Fetch Comparison</a></div>
                            <div>• <a href="https://www.youtube.com/watch?v=cuEtnrL9-H0" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Fetch API Crash Course</a></div>
                            <div>• <a href="https://www.youtube.com/watch?v=6LyagkoRWYA" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Axios Tutorial</a></div>
                            <div>• <a href="https://rapidapi.com/blog/axios-react-api-tutorial/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Axios with React Tutorial</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">📋 Implementation Checklist</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Fetch Setup ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Basic fetch wrapper</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Error handling</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Response parsing</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Axios Config ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Base configuration</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Request interceptors</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Response interceptors</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Advanced Features ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Request cancellation</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Timeout handling</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Custom hooks</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Real-World: E-commerce API</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            E-commerce platform needing reliable API communication for products, orders, payments with offline support.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Solution:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Axios Client:</strong> Centralized configuration with interceptors</div>
                            <div>• <strong>Request Queue:</strong> Retry failed requests automatically</div>
                            <div>• <strong>Caching:</strong> Cache GET requests for performance</div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Performance:</strong> 40% faster page loads with caching</div>
                            <div>• <strong>Reliability:</strong> 99.9% success rate with retry logic</div>
                            <div>• <strong>UX:</strong> Seamless offline experience</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-api-step-4',
              title: 'Error Handling',
              description: 'Handle API errors gracefully',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400">🚨 API Error Handling Mastery</h4>
                      <p className="mb-4">Build resilient applications with comprehensive error handling, retry logic, and user-friendly error messages.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-red-700 dark:text-red-300">🔍 Error Types</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Network Errors:</strong> Connection failures, timeouts</div>
                            <div><strong>HTTP Errors:</strong> 4xx client, 5xx server errors</div>
                            <div><strong>Parse Errors:</strong> Invalid JSON responses</div>
                            <div><strong>Validation Errors:</strong> Data format issues</div>
                          </div>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">🛠️ Handling Strategies</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Retry Logic:</strong> Exponential backoff</div>
                            <div><strong>Circuit Breaker:</strong> Prevent cascade failures</div>
                            <div><strong>Graceful Degradation:</strong> Fallback content</div>
                            <div><strong>User Feedback:</strong> Clear error messages</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-red-700 dark:text-red-300">⚙️ Implementation Steps</h5>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: Error Classification (6 min)</h6>
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                            <div className="text-xs space-y-1">
                              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                {`class ApiError extends Error {`}<br/>
                                {`  constructor(message, status, type) {`}<br/>
                                {`    super(message);`}<br/>
                                {`    this.status = status;`}<br/>
                                {`    this.type = type; // 'network', 'client', 'server'`}<br/>
                                {`  }`}<br/>
                                {`}`}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Retry Logic (7 min)</h6>
                          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                            <div className="text-xs space-y-1">
                              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                {`async function retryRequest(fn, maxRetries = 3) {`}<br/>
                                {`  for (let i = 0; i < maxRetries; i++) {`}<br/>
                                {`    try {`}<br/>
                                {`      return await fn();`}<br/>
                                {`    } catch (error) {`}<br/>
                                {`      if (i === maxRetries - 1) throw error;`}<br/>
                                {`      await delay(Math.pow(2, i) * 1000);`}<br/>
                                {`    }`}<br/>
                                {`  }`}<br/>
                                {`}`}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: User-Friendly Messages (6 min)</h6>
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                            <div className="text-xs space-y-1">
                              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                {`const errorMessages = {`}<br/>
                                {`  400: 'Please check your input',`}<br/>
                                {`  401: 'Please log in again',`}<br/>
                                {`  403: 'Access denied',`}<br/>
                                {`  404: 'Resource not found',`}<br/>
                                {`  500: 'Server error, please try again'`}<br/>
                                {`};`}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Step 4: Global Error Handler (6 min)</h6>
                          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                            <div className="text-xs space-y-1">
                              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                {`// contexts/ErrorContext.tsx`}<br/>
                                {`export function ErrorProvider({ children }) {`}<br/>
                                {`  const [error, setError] = useState(null);`}<br/>
                                {`  `}<br/>
                                {`  const showError = (error) => {`}<br/>
                                {`    setError(error);`}<br/>
                                {`    setTimeout(() => setError(null), 5000);`}<br/>
                                {`  };`}<br/>
                                {`  `}<br/>
                                {`  return (`}<br/>
                                {`    <ErrorContext.Provider value={{ showError }}>`}<br/>
                                {`      {children}`}<br/>
                                {`      {error && <ErrorToast error={error} />}`}<br/>
                                {`    </ErrorContext.Provider>`}<br/>
                                {`  );`}<br/>
                                {`}`}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">📚 External Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Error Handling Guides</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status" target="_blank" rel="noopener" className="text-blue-500 hover:underline">HTTP Status Codes - MDN</a></div>
                            <div>• <a href="https://blog.logrocket.com/error-handling-react-error-boundary/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">React Error Boundaries</a></div>
                            <div>• <a href="https://martinfowler.com/bliki/CircuitBreaker.html" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Circuit Breaker Pattern</a></div>
                            <div>• <a href="https://www.patterns.dev/posts/error-boundary-pattern/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Error Boundary Patterns</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🎓 Best Practices</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://github.com/goldbergyoni/nodebestpractices#-6-error-handling-practices" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Node.js Error Handling</a></div>
                            <div>• <a href="https://web.dev/resilient-search-experiences/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Resilient Web Experiences</a></div>
                            <div>• <a href="https://www.youtube.com/watch?v=Fdf5aTYRW0E" target="_blank" rel="noopener" className="text-blue-500 hover:underline">JavaScript Error Handling</a></div>
                            <div>• <a href="https://kentcdodds.com/blog/use-react-error-boundary-to-handle-errors-in-react" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Kent C. Dodds Error Guide</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-red-700 dark:text-red-300">📋 Implementation Checklist</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Error Types ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Custom error classes</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Error categorization</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Status code mapping</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Recovery Logic ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Retry mechanism</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Exponential backoff</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Circuit breaker</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">User Experience ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Error messages</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Global error handler</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Fallback UI</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Real-World: Payment Processing</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">Payment gateway with critical error handling - no transaction should be lost or duplicated.</p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Solution:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Idempotency Keys:</strong> Prevent duplicate transactions</div>
                            <div>• <strong>Circuit Breaker:</strong> Fail fast when gateway is down</div>
                            <div>• <strong>Dead Letter Queue:</strong> Store failed payments for retry</div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Reliability:</strong> 99.99% transaction success rate</div>
                            <div>• <strong>Recovery:</strong> 100% failed payment recovery</div>
                            <div>• <strong>UX:</strong> Clear error messages reduce support tickets 60%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'optimization',
          title: '⚡ Optimization',
          description: 'Optimize API performance',
          steps: [
            {
              id: 'webdev-integrate-api-step-5',
              title: 'Caching Strategies',
              description: 'Implement effective API caching',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">⚡ API Caching Strategies Mastery</h4>
                      <p className="mb-4">Optimize API performance with intelligent caching strategies including browser cache, CDN, and service worker caching.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">🔄 Cache Types</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Browser Cache:</strong> HTTP headers, localStorage</div>
                            <div><strong>Memory Cache:</strong> In-memory data storage</div>
                            <div><strong>Service Worker:</strong> Offline-first caching</div>
                            <div><strong>CDN Cache:</strong> Edge location caching</div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">📈 Strategies</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Cache-First:</strong> Serve from cache, fallback to network</div>
                            <div><strong>Network-First:</strong> Try network, fallback to cache</div>
                            <div><strong>Stale-While-Revalidate:</strong> Serve cache, update background</div>
                            <div><strong>Cache-Only:</strong> Offline-only resources</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">⚙️ Implementation (35 min)</h5>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Memory Cache (10 min)</h6>
                          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                            <div className="text-xs space-y-1">
                              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                {`class MemoryCache {`}<br/>
                                {`  constructor(ttl = 300000) { // 5 min default`}<br/>
                                {`    this.cache = new Map();`}<br/>
                                {`    this.ttl = ttl;`}<br/>
                                {`  }`}<br/><br/>
                                {`  set(key, value) {`}<br/>
                                {`    this.cache.set(key, {`}<br/>
                                {`      value,`}<br/>
                                {`      expires: Date.now() + this.ttl`}<br/>
                                {`    });`}<br/>
                                {`  }`}<br/><br/>
                                {`  get(key) {`}<br/>
                                {`    const item = this.cache.get(key);`}<br/>
                                {`    if (!item || Date.now() > item.expires) {`}<br/>
                                {`      this.cache.delete(key);`}<br/>
                                {`      return null;`}<br/>
                                {`    }`}<br/>
                                {`    return item.value;`}<br/>
                                {`  }`}<br/>
                                {`}`}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">HTTP Cache Headers (8 min)</h6>
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                            <div className="text-xs space-y-1">
                              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                {`// API Response Headers`}<br/>
                                {`const cacheHeaders = {`}<br/>
                                {`  'Cache-Control': 'public, max-age=300', // 5 minutes`}<br/>
                                {`  'ETag': '"v1.0"',`}<br/>
                                {`  'Last-Modified': new Date().toUTCString()`}<br/>
                                {`};`}<br/><br/>
                                {`// Client-side cache check`}<br/>
                                {`const response = await fetch(url, {`}<br/>
                                {`  headers: {`}<br/>
                                {`    'If-None-Match': storedETag,`}<br/>
                                {`    'If-Modified-Since': lastModified`}<br/>
                                {`  }`}<br/>
                                {`});`}<br/>
                                {`if (response.status === 304) {`}<br/>
                                {`  return getCachedData(url);`}<br/>
                                {`}`}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Service Worker Cache (10 min)</h6>
                          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                            <div className="text-xs space-y-1">
                              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                {`// sw.js - Service Worker`}<br/>
                                {`self.addEventListener('fetch', event => {`}<br/>
                                {`  if (event.request.url.includes('/api/')) {`}<br/>
                                {`    event.respondWith(`}<br/>
                                {`      caches.open('api-cache').then(cache => {`}<br/>
                                {`        return cache.match(event.request).then(response => {`}<br/>
                                {`          if (response) {`}<br/>
                                {`            // Serve from cache, update in background`}<br/>
                                {`            fetch(event.request).then(fetchResponse => {`}<br/>
                                {`              cache.put(event.request, fetchResponse.clone());`}<br/>
                                {`            });`}<br/>
                                {`            return response;`}<br/>
                                {`          }`}<br/>
                                {`          return fetch(event.request).then(fetchResponse => {`}<br/>
                                {`            cache.put(event.request, fetchResponse.clone());`}<br/>
                                {`            return fetchResponse;`}<br/>
                                {`          });`}<br/>
                                {`        });`}<br/>
                                {`      })`}<br/>
                                {`    );`}<br/>
                                {`  }`}<br/>
                                {`});`}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-red-600 dark:text-red-400">Smart Invalidation (7 min)</h6>
                          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                            <div className="text-xs space-y-1">
                              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded font-mono">
                                {`class SmartCache {`}<br/>
                                {`  constructor() {`}<br/>
                                {`    this.cache = new Map();`}<br/>
                                {`    this.dependencies = new Map();`}<br/>
                                {`  }`}<br/><br/>
                                {`  set(key, value, deps = []) {`}<br/>
                                {`    this.cache.set(key, value);`}<br/>
                                {`    deps.forEach(dep => {`}<br/>
                                {`      if (!this.dependencies.has(dep)) {`}<br/>
                                {`        this.dependencies.set(dep, new Set());`}<br/>
                                {`      }`}<br/>
                                {`      this.dependencies.get(dep).add(key);`}<br/>
                                {`    });`}<br/>
                                {`  }`}<br/><br/>
                                {`  invalidate(dependency) {`}<br/>
                                {`    const keys = this.dependencies.get(dependency);`}<br/>
                                {`    if (keys) {`}<br/>
                                {`      keys.forEach(key => this.cache.delete(key));`}<br/>
                                {`      this.dependencies.delete(dependency);`}<br/>
                                {`    }`}<br/>
                                {`  }`}<br/>
                                {`}`}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">📚 External Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Caching Guides</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://web.dev/http-cache/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">HTTP Caching - Web.dev</a></div>
                            <div>• <a href="https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Service Workers - MDN</a></div>
                            <div>• <a href="https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Offline Cookbook</a></div>
                            <div>• <a href="https://www.keycdn.com/blog/http-cache-headers" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Cache Headers Guide</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🛠️ Tools &amp; Libraries</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://swr.vercel.app/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">SWR - Data Fetching Library</a></div>
                            <div>• <a href="https://react-query.tanstack.com/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">React Query - Server State</a></div>
                            <div>• <a href="https://developers.google.com/web/tools/workbox" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Workbox - PWA Libraries</a></div>
                            <div>• <a href="https://www.npmjs.com/package/lru-cache" target="_blank" rel="noopener" className="text-blue-500 hover:underline">LRU Cache - Node.js</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Real-World: News Application</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">News app with frequent content updates, offline reading, and fast load times for mobile users.</p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Caching Strategy:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Headlines:</strong> 2-minute cache with stale-while-revalidate</div>
                            <div>• <strong>Full Articles:</strong> 24-hour cache with background sync</div>
                            <div>• <strong>Images:</strong> Permanent cache with CDN</div>
                            <div>• <strong>Offline Mode:</strong> Service worker with last 50 articles</div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Performance:</strong> 85% faster page loads with caching</div>
                            <div>• <strong>Data Usage:</strong> 60% reduction in mobile data consumption</div>
                            <div>• <strong>Offline UX:</strong> 100% article availability offline</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-api-step-6',
              title: 'Rate Limiting',
              description: 'Handle rate limits and quotas',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-yellow-600 dark:text-yellow-400">
                        ⚡ Complete Rate Limiting &amp; Quota Management Guide
                      </h4>
                      <p className="mb-4">
                        Master API rate limiting strategies to handle quotas gracefully, implement intelligent throttling, 
                        and create resilient applications that work within API constraints while providing excellent user experience.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-yellow-700 dark:text-yellow-300">🎯 Rate Limiting Types</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Fixed Window:</strong> Reset quotas at fixed intervals (hourly/daily)</div>
                            <div><strong>Sliding Window:</strong> Rolling time periods for smoother limits</div>
                            <div><strong>Token Bucket:</strong> Burst traffic with sustained rate control</div>
                            <div><strong>Leaky Bucket:</strong> Smooth, consistent request processing</div>
                            <div><strong>Concurrent Limits:</strong> Maximum simultaneous requests</div>
                          </div>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">🛡️ Handling Strategies</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Request Queuing:</strong> Queue requests when limits approached</div>
                            <div><strong>Intelligent Backoff:</strong> Smart retry timing based on headers</div>
                            <div><strong>Priority Queues:</strong> Critical requests get preference</div>
                            <div><strong>Circuit Breakers:</strong> Fail fast when limits consistently hit</div>
                            <div><strong>User Communication:</strong> Clear feedback about limitations</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-yellow-700 dark:text-yellow-300">⚙️ Step-by-Step Rate Limiting Implementation Strategy</h5>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: Understanding API Rate Limits (8 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Learn to read and interpret rate limit information from API providers to build effective handling strategies.</p>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 text-xs">Common Rate Limit Patterns:</div>
                              <div className="text-xs space-y-2">
                                <div><strong>HTTP Headers Analysis:</strong> X-RateLimit-Remaining, X-RateLimit-Reset, Retry-After headers tell you current quota status and when limits refresh</div>
                                <div><strong>API Documentation Study:</strong> Each provider has different limits - Twitter allows 300 requests/15min, GitHub allows 5000/hour, Stripe varies by endpoint type</div>
                                <div><strong>Tier-Based Limits:</strong> Free vs paid tiers often have dramatically different quotas - understand your current plan limitations</div>
                                <div><strong>Endpoint-Specific Limits:</strong> Different endpoints may have separate quotas - search APIs often more restricted than basic data retrieval</div>
                                <div><strong>User vs App Limits:</strong> Some APIs limit per user, others per application - affects how you architect multi-user applications</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Building Rate Limit Awareness (7 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Create systems that monitor and track rate limit consumption in real-time to prevent hitting limits.</p>
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Rate Limit Monitoring Strategies:</div>
                              <div className="text-xs space-y-2">
                                <div><strong>Header Tracking:</strong> Parse rate limit headers from every API response to maintain current quota awareness</div>
                                <div><strong>Local Counters:</strong> Maintain client-side counters that estimate usage when headers aren't available</div>
                                <div><strong>Threshold Alerts:</strong> Set up warnings when approaching 80% of quota to trigger defensive measures</div>
                                <div><strong>Usage Analytics:</strong> Track patterns to understand peak usage times and optimize request distribution</div>
                                <div><strong>Multi-Key Management:</strong> For high-volume apps, rotate between multiple API keys to increase effective quotas</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: Implementing Smart Request Queuing (8 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Design intelligent request queuing systems that smooth out traffic and respect rate limits automatically.</p>
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-purple-600 dark:text-purple-400 text-xs">Queue Management Strategies:</div>
                              <div className="text-xs space-y-2">
                                <div><strong>Priority-Based Queuing:</strong> Critical user-facing requests get higher priority than background data sync operations</div>
                                <div><strong>Adaptive Timing:</strong> Adjust queue processing speed based on current rate limit headroom and historical patterns</div>
                                <div><strong>Batch Optimization:</strong> Group similar requests together when APIs support batch operations to maximize efficiency</div>
                                <div><strong>User Experience Preservation:</strong> Always prioritize interactive requests over automated background tasks</div>
                                <div><strong>Graceful Degradation:</strong> When limits hit, disable non-essential features while maintaining core functionality</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Step 4: User Communication &amp; Fallback Strategies (7 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Create transparent user communication and intelligent fallback mechanisms when rate limits are reached.</p>
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-orange-600 dark:text-orange-400 text-xs">User Experience During Rate Limiting:</div>
                              <div className="text-xs space-y-2">
                                <div><strong>Transparent Feedback:</strong> Show users clear messages about delays: "Processing your request - estimated wait: 2 minutes due to API limits"</div>
                                <div><strong>Progress Indicators:</strong> Use progress bars and estimated completion times to manage user expectations during queued requests</div>
                                <div><strong>Cached Fallbacks:</strong> Serve slightly stale cached data with clear timestamps rather than showing errors or blank pages</div>
                                <div><strong>Alternative Data Sources:</strong> Have backup APIs or data providers ready for critical functionality when primary APIs are limited</div>
                                <div><strong>Upgrade Prompts:</strong> For high-usage users, suggest API plan upgrades or premium tiers to remove limitations</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">📚 Essential Learning Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Rate Limiting Concepts</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://cloud.google.com/architecture/rate-limiting-strategies-techniques" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Google Cloud Rate Limiting Guide</a></div>
                            <div>• <a href="https://stripe.com/blog/rate-limiters" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Stripe's Rate Limiting Architecture</a></div>
                            <div>• <a href="https://blog.cloudflare.com/counting-things-a-lot-of-different-things/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Cloudflare Rate Limiting Deep Dive</a></div>
                            <div>• <a href="https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting" target="_blank" rel="noopener" className="text-blue-500 hover:underline">GitHub API Rate Limiting Docs</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🛠️ Implementation Patterns</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://microservices.io/patterns/reliability/circuit-breaker.html" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Circuit Breaker Pattern</a></div>
                            <div>• <a href="https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">AWS Backoff &amp; Jitter Strategies</a></div>
                            <div>• <a href="https://blog.twitter.com/engineering/en_us/topics/infrastructure/2017/the-infrastructure-behind-twitter-scale" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Twitter's Scale Infrastructure</a></div>
                            <div>• <a href="https://netflixtechblog.com/fault-tolerance-in-a-high-volume-distributed-system-91ab4faae74a" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Netflix Fault Tolerance</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-yellow-700 dark:text-yellow-300">📋 Rate Limiting Mastery Checklist</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Understanding &amp; Monitoring ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Analyzed API rate limit documentation</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Implemented header parsing system</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Set up quota monitoring dashboards</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Configured threshold alerting</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Queue Management ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Built priority-based request queue</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Implemented intelligent backoff</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Added circuit breaker pattern</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Optimized batch request handling</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">User Experience ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Created clear rate limit messaging</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Added progress indicators</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Implemented cached fallbacks</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Set up alternative data sources</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Real-World Example: Social Media Analytics Platform</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Building a social media analytics dashboard that aggregates data from Twitter, Instagram, Facebook, and LinkedIn APIs. 
                            Each platform has different rate limits, and customers expect real-time insights across 10,000+ social accounts.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Rate Limiting Strategy:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Multi-Tier Queuing:</strong> Real-time user requests get immediate processing, while background data sync runs during off-peak hours</div>
                            <div>• <strong>Platform-Specific Handling:</strong> Twitter's 15-minute windows handled differently from Facebook's daily quotas</div>
                            <div>• <strong>Intelligent Caching:</strong> Cache frequently accessed metrics for 15 minutes, serve stale data with refresh timestamps during peak usage</div>
                            <div>• <strong>Customer Communication:</strong> Dashboard shows "Last updated: 3 minutes ago" with auto-refresh when quotas available</div>
                            <div>• <strong>Enterprise Scaling:</strong> High-tier customers get dedicated API keys and priority queue access</div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>User Satisfaction:</strong> 94% of users satisfied with data freshness despite API limitations</div>
                            <div>• <strong>API Efficiency:</strong> 300% improvement in request efficiency through intelligent batching and caching</div>
                            <div>• <strong>Cost Optimization:</strong> 60% reduction in API costs by avoiding redundant requests and optimizing timing</div>
                            <div>• <strong>Reliability:</strong> 99.97% uptime even during API provider outages through fallback strategies</div>
                            <div>• <strong>Scale Achievement:</strong> Successfully handles 50M+ API requests monthly across all platforms</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-api-step-7',
              title: 'API Monitoring',
              description: 'Monitor API performance and health',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                        📊 Complete API Monitoring &amp; Observability Guide
                      </h4>
                      <p className="mb-4">
                        Build comprehensive monitoring systems to track API performance, detect issues proactively, 
                        and maintain high reliability across all integrations with intelligent alerting and analytics.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">🎯 Key Metrics to Monitor</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Response Time:</strong> Average, median, 95th percentile latency</div>
                            <div><strong>Error Rates:</strong> 4xx client errors, 5xx server errors</div>
                            <div><strong>Throughput:</strong> Requests per second, concurrent connections</div>
                            <div><strong>Availability:</strong> Uptime percentage, SLA compliance</div>
                            <div><strong>Resource Usage:</strong> CPU, memory, bandwidth consumption</div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">🔧 Monitoring Tools</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Application Performance:</strong> New Relic, DataDog, AppInsights</div>
                            <div><strong>Infrastructure:</strong> Prometheus, Grafana, CloudWatch</div>
                            <div><strong>Uptime Monitoring:</strong> Pingdom, UptimeRobot, StatusCake</div>
                            <div><strong>Log Analysis:</strong> ELK Stack, Splunk, Fluentd</div>
                            <div><strong>Synthetic Testing:</strong> Postman monitors, Runscope</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">📚 Essential Learning Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Monitoring Best Practices</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://sre.google/sre-book/monitoring-distributed-systems/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Google SRE Monitoring Guide</a></div>
                            <div>• <a href="https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_monitor_aws_resources.html" target="_blank" rel="noopener" className="text-blue-500 hover:underline">AWS Well-Architected Monitoring</a></div>
                            <div>• <a href="https://prometheus.io/docs/practices/alerting/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Prometheus Alerting Best Practices</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🛠️ Implementation Tools</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://grafana.com/docs/grafana/latest/getting-started/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Grafana Dashboard Creation</a></div>
                            <div>• <a href="https://www.datadoghq.com/blog/monitoring-101-collecting-data/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">DataDog Monitoring 101</a></div>
                            <div>• <a href="https://newrelic.com/blog/best-practices/best-practices-for-monitoring-your-apps" target="_blank" rel="noopener" className="text-blue-500 hover:underline">New Relic App Monitoring</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-yellow-700 dark:text-yellow-300">📋 Monitoring Implementation Checklist</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Health &amp; Availability ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Health check endpoints</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Uptime monitoring setup</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Status page created</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Basic alerting configured</span>
                            </label>
                          </div>
                        </div>
                        <div>
                          <h6 className="font-medium mb-2 text-sm">Performance &amp; Analytics ✓</h6>
                          <div className="space-y-1 text-xs">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Response time tracking</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Error rate monitoring</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Performance dashboards</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded" />
                              <span>Business impact correlation</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Real-World Success: E-commerce Platform Monitoring</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            E-commerce platform handling 100,000+ API requests per minute during peak shopping seasons 
                            needed comprehensive monitoring to prevent revenue loss from performance issues.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Solution:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Multi-layer monitoring:</strong> Infrastructure, application, and business metrics</div>
                            <div>• <strong>Predictive alerts:</strong> ML models predict issues 15 minutes before they occur</div>
                            <div>• <strong>Real-time dashboards:</strong> Live visibility into checkout flow performance</div>
                            <div>• <strong>Geographic monitoring:</strong> Track performance across global regions</div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>99.99% uptime</strong> during Black Friday peak traffic</div>
                            <div>• <strong>85% faster</strong> issue detection and resolution</div>
                            <div>• <strong>$2.3M prevented losses</strong> through proactive monitoring</div>
                            <div>• <strong>300ms improvement</strong> in average response time</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        }
      ]
    },
    storage: {
      id: 'storage',
      title: 'Step-by-Step Storage Integration',
      icon: <Cloud className="h-5 w-5" />,
      description: 'Implement file storage and management',
      sections: [
        {
          id: 'foundation',
          title: '📦 Foundation',
          description: 'Storage fundamentals',
          steps: [
            {
              id: 'webdev-integrate-storage-step-1',
              title: 'Storage Types',
              description: 'Understanding different storage solutions',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Storage Solutions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Object Storage</h3>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• AWS S3</li>
                        <li>• Supabase Storage</li>
                        <li>• Cloudinary</li>
                        <li>• Best for: Files, images, documents</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>CDN Storage</h3>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Cloudflare</li>
                        <li>• AWS CloudFront</li>
                        <li>• Vercel</li>
                        <li>• Best for: Fast global delivery</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-storage-step-2',
              title: 'Set Up Supabase Storage',
              description: 'Configure cloud storage with Supabase',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                        ☁️ Complete Supabase Storage Setup &amp; Configuration
                      </h4>
                      <p className="mb-4">
                        Set up enterprise-grade cloud storage with Supabase that provides secure, scalable file management
                        with built-in CDN, automatic image optimization, and seamless authentication integration.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">🎯 Key Features</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Bucket Management:</strong> Organize files with custom buckets</div>
                            <div><strong>Access Policies:</strong> Row-level security for file permissions</div>
                            <div><strong>CDN Integration:</strong> Global file delivery optimization</div>
                            <div><strong>Image Transforms:</strong> On-the-fly image processing</div>
                            <div><strong>Resumable Uploads:</strong> Handle large files reliably</div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">💡 Best Practices</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Bucket Strategy:</strong> Separate buckets by purpose and security</div>
                            <div><strong>File Naming:</strong> UUID-based names prevent conflicts</div>
                            <div><strong>Metadata Usage:</strong> Store file info for better organization</div>
                            <div><strong>Compression:</strong> Optimize file sizes before upload</div>
                            <div><strong>Backup Planning:</strong> Multiple region redundancy</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">⚙️ Step-by-Step Setup Process</h5>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Step 1: Project Configuration (5 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Initialize Supabase Storage in your project with proper bucket structure and security policies.</p>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-blue-600 dark:text-blue-400 text-xs">Configuration Essentials:</div>
                              <div className="text-xs space-y-2">
                                <div><strong>Bucket Creation:</strong> Create separate buckets for public assets (avatars, product images) and private files (documents, reports)</div>
                                <div><strong>Storage Policies:</strong> Define who can upload, download, and delete files using Row Level Security (RLS) policies</div>
                                <div><strong>CORS Configuration:</strong> Set up proper cross-origin policies for web applications to access storage directly</div>
                                <div><strong>CDN Settings:</strong> Enable global CDN distribution for faster file delivery worldwide</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Step 2: Security Implementation (8 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Implement comprehensive security measures to protect files and control access properly.</p>
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-green-600 dark:text-green-400 text-xs">Security Framework:</div>
                              <div className="text-xs space-y-2">
                                <div><strong>Authentication Integration:</strong> Link storage permissions with your user authentication system</div>
                                <div><strong>File Type Validation:</strong> Restrict uploads to safe file formats and validate MIME types server-side</div>
                                <div><strong>Size Limitations:</strong> Set appropriate file size limits per user tier and file type</div>
                                <div><strong>Access Logging:</strong> Track all file operations for security auditing and compliance</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-gray-700 p-4 rounded">
                          <h6 className="font-medium mb-2 text-purple-600 dark:text-purple-400">Step 3: Performance Optimization (7 minutes)</h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-600 dark:text-gray-300">Configure advanced features for optimal performance and user experience.</p>
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                              <div className="font-medium mb-2 text-purple-600 dark:text-purple-400 text-xs">Performance Strategies:</div>
                              <div className="text-xs space-y-2">
                                <div><strong>Image Transformation:</strong> Set up automatic image resizing, format conversion, and quality optimization</div>
                                <div><strong>Caching Headers:</strong> Configure proper cache-control headers for different file types</div>
                                <div><strong>Compression:</strong> Enable automatic compression for text files and documents</div>
                                <div><strong>Lazy Loading:</strong> Implement progressive loading strategies for better perceived performance</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-yellow-700 dark:text-yellow-300">📚 Essential Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Official Documentation</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://supabase.com/docs/guides/storage" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Supabase Storage Guide</a></div>
                            <div>• <a href="https://supabase.com/docs/guides/storage/security/access-control" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Storage Security &amp; RLS</a></div>
                            <div>• <a href="https://supabase.com/docs/guides/storage/cdn" target="_blank" rel="noopener" className="text-blue-500 hover:underline">CDN &amp; Image Optimization</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🛠️ Implementation Examples</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://github.com/supabase/supabase/tree/master/examples/storage" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Storage Examples Repository</a></div>
                            <div>• <a href="https://supabase.com/docs/guides/storage/uploads/standard-uploads" target="_blank" rel="noopener" className="text-blue-500 hover:underline">File Upload Patterns</a></div>
                            <div>• <a href="https://supabase.com/docs/guides/storage/transformations/image-transformations" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Image Transformation Guide</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Real-World Example: SaaS Document Platform</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Document collaboration platform needed secure file storage for 50,000+ users with 
                            team-based access controls, automatic backups, and global CDN delivery.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Supabase Solution:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Multi-bucket Strategy:</strong> Separate buckets for public assets, private documents, and temporary files</div>
                            <div>• <strong>Team-based RLS:</strong> Policies ensuring users only access files from their organizations</div>
                            <div>• <strong>Automated Workflows:</strong> Trigger functions for virus scanning and document processing</div>
                            <div>• <strong>Global CDN:</strong> 99.9% uptime with &lt;100ms access times worldwide</div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>99.99% uptime:</strong> Zero data loss incidents in 2+ years</div>
                            <div>• <strong>50% cost reduction:</strong> Compared to traditional cloud storage solutions</div>
                            <div>• <strong>3x faster uploads:</strong> Through optimized bucket configuration and CDN</div>
                            <div>• <strong>100% compliance:</strong> Met SOC2 and GDPR requirements out of the box</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'implementation',
          title: '📁 Implementation',
          description: 'File upload and management',
          steps: [
            {
              id: 'webdev-integrate-storage-step-3',
              title: 'File Upload',
              description: 'Implement file upload functionality',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        📤 Advanced File Upload Implementation
                      </h4>
                      <p className="mb-4">
                        Build robust file upload systems with drag-and-drop interfaces, progress tracking, 
                        validation, and error handling for professional user experiences.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">🎯 Upload Features</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Drag &amp; Drop:</strong> Intuitive file selection interface</div>
                            <div><strong>Progress Tracking:</strong> Real-time upload progress display</div>
                            <div><strong>Multiple Files:</strong> Batch upload capabilities</div>
                            <div><strong>File Validation:</strong> Type, size, and format checking</div>
                            <div><strong>Error Recovery:</strong> Retry failed uploads automatically</div>
                          </div>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">🛡️ Security Measures</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>File Type Validation:</strong> Whitelist safe file extensions</div>
                            <div><strong>Size Limits:</strong> Prevent oversized uploads</div>
                            <div><strong>Virus Scanning:</strong> Integrate malware detection</div>
                            <div><strong>Content Inspection:</strong> Validate file headers</div>
                            <div><strong>Rate Limiting:</strong> Prevent abuse and spam</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">📚 Learning Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Upload Techniques</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://developer.mozilla.org/en-US/docs/Web/API/File_API" target="_blank" rel="noopener" className="text-blue-500 hover:underline">File API Reference</a></div>
                            <div>• <a href="https://web.dev/drag-and-drop/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Drag and Drop Guide</a></div>
                            <div>• <a href="https://developer.mozilla.org/en-US/docs/Web/API/FormData" target="_blank" rel="noopener" className="text-blue-500 hover:underline">FormData Usage</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🔧 Libraries &amp; Tools</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://react-dropzone.js.org/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">React Dropzone</a></div>
                            <div>• <a href="https://uppy.io/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Uppy File Uploader</a></div>
                            <div>• <a href="https://github.com/rpldy/react-uploady" target="_blank" rel="noopener" className="text-blue-500 hover:underline">React Uploady</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Example: Media Upload Platform</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Social media platform needed robust file upload for images and videos 
                            with real-time progress and automatic compression.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>95% upload success rate:</strong> with retry mechanisms</div>
                            <div>• <strong>60% faster uploads:</strong> through chunking</div>
                            <div>• <strong>Zero security incidents:</strong> comprehensive validation</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-storage-step-4',
              title: 'Image Optimization',
              description: 'Optimize images for web delivery',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                        🖼️ Advanced Image Optimization Strategies
                      </h4>
                      <p className="mb-4">
                        Implement intelligent image optimization that reduces load times by 70%+ while maintaining 
                        visual quality through modern formats, responsive sizing, and smart compression.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">🎯 Optimization Techniques</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Format Conversion:</strong> WebP, AVIF for modern browsers</div>
                            <div><strong>Responsive Sizing:</strong> Multiple sizes for different screens</div>
                            <div><strong>Compression:</strong> Lossless and lossy optimization</div>
                            <div><strong>Lazy Loading:</strong> Load images as needed</div>
                            <div><strong>Progressive JPEGs:</strong> Better perceived performance</div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">⚡ Performance Benefits</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Load Speed:</strong> 70% faster page loading</div>
                            <div><strong>Bandwidth:</strong> 60% reduction in data usage</div>
                            <div><strong>SEO Impact:</strong> Better Core Web Vitals scores</div>
                            <div><strong>User Experience:</strong> Smoother image rendering</div>
                            <div><strong>Cost Savings:</strong> Lower CDN bandwidth costs</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-yellow-700 dark:text-yellow-300">📚 Essential Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Optimization Guides</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://web.dev/fast/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Web.dev Performance Guide</a></div>
                            <div>• <a href="https://developers.google.com/speed/webp" target="_blank" rel="noopener" className="text-blue-500 hover:underline">WebP Image Format</a></div>
                            <div>• <a href="https://web.dev/browser-level-image-lazy-loading/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Native Lazy Loading</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🛠️ Tools &amp; Services</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://cloudinary.com/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Cloudinary Image CDN</a></div>
                            <div>• <a href="https://imagekit.io/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">ImageKit Optimization</a></div>
                            <div>• <a href="https://squoosh.app/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Squoosh Compression Tool</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Success Story: E-commerce Platform</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Online retailer with 100,000+ product images needed faster loading 
                            without sacrificing visual quality for mobile and desktop users.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Optimization Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>75% smaller files:</strong> WebP conversion + compression</div>
                            <div>• <strong>3x faster loading:</strong> Responsive images + lazy loading</div>
                            <div>• <strong>25% more conversions:</strong> Better user experience</div>
                            <div>• <strong>$50k saved annually:</strong> Reduced bandwidth costs</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'advanced',
          title: '🚀 Advanced',
          description: 'Advanced storage features',
          steps: [
            {
              id: 'webdev-integrate-storage-step-5',
              title: 'Progressive Upload',
              description: 'Implement chunked and resumable uploads',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                        🚀 Progressive &amp; Resumable Upload Systems
                      </h4>
                      <p className="mb-4">
                        Build enterprise-grade upload systems that handle large files reliably with chunking, 
                        resume capabilities, and parallel processing for optimal performance.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">🎯 Advanced Features</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Chunked Uploads:</strong> Split large files into manageable pieces</div>
                            <div><strong>Resume Capability:</strong> Continue interrupted uploads</div>
                            <div><strong>Parallel Processing:</strong> Upload multiple chunks simultaneously</div>
                            <div><strong>Progress Tracking:</strong> Granular upload progress reporting</div>
                            <div><strong>Error Recovery:</strong> Automatic retry with exponential backoff</div>
                          </div>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-red-700 dark:text-red-300">⚡ Performance Gains</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Large File Support:</strong> Handle GB-sized files reliably</div>
                            <div><strong>Network Resilience:</strong> Survive connection interruptions</div>
                            <div><strong>Faster Uploads:</strong> Parallel chunk processing</div>
                            <div><strong>Better UX:</strong> No need to restart failed uploads</div>
                            <div><strong>Resource Efficiency:</strong> Optimal bandwidth utilization</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">📚 Technical Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Implementation Guides</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://developer.mozilla.org/en-US/docs/Web/API/Blob/slice" target="_blank" rel="noopener" className="text-blue-500 hover:underline">File Chunking with Blob</a></div>
                            <div>• <a href="https://tus.io/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">TUS Resumable Upload Protocol</a></div>
                            <div>• <a href="https://github.com/23/resumable.js" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Resumable.js Library</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🛠️ Advanced Libraries</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://uppy.io/docs/tus/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Uppy TUS Integration</a></div>
                            <div>• <a href="https://github.com/flowjs/flow.js" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Flow.js Chunked Upload</a></div>
                            <div>• <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html" target="_blank" rel="noopener" className="text-blue-500 hover:underline">AWS Multipart Upload</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Case Study: Video Platform Upload</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Video sharing platform needed reliable upload system for 4K videos up to 10GB 
                            with mobile users on unstable connections.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Progressive Upload Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>99.5% upload success:</strong> Even on poor connections</div>
                            <div>• <strong>5x faster completion:</strong> Parallel chunk processing</div>
                            <div>• <strong>80% less support tickets:</strong> Automatic error recovery</div>
                            <div>• <strong>Mobile optimization:</strong> Adaptive chunk sizing</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-storage-step-6',
              title: 'Access Control',
              description: 'Secure file access with permissions',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400">
                        🔐 Advanced File Access Control &amp; Security
                      </h4>
                      <p className="mb-4">
                        Implement enterprise-grade security with granular permissions, time-based access, 
                        and compliance-ready audit trails for complete file protection.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-red-700 dark:text-red-300">🛡️ Security Layers</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Role-Based Access:</strong> User roles determine permissions</div>
                            <div><strong>Row-Level Security:</strong> Database-enforced access control</div>
                            <div><strong>Signed URLs:</strong> Time-limited secure access tokens</div>
                            <div><strong>IP Restrictions:</strong> Geographic and network-based limits</div>
                            <div><strong>Audit Logging:</strong> Complete access history tracking</div>
                          </div>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-yellow-700 dark:text-yellow-300">🎯 Access Patterns</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Public Assets:</strong> CDN-cached, openly accessible</div>
                            <div><strong>User Files:</strong> Owner-only access with sharing options</div>
                            <div><strong>Team Resources:</strong> Organization-based permissions</div>
                            <div><strong>Confidential Data:</strong> Multi-factor authentication required</div>
                            <div><strong>Temporary Access:</strong> Time-expiring shared links</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">📚 Security Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Access Control Guides</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://supabase.com/docs/guides/auth/row-level-security" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Row Level Security Guide</a></div>
                            <div>• <a href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Signed URLs Best Practices</a></div>
                            <div>• <a href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">OWASP Security Guidelines</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🔧 Security Tools</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://auth0.com/docs/secure/tokens" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Auth0 Token Security</a></div>
                            <div>• <a href="https://github.com/supabase/gotrue" target="_blank" rel="noopener" className="text-blue-500 hover:underline">GoTrue Authentication</a></div>
                            <div>• <a href="https://casbin.org/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Casbin Authorization</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Enterprise Example: Healthcare Platform</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Healthcare platform needed HIPAA-compliant file storage with role-based access 
                            for patients, doctors, and administrators across multiple facilities.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Security Implementation:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>Multi-layer Security:</strong> RLS + signed URLs + audit logs</div>
                            <div>• <strong>100% HIPAA Compliance:</strong> Passed all security audits</div>
                            <div>• <strong>Zero Data Breaches:</strong> Perfect security record</div>
                            <div>• <strong>Granular Permissions:</strong> Patient-doctor-admin hierarchy</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-storage-step-7',
              title: 'Backup & Sync',
              description: 'Implement backup and synchronization',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
                        🔄 Enterprise Backup &amp; Synchronization Systems
                      </h4>
                      <p className="mb-4">
                        Build robust backup and sync infrastructure with cross-region redundancy, 
                        conflict resolution, and real-time synchronization for bulletproof data protection.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-indigo-700 dark:text-indigo-300">🎯 Backup Strategies</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Incremental Backups:</strong> Only changed files backed up</div>
                            <div><strong>Cross-Region Sync:</strong> Geographic redundancy</div>
                            <div><strong>Version Control:</strong> Historical file versioning</div>
                            <div><strong>Real-time Sync:</strong> Instant file synchronization</div>
                            <div><strong>Conflict Resolution:</strong> Smart merge strategies</div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">🚀 Sync Features</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Multi-Device Sync:</strong> Files available everywhere</div>
                            <div><strong>Offline Support:</strong> Works without internet</div>
                            <div><strong>Selective Sync:</strong> Choose what to synchronize</div>
                            <div><strong>Bandwidth Control:</strong> Optimize network usage</div>
                            <div><strong>Progress Tracking:</strong> Sync status visibility</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">📚 Technical Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Sync Algorithms</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://en.wikipedia.org/wiki/Rsync" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Rsync Protocol</a></div>
                            <div>• <a href="https://syncthing.net/specs/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Syncthing Specification</a></div>
                            <div>• <a href="https://docs.microsoft.com/en-us/azure/storage/files/storage-sync-files-planning" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Azure File Sync</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🔧 Backup Solutions</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://rclone.org/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Rclone Cloud Sync</a></div>
                            <div>• <a href="https://restic.net/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Restic Backup Program</a></div>
                            <div>• <a href="https://www.duplicati.com/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Duplicati Backup Client</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Success Story: Design Agency Sync</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Global design agency with 200+ team members needed real-time file sync 
                            across 15 offices with offline capability and version control.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Sync Solution Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>99.99% sync reliability:</strong> Zero data loss incidents</div>
                            <div>• <strong>Real-time collaboration:</strong> Files sync in &lt;5 seconds</div>
                            <div>• <strong>50% faster workflows:</strong> Instant access to latest files</div>
                            <div>• <strong>Global accessibility:</strong> Works from any location</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        }
      ]
    },
    payments: {
      id: 'payments',
      title: 'Step-by-Step Payment Integration',
      icon: <Monitor className="h-5 w-5" />,
      description: 'Implement secure payment processing',
      sections: [
        {
          id: 'foundation',
          title: '💳 Foundation',
          description: 'Payment fundamentals',
          steps: [
            {
              id: 'webdev-integrate-payment-step-1',
              title: 'Payment Providers',
              description: 'Choose the right payment processor',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Payment Providers</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Popular Providers</h3>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Stripe</li>
                        <li>• PayPal</li>
                        <li>• Square</li>
                        <li>• Razorpay</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Key Features</h3>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• PCI compliance</li>
                        <li>• Multiple currencies</li>
                        <li>• Fraud protection</li>
                        <li>• Easy integration</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-payment-step-2',
              title: 'Set Up Stripe',
              description: 'Configure Stripe for payments',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                        💳 Complete Stripe Integration &amp; Setup
                      </h4>
                      <p className="mb-4">
                        Set up enterprise-grade payment processing with Stripe that handles global payments, 
                        compliance, fraud prevention, and seamless checkout experiences for maximum conversion.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">🎯 Core Features</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Global Processing:</strong> Accept payments in 135+ currencies</div>
                            <div><strong>Security Compliance:</strong> PCI DSS Level 1 certified</div>
                            <div><strong>Fraud Prevention:</strong> Machine learning fraud detection</div>
                            <div><strong>Mobile Optimized:</strong> Responsive checkout experiences</div>
                            <div><strong>Real-time Analytics:</strong> Revenue and conversion insights</div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">💡 Setup Strategy</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Account Configuration:</strong> Business verification and setup</div>
                            <div><strong>API Integration:</strong> Secure key management and testing</div>
                            <div><strong>Webhook Setup:</strong> Real-time event handling</div>
                            <div><strong>Tax Configuration:</strong> Automated tax calculation</div>
                            <div><strong>Compliance Setup:</strong> Regional regulations handling</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-yellow-700 dark:text-yellow-300">📚 Essential Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Official Documentation</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://stripe.com/docs" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Stripe Developer Docs</a></div>
                            <div>• <a href="https://stripe.com/docs/payments/quickstart" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Payment Integration Guide</a></div>
                            <div>• <a href="https://stripe.com/docs/security" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Security Best Practices</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🛠️ Implementation Tools</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://github.com/stripe/stripe-node" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Stripe Node.js Library</a></div>
                            <div>• <a href="https://stripe.com/docs/stripe-js" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Stripe.js Frontend SDK</a></div>
                            <div>• <a href="https://stripe.com/docs/testing" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Testing &amp; Card Numbers</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Success Story: SaaS Platform Launch</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            B2B SaaS startup needed global payment processing for subscription tiers 
                            with enterprise compliance and seamless user experience.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Stripe Implementation Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>98.7% conversion rate:</strong> Optimized checkout flow</div>
                            <div>• <strong>40+ countries supported:</strong> Global expansion ready</div>
                            <div>• <strong>99.99% uptime:</strong> Reliable payment processing</div>
                            <div>• <strong>$2M ARR achieved:</strong> Within 12 months of launch</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'implementation',
          title: '💰 Implementation',
          description: 'Build payment flows',
          steps: [
            {
              id: 'webdev-integrate-payment-step-3',
              title: 'One-time Payments',
              description: 'Implement single payment processing',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        💰 One-Time Payment Implementation
                      </h4>
                      <p className="mb-4">
                        Build seamless one-time payment flows with optimized checkout experiences, 
                        multiple payment methods, and conversion-focused design patterns for maximum revenue.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">🎯 Payment Methods</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Credit Cards:</strong> Visa, Mastercard, Amex support</div>
                            <div><strong>Digital Wallets:</strong> Apple Pay, Google Pay, PayPal</div>
                            <div><strong>Bank Transfers:</strong> ACH, SEPA, wire transfers</div>
                            <div><strong>Buy Now Pay Later:</strong> Klarna, Afterpay integration</div>
                            <div><strong>Crypto Payments:</strong> Bitcoin, Ethereum support</div>
                          </div>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">⚡ Optimization Features</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Express Checkout:</strong> Single-click purchase flows</div>
                            <div><strong>Payment Element:</strong> Dynamic form optimization</div>
                            <div><strong>Address Collection:</strong> Autofill and validation</div>
                            <div><strong>Tax Calculation:</strong> Real-time tax computation</div>
                            <div><strong>Receipt Generation:</strong> Automated email receipts</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">📚 Implementation Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Payment Guides</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://stripe.com/docs/payments/payment-intents" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Payment Intents API</a></div>
                            <div>• <a href="https://stripe.com/docs/payments/payment-element" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Payment Element Guide</a></div>
                            <div>• <a href="https://stripe.com/docs/payments/checkout" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Stripe Checkout</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🔧 Development Tools</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://stripe.com/docs/stripe-cli" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Stripe CLI Tool</a></div>
                            <div>• <a href="https://dashboard.stripe.com/test/logs" target="_blank" rel="noopener" className="text-blue-500 hover:underline">API Request Logs</a></div>
                            <div>• <a href="https://stripe.com/docs/testing" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Test Card Numbers</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 E-commerce Success: Online Marketplace</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Online marketplace needed fast, secure checkout with multiple payment options 
                            to reduce cart abandonment and increase conversion rates.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Payment Optimization Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>35% higher conversion:</strong> Express checkout implementation</div>
                            <div>• <strong>60% faster checkout:</strong> Payment Element optimization</div>
                            <div>• <strong>90% mobile success:</strong> Mobile-first payment design</div>
                            <div>• <strong>25% revenue increase:</strong> Multi-payment method support</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-payment-step-4',
              title: 'Subscriptions',
              description: 'Set up recurring billing',
              estimated_time: '40 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                        🔄 Advanced Subscription Management
                      </h4>
                      <p className="mb-4">
                        Build comprehensive subscription systems with flexible billing cycles, 
                        proration handling, dunning management, and revenue optimization for sustainable growth.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">🎯 Subscription Features</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Flexible Billing:</strong> Monthly, yearly, custom cycles</div>
                            <div><strong>Plan Management:</strong> Upgrades, downgrades, cancellations</div>
                            <div><strong>Proration Logic:</strong> Fair billing adjustments</div>
                            <div><strong>Trial Periods:</strong> Free trials and freemium models</div>
                            <div><strong>Usage-Based Billing:</strong> Metered and tiered pricing</div>
                          </div>
                        </div>

                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-indigo-700 dark:text-indigo-300">💡 Revenue Optimization</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Dunning Management:</strong> Automated retry logic</div>
                            <div><strong>Churn Prevention:</strong> Failed payment recovery</div>
                            <div><strong>Coupon System:</strong> Discounts and promotions</div>
                            <div><strong>Analytics Tracking:</strong> MRR, churn, LTV metrics</div>
                            <div><strong>Tax Automation:</strong> Global tax compliance</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">📚 Subscription Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Billing Guides</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://stripe.com/docs/billing/subscriptions/overview" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Subscription Overview</a></div>
                            <div>• <a href="https://stripe.com/docs/billing/subscriptions/metered-billing" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Usage-Based Billing</a></div>
                            <div>• <a href="https://stripe.com/docs/billing/subscriptions/trials" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Free Trials Setup</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🛠️ Management Tools</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://stripe.com/docs/billing/customer-portal" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Customer Portal</a></div>
                            <div>• <a href="https://stripe.com/docs/billing/subscriptions/webhooks" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Subscription Webhooks</a></div>
                            <div>• <a href="https://stripe.com/docs/billing/invoices" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Invoice Management</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 SaaS Growth: Productivity Platform</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Productivity SaaS needed flexible subscription tiers with usage-based pricing 
                            and effective churn reduction for sustainable growth.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Subscription Implementation Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>95% billing success rate:</strong> Smart dunning management</div>
                            <div>• <strong>40% churn reduction:</strong> Failed payment recovery</div>
                            <div>• <strong>$5M ARR growth:</strong> Optimized pricing tiers</div>
                            <div>• <strong>85% trial conversion:</strong> Effective onboarding flow</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'advanced',
          title: '🔒 Advanced',
          description: 'Advanced payment features',
          steps: [
            {
              id: 'webdev-integrate-payment-step-5',
              title: 'Webhooks',
              description: 'Handle payment events with webhooks',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400">
                        🔗 Webhook Integration &amp; Event Handling
                      </h4>
                      <p className="mb-4">
                        Build robust webhook systems for real-time payment event processing with secure validation, 
                        retry logic, and comprehensive error handling for reliable payment automation.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-red-700 dark:text-red-300">🎯 Critical Events</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Payment Success:</strong> payment_intent.succeeded</div>
                            <div><strong>Payment Failure:</strong> payment_intent.payment_failed</div>
                            <div><strong>Subscription Events:</strong> customer.subscription.updated</div>
                            <div><strong>Invoice Events:</strong> invoice.payment_succeeded</div>
                            <div><strong>Dispute Events:</strong> charge.dispute.created</div>
                          </div>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-yellow-700 dark:text-yellow-300">🛡️ Security &amp; Reliability</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Signature Verification:</strong> Cryptographic validation</div>
                            <div><strong>Idempotency:</strong> Duplicate event handling</div>
                            <div><strong>Retry Logic:</strong> Exponential backoff strategy</div>
                            <div><strong>Event Ordering:</strong> Timestamp-based processing</div>
                            <div><strong>Error Monitoring:</strong> Failed webhook tracking</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">📚 Webhook Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Implementation Guides</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://stripe.com/docs/webhooks" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Webhook Overview</a></div>
                            <div>• <a href="https://stripe.com/docs/webhooks/signatures" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Signature Verification</a></div>
                            <div>• <a href="https://stripe.com/docs/webhooks/best-practices" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Webhook Best Practices</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🔧 Development Tools</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://stripe.com/docs/stripe-cli/webhooks" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Stripe CLI Webhooks</a></div>
                            <div>• <a href="https://webhook.site/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Webhook Testing Tool</a></div>
                            <div>• <a href="https://ngrok.com/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Ngrok Local Tunneling</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Enterprise Case: Financial Services</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Financial services platform needed reliable webhook processing for regulatory compliance 
                            with audit trails and guaranteed event delivery.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Webhook Implementation Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>99.99% delivery rate:</strong> Robust retry mechanisms</div>
                            <div>• <strong>100% audit compliance:</strong> Complete event logging</div>
                            <div>• <strong>&lt;500ms processing:</strong> Optimized event handling</div>
                            <div>• <strong>Zero data loss:</strong> Idempotent event processing</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-payment-step-6',
              title: 'Refunds & Disputes',
              description: 'Handle refunds and chargebacks',
              estimated_time: '30 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-orange-600 dark:text-orange-400">
                        🔄 Refunds &amp; Dispute Management
                      </h4>
                      <p className="mb-4">
                        Build comprehensive refund and dispute handling systems with automated workflows, 
                        evidence collection, and proactive chargeback prevention for minimal revenue loss.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">🎯 Refund Management</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Automated Refunds:</strong> Instant processing workflows</div>
                            <div><strong>Partial Refunds:</strong> Flexible amount adjustments</div>
                            <div><strong>Refund Policies:</strong> Clear terms and conditions</div>
                            <div><strong>Customer Portal:</strong> Self-service refund requests</div>
                            <div><strong>Approval Workflows:</strong> Multi-tier authorization</div>
                          </div>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-red-700 dark:text-red-300">🛡️ Dispute Prevention</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Fraud Detection:</strong> AI-powered risk scoring</div>
                            <div><strong>Clear Billing:</strong> Transparent charge descriptions</div>
                            <div><strong>Customer Communication:</strong> Proactive notifications</div>
                            <div><strong>Evidence Collection:</strong> Automated documentation</div>
                            <div><strong>Chargeback Alerts:</strong> Early warning systems</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">📚 Dispute Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Management Guides</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://stripe.com/docs/disputes" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Dispute Overview</a></div>
                            <div>• <a href="https://stripe.com/docs/disputes/prevention" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Chargeback Prevention</a></div>
                            <div>• <a href="https://stripe.com/docs/refunds" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Refund Best Practices</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🛠️ Protection Tools</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://stripe.com/radar" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Stripe Radar Fraud Detection</a></div>
                            <div>• <a href="https://stripe.com/docs/disputes/evidence" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Evidence Submission</a></div>
                            <div>• <a href="https://stripe.com/docs/billing/customer-portal" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Customer Self-Service</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 E-commerce Success: Fashion Retailer</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Fashion e-commerce platform faced high chargeback rates and customer disputes 
                            due to sizing issues and unclear return policies.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Dispute Management Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>75% chargeback reduction:</strong> Proactive prevention system</div>
                            <div>• <strong>90% dispute win rate:</strong> Comprehensive evidence collection</div>
                            <div>• <strong>50% faster resolution:</strong> Automated workflows</div>
                            <div>• <strong>95% customer satisfaction:</strong> Self-service refund portal</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-payment-step-7',
              title: 'Multi-vendor Payments',
              description: 'Implement marketplace payments',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
                        🏢 Multi-Vendor Payment Platforms
                      </h4>
                      <p className="mb-4">
                        Build sophisticated marketplace payment systems with automated splits, vendor onboarding, 
                        compliance management, and flexible commission structures for scalable multi-party transactions.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-indigo-700 dark:text-indigo-300">🎯 Platform Features</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Payment Splits:</strong> Automated revenue distribution</div>
                            <div><strong>Vendor Onboarding:</strong> KYC and compliance automation</div>
                            <div><strong>Commission Management:</strong> Flexible fee structures</div>
                            <div><strong>Escrow Services:</strong> Secure fund holding</div>
                            <div><strong>Payout Scheduling:</strong> Automated vendor payments</div>
                          </div>
                        </div>

                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-emerald-700 dark:text-emerald-300">💡 Advanced Capabilities</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Express Accounts:</strong> Fast vendor setup</div>
                            <div><strong>Custom Accounts:</strong> Full platform control</div>
                            <div><strong>Tax Reporting:</strong> 1099 and international forms</div>
                            <div><strong>Dispute Management:</strong> Multi-party resolution</div>
                            <div><strong>Analytics Dashboard:</strong> Platform-wide insights</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">📚 Marketplace Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Platform Guides</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://stripe.com/docs/connect" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Stripe Connect Overview</a></div>
                            <div>• <a href="https://stripe.com/docs/connect/express-accounts" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Express Accounts Setup</a></div>
                            <div>• <a href="https://stripe.com/docs/connect/charges-transfers" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Payment Splits Guide</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🛠️ Management Tools</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://stripe.com/docs/connect/payouts" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Automated Payouts</a></div>
                            <div>• <a href="https://stripe.com/docs/connect/account-capabilities" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Account Capabilities</a></div>
                            <div>• <a href="https://stripe.com/docs/connect/webhooks" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Connect Webhooks</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Marketplace Success: Creative Platform</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Creative services marketplace needed seamless multi-vendor payments with automated 
                            splits, escrow protection, and global vendor onboarding.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Multi-Vendor Platform Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>10,000+ vendors onboarded:</strong> Streamlined KYC process</div>
                            <div>• <strong>$50M transaction volume:</strong> Reliable payment processing</div>
                            <div>• <strong>99% payout accuracy:</strong> Automated split calculations</div>
                            <div>• <strong>Global expansion:</strong> 40+ countries supported</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        }
      ]
    },
    analytics: {
      id: 'analytics',
      title: 'Step-by-Step Analytics Integration',
      icon: <Settings className="h-5 w-5" />,
      description: 'Track and analyze user behavior',
      sections: [
        {
          id: 'foundation',
          title: '📊 Foundation',
          description: 'Analytics basics and setup',
          steps: [
            {
              id: 'webdev-integrate-analytics-step-1',
              title: 'Analytics Platforms',
              description: 'Choose the right analytics solution',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Analytics Platforms</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Web Analytics</h3>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Google Analytics</li>
                        <li>• Mixpanel</li>
                        <li>• Amplitude</li>
                        <li>• Plausible</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Key Metrics</h3>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Page views</li>
                        <li>• User sessions</li>
                        <li>• Conversion rates</li>
                        <li>• User behavior</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-analytics-step-2',
              title: 'Set Up Google Analytics',
              description: 'Configure GA4 for your application',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                        📊 Complete Google Analytics 4 Setup
                      </h4>
                      <p className="mb-4">
                        Set up enterprise-grade analytics with GA4 that provides comprehensive user insights, 
                        conversion tracking, and data-driven decision making for optimal business growth.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">🎯 GA4 Features</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Enhanced Measurement:</strong> Automatic event tracking</div>
                            <div><strong>Cross-Platform:</strong> Web and app unified tracking</div>
                            <div><strong>Privacy-Focused:</strong> Cookieless measurement ready</div>
                            <div><strong>Machine Learning:</strong> Predictive insights and metrics</div>
                            <div><strong>Custom Events:</strong> Flexible event configuration</div>
                          </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">💡 Implementation Strategy</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Property Setup:</strong> Account and property configuration</div>
                            <div><strong>Data Streams:</strong> Web and app stream setup</div>
                            <div><strong>Enhanced Ecommerce:</strong> Revenue tracking setup</div>
                            <div><strong>Goals &amp; Conversions:</strong> Business objective tracking</div>
                            <div><strong>Audience Building:</strong> User segmentation setup</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-yellow-700 dark:text-yellow-300">📚 Setup Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Official Documentation</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://support.google.com/analytics/answer/9304153" target="_blank" rel="noopener" className="text-blue-500 hover:underline">GA4 Setup Guide</a></div>
                            <div>• <a href="https://developers.google.com/analytics/devguides/collection/ga4" target="_blank" rel="noopener" className="text-blue-500 hover:underline">GA4 Developer Guide</a></div>
                            <div>• <a href="https://support.google.com/analytics/answer/9267735" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Enhanced Ecommerce</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🛠️ Implementation Tools</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://tagmanager.google.com/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Google Tag Manager</a></div>
                            <div>• <a href="https://github.com/GoogleChrome/web-vitals" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Web Vitals Library</a></div>
                            <div>• <a href="https://analytics.google.com/analytics/web/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">GA4 Interface</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Success Story: E-learning Platform</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Online education platform needed comprehensive user journey tracking 
                            to optimize course completion rates and revenue.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">GA4 Implementation Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>40% better insights:</strong> Cross-platform user tracking</div>
                            <div>• <strong>25% higher conversions:</strong> Optimized user funnels</div>
                            <div>• <strong>60% faster decisions:</strong> Real-time data access</div>
                            <div>• <strong>Privacy compliant:</strong> Future-proof measurement</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'tracking',
          title: '📈 Tracking',
          description: 'Implement event tracking',
          steps: [
            {
              id: 'webdev-integrate-analytics-step-3',
              title: 'Event Tracking',
              description: 'Track user interactions and events',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        📈 Advanced Event Tracking Implementation
                      </h4>
                      <p className="mb-4">
                        Build comprehensive event tracking systems that capture every user interaction, 
                        providing granular insights for optimization and data-driven product decisions.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">🎯 Event Categories</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>User Interactions:</strong> Clicks, scrolls, form submissions</div>
                            <div><strong>Navigation Events:</strong> Page views, route changes</div>
                            <div><strong>Business Actions:</strong> Purchases, sign-ups, downloads</div>
                            <div><strong>Engagement Metrics:</strong> Time on page, video plays</div>
                            <div><strong>Error Tracking:</strong> Failed actions, 404 errors</div>
                          </div>
                        </div>

                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-indigo-700 dark:text-indigo-300">💡 Implementation Strategies</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Auto-Tracking:</strong> Enhanced measurement setup</div>
                            <div><strong>Custom Events:</strong> Business-specific tracking</div>
                            <div><strong>Parameter Enrichment:</strong> Context and metadata</div>
                            <div><strong>User Properties:</strong> Demographic and behavioral data</div>
                            <div><strong>Cross-Platform:</strong> Web, mobile, and offline sync</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">📚 Event Tracking Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Implementation Guides</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://developers.google.com/analytics/devguides/collection/ga4/events" target="_blank" rel="noopener" className="text-blue-500 hover:underline">GA4 Event Tracking</a></div>
                            <div>• <a href="https://support.google.com/analytics/answer/9267568" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Recommended Events</a></div>
                            <div>• <a href="https://developers.google.com/tag-manager/devguide" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Tag Manager Guide</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🛠️ Tracking Libraries</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://github.com/GoogleChrome/web-vitals" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Web Vitals Tracking</a></div>
                            <div>• <a href="https://segment.com/docs/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Segment Analytics</a></div>
                            <div>• <a href="https://mixpanel.com/help/reference/javascript" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Mixpanel SDK</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 SaaS Success: Project Management Tool</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Project management SaaS needed detailed user behavior tracking 
                            to identify feature usage patterns and optimize user experience.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Event Tracking Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>50% more insights:</strong> Granular user interaction data</div>
                            <div>• <strong>30% feature adoption:</strong> Data-driven feature improvements</div>
                            <div>• <strong>20% churn reduction:</strong> Early warning indicators</div>
                            <div>• <strong>2x faster optimization:</strong> Real-time event analysis</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-analytics-step-4',
              title: 'Custom Dimensions',
              description: 'Create custom tracking parameters',
              estimated_time: '25 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                        🎛️ Custom Dimensions &amp; Parameters
                      </h4>
                      <p className="mb-4">
                        Create powerful custom tracking parameters that capture business-specific data, 
                        enabling advanced segmentation and personalized analytics insights.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">🎯 Dimension Types</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>User Properties:</strong> Demographic and profile data</div>
                            <div><strong>Event Parameters:</strong> Context-specific information</div>
                            <div><strong>Custom Metrics:</strong> Business KPIs and calculations</div>
                            <div><strong>Content Groups:</strong> Page and content categorization</div>
                            <div><strong>Campaign Data:</strong> Marketing attribution tracking</div>
                          </div>
                        </div>

                        <div className="bg-teal-50 dark:bg-teal-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-teal-700 dark:text-teal-300">💡 Advanced Applications</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>User Segmentation:</strong> Behavioral and demographic groups</div>
                            <div><strong>Product Analytics:</strong> Feature usage and adoption</div>
                            <div><strong>Performance Tracking:</strong> Custom business metrics</div>
                            <div><strong>Personalization:</strong> User experience optimization</div>
                            <div><strong>Revenue Attribution:</strong> Multi-touch attribution</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">📚 Custom Tracking Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Configuration Guides</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://support.google.com/analytics/answer/10075209" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Custom Dimensions GA4</a></div>
                            <div>• <a href="https://developers.google.com/analytics/devguides/collection/ga4/user-properties" target="_blank" rel="noopener" className="text-blue-500 hover:underline">User Properties Guide</a></div>
                            <div>• <a href="https://support.google.com/analytics/answer/9355671" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Event Parameters</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🛠️ Implementation Tools</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://tagmanager.google.com/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Google Tag Manager</a></div>
                            <div>• <a href="https://developers.google.com/analytics/devguides/collection/ga4/reference/config" target="_blank" rel="noopener" className="text-blue-500 hover:underline">GA4 Configuration</a></div>
                            <div>• <a href="https://analytics.google.com/analytics/web/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Analytics Interface</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 E-commerce Success: Fashion Retailer</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Fashion e-commerce needed detailed product analytics and customer segmentation 
                            to optimize inventory and personalize shopping experiences.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Custom Dimensions Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>45% better targeting:</strong> Advanced customer segmentation</div>
                            <div>• <strong>30% inventory optimization:</strong> Product performance tracking</div>
                            <div>• <strong>25% higher AOV:</strong> Personalized recommendations</div>
                            <div>• <strong>60% more insights:</strong> Custom business metrics</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'optimization',
          title: '⚡ Optimization',
          description: 'Advanced analytics features',
          steps: [
            {
              id: 'webdev-integrate-analytics-step-5',
              title: 'Conversion Funnels',
              description: 'Track user conversion paths',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400">
                        🎯 Conversion Funnel Optimization
                      </h4>
                      <p className="mb-4">
                        Build sophisticated conversion tracking systems that identify bottlenecks, 
                        optimize user journeys, and maximize revenue through data-driven funnel analysis.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-red-700 dark:text-red-300">🎯 Funnel Types</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Acquisition Funnel:</strong> Traffic to registration flow</div>
                            <div><strong>Activation Funnel:</strong> Onboarding and first value</div>
                            <div><strong>Purchase Funnel:</strong> Product discovery to checkout</div>
                            <div><strong>Retention Funnel:</strong> User engagement and return</div>
                            <div><strong>Revenue Funnel:</strong> Customer lifetime value path</div>
                          </div>
                        </div>

                        <div className="bg-pink-50 dark:bg-pink-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-pink-700 dark:text-pink-300">💡 Optimization Strategies</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Drop-off Analysis:</strong> Identify funnel bottlenecks</div>
                            <div><strong>Cohort Tracking:</strong> User behavior over time</div>
                            <div><strong>Multi-path Funnels:</strong> Alternative conversion routes</div>
                            <div><strong>Attribution Modeling:</strong> Multi-touch conversion credit</div>
                            <div><strong>Predictive Analytics:</strong> Conversion likelihood scoring</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">📚 Funnel Analytics Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Analysis Guides</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://support.google.com/analytics/answer/9327974" target="_blank" rel="noopener" className="text-blue-500 hover:underline">GA4 Funnel Analysis</a></div>
                            <div>• <a href="https://support.google.com/analytics/answer/9946255" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Path Exploration</a></div>
                            <div>• <a href="https://support.google.com/analytics/answer/9945984" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Cohort Analysis</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🛠️ Optimization Tools</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://mixpanel.com/funnels/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Mixpanel Funnels</a></div>
                            <div>• <a href="https://amplitude.com/funnel-analysis" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Amplitude Funnel Analysis</a></div>
                            <div>• <a href="https://www.hotjar.com/funnels/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Hotjar Funnel Analysis</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 SaaS Success: Marketing Automation</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Marketing automation platform had low trial-to-paid conversion rates 
                            and needed to identify optimization opportunities in their funnel.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Funnel Optimization Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>65% conversion increase:</strong> Identified and fixed bottlenecks</div>
                            <div>• <strong>40% faster onboarding:</strong> Streamlined activation flow</div>
                            <div>• <strong>30% higher retention:</strong> Improved user journey mapping</div>
                            <div>• <strong>$3M ARR growth:</strong> Data-driven funnel optimization</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-analytics-step-6',
              title: 'A/B Testing',
              description: 'Implement and track experiments',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-indigo-600 dark:text-indigo-400">
                        🧪 Advanced A/B Testing &amp; Experimentation
                      </h4>
                      <p className="mb-4">
                        Build comprehensive experimentation platforms with statistical significance testing, 
                        multivariate analysis, and automated decision-making for continuous optimization.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-indigo-700 dark:text-indigo-300">🎯 Testing Types</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>A/B Testing:</strong> Simple two-variant comparisons</div>
                            <div><strong>Multivariate Testing:</strong> Multiple element variations</div>
                            <div><strong>Split URL Testing:</strong> Different page experiences</div>
                            <div><strong>Feature Flags:</strong> Gradual feature rollouts</div>
                            <div><strong>Personalization:</strong> User-specific experiences</div>
                          </div>
                        </div>

                        <div className="bg-cyan-50 dark:bg-cyan-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-cyan-700 dark:text-cyan-300">💡 Advanced Features</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Statistical Analysis:</strong> Confidence intervals and p-values</div>
                            <div><strong>Bayesian Testing:</strong> Continuous monitoring approach</div>
                            <div><strong>Segmentation:</strong> User group specific tests</div>
                            <div><strong>Sequential Testing:</strong> Early stopping criteria</div>
                            <div><strong>Multi-armed Bandits:</strong> Dynamic traffic allocation</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-yellow-700 dark:text-yellow-300">📚 A/B Testing Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Testing Guides</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://support.google.com/optimize/answer/7405543" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Google Optimize Guide</a></div>
                            <div>• <a href="https://vwo.com/ab-testing/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">VWO A/B Testing</a></div>
                            <div>• <a href="https://help.optimizely.com/Get_Started" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Optimizely Documentation</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🛠️ Testing Platforms</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://github.com/facebook/planout" target="_blank" rel="noopener" className="text-blue-500 hover:underline">PlanOut Framework</a></div>
                            <div>• <a href="https://launchdarkly.com/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">LaunchDarkly Feature Flags</a></div>
                            <div>• <a href="https://splitio.com/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Split.io Testing Platform</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Growth Success: Fintech Startup</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Fintech startup needed to optimize their onboarding flow and increase 
                            user activation rates through systematic experimentation.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">A/B Testing Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>85% activation increase:</strong> Optimized onboarding flow</div>
                            <div>• <strong>50+ experiments run:</strong> Continuous optimization culture</div>
                            <div>• <strong>95% statistical confidence:</strong> Reliable test results</div>
                            <div>• <strong>$2M revenue impact:</strong> Data-driven growth strategies</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-analytics-step-7',
              title: 'Data Visualization',
              description: 'Create custom analytics dashboards',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-teal-600 dark:text-teal-400">
                        📊 Advanced Data Visualization &amp; Dashboards
                      </h4>
                      <p className="mb-4">
                        Create stunning, interactive data visualizations and comprehensive analytics dashboards 
                        that transform raw data into actionable business insights and strategic decision-making tools.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-teal-50 dark:bg-teal-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-teal-700 dark:text-teal-300">🎯 Visualization Types</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Interactive Charts:</strong> Real-time data exploration</div>
                            <div><strong>Heatmaps &amp; Treemaps:</strong> Pattern visualization</div>
                            <div><strong>Geospatial Maps:</strong> Location-based analytics</div>
                            <div><strong>Time Series:</strong> Trend and seasonal analysis</div>
                            <div><strong>Custom Widgets:</strong> Business-specific visualizations</div>
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">💡 Dashboard Features</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Real-time Updates:</strong> Live data streaming</div>
                            <div><strong>Filter &amp; Drill-down:</strong> Interactive exploration</div>
                            <div><strong>Export &amp; Sharing:</strong> Report generation</div>
                            <div><strong>Mobile Responsive:</strong> Cross-device compatibility</div>
                            <div><strong>Role-based Access:</strong> Personalized views</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">📚 Visualization Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Visualization Libraries</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://d3js.org/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">D3.js Documentation</a></div>
                            <div>• <a href="https://plotly.com/javascript/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Plotly.js Guide</a></div>
                            <div>• <a href="https://www.chartjs.org/docs/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Chart.js Documentation</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🛠️ Dashboard Platforms</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://grafana.com/docs/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Grafana Dashboard Guide</a></div>
                            <div>• <a href="https://observablehq.com/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Observable Notebooks</a></div>
                            <div>• <a href="https://superset.apache.org/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Apache Superset</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Enterprise Success: Healthcare Analytics</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Healthcare network needed comprehensive patient data visualization and operational 
                            dashboards to improve care quality and reduce costs across 50+ facilities.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Visualization Platform Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>70% faster insights:</strong> Real-time dashboard analytics</div>
                            <div>• <strong>50+ custom visualizations:</strong> Tailored medical metrics</div>
                            <div>• <strong>30% cost reduction:</strong> Operational efficiency improvements</div>
                            <div>• <strong>95% user adoption:</strong> Intuitive interface design</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        }
      ]
    },
    ai: {
      id: 'ai',
      title: 'Step-by-Step AI Services Integration',
      icon: <Code className="h-5 w-5" />,
      description: 'Integrate AI and machine learning services',
      sections: [
        {
          id: 'foundation',
          title: '🧠 Foundation',
          description: 'AI service fundamentals',
          steps: [
            {
              id: 'webdev-integrate-ai-step-1',
              title: 'AI Service Types',
              description: 'Understanding different AI service categories',
              estimated_time: '20 min',
              difficulty: 'Beginner',
              content: (
                <div className="space-y-6">
                  <h2 className={`text-2xl font-bold mb-4 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>AI Service Categories</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg text-blue-600 dark:text-blue-400 mb-4`}>Language Models</h3>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• OpenAI GPT</li>
                        <li>• Anthropic Claude</li>
                        <li>• Google Gemini</li>
                        <li>• Text generation & analysis</li>
                      </ul>
                    </div>
                    <div className={`${theme === 'gradient' ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'} border ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} rounded-lg p-6`}>
                      <h3 className={`font-semibold text-lg text-green-600 dark:text-green-400 mb-4`}>Specialized AI</h3>
                      <ul className={`space-y-2 text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
                        <li>• Computer Vision</li>
                        <li>• Speech Recognition</li>
                        <li>• Image Generation</li>
                        <li>• Recommendation Systems</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-ai-step-2',
              title: 'Set Up OpenAI API',
              description: 'Configure OpenAI for your application',
              estimated_time: '25 min',
              difficulty: 'Beginner',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-blue-600 dark:text-blue-400">
                        🤖 OpenAI API Enterprise Setup
                      </h4>
                      <p className="mb-4">
                        Configure OpenAI API with production-ready authentication, rate limiting, 
                        error handling, and cost optimization for scalable AI-powered applications.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">🎯 Setup Components</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>API Key Management:</strong> Secure environment variables</div>
                            <div><strong>Client Configuration:</strong> SDK initialization and settings</div>
                            <div><strong>Model Selection:</strong> GPT-4, GPT-3.5, and specialized models</div>
                            <div><strong>Request Formatting:</strong> Prompt engineering and parameters</div>
                            <div><strong>Response Handling:</strong> Parsing and error management</div>
                          </div>
                        </div>

                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-emerald-700 dark:text-emerald-300">💡 Production Features</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Rate Limiting:</strong> Request throttling and quotas</div>
                            <div><strong>Caching Strategy:</strong> Response caching for efficiency</div>
                            <div><strong>Usage Monitoring:</strong> Token tracking and cost control</div>
                            <div><strong>Fallback Handling:</strong> Service availability management</div>
                            <div><strong>Security Headers:</strong> API protection and validation</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-yellow-700 dark:text-yellow-300">📚 OpenAI Integration Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Official Documentation</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://platform.openai.com/docs/quickstart" target="_blank" rel="noopener" className="text-blue-500 hover:underline">OpenAI Quickstart Guide</a></div>
                            <div>• <a href="https://platform.openai.com/docs/api-reference" target="_blank" rel="noopener" className="text-blue-500 hover:underline">API Reference</a></div>
                            <div>• <a href="https://platform.openai.com/docs/guides/prompt-engineering" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Prompt Engineering</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🛠️ Development Tools</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://github.com/openai/openai-node" target="_blank" rel="noopener" className="text-blue-500 hover:underline">OpenAI Node.js SDK</a></div>
                            <div>• <a href="https://platform.openai.com/playground" target="_blank" rel="noopener" className="text-blue-500 hover:underline">OpenAI Playground</a></div>
                            <div>• <a href="https://platform.openai.com/usage" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Usage Dashboard</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Success Story: Content Platform</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Content creation platform needed AI-powered writing assistance 
                            to help users generate high-quality articles and marketing copy.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">OpenAI Integration Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>300% content output:</strong> AI-assisted writing workflows</div>
                            <div>• <strong>80% cost optimization:</strong> Smart caching and rate limiting</div>
                            <div>• <strong>99.9% uptime:</strong> Robust error handling and fallbacks</div>
                            <div>• <strong>50k+ users served:</strong> Scalable AI infrastructure</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'implementation',
          title: '🤖 Implementation',
          description: 'Build AI-powered features',
          steps: [
            {
              id: 'webdev-integrate-ai-step-3',
              title: 'Text Generation',
              description: 'Implement AI text generation features',
              estimated_time: '35 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                        ✍️ AI Text Generation &amp; Content Creation
                      </h4>
                      <p className="mb-4">
                        Implement sophisticated text generation features with advanced prompt engineering, 
                        context management, and content optimization for diverse business applications.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">🎯 Generation Types</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Creative Writing:</strong> Articles, stories, marketing copy</div>
                            <div><strong>Technical Content:</strong> Documentation, code comments</div>
                            <div><strong>Business Communication:</strong> Emails, proposals, reports</div>
                            <div><strong>Educational Material:</strong> Tutorials, explanations, summaries</div>
                            <div><strong>Interactive Chat:</strong> Conversational AI assistants</div>
                          </div>
                        </div>

                        <div className="bg-teal-50 dark:bg-teal-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-teal-700 dark:text-teal-300">💡 Advanced Features</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Prompt Templates:</strong> Reusable content frameworks</div>
                            <div><strong>Context Injection:</strong> Dynamic information integration</div>
                            <div><strong>Style Consistency:</strong> Brand voice and tone matching</div>
                            <div><strong>Content Filtering:</strong> Safety and quality controls</div>
                            <div><strong>Version Control:</strong> Content iteration and refinement</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">📚 Text Generation Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Implementation Guides</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://platform.openai.com/docs/guides/text-generation" target="_blank" rel="noopener" className="text-blue-500 hover:underline">OpenAI Text Generation</a></div>
                            <div>• <a href="https://docs.anthropic.com/claude/docs" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Anthropic Claude Guide</a></div>
                            <div>• <a href="https://ai.google.dev/docs" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Google AI Documentation</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🛠️ Development Tools</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://langchain.readthedocs.io/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">LangChain Framework</a></div>
                            <div>• <a href="https://github.com/vercel/ai" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Vercel AI SDK</a></div>
                            <div>• <a href="https://huggingface.co/transformers/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Hugging Face Transformers</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Marketing Success: E-commerce Platform</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            E-commerce marketplace needed automated product descriptions and 
                            personalized marketing content for 100,000+ products across multiple categories.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Text Generation Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>95% content automation:</strong> AI-generated product descriptions</div>
                            <div>• <strong>40% conversion increase:</strong> Personalized marketing copy</div>
                            <div>• <strong>90% time savings:</strong> Automated content creation</div>
                            <div>• <strong>Multi-language support:</strong> Global market expansion</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-ai-step-4',
              title: 'Image Analysis',
              description: 'Add computer vision capabilities',
              estimated_time: '30 min',
              difficulty: 'Intermediate',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-purple-600 dark:text-purple-400">
                        👁️ Computer Vision &amp; Image Analysis
                      </h4>
                      <p className="mb-4">
                        Build sophisticated computer vision systems with object detection, image classification, 
                        OCR capabilities, and real-time visual analysis for enhanced user experiences.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">🎯 Vision Capabilities</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Object Detection:</strong> Identify and locate objects in images</div>
                            <div><strong>Image Classification:</strong> Categorize and label visual content</div>
                            <div><strong>OCR &amp; Text Extraction:</strong> Extract text from images and documents</div>
                            <div><strong>Face Recognition:</strong> Identity verification and analysis</div>
                            <div><strong>Content Moderation:</strong> Automated safety and policy enforcement</div>
                          </div>
                        </div>

                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-indigo-700 dark:text-indigo-300">💡 Advanced Applications</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Real-time Processing:</strong> Live video stream analysis</div>
                            <div><strong>Batch Processing:</strong> Large-scale image processing</div>
                            <div><strong>Medical Imaging:</strong> Healthcare diagnostic support</div>
                            <div><strong>Quality Control:</strong> Manufacturing defect detection</div>
                            <div><strong>Visual Search:</strong> Image-based product discovery</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">📚 Computer Vision Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 API Documentation</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://platform.openai.com/docs/guides/vision" target="_blank" rel="noopener" className="text-blue-500 hover:underline">OpenAI Vision API</a></div>
                            <div>• <a href="https://cloud.google.com/vision/docs" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Google Cloud Vision</a></div>
                            <div>• <a href="https://docs.aws.amazon.com/rekognition/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">AWS Rekognition</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🛠️ Vision Libraries</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://opencv.org/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">OpenCV Library</a></div>
                            <div>• <a href="https://github.com/tensorflow/tensorflow" target="_blank" rel="noopener" className="text-blue-500 hover:underline">TensorFlow Vision</a></div>
                            <div>• <a href="https://pytorch.org/vision/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">PyTorch Vision</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Retail Success: Fashion Discovery App</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Fashion discovery app needed visual search capabilities to help users 
                            find similar products by uploading photos of clothing items they liked.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Image Analysis Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>85% accuracy rate:</strong> Visual product matching system</div>
                            <div>• <strong>60% user engagement:</strong> AI-powered discovery features</div>
                            <div>• <strong>200ms response time:</strong> Real-time image processing</div>
                            <div>• <strong>3x conversion rate:</strong> Visual search to purchase funnel</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        },
        {
          id: 'advanced',
          title: '🚀 Advanced',
          description: 'Advanced AI implementations',
          steps: [
            {
              id: 'webdev-integrate-ai-step-5',
              title: 'Custom Training',
              description: 'Fine-tune models for your use case',
              estimated_time: '45 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400">
                        🎓 Custom Model Training &amp; Fine-tuning
                      </h4>
                      <p className="mb-4">
                        Develop specialized AI models tailored to your specific use cases through 
                        fine-tuning, transfer learning, and custom training pipelines for optimal performance.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-red-700 dark:text-red-300">🎯 Training Approaches</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Fine-tuning:</strong> Adapt pre-trained models to your domain</div>
                            <div><strong>Transfer Learning:</strong> Leverage existing model knowledge</div>
                            <div><strong>Custom Training:</strong> Build models from scratch</div>
                            <div><strong>Few-shot Learning:</strong> Train with limited data samples</div>
                            <div><strong>Reinforcement Learning:</strong> Optimize through feedback loops</div>
                          </div>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-orange-700 dark:text-orange-300">💡 Advanced Techniques</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Data Augmentation:</strong> Expand training datasets</div>
                            <div><strong>Hyperparameter Tuning:</strong> Optimize model performance</div>
                            <div><strong>Model Evaluation:</strong> Validation and testing strategies</div>
                            <div><strong>Deployment Optimization:</strong> Production-ready models</div>
                            <div><strong>Continuous Learning:</strong> Adaptive model updates</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-blue-700 dark:text-blue-300">📚 Model Training Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Training Platforms</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://platform.openai.com/docs/guides/fine-tuning" target="_blank" rel="noopener" className="text-blue-500 hover:underline">OpenAI Fine-tuning</a></div>
                            <div>• <a href="https://huggingface.co/docs/transformers/training" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Hugging Face Training</a></div>
                            <div>• <a href="https://cloud.google.com/vertex-ai/docs/training" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Google Vertex AI</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🛠️ Training Tools</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://pytorch.org/tutorials/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">PyTorch Training Guide</a></div>
                            <div>• <a href="https://www.tensorflow.org/guide" target="_blank" rel="noopener" className="text-blue-500 hover:underline">TensorFlow Training</a></div>
                            <div>• <a href="https://wandb.ai/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Weights &amp; Biases MLOps</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 FinTech Success: Fraud Detection System</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Financial services company needed a highly accurate fraud detection system 
                            that could adapt to evolving fraud patterns and minimize false positives.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Custom Training Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>98.5% accuracy rate:</strong> Fine-tuned fraud detection model</div>
                            <div>• <strong>75% false positive reduction:</strong> Optimized for business impact</div>
                            <div>• <strong>Real-time inference:</strong> Sub-100ms transaction scoring</div>
                            <div>• <strong>$50M fraud prevented:</strong> Measurable business protection</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-ai-step-6',
              title: 'AI Workflows',
              description: 'Chain multiple AI services together',
              estimated_time: '40 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-cyan-600 dark:text-cyan-400">
                        🔗 Multi-Model AI Workflows &amp; Orchestration
                      </h4>
                      <p className="mb-4">
                        Design sophisticated AI pipelines that chain multiple models and services together 
                        for complex automation workflows and intelligent business process optimization.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-cyan-50 dark:bg-cyan-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-cyan-700 dark:text-cyan-300">🎯 Workflow Types</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Sequential Pipelines:</strong> Step-by-step AI processing chains</div>
                            <div><strong>Parallel Processing:</strong> Multiple models running simultaneously</div>
                            <div><strong>Conditional Branching:</strong> Dynamic workflow routing</div>
                            <div><strong>Feedback Loops:</strong> Iterative refinement processes</div>
                            <div><strong>Human-in-the-Loop:</strong> AI-assisted decision workflows</div>
                          </div>
                        </div>

                        <div className="bg-teal-50 dark:bg-teal-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-teal-700 dark:text-teal-300">💡 Advanced Orchestration</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>State Management:</strong> Workflow context preservation</div>
                            <div><strong>Error Handling:</strong> Fault tolerance and recovery</div>
                            <div><strong>Load Balancing:</strong> Distributed processing optimization</div>
                            <div><strong>Monitoring &amp; Logging:</strong> Workflow performance tracking</div>
                            <div><strong>Version Control:</strong> Workflow deployment management</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-purple-700 dark:text-purple-300">📚 Workflow Orchestration Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Orchestration Platforms</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://langchain.readthedocs.io/en/latest/modules/chains.html" target="_blank" rel="noopener" className="text-blue-500 hover:underline">LangChain Chains</a></div>
                            <div>• <a href="https://docs.llamaindex.ai/en/stable/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">LlamaIndex Workflows</a></div>
                            <div>• <a href="https://n8n.io/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">n8n Automation</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🛠️ Pipeline Tools</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://airflow.apache.org/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Apache Airflow</a></div>
                            <div>• <a href="https://prefect.io/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Prefect Workflow Engine</a></div>
                            <div>• <a href="https://github.com/PrefectHQ/prefect" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Workflow Automation</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Enterprise Success: Legal Document Processing</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Law firm needed automated document analysis combining OCR, legal entity extraction, 
                            contract clause analysis, and risk assessment across thousands of documents.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">AI Workflow Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>90% processing automation:</strong> Multi-model AI pipeline</div>
                            <div>• <strong>80% time reduction:</strong> Document review acceleration</div>
                            <div>• <strong>95% accuracy rate:</strong> Legal entity and clause extraction</div>
                            <div>• <strong>$2M cost savings:</strong> Reduced manual legal review</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              id: 'webdev-integrate-ai-step-7',
              title: 'AI Ethics & Safety',
              description: 'Implement responsible AI practices',
              estimated_time: '35 min',
              difficulty: 'Advanced',
              content: (
                <div className={theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}>
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold mb-3 text-amber-600 dark:text-amber-400">
                        🛡️ AI Ethics, Safety &amp; Responsible Implementation
                      </h4>
                      <p className="mb-4">
                        Build responsible AI systems with comprehensive safety measures, bias mitigation, 
                        transparency frameworks, and ethical guidelines for trustworthy AI deployment.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-amber-700 dark:text-amber-300">🎯 Safety Measures</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Bias Detection:</strong> Identify and mitigate algorithmic bias</div>
                            <div><strong>Content Filtering:</strong> Safety and policy compliance</div>
                            <div><strong>Data Privacy:</strong> User information protection</div>
                            <div><strong>Explainability:</strong> Transparent decision-making</div>
                            <div><strong>Human Oversight:</strong> Meaningful human control</div>
                          </div>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-5 rounded">
                          <h5 className="font-semibold mb-3 text-yellow-700 dark:text-yellow-300">💡 Ethical Framework</h5>
                          <div className="space-y-3 text-sm">
                            <div><strong>Fairness Auditing:</strong> Regular bias assessments</div>
                            <div><strong>Accountability Systems:</strong> Clear responsibility chains</div>
                            <div><strong>Transparency Reports:</strong> AI system documentation</div>
                            <div><strong>User Consent:</strong> Informed agreement processes</div>
                            <div><strong>Impact Assessment:</strong> Societal effect evaluation</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded">
                      <h5 className="font-semibold mb-3 text-green-700 dark:text-green-300">📚 AI Ethics Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-blue-600 dark:text-blue-400">📖 Ethics Guidelines</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://ai.google/responsibility/principles/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Google AI Principles</a></div>
                            <div>• <a href="https://www.microsoft.com/en-us/ai/responsible-ai" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Microsoft Responsible AI</a></div>
                            <div>• <a href="https://openai.com/safety/" target="_blank" rel="noopener" className="text-blue-500 hover:underline">OpenAI Safety Standards</a></div>
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-4 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">🛠️ Safety Tools</h6>
                          <div className="space-y-2 text-xs">
                            <div>• <a href="https://github.com/facebookresearch/fairness-gym" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Fairness Gym</a></div>
                            <div>• <a href="https://www.tensorflow.org/responsible_ai" target="_blank" rel="noopener" className="text-blue-500 hover:underline">TensorFlow Responsible AI</a></div>
                            <div>• <a href="https://github.com/microsoft/responsible-ai-toolbox" target="_blank" rel="noopener" className="text-blue-500 hover:underline">Microsoft RAI Toolbox</a></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded">
                      <h5 className="font-semibold mb-3">🎯 Healthcare Success: Medical AI Platform</h5>
                      <div className="text-sm space-y-3">
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Challenge:</h6>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            Healthcare AI platform needed comprehensive safety measures and bias mitigation 
                            to ensure equitable treatment recommendations across diverse patient populations.
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded">
                          <h6 className="font-medium mb-2 text-green-600 dark:text-green-400">Responsible AI Results:</h6>
                          <div className="text-xs space-y-1">
                            <div>• <strong>98% bias reduction:</strong> Comprehensive fairness auditing</div>
                            <div>• <strong>100% transparency:</strong> Explainable AI decision-making</div>
                            <div>• <strong>FDA compliance:</strong> Regulatory approval achieved</div>
                            <div>• <strong>Equal outcomes:</strong> Equitable care across demographics</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          ]
        }
      ]
    }
  };

  const currentLearningPath = learningPaths[activeApp] || learningPaths.database;
  const totalSteps = currentLearningPath.sections.reduce((total, section) => total + section.steps.length, 0);

  // State to store completion data for ALL apps
  const [allAppsCompletionData, setAllAppsCompletionData] = useState<{ [key: string]: { completed: number; total: number } }>({});

  // Function to fetch completion data for all apps
  const fetchAllAppsCompletionData = useCallback(async () => {
    try {
      const { data: { user } } = await (await import('../../lib/supabase')).supabase.auth.getUser();
      if (!user) return;

      // Fetch all completed steps for this user across all tools
      const { data, error } = await (await import('../../lib/supabase')).supabase
        .from('user_learning_progress')
        .select('tool_id, step_id')
        .eq('user_id', user.id)
        .eq('completed', true);

      if (error) throw error;

      // Group completed steps by tool_id
      const completedStepsByTool: { [key: string]: Set<string> } = {};
      (data || []).forEach(item => {
        if (!completedStepsByTool[item.tool_id]) {
          completedStepsByTool[item.tool_id] = new Set();
        }
        completedStepsByTool[item.tool_id].add(item.step_id);
      });

      // Calculate completion data for all apps
      const completionData: { [key: string]: { completed: number; total: number } } = {};
      
      Object.keys(learningPaths).forEach(appId => {
        const path = learningPaths[appId];
        const totalStepsForApp = path.sections.reduce((total, section) => total + section.steps.length, 0);
        const completedStepsForApp = completedStepsByTool[appId]?.size || 0;
        
        completionData[appId] = {
          completed: completedStepsForApp,
          total: totalStepsForApp
        };
      });

      setAllAppsCompletionData(completionData);
    } catch (err) {
      console.error('Error fetching all apps completion data:', err);
    }
  }, []);

  // Load completion data for all apps on mount
  useEffect(() => {
    fetchAllAppsCompletionData();
    
    // Listen for progress updates and refresh data
    const handleProgressUpdate = () => {
      fetchAllAppsCompletionData();
    };
    
    window.addEventListener('userProgressUpdated', handleProgressUpdate);
    
    return () => {
      window.removeEventListener('userProgressUpdated', handleProgressUpdate);
    };
  }, [fetchAllAppsCompletionData]);

  const checklistItems: { [key: string]: Array<{id: string, title: string, description: string, completed: boolean}> } = {
    database: [
      {
        id: 'choose-database-type',
        title: 'Choose database type',
        description: 'Select between SQL or NoSQL based on your needs',
        completed: false
      },
      {
        id: 'setup-supabase-project',
        title: 'Set up Supabase project',
        description: 'Create new Supabase project with PostgreSQL',
        completed: false
      },
      {
        id: 'design-database-schema',
        title: 'Design database schema',
        description: 'Create tables and define relationships',
        completed: false
      },
      {
        id: 'configure-row-level-security',
        title: 'Configure row-level security',
        description: 'Set up RLS policies for data protection',
        completed: false
      },
      {
        id: 'setup-database-functions',
        title: 'Set up database functions',
        description: 'Create stored procedures and triggers',
        completed: false
      },
      {
        id: 'optimize-performance',
        title: 'Optimize database performance',
        description: 'Add indexes and optimize queries',
        completed: false
      }
    ],
    auth: [
      {
        id: 'configure-auth-providers',
        title: 'Configure auth providers',
        description: 'Set up email, OAuth, and social login providers',
        completed: false
      },
      {
        id: 'implement-signup-login',
        title: 'Implement signup/login',
        description: 'Create authentication forms and flows',
        completed: false
      },
      {
        id: 'setup-protected-routes',
        title: 'Set up protected routes',
        description: 'Implement route guards and middleware',
        completed: false
      },
      {
        id: 'configure-session-management',
        title: 'Configure session management',
        description: 'Handle user sessions and token refresh',
        completed: false
      },
      {
        id: 'implement-user-profiles',
        title: 'Implement user profiles',
        description: 'Create user profile management features',
        completed: false
      },
      {
        id: 'setup-password-reset',
        title: 'Set up password reset',
        description: 'Implement secure password recovery flow',
        completed: false
      }
    ],
    apis: [
      {
        id: 'design-api-structure',
        title: 'Design API structure',
        description: 'Plan RESTful API endpoints and data flow',
        completed: false
      },
      {
        id: 'implement-crud-operations',
        title: 'Implement CRUD operations',
        description: 'Create, read, update, delete data operations',
        completed: false
      },
      {
        id: 'setup-api-authentication',
        title: 'Set up API authentication',
        description: 'Secure APIs with JWT tokens and API keys',
        completed: false
      },
      {
        id: 'implement-rate-limiting',
        title: 'Implement rate limiting',
        description: 'Add rate limiting to prevent API abuse',
        completed: false
      },
      {
        id: 'setup-api-documentation',
        title: 'Set up API documentation',
        description: 'Create comprehensive API docs with examples',
        completed: false
      },
      {
        id: 'test-api-endpoints',
        title: 'Test API endpoints',
        description: 'Implement automated API testing suite',
        completed: false
      }
    ],
    storage: [
      {
        id: 'configure-file-storage',
        title: 'Configure file storage',
        description: 'Set up cloud storage buckets and policies',
        completed: false
      },
      {
        id: 'implement-file-upload',
        title: 'Implement file upload',
        description: 'Create secure file upload functionality',
        completed: false
      },
      {
        id: 'setup-image-processing',
        title: 'Set up image processing',
        description: 'Add image resize, compression, and optimization',
        completed: false
      },
      {
        id: 'implement-file-versioning',
        title: 'Implement file versioning',
        description: 'Track file versions and enable rollbacks',
        completed: false
      },
      {
        id: 'configure-cdn',
        title: 'Configure CDN',
        description: 'Set up content delivery network for faster access',
        completed: false
      },
      {
        id: 'setup-file-security',
        title: 'Set up file security',
        description: 'Implement access controls and virus scanning',
        completed: false
      }
    ],
    payments: [
      {
        id: 'choose-payment-provider',
        title: 'Choose payment provider',
        description: 'Select Stripe, PayPal, or other payment gateway',
        completed: false
      },
      {
        id: 'setup-payment-forms',
        title: 'Set up payment forms',
        description: 'Create secure payment collection forms',
        completed: false
      },
      {
        id: 'implement-subscription-billing',
        title: 'Implement subscription billing',
        description: 'Set up recurring payments and subscriptions',
        completed: false
      },
      {
        id: 'configure-webhooks',
        title: 'Configure payment webhooks',
        description: 'Handle payment status updates and events',
        completed: false
      },
      {
        id: 'setup-refund-system',
        title: 'Set up refund system',
        description: 'Implement automated and manual refund processing',
        completed: false
      },
      {
        id: 'implement-payment-analytics',
        title: 'Implement payment analytics',
        description: 'Track revenue, conversion rates, and payment metrics',
        completed: false
      }
    ],
    analytics: [
      {
        id: 'setup-google-analytics',
        title: 'Set up Google Analytics',
        description: 'Configure GA4 for web traffic analysis',
        completed: false
      },
      {
        id: 'implement-event-tracking',
        title: 'Implement event tracking',
        description: 'Track user interactions and custom events',
        completed: false
      },
      {
        id: 'setup-conversion-tracking',
        title: 'Set up conversion tracking',
        description: 'Monitor goals and conversion funnels',
        completed: false
      },
      {
        id: 'configure-custom-dashboards',
        title: 'Configure custom dashboards',
        description: 'Create personalized analytics dashboards',
        completed: false
      },
      {
        id: 'implement-user-segmentation',
        title: 'Implement user segmentation',
        description: 'Analyze different user groups and behaviors',
        completed: false
      },
      {
        id: 'setup-automated-reports',
        title: 'Set up automated reports',
        description: 'Generate and schedule analytics reports',
        completed: false
      }
    ],
    ai: [
      {
        id: 'choose-ai-provider',
        title: 'Choose AI service provider',
        description: 'Select OpenAI, Anthropic, or other AI services',
        completed: false
      },
      {
        id: 'setup-api-keys',
        title: 'Set up API keys',
        description: 'Configure secure API key management',
        completed: false
      },
      {
        id: 'implement-chat-interface',
        title: 'Implement chat interface',
        description: 'Create conversational AI user interface',
        completed: false
      },
      {
        id: 'setup-prompt-engineering',
        title: 'Set up prompt engineering',
        description: 'Design effective prompts for AI responses',
        completed: false
      },
      {
        id: 'implement-context-management',
        title: 'Implement context management',
        description: 'Handle conversation history and context',
        completed: false
      },
      {
        id: 'setup-ai-safety-measures',
        title: 'Set up AI safety measures',
        description: 'Implement content filtering and safety checks',
        completed: false
      }
    ]
  };

  const toggleStep = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const handleMarkStepComplete = async (stepId: string) => {
    await markStepComplete(stepId);
  };

  const handleMarkStepIncomplete = async (stepId: string) => {
    await markStepIncomplete(stepId);
  };

  const handleTabOpen = (tabId: string, step: any) => {
    // Check if tab is already open
    if (openTabs.find(tab => tab.id === tabId)) {
      setActiveTab(tabId);
      return;
    }

    // Create tab content based on tabId
    let content: React.ReactNode;
    
    switch (tabId) {
      case 'database-guide':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Database Integration Guide
            </h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  Choosing a Database
                </h4>
                <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                  Select the right database for your application needs.
                </p>
              </div>
              <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  Connection Setup
                </h4>
                <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                  Configure secure database connections.
                </p>
              </div>
            </div>
          </div>
        );
        break;
      case 'supabase-config':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Supabase Configuration
            </h3>
            <div className={`p-6 border-2 border-dashed rounded-lg text-center ${
              theme === 'gradient' ? 'border-gray-600' : 'border-gray-300 dark:border-gray-600'
            }`}>
              <Database className={`h-12 w-12 mx-auto mb-4 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-400'}`} />
              <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                Supabase configuration interface would be embedded here
              </p>
            </div>
          </div>
        );
        break;
      case 'auth-guide':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Authentication Guide
            </h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${theme === 'gradient' ? 'bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-700'}`}>
                <h4 className={`font-medium mb-2 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  Auth Strategies
                </h4>
                <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                  Choose the right authentication strategy for your app.
                </p>
              </div>
            </div>
          </div>
        );
        break;
      case 'supabase-auth-config':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              Supabase Auth Configuration
            </h3>
            <div className={`p-6 border-2 border-dashed rounded-lg text-center ${
              theme === 'gradient' ? 'border-gray-600' : 'border-gray-300 dark:border-gray-600'
            }`}>
              <Lock className={`h-12 w-12 mx-auto mb-4 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-400'}`} />
              <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                Supabase auth configuration interface would be embedded here
              </p>
            </div>
          </div>
        );
        break;
      case 'api-guide':
        content = (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              API Integration Guide
            </h3>
            <div className={`p-6 border-2 border-dashed rounded-lg text-center ${
              theme === 'gradient' ? 'border-gray-600' : 'border-gray-300 dark:border-gray-600'
            }`}>
              <Webhook className={`h-12 w-12 mx-auto mb-4 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-400'}`} />
              <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
                API integration guide would be embedded here
              </p>
            </div>
          </div>
        );
        break;
      default:
        content = (
          <div className="text-center py-8">
            <p className={theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>
              Content for {step.title}
            </p>
          </div>
        );
    }

    const newTab = {
      id: tabId,
      title: step.title,
      content,
      closeable: true
    };

    setOpenTabs(prev => [...prev, newTab]);
    setActiveTab(tabId);
  };

  const handleTabClose = (tabId: string) => {
    setOpenTabs(prev => prev.filter(tab => tab.id !== tabId));
    if (activeTab === tabId) {
      const remainingTabs = openTabs.filter(tab => tab.id !== tabId);
      setActiveTab(remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1].id : '');
    }
  };

  return (
    <div className="space-y-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${
            theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'
          }`}>
            Integrate Services
          </h1>
          <p className={`mt-2 ${
            theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
          }`}>
            Connect your web application to databases, APIs, and third-party services
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {checklistCollapsed && (
            <button
              onClick={() => setChecklistCollapsed(false)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                theme === 'gradient' 
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300 hover:bg-blue-600/30' 
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${theme === 'gradient' ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                <span className="font-medium">Checklist</span>
              </div>
            </button>
          )}
          <Database className={`h-8 w-8 ${theme === 'gradient' ? 'text-blue-400' : 'text-blue-600'}`} />
        </div>
      </div>

      {/* Mini App Switcher */}
      <MiniAppSwitcher 
        apps={miniApps}
        activeApp={activeApp}
        onAppChange={setActiveApp}
        completionData={allAppsCompletionData}
      />

      <div className={`grid gap-6 ${checklistCollapsed ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
        {/* Left Column - Collapsible Checklist */}
        {!checklistCollapsed && (
        <div className="lg:col-span-1">
            <div className={`${theme === 'gradient' ? 'bg-gray-800/50 border-gray-700' : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'} border rounded-lg overflow-hidden`}>
              <button
                onClick={() => setChecklistCollapsed(!checklistCollapsed)}
                className={`w-full px-4 py-3 flex items-center justify-between ${theme === 'gradient' ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors`}
              >
                <h3 className={`font-semibold ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  Integration Checklist
                </h3>
                <Minus className={`h-5 w-5 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-500 dark:text-gray-300'}`} />
              </button>
              <div className="p-4">
                          <EnhancedChecklist
                  title=""
                  items={checklistItems[activeApp] || []}
                  toolId={activeApp}
                />
        </div>
            </div>
          </div>
        )}

        {/* Right Column - FAQ-Style Learning Path and Tabs */}
        <div className={checklistCollapsed ? 'col-span-1' : 'lg:col-span-2'}>
          <div className="space-y-6">
            {/* FAQ-Style Learning Path Section */}
            <div className={`${theme === 'gradient' ? 'bg-gray-800/30 border-gray-700' : 'bg-white dark:bg-gray-800/30 border-gray-200 dark:border-gray-700'} border rounded-lg p-6`}>
              <div className="flex items-center mb-4">
                {currentLearningPath.icon}
                <h2 className={`text-xl font-bold ml-3 ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{currentLearningPath.title}</h2>
              </div>
              <p className={`mb-6 ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>{currentLearningPath.description}</p>
              
              {progressLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className={`h-8 w-8 animate-spin ${
                    theme === 'gradient' ? 'text-blue-400' : 'text-blue-600 dark:text-blue-400'
                  }`} />
                </div>
              ) : (
                /* FAQ-Style Steps */
                <div className="space-y-6">
                  {currentLearningPath.sections.map((section, sectionIndex) => {
                    let stepCounter = 0;
                    // Calculate step number offset for this section
                    for (let i = 0; i < sectionIndex; i++) {
                      stepCounter += currentLearningPath.sections[i].steps.length;
                    }
                    
                    return (
                      <div key={section.id} className="space-y-3">
                        {/* Section Header */}
                        <div className={`${theme === 'gradient' ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-100 dark:bg-gray-700/30 border-gray-300 dark:border-gray-600'} border rounded-lg p-4`}>
                          <div className="flex items-center space-x-3">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${theme === 'gradient' ? 'bg-blue-500' : 'bg-blue-600'} text-white`}>
                              {sectionIndex + 1}
                            </div>
                            <div>
                              <h3 className={`font-semibold text-lg ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{section.title}</h3>
                              <p className={`text-sm ${theme === 'gradient' ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>{section.description}</p>
                            </div>
                            <div className="ml-auto">
                              <span className={`text-xs ${theme === 'gradient' ? 'bg-gray-600 text-gray-200' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200'} px-3 py-1 rounded-full`}>
                                {section.steps.length} steps
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Section Steps */}
                        <div className="space-y-2 ml-4">
                          {section.steps.map((step, stepIndex) => {
                            const isCompleted = isStepCompleted(step.id);
                            const isExpanded = expandedStep === step.id;
                            const globalStepNumber = stepCounter + stepIndex + 1;
                            
                            return (
                              <div key={step.id} className={`${theme === 'gradient' ? 'border-gray-600' : 'border-gray-200 dark:border-gray-600'} border rounded-lg overflow-hidden`}>
                                <button
                                  onClick={() => toggleStep(step.id)}
                                  className={`w-full p-4 text-left ${theme === 'gradient' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'} transition-colors`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                        isCompleted ? 'bg-green-500 text-white' : `${theme === 'gradient' ? 'bg-blue-500' : 'bg-blue-600'} text-white`
                                      }`}>
                                        {isCompleted ? <CheckCircle className="h-4 w-4" /> : globalStepNumber}
                                      </div>
                                      <div className="flex-1">
                                        <h4 className={`font-medium ${theme === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{step.title}</h4>
                                        <p className={`text-sm mt-1 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>{step.description}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <div className="flex items-center space-x-2 text-xs">
                                        <span className={`${theme === 'gradient' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'} px-2 py-1 rounded`}>
                                          {step.estimated_time}
                                        </span>
                                        <span className={`px-2 py-1 rounded ${
                                          step.difficulty === 'Beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                          step.difficulty === 'Intermediate' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                                          'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                        }`}>
                                          {step.difficulty}
                                        </span>
                                      </div>
                                      {isExpanded ? (
                                        <ChevronDown className={`h-5 w-5 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-400'}`} />
                                      ) : (
                                        <ChevronRight className={`h-5 w-5 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-400'}`} />
                                      )}
                                    </div>
                                  </div>
                                </button>
                                
                                {isExpanded && (
                                  <div className={`px-6 pb-6 ${theme === 'gradient' ? 'bg-gray-800/20' : 'bg-gray-50 dark:bg-gray-800/20'}`}>
                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                                      {step.content}
                                    </div>
                                    <div className="flex justify-end mt-6">
                                      {isCompleted ? (
                                        <button
                                          onClick={() => handleMarkStepIncomplete(step.id)}
                                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm flex items-center"
                                        >
                                          <Minus className="h-4 w-4 mr-2" />
                                          Mark Incomplete
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => handleMarkStepComplete(step.id)}
                                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm flex items-center"
                                        >
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Mark Complete
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          {/* Progress Bar */}
          <div className={`mt-6 pt-4 ${theme === 'gradient' ? 'border-gray-700' : 'border-gray-200 dark:border-gray-700'} border-t`}>
            <div className={`flex items-center justify-between text-sm mb-2 ${theme === 'gradient' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
              <span>Progress</span>
              <span>{completedSteps.size}/{totalSteps} steps completed</span>
            </div>
            <div className={`w-full ${theme === 'gradient' ? 'bg-gray-700' : 'bg-gray-200 dark:bg-gray-700'} rounded-full h-2`}>
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedSteps.size / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Main Content Tabs */}
          <MainContentTabs
            tabs={openTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onTabClose={handleTabClose}
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebDevIntegrate;