import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import Dashboard from '../pages/Dashboard';
import Build from '../pages/Build';
import Automate from '../pages/Automate';
import Monetize from '../pages/Monetize';
import Analyze from '../pages/Analyze';
import Network from '../pages/Network';
import Settings from '../pages/Settings';
import VibeCodingLab from '../pages/VibeCodingLab';
import N8nAIAgents from '../pages/N8nAIAgents';
import AICourseFactory from '../pages/AICourseFactory';
import PromptEngineering from '../pages/PromptEngineering';
import SignalIntelligence from '../pages/SignalIntelligence';
import GenesisEngine from '../pages/GenesisEngine';
import SpeedWealth from '../pages/SpeedWealth';
import CashflowArena from '../pages/CashflowArena';
import DigitalGhostwriting from '../pages/DigitalGhostwriting';
import MarketRecon from '../pages/MarketRecon';
import AnalyticsDashboard from '../pages/AnalyticsDashboard';
import PortfolioShowcase from '../pages/PortfolioShowcase';
import DiscordIntegration from '../pages/DiscordIntegration';
import ChallengesMentorship from '../pages/ChallengesMentorship';
import Integrate from '../pages/Integrate';
import Deploy from '../pages/Deploy';
import Optimize from '../pages/Optimize';
import Auth from '../pages/Auth';
import Onboarding from '../pages/Onboarding';
import Payment from '../pages/Payment';
import CheckAuth from '../pages/CheckAuth';

// Focus index pages
import N8nIndex from '../pages/N8nIndex';
import VideoIndex from '../pages/VideoIndex';
import WebDevIndex from '../pages/WebDevIndex';

// Advanced focus pages
import AdvancedIndex from '../pages/advanced/AdvancedIndex';
import AdvancedN8nIndex from '../pages/advanced/N8nIndex';
import AdvancedVideoIndex from '../pages/advanced/VideoIndex';
import AdvancedWebDevIndex from '../pages/advanced/WebDevIndex';
import ClothingBrand from '../pages/advanced/ClothingBrand';
import AiInfluencer from '../pages/advanced/AiInfluencer';
import Copywriting from '../pages/advanced/Copywriting';
import Automation from '../pages/advanced/AutomationAgency';

// N8n focus pages
import N8nIntegrate from '../pages/n8n/Integrate';
import N8nDeploy from '../pages/n8n/Deploy';
import N8nOptimize from '../pages/n8n/Optimize';
import N8nNetwork from '../pages/n8n/Network';

// Video focus pages
import VideoIntegrate from '../pages/video/Integrate';
import VideoDeploy from '../pages/video/Deploy';
import VideoOptimize from '../pages/video/Optimize';
import VideoNetwork from '../pages/video/Network';

// Web Dev focus pages
import WebDevIntegrate from '../pages/webdev/Integrate';
import WebDevDeploy from '../pages/webdev/Deploy';
import WebDevOptimize from '../pages/webdev/Optimize';
import WebDevNetwork from '../pages/webdev/Network';

import { RequireAuth } from './RequireAuth';
import { EmailVerification } from '../components/auth/EmailVerification';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/check-auth" element={<CheckAuth />} />
        
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="build" element={<Build />} />
            <Route path="automate" element={<Automate />} />
            <Route path="monetize" element={<Monetize />} />
            <Route path="analyze" element={<Analyze />} />
            <Route path="network" element={<Network />} />
            <Route path="settings" element={<Settings />} />
            <Route path="vibe-coding-lab" element={<VibeCodingLab />} />
            <Route path="n8n-ai-agents" element={<N8nAIAgents />} />
            <Route path="ai-course-factory" element={<AICourseFactory />} />
            <Route path="prompt-engineering" element={<PromptEngineering />} />
            <Route path="signal-intelligence" element={<SignalIntelligence />} />
            <Route path="genesis-engine" element={<GenesisEngine />} />
            <Route path="speed-wealth" element={<SpeedWealth />} />
            <Route path="cashflow-arena" element={<CashflowArena />} />
            <Route path="ghostwriting" element={<DigitalGhostwriting />} />
            <Route path="market-recon" element={<MarketRecon />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="portfolio" element={<PortfolioShowcase />} />
            <Route path="discord" element={<DiscordIntegration />} />
            <Route path="challenges" element={<ChallengesMentorship />} />
            <Route path="integrate" element={<Integrate />} />
            <Route path="deploy" element={<Deploy />} />
            <Route path="optimize" element={<Optimize />} />
            
            {/* Focus index pages */}
            <Route path="n8n" element={<N8nIndex />} />
            <Route path="video" element={<VideoIndex />} />
            <Route path="webdev" element={<WebDevIndex />} />
            
            {/* Advanced focus pages */}
            <Route path="advanced" element={<AdvancedIndex />} />
            <Route path="advanced/n8n" element={<AdvancedN8nIndex />} />
            <Route path="advanced/video" element={<AdvancedVideoIndex />} />
            <Route path="advanced/webdev" element={<AdvancedWebDevIndex />} />
            <Route path="advanced/clothing-brand" element={<ClothingBrand />} />
            <Route path="advanced/ai-influencer" element={<AiInfluencer />} />
            <Route path="advanced/copywriting" element={<Copywriting />} />
            <Route path="advanced/automationagency" element={<Automation />} />

            
            {/* N8n focus pages */}
            <Route path="n8n/integrate" element={<N8nIntegrate />} />
            <Route path="n8n/deploy" element={<N8nDeploy />} />
            <Route path="n8n/optimize" element={<N8nOptimize />} />
            <Route path="n8n/network" element={<N8nNetwork />} />
            
            {/* Video focus pages */}
            <Route path="video/integrate" element={<VideoIntegrate />} />
            <Route path="video/deploy" element={<VideoDeploy />} />
            <Route path="video/optimize" element={<VideoOptimize />} />
            <Route path="video/network" element={<VideoNetwork />} />
            
            {/* Web Dev focus pages */}
            <Route path="webdev/integrate" element={<WebDevIntegrate />} />
            <Route path="webdev/deploy" element={<WebDevDeploy />} />
            <Route path="webdev/optimize" element={<WebDevOptimize />} />
            <Route path="webdev/network" element={<WebDevNetwork />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/check-auth" replace />} />
      </Routes>
    </BrowserRouter>
  );
};