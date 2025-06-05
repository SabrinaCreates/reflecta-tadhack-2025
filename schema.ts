import { pgTable, text, serial, integer, timestamp, jsonb, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const vconFiles = pgTable("vcon_files", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  data: jsonb("data").notNull(),
  processed: boolean("processed").default(false),
});

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  fileId: integer("file_id").references(() => vconFiles.id).notNull(),
  totalCalls: integer("total_calls").notNull(),
  avgWaitTime: real("avg_wait_time").notNull(), // in seconds
  escalatedCalls: integer("escalated_calls").notNull(),
  satisfactionScore: real("satisfaction_score").notNull(),
  topComplaints: text("top_complaints").array().notNull(),
  topCompliments: text("top_compliments").array().notNull(),
  popularService: text("popular_service"),
  leastEngagedService: text("least_engaged_service"),
  avgQualityScore: real("avg_quality_score").notNull(),
  topPerformingAgent: text("top_performing_agent"),
  callsBelowThreshold: integer("calls_below_threshold").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const callQuality = pgTable("call_quality", {
  id: serial("id").primaryKey(),
  fileId: integer("file_id").references(() => vconFiles.id).notNull(),
  callIndex: integer("call_index").notNull(),
  agentName: text("agent_name"),
  qualityScore: real("quality_score").notNull(),
  hasGreeting: boolean("has_greeting").default(false),
  hasClosing: boolean("has_closing").default(false),
  isCalm: boolean("is_calm").default(false),
  resolvedInTime: boolean("resolved_in_time").default(false),
  wasTransferred: boolean("was_transferred").default(false),
  duration: real("duration").notNull(), // in seconds
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertVconFileSchema = createInsertSchema(vconFiles).omit({
  id: true,
  uploadedAt: true,
  processed: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  createdAt: true,
});

export const insertCallQualitySchema = createInsertSchema(callQuality).omit({
  id: true,
  createdAt: true,
});

export type InsertVconFile = z.infer<typeof insertVconFileSchema>;
export type VconFile = typeof vconFiles.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;
export type InsertCallQuality = z.infer<typeof insertCallQualitySchema>;
export type CallQuality = typeof callQuality.$inferSelect;

// vCon structure types
export interface VconData {
  vcon: string;
  uuid: string;
  parties: Array<{
    tel?: string;
    name?: string;
    mailto?: string;
  }>;
  dialog: Array<{
    type: string;
    start: string;
    duration: number;
    parties: number[];
    body?: string;
    transcript?: string;
  }>;
  analysis?: Array<{
    type: string;
    dialog: number;
    body: any;
  }>;
}
