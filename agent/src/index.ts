/**
 * Main entry point for the LangGraph agent service
 * Exports the graph and authentication middleware
 */

import { graph } from "./agent";
import { auth } from "./auth";

// Export both the graph and auth for LangGraph CLI
export { graph, auth };

