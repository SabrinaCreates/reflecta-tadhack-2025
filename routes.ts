import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVconFileSchema, insertAnalyticsSchema, insertCallQualitySchema } from "@shared/schema";
import multer from "multer";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype === 'application/json' || file.originalname.endsWith('.json')) {
      cb(null, true);
    } else {
      cb(new Error('Only JSON files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Upload vCon file
  app.post("/api/upload", upload.single('file'), async (req: MulterRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileContent = req.file.buffer.toString('utf-8');
      let vconData;
      
      try {
        vconData = JSON.parse(fileContent);
      } catch (parseError) {
        return res.status(400).json({ message: "Invalid JSON file" });
      }

      // Validate vCon structure
      if (!vconData.vcon || !vconData.dialog) {
        return res.status(400).json({ message: "Invalid vCon file structure" });
      }

      const fileData = insertVconFileSchema.parse({
        filename: req.file.originalname,
        data: vconData,
      });

      const savedFile = await storage.createVconFile(fileData);
      
      // Process analytics and call quality
      const { analytics, callQualities } = await processVconAnalytics(vconData, savedFile.id);
      await storage.createAnalytics(analytics);
      
      // Save individual call quality records
      for (const callQuality of callQualities) {
        await storage.createCallQuality(callQuality);
      }

      res.json({ 
        message: "File uploaded and processed successfully", 
        fileId: savedFile.id 
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ message: error.message || "Failed to upload file" });
    }
  });

  // Get analytics data
  app.get("/api/analytics/latest", async (req, res) => {
    try {
      const analytics = await storage.getLatestAnalytics();
      
      if (!analytics) {
        return res.status(404).json({ message: "No analytics data found" });
      }

      res.json(analytics);
    } catch (error: any) {
      console.error("Analytics fetch error:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Get all analytics
  app.get("/api/analytics", async (req, res) => {
    try {
      const analytics = await storage.getAllAnalytics();
      res.json(analytics);
    } catch (error: any) {
      console.error("Analytics fetch error:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Get analytics by file ID
  app.get("/api/analytics/:fileId", async (req, res) => {
    try {
      const fileId = parseInt(req.params.fileId);
      const analytics = await storage.getAnalyticsByFileId(fileId);
      
      if (!analytics) {
        return res.status(404).json({ message: "Analytics not found for this file" });
      }

      res.json(analytics);
    } catch (error: any) {
      console.error("Analytics fetch error:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Get call qualities by file ID
  app.get("/api/call-quality/:fileId", async (req, res) => {
    try {
      const fileId = parseInt(req.params.fileId);
      const callQualities = await storage.getCallQualitiesByFileId(fileId);
      res.json(callQualities);
    } catch (error: any) {
      console.error("Call quality fetch error:", error);
      res.status(500).json({ message: "Failed to fetch call qualities" });
    }
  });

  // Get latest call qualities
  app.get("/api/call-quality/latest", async (req, res) => {
    try {
      const allQualities = await storage.getAllCallQualities();
      // Get the most recent file's call qualities
      if (allQualities.length === 0) {
        return res.status(404).json({ message: "No call quality data found" });
      }
      
      const latestFileId = Math.max(...allQualities.map(q => q.fileId));
      const latestQualities = allQualities.filter(q => q.fileId === latestFileId);
      res.json(latestQualities);
    } catch (error: any) {
      console.error("Call quality fetch error:", error);
      res.status(500).json({ message: "Failed to fetch call qualities" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function processVconAnalytics(vconData: any, fileId: number) {
  const dialogs = vconData.dialog || [];
  const totalCalls = dialogs.length;
  
  // Calculate average wait time (simulate from dialog data)
  const avgWaitTime = dialogs.reduce((sum: number, dialog: any) => {
    return sum + (dialog.duration || 0);
  }, 0) / Math.max(totalCalls, 1);

  // Analyze transcripts for complaints and compliments
  const transcripts = dialogs
    .filter((d: any) => d.transcript || d.body)
    .map((d: any) => (d.transcript || d.body || '').toLowerCase());

  // Simple keyword analysis for complaints
  const complaintKeywords = ['wait', 'slow', 'problem', 'issue', 'complaint', 'frustrated', 'angry', 'billing', 'connection'];
  const complimentKeywords = ['great', 'excellent', 'helpful', 'fast', 'quick', 'thank', 'good', 'satisfied', 'amazing'];

  const topComplaints = complaintKeywords
    .map(keyword => ({
      keyword,
      count: transcripts.filter((t: any) => t.includes(keyword)).length
    }))
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(item => item.keyword);

  const topCompliments = complimentKeywords
    .map(keyword => ({
      keyword,
      count: transcripts.filter((t: any) => t.includes(keyword)).length
    }))
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(item => item.keyword);

  // Calculate escalated calls (simulate based on duration and keywords)
  const escalatedCalls = dialogs.filter((d: any) => {
    const transcript = (d.transcript || d.body || '').toLowerCase();
    return d.duration > 600 || // calls longer than 10 minutes
           transcript.includes('supervisor') || 
           transcript.includes('manager') ||
           transcript.includes('escalate');
  }).length;

  // Calculate satisfaction score (simulate)
  const satisfactionScore = Math.max(1, 5 - (escalatedCalls / totalCalls) * 2 - (topComplaints.length / 10));

  // Determine popular and least engaged services
  const services = ['Technical Support', 'Billing Inquiries', 'General Questions', 'Sales'];
  const popularService = services[Math.floor(Math.random() * services.length)];
  const leastEngagedService = services.find(s => s !== popularService) || 'Billing Inquiries';

  // Process individual call quality scores
  const callQualities = dialogs.map((dialog: any, index: number) => {
    const transcript = (dialog.transcript || dialog.body || '').toLowerCase();
    const duration = dialog.duration || 0;
    
    // Analyze call quality factors
    const hasGreeting = transcript.includes('hello') || transcript.includes('good') || transcript.includes('thank you for calling');
    const hasClosing = transcript.includes('thank you') || transcript.includes('goodbye') || transcript.includes('have a great day');
    const isCalm = !transcript.includes('angry') && !transcript.includes('frustrated') && !complaintKeywords.some(keyword => transcript.includes(keyword));
    const resolvedInTime = duration < 600; // Under 10 minutes
    const wasTransferred = transcript.includes('transfer') || transcript.includes('escalate') || transcript.includes('supervisor');
    
    // Calculate quality score (1-10)
    let qualityScore = 5; // Base score
    if (hasGreeting) qualityScore += 1.5;
    if (hasClosing) qualityScore += 1.5;
    if (isCalm) qualityScore += 2;
    if (resolvedInTime) qualityScore += 1.5;
    if (wasTransferred) qualityScore -= 2;
    
    // Ensure score is between 1-10
    qualityScore = Math.max(1, Math.min(10, qualityScore));
    
    // Generate agent names
    const agentNames = ['Sarah Johnson', 'Mike Chen', 'Emily Davis', 'Alex Rodriguez', 'Jessica Wilson'];
    const agentName = agentNames[index % agentNames.length];
    
    return insertCallQualitySchema.parse({
      fileId,
      callIndex: index,
      agentName,
      qualityScore: Math.round(qualityScore * 10) / 10,
      hasGreeting,
      hasClosing,
      isCalm,
      resolvedInTime,
      wasTransferred,
      duration,
    });
  });

  // Calculate call quality metrics
  const avgQualityScore = callQualities.reduce((sum, cq) => sum + cq.qualityScore, 0) / Math.max(callQualities.length, 1);
  const callsBelowThreshold = callQualities.filter(cq => cq.qualityScore < 6).length;
  
  // Find top performing agent
  const agentScores = new Map<string, number[]>();
  callQualities.forEach(cq => {
    if (cq.agentName) {
      if (!agentScores.has(cq.agentName)) {
        agentScores.set(cq.agentName, []);
      }
      agentScores.get(cq.agentName)!.push(cq.qualityScore);
    }
  });
  
  let topPerformingAgent = '';
  let highestAvgScore = 0;
  agentScores.forEach((scores, agent) => {
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    if (avgScore > highestAvgScore) {
      highestAvgScore = avgScore;
      topPerformingAgent = agent;
    }
  });

  const analytics = insertAnalyticsSchema.parse({
    fileId,
    totalCalls,
    avgWaitTime,
    escalatedCalls,
    satisfactionScore: Math.round(satisfactionScore * 10) / 10,
    topComplaints,
    topCompliments,
    popularService,
    leastEngagedService,
    avgQualityScore: Math.round(avgQualityScore * 10) / 10,
    topPerformingAgent,
    callsBelowThreshold,
  });

  return { analytics, callQualities };
}
