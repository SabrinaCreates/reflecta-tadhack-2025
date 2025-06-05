import { vconFiles, analytics, callQuality, type VconFile, type InsertVconFile, type Analytics, type InsertAnalytics, type CallQuality, type InsertCallQuality } from "@shared/schema";

export interface IStorage {
  // vCon file operations
  createVconFile(file: InsertVconFile): Promise<VconFile>;
  getVconFile(id: number): Promise<VconFile | undefined>;
  getAllVconFiles(): Promise<VconFile[]>;
  
  // Analytics operations
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  getAnalyticsByFileId(fileId: number): Promise<Analytics | undefined>;
  getLatestAnalytics(): Promise<Analytics | undefined>;
  getAllAnalytics(): Promise<Analytics[]>;
  
  // Call Quality operations
  createCallQuality(callQuality: InsertCallQuality): Promise<CallQuality>;
  getCallQualitiesByFileId(fileId: number): Promise<CallQuality[]>;
  getAllCallQualities(): Promise<CallQuality[]>;
}

export class MemStorage implements IStorage {
  private vconFiles: Map<number, VconFile>;
  private analytics: Map<number, Analytics>;
  private callQualities: Map<number, CallQuality>;
  private currentVconId: number;
  private currentAnalyticsId: number;
  private currentCallQualityId: number;

  constructor() {
    this.vconFiles = new Map();
    this.analytics = new Map();
    this.callQualities = new Map();
    this.currentVconId = 1;
    this.currentAnalyticsId = 1;
    this.currentCallQualityId = 1;
  }

  async createVconFile(insertFile: InsertVconFile): Promise<VconFile> {
    const id = this.currentVconId++;
    const file: VconFile = {
      id,
      filename: insertFile.filename,
      data: insertFile.data,
      uploadedAt: new Date(),
      processed: false,
    };
    this.vconFiles.set(id, file);
    return file;
  }

  async getVconFile(id: number): Promise<VconFile | undefined> {
    return this.vconFiles.get(id);
  }

  async getAllVconFiles(): Promise<VconFile[]> {
    return Array.from(this.vconFiles.values());
  }

  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const id = this.currentAnalyticsId++;
    const analyticsData: Analytics = {
      id,
      fileId: insertAnalytics.fileId,
      totalCalls: insertAnalytics.totalCalls,
      avgWaitTime: insertAnalytics.avgWaitTime,
      escalatedCalls: insertAnalytics.escalatedCalls,
      satisfactionScore: insertAnalytics.satisfactionScore,
      topComplaints: insertAnalytics.topComplaints,
      topCompliments: insertAnalytics.topCompliments,
      popularService: insertAnalytics.popularService || null,
      leastEngagedService: insertAnalytics.leastEngagedService || null,
      avgQualityScore: insertAnalytics.avgQualityScore,
      topPerformingAgent: insertAnalytics.topPerformingAgent || null,
      callsBelowThreshold: insertAnalytics.callsBelowThreshold,
      createdAt: new Date(),
    };
    this.analytics.set(id, analyticsData);
    return analyticsData;
  }

  async getAnalyticsByFileId(fileId: number): Promise<Analytics | undefined> {
    return Array.from(this.analytics.values()).find(a => a.fileId === fileId);
  }

  async getLatestAnalytics(): Promise<Analytics | undefined> {
    const allAnalytics = Array.from(this.analytics.values());
    if (allAnalytics.length === 0) return undefined;
    
    return allAnalytics.reduce((latest, current) => 
      current.createdAt > latest.createdAt ? current : latest
    );
  }

  async getAllAnalytics(): Promise<Analytics[]> {
    return Array.from(this.analytics.values());
  }

  async createCallQuality(insertCallQuality: InsertCallQuality): Promise<CallQuality> {
    const id = this.currentCallQualityId++;
    const callQualityData: CallQuality = {
      id,
      fileId: insertCallQuality.fileId,
      callIndex: insertCallQuality.callIndex,
      agentName: insertCallQuality.agentName || null,
      qualityScore: insertCallQuality.qualityScore,
      hasGreeting: insertCallQuality.hasGreeting || false,
      hasClosing: insertCallQuality.hasClosing || false,
      isCalm: insertCallQuality.isCalm || false,
      resolvedInTime: insertCallQuality.resolvedInTime || false,
      wasTransferred: insertCallQuality.wasTransferred || false,
      duration: insertCallQuality.duration,
      createdAt: new Date(),
    };
    this.callQualities.set(id, callQualityData);
    return callQualityData;
  }

  async getCallQualitiesByFileId(fileId: number): Promise<CallQuality[]> {
    return Array.from(this.callQualities.values()).filter(cq => cq.fileId === fileId);
  }

  async getAllCallQualities(): Promise<CallQuality[]> {
    return Array.from(this.callQualities.values());
  }
}

export const storage = new MemStorage();
