import "server-only";
import type { AgentTool } from "./defineTool";
import { readTools } from "./readTools";
import { writeTools } from "./writeTools";

/** Every tool in this list is given to Gemini. Add tools in readTools.ts or writeTools.ts, not here. */
export const tools: AgentTool[] = [...readTools, ...writeTools];
