/**
 * This is the main entry point for the agent.
 * It defines the workflow graph, state, tools, nodes and edges.
 */

import { z } from "zod";
import { RunnableConfig } from "@langchain/core/runnables";
import { tool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage, SystemMessage } from "@langchain/core/messages";
import { MemorySaver, START, StateGraph } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { convertActionsToDynamicStructuredTools, CopilotKitStateAnnotation } from "@copilotkit/sdk-js/langgraph";
import { Annotation } from "@langchain/langgraph";
import { tavily } from "@tavily/core";

// 1. Define our agent state, which includes CopilotKit state to
//    provide actions to the state.
const AgentStateAnnotation = Annotation.Root({
  ...CopilotKitStateAnnotation.spec, // CopilotKit state annotation already includes messages, as well as frontend tools
  proverbs: Annotation<string[]>,
});

// 2. Define the type for our agent state
export type AgentState = typeof AgentStateAnnotation.State;

// 2.1 Initialize Tavily search client
const tavilyClient = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

// 3. Define a simple tool to get the weather statically
const getWeather = tool(
  (args) => {
    return `The weather for ${args.location} is 70 degrees, clear skies, 45% humidity, 5 mph wind, and feels like 72 degrees.`;
  },
  {
    name: "getWeather",
    description: "Get the weather for a given location.",
    schema: z.object({
      location: z.string().describe("The location to get weather for"),
    }),
  }
);

// 3.1 Define the searchApi tool using Tavily Search API
const searchApi = tool(
  async (args) => {
    try {
      // Check if API key is configured
      if (!process.env.TAVILY_API_KEY) {
        return "Error: TAVILY_API_KEY is not configured. Please set it in your environment variables.";
      }

      // Perform search with Tavily
      const response = await tavilyClient.search(args.query, {
        search_depth: args.search_depth || "basic",
        max_results: args.max_results || 5,
      });

      // Format results for the LLM
      if (!response.results || response.results.length === 0) {
        return `No search results found for "${args.query}".`;
      }

      // Build a formatted response with key information
      const results = response.results.map((result: any, index: number) => {
        return `Result ${index + 1}:
Title: ${result.title || "No title"}
URL: ${result.url || "No URL"}
Content: ${result.content || "No content available"}
`;
      }).join("\n\n");

      return `Search results for "${args.query}":\n\n${results}`;
    } catch (error: any) {
      // Handle errors gracefully
      const errorMessage = error?.message || "Unknown error occurred";
      console.error("Error performing search:", error);
      return `Error performing search: ${errorMessage}. Please check your API key and try again.`;
    }
  },
  {
    name: "searchApi",
    description: "Search the web for real-time information using Tavily Search API. Use this when you need current information, facts, or data from the internet.",
    schema: z.object({
      query: z.string().describe("The search query to look up on the web"),
      search_depth: z
        .enum(["basic", "advanced"])
        .optional()
        .describe("Search depth: 'basic' is faster for simple queries, 'advanced' provides more comprehensive results. Defaults to 'basic'."),
      max_results: z
        .number()
        .int()
        .min(1)
        .max(10)
        .optional()
        .describe("Maximum number of search results to return. Defaults to 5, maximum is 10."),
    }),
  }
);

// 4. Put our tools into an array
const tools = [getWeather, searchApi];

// 5. Define the chat node, which will handle the chat logic
async function chat_node(state: AgentState, config: RunnableConfig) {
  // 5.1 Define the model, lower temperature for deterministic responses
  // Using Google Gemini instead of OpenAI
  const model = new ChatGoogleGenerativeAI({ 
    temperature: 0, 
    model: "gemini-1.5-pro",
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  });

  // 5.2 Bind the tools to the model, include CopilotKit actions. This allows
  //     the model to call tools that are defined in CopilotKit by the frontend.
  const modelWithTools = model.bindTools!(
    [
      ...convertActionsToDynamicStructuredTools(state.copilotkit?.actions ?? []),
      ...tools,
    ],
  );

  // 5.3 Define the system message, which will be used to guide the model, in this case
  //     we also add in the language to use from the state.
  const systemMessage = new SystemMessage({
    content: `You are a helpful assistant. The current proverbs are ${JSON.stringify(state.proverbs)}.`,
  });

  // 5.4 Invoke the model with the system message and the messages in the state
  const response = await modelWithTools.invoke(
    [systemMessage, ...state.messages],
    config
  );

  // 5.5 Return the response, which will be added to the state
  return {
    messages: response,
  };
}

// 6. Define the function that determines whether to continue or not,
//    this is used to determine the next node to run
function shouldContinue({ messages, copilotkit }: AgentState) {
  // 6.1 Get the last message from the state
  const lastMessage = messages[messages.length - 1] as AIMessage;

  // 7.2 If the LLM makes a tool call, then we route to the "tools" node
  if (lastMessage.tool_calls?.length) {
    // Actions are the frontend tools coming from CopilotKit
    const actions = copilotkit?.actions;
    const toolCallName = lastMessage.tool_calls![0].name;

    // 7.3 Only route to the tool node if the tool call is not a CopilotKit action
    if (!actions || actions.every((action) => action.name !== toolCallName)) {
      return "tool_node"
    }
  }

  // 6.4 Otherwise, we stop (reply to the user) using the special "__end__" node
  return "__end__";
}

// Define the workflow graph
const workflow = new StateGraph(AgentStateAnnotation)
  .addNode("chat_node", chat_node)
  .addNode("tool_node", new ToolNode(tools))
  .addEdge(START, "chat_node")
  .addEdge("tool_node", "chat_node")
  .addConditionalEdges("chat_node", shouldContinue as any);

const memory = new MemorySaver();

export const graph = workflow.compile({
  checkpointer: memory,
});

