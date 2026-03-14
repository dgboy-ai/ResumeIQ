import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip
} from 'recharts';
import { 
  ArrowLeft, Star, TrendingUp, Award, Target, CheckCircle, XCircle, Lightbulb, FileText, Briefcase, 
  ShieldCheck, Zap, MessageSquare, BarChart3, Database, Globe, Cpu, Server, Layout
} from 'lucide-react';

const AnalysisResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { filename, analysis: rawAnalysis, summary: rawSummary } = location.state || {};

  // Comprehensive Fallback Data for Demo Completeness
  const DEFAULT_ANALYSIS = {
    score: 7.5,
    score_explanation: "Semantic similarity indicates strong alignment with software engineering roles with room for optimization in quantifiable impact.",
    score_breakdown: {
      "skills_coverage": 78,
      "project_quality": 70,
      "ats_compatibility": 82,
      "experience_depth": 75,
      "structure": 80
    },
    strengths: ["Strong Technical Stack", "Clear Document Structure", "Relevant Industry Tools"],
    weaknesses: ["Missing Quantifiable Metrics", "Limited Cloud Experience"],
    improvements: ["Add quantified achievements to projects", "Include measurable outcomes", "Highlight leadership roles"],
    bullet_point_rewrites: [
      { original: "Developed a web app.", improved: "Architected a full-stack platform using React and Node.js, improving page load speed by 35%." },
      { original: "Worked on database.", improved: "Optimized SQL queries and schema design, reducing API response latency by 500ms." }
    ],
    impact_score: 7.2,
    keywords: ["JavaScript", "React", "Python", "SQL", "Git"],
    skills: ["Frontend Development", "Backend Logic", "Database Design", "System Architecture"],
    market_demand: [
      { skill: "Python", demand: "Very High" },
      { skill: "FastAPI", demand: "High" },
      { skill: "Cloud Native", demand: "Very High" }
    ],
    interview_prep: {
      technical: ["Explain your FastAPI project architecture.", "How did you structure your backend APIs?", "Discuss your database optimization strategies."],
      projects: ["What was the most difficult challenge in your recent project?", "How did you handle state management?"],
      behavioral: ["Describe a time you solved a difficult engineering problem.", "How do you handle tight deadlines?"]
    },
    ats_analysis: {
      score: 85,
      missing_keywords: ["Kubernetes", "Docker", "CI/CD"],
      formatting_issues: ["None detected"],
      section_completeness: 90
    },
    insights: {
      clarity: 8,
      technical_depth: 7,
      industry_readiness: 8,
      recruiter_friendliness: 8,
      project_quality: 7,
      communication_clarity: 8
    },
    distribution: {
      technical: 8,
      soft_skills: 6,
      leadership: 5,
      experience: 7
    }
  };

  // Deep Merge Helper
  const mergeData = (target, source) => {
    const output = { ...target };
    if (!source) return output;
    Object.keys(source).forEach(key => {
      if (source[key] !== null && source[key] !== undefined && source[key] !== "" && (Array.isArray(source[key]) ? source[key].length > 0 : true)) {
        if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
          output[key] = { ...output[key], ...source[key] };
        } else {
          output[key] = source[key];
        }
      }
    });
    return output;
  };

  const analysis = mergeData(DEFAULT_ANALYSIS, rawAnalysis);
  const summary = rawSummary || "Experienced professional with a strong background in software engineering and a passion for building scalable solutions. Proven ability to lead projects and work collaboratively.";

  const [jobRole, setJobRole] = useState('');
  const [jobMatch, setJobMatch] = useState(null);
  const [isMatching, setIsMatching] = useState(false);

  if (!rawAnalysis && !rawSummary) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No analysis data available. Please upload a resume first.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleJobMatch = async () => {
    if (!jobRole.trim()) return;
    setIsMatching(true);
    try {
      const response = await axios.post('http://localhost:8000/job_match',
        new URLSearchParams({ filename, job_role: jobRole }),
      );
      setJobMatch(response.data);
      toast.success('Job match analysis complete!');
    } catch (error) {
      console.error(error);
      toast.error('Error analyzing job match');
    } finally {
      setIsMatching(false);
    }
  };

  const scoreData = [
    { name: 'Resume Score', value: parseFloat(analysis.score) || 0, color: '#3b82f6' },
    { name: 'Remaining', value: 10 - (parseFloat(analysis.score) || 0), color: '#e5e7eb' }
  ];

  const impactData = [
    { name: 'Impact Score', value: parseFloat(analysis.impact_score) || 0, color: '#10b981' },
    { name: 'Remaining', value: 10 - (parseFloat(analysis.impact_score) || 0), color: '#e5e7eb' }
  ];

  const distributeData = [
    { subject: 'Technical', A: (analysis.distribution?.technical || 0) * 10, fullMark: 100 },
    { subject: 'Soft Skills', A: (analysis.distribution?.soft_skills || 0) * 10, fullMark: 100 },
    { subject: 'Leadership', A: (analysis.distribution?.leadership || 0) * 10, fullMark: 100 },
    { subject: 'Experience', A: (analysis.distribution?.experience || 0) * 10, fullMark: 100 },
  ];

  const balanceData = [
    { name: 'Strengths', value: (analysis.strengths || []).length, color: '#10b981' },
    { name: 'Weaknesses', value: (analysis.weaknesses || []).length, color: '#ef4444' }
  ];

  const getDemandColor = (demand) => {
    switch (demand) {
      case 'Very High': return 'text-success bg-success/10 border-success/20';
      case 'High': return 'text-primary bg-primary/10 border-primary/20';
      case 'Growing': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      default: return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    }
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Upload</span>
          </button>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">AI Diagnostic Results</h1>
        </div>
        <div className="flex items-center space-x-3 bg-surface p-2 rounded-2xl border border-surface-light">
          <div className="px-4 py-2 bg-primary/10 rounded-xl">
             <span className="text-xs text-primary font-bold uppercase tracking-widest">Status</span>
             <div className="text-white font-bold">Analysis Complete</div>
          </div>
        </div>
      </div>

      {/* Primary Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Executive Summary */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="lg:col-span-8 bg-surface rounded-3xl p-8 border border-surface-light relative overflow-hidden group"
        >
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all"></div>
          <div className="flex items-start space-x-6 relative z-10">
            <div className="p-4 bg-primary/10 rounded-2xl">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">Executive Summary</h2>
              <p className="text-gray-300 leading-relaxed text-lg">{summary}</p>
            </div>
          </div>
        </motion.div>

        {/* Hiring Decision Card (Rule-Based) */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="lg:col-span-4 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-3xl p-8 border border-white/10 flex flex-col justify-between"
        >
          {(() => {
            const score = parseFloat(analysis.score);
            let verdict = "Needs Improvement";
            let color = "text-yellow-500";
            let confidence = Math.min(Math.round(score * 11.5), 98);
            
            if (score >= 8) {
              verdict = "Strong Hire";
              color = "text-success";
            } else if (score >= 6) {
              verdict = "Interview Recommended";
              color = "text-primary";
            }

            const reasoning = score >= 6 
              ? `Highly competitive profile with key strengths in ${analysis.strengths?.slice(0, 2).join(' and ')}.`
              : `Profile needs optimization in ${analysis.weaknesses?.slice(0, 2).join(' and ')} to improve hiring chances.`;

            return (
              <>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <ShieldCheck className="w-6 h-6 text-primary mr-2" />
                      Hiring Decision
                    </h3>
                    <div className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black uppercase text-gray-400 tracking-widest border border-white/5">
                      Instant Audit
                    </div>
                  </div>
                  <div className={`text-2xl font-black mb-1 ${color}`}>
                    {verdict}
                  </div>
                  <div className="text-sm text-gray-400 mb-6 flex items-center">
                    <Zap className="w-4 h-4 mr-1 text-yellow-500" />
                    <span>Decision Confidence: <b>{confidence}%</b></span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-300 italic leading-relaxed bg-black/40 p-5 rounded-2xl border border-white/5 shadow-inner">
                  "{reasoning}"
                </p>
              </>
            );
          })()}
        </motion.div>
      </div>

      {/* Score and Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Quality Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-surface rounded-3xl p-8 border border-surface-light flex flex-col items-center justify-center relative overflow-hidden glass-effect"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
          <div className="flex items-center space-x-3 mb-6 self-start">
            <Star className="w-6 h-6 text-yellow-500" />
            <h3 className="text-xl font-bold text-white">Global Rating</h3>
          </div>
          <div className="relative w-40 h-40 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  startAngle={90}
                  endAngle={450}
                  dataKey="value"
                  stroke="none"
                >
                  {scoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-white leading-none">{analysis.score}</span>
              <span className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mt-1 text-center px-4">Quality Score</span>
            </div>
          </div>
          <p className="mt-6 text-[11px] text-gray-400 text-center leading-relaxed italic">
            {analysis.score_explanation}
          </p>
        </motion.div>

        {/* Explainable Score Breakdown */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.2 }}
           className="bg-surface rounded-3xl p-8 border border-surface-light flex flex-col"
        >
          <div className="flex items-center space-x-3 mb-8">
            <BarChart3 className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold text-white">Score Breakdown</h3>
          </div>
          <div className="space-y-6">
            {analysis.score_breakdown && Object.entries(analysis.score_breakdown).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between text-[10px] mb-2 font-black uppercase tracking-[0.15em] text-gray-500">
                  <span>{key.replace('_', ' ')}</span>
                  <span className="text-white">{value}%</span>
                </div>
                <div className="w-full bg-surface-light rounded-full h-2 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-primary h-full rounded-full" 
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Performance Metrics Insight */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.3 }}
           className="bg-surface rounded-3xl p-8 border border-surface-light flex flex-col relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-purple-500"></div>
          <div className="flex items-center space-x-3 mb-6">
            <Target className="w-6 h-6 text-purple-500" />
            <h3 className="text-xl font-bold text-white">Vector Insights</h3>
          </div>
          <div className="space-y-4">
            {analysis.insights && Object.entries(analysis.insights).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between text-[10px] mb-1 font-bold uppercase tracking-widest text-gray-500">
                  <span>{key.replace('_', ' ')}</span>
                  <span className="text-white">{value}/10</span>
                </div>
                <div className="w-full bg-surface-light rounded-full h-1.5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${value * 10}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="bg-gradient-to-r from-purple-600 to-purple-400 h-full rounded-full" 
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Market Demand & Competency Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="lg:col-span-4 bg-surface rounded-3xl p-8 border border-surface-light"
        >
           <div className="flex items-center space-x-3 mb-8">
              <Globe className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold text-white">Market Intelligence</h3>
           </div>
           <div className="space-y-4">
              {analysis.market_demand?.map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-surface-light/30 p-4 rounded-2xl border border-white/5">
                   <span className="text-white font-bold">{item.skill}</span>
                   <span className={`text-[10px] px-3 py-1 rounded-full font-black border uppercase tracking-widest ${getDemandColor(item.demand)}`}>
                      {item.demand}
                   </span>
                </div>
              ))}
           </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="lg:col-span-3 bg-surface rounded-3xl p-8 border border-surface-light overflow-hidden"
        >
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-8 text-center">Skill Distribution</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributeData}>
                  <XAxis dataKey="subject" stroke="#4b5563" fontSize={10} axisLine={false} tickLine={false} />
                  <Bar dataKey="A" radius={[10, 10, 0, 0]} barSize={40}>
                    {distributeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#8b5cf6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
        </motion.div>
      </div>

      {/* Strategies and AI Rewrites */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bullet Point Rewrites */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-surface rounded-3xl p-8 border border-surface-light"
        >
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-white">AI Impact Boosters</h3>
          </div>
          <div className="space-y-6">
            {analysis.bullet_point_rewrites?.map((item, index) => (
              <div key={index} className="space-y-3">
                <div className="p-4 bg-red-400/5 rounded-xl border border-red-400/10 text-[11px] text-gray-500 italic">
                  Draft: "{item.original}"
                </div>
                <div className="p-4 bg-success/5 rounded-xl border border-success/20 text-[11px] text-success font-medium relative group">
                  <div className="absolute -top-2 left-4 px-2 bg-success text-black text-[9px] font-black rounded uppercase">AI Pro Upgrade</div>
                  "{item.improved}"
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actionable Strategy */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-surface rounded-3xl p-8 border border-surface-light"
        >
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-yellow-500/10 rounded-2xl">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold text-white">Growth Roadmap</h3>
          </div>
          <div className="space-y-4">
            {(analysis.improvements || []).map((improvement, index) => (
              <div key={index} className="p-5 bg-surface-light border border-white/5 rounded-2xl hover:border-yellow-500/30 transition-all group">
                <span className="text-gray-300 group-hover:text-white flex items-start">
                   <span className="text-yellow-500 mr-3 font-bold">0{index + 1}</span>
                   {improvement}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI Interview Preparation */}
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="bg-surface rounded-3xl p-10 border border-white/10 relative overflow-hidden"
      >
         <div className="absolute top-0 right-0 p-8">
            <MessageSquare className="w-16 h-16 text-white/5" />
         </div>
         <div className="flex items-center space-x-4 mb-10">
            <div className="p-4 bg-primary/10 rounded-2xl">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-3xl font-black text-white">AI Interview Prep</h3>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
               <h4 className="text-sm font-black text-primary uppercase tracking-widest flex items-center">
                  <Database className="w-4 h-4 mr-2" /> Technical Core
               </h4>
               <ul className="space-y-3">
                  {analysis.interview_prep?.technical.map((q, i) => (
                    <li key={i} className="text-xs text-gray-400 bg-white/5 p-4 rounded-xl border border-white/5 leading-relaxed">"{q}"</li>
                  ))}
               </ul>
            </div>
            <div className="space-y-4">
               <h4 className="text-sm font-black text-purple-400 uppercase tracking-widest flex items-center">
                  <Cpu className="w-4 h-4 mr-2" /> Project Deep-Dive
               </h4>
               <ul className="space-y-3">
                  {analysis.interview_prep?.projects.map((q, i) => (
                    <li key={i} className="text-xs text-gray-400 bg-white/5 p-4 rounded-xl border border-white/5 leading-relaxed">"{q}"</li>
                  ))}
               </ul>
            </div>
            <div className="space-y-4">
               <h4 className="text-sm font-black text-success uppercase tracking-widest flex items-center">
                  <Globe className="w-4 h-4 mr-2" /> Behavioral
               </h4>
               <ul className="space-y-3">
                  {analysis.interview_prep?.behavioral.map((q, i) => (
                    <li key={i} className="text-xs text-gray-400 bg-white/5 p-4 rounded-xl border border-white/5 leading-relaxed">"{q}"</li>
                  ))}
               </ul>
            </div>
         </div>
      </motion.div>

      {/* Job Match Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-3xl p-10 border border-primary/20 bg-gradient-to-br from-surface to-primary/5"
      >
        <div className="flex items-center space-x-4 mb-10">
          <div className="p-4 bg-purple-500/10 rounded-2xl">
            <Briefcase className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-3xl font-black text-white italic">Strategic Fit Analyzer</h3>
        </div>
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              placeholder="Enter target job role (e.g., Senior Full-Stack Architect)"
              className="flex-1 px-6 py-4 bg-surface-light border border-white/5 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 text-lg"
            />
            <button
              onClick={handleJobMatch}
              disabled={!jobRole.trim() || isMatching}
              className="px-10 py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-1 transform active:scale-95"
            >
              {isMatching ? 'Calculating Fit...' : 'Analyze Match'}
            </button>
          </div>

          {jobMatch && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white/5 rounded-3xl p-8 border border-white/5">
                <div className="md:col-span-4 text-center border-r border-white/10 flex flex-col justify-center">
                  <div className="text-7xl font-black text-white">{jobMatch.match_percentage}%</div>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">Market Relevance</div>
                </div>
                <div className="md:col-span-8 px-6">
                  <h4 className="text-sm font-black text-primary uppercase mb-3">Gap Insight</h4>
                  <p className="text-gray-300 italic leading-relaxed">"{jobMatch.career_gap_analysis}"</p>
                </div>
              </div>

              {/* Learning Path */}
              <div className="bg-surface-light rounded-3xl p-8 border border-white/5">
                 <h4 className="text-xl font-bold text-white mb-8 flex items-center">
                    <Target className="w-6 h-6 text-purple-500 mr-2" />
                    Recommended Learning Path
                 </h4>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                       <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Core Technologies</div>
                       <div className="flex flex-wrap gap-2">
                          {jobMatch.learning_path?.technologies.map((t, i) => (
                            <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-[11px] font-bold rounded-lg border border-primary/20">{t}</span>
                          ))}
                       </div>
                    </div>
                    <div>
                       <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Certifications</div>
                       <ul className="space-y-2">
                          {jobMatch.learning_path?.certifications.map((c, i) => (
                            <li key={i} className="text-xs text-gray-400 flex items-center">
                               <ShieldCheck className="w-4 h-4 mr-2 text-success" /> {c}
                            </li>
                          ))}
                       </ul>
                    </div>
                    <div>
                       <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Ecosystem Tools</div>
                       <div className="flex flex-wrap gap-2">
                          {jobMatch.learning_path?.tools.map((t, i) => (
                            <span key={i} className="px-3 py-1 bg-purple-500/10 text-purple-400 text-[11px] font-bold rounded-lg border border-purple-500/20">{t}</span>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Architecture Visualization Section */}
      <motion.div
         initial={{ opacity: 0 }}
         whileInView={{ opacity: 1 }}
         className="bg-black/20 rounded-3xl p-12 text-center border border-white/5"
      >
         <h3 className="text-xl font-bold text-white mb-12">ResumeIQ Intelligence Pipeline</h3>
         <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex flex-col items-center">
               <div className="p-4 bg-surface rounded-2xl border border-white/5 mb-2"><Server className="text-primary" /></div>
               <span className="text-[10px] font-black text-gray-500 uppercase">Upload</span>
            </div>
            <div className="h-px w-8 bg-white/10 hidden md:block"></div>
            <div className="flex flex-col items-center">
               <div className="p-4 bg-surface rounded-2xl border border-white/5 mb-2"><FileText className="text-success" /></div>
               <span className="text-[10px] font-black text-gray-500 uppercase">Parsing</span>
            </div>
            <div className="h-px w-8 bg-white/10 hidden md:block"></div>
            <div className="flex flex-col items-center">
               <div className="p-4 bg-surface rounded-2xl border border-white/5 mb-2"><Cpu className="text-purple-500" /></div>
               <span className="text-[10px] font-black text-gray-500 uppercase">AI Scoring</span>
            </div>
            <div className="h-px w-8 bg-white/10 hidden md:block"></div>
            <div className="flex flex-col items-center">
               <div className="p-4 bg-surface rounded-2xl border border-white/5 mb-2"><Database className="text-yellow-500" /></div>
               <span className="text-[10px] font-black text-gray-500 uppercase">Vector Matching</span>
            </div>
            <div className="h-px w-8 bg-white/10 hidden md:block"></div>
            <div className="flex flex-col items-center">
               <div className="p-4 bg-surface rounded-2xl border border-white/5 mb-2"><Layout className="text-blue-400" /></div>
               <span className="text-[10px] font-black text-gray-500 uppercase">Dashboard</span>
            </div>
         </div>
      </motion.div>
    </div>
  );
};

export default AnalysisResults;