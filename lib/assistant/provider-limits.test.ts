import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { AIMessage, HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages";
import { createGeminiChatModelFields } from "./adapter";
import { loadAssistantConfig } from "./config";
import {
  boundAssembledModelInput,
  estimateTextTokens,
  groupMessagesPreservingToolPairs,
} from "./token-budget";
import { ASSISTANT_DEFAULT_MAX_OUTPUT_TOKENS } from "./constants";

describe("assistant provider limits", { concurrency: false }, () => {
  it("keeps system instructions, tools, and the latest user turn under the input budget", () => {
    const system = new SystemMessage("You are the Overture assistant. ".repeat(20) + "Page context: ICDU overview. ".repeat(40));
    const oldHuman = new HumanMessage("old question about a previous page. ".repeat(40));
    const oldAi = new AIMessage("old answer with extra page context. ".repeat(40));
    const latest = new HumanMessage("What is the AI Center of Excellence?");
    const tools = [
      {
        name: "scheduleConsultation",
        description: "Schedules a consultation call with the user.",
        jsonSchema: JSON.stringify({ type: "object", properties: {} }),
      },
    ];

    const bounded = boundAssembledModelInput(
      [system, oldHuman, oldAi, latest],
      tools,
      220
    );

    assert.ok(bounded.estimatedInputTokens <= 220);
    assert.equal(bounded.messages.at(-1)?.content, latest.content);
    assert.equal(
      bounded.messages.filter((message) => message._getType?.() === "system").length,
      1
    );
    assert.ok(bounded.historyTruncated);
  });

  it("collapses multiple system messages before bounding", () => {
    const bounded = boundAssembledModelInput(
      [
        new SystemMessage("Server policy."),
        new SystemMessage("CopilotKit page context."),
        new HumanMessage("What is ICDU?"),
      ],
      [],
      4000
    );
    assert.equal(
      bounded.messages.filter((message) => message._getType?.() === "system").length,
      1
    );
    assert.match(String(bounded.messages[0].content), /Server policy/);
    assert.match(String(bounded.messages[0].content), /CopilotKit page context/);
  });

  it("preserves CopilotKit tool-call order instead of moving the user turn after tool results", () => {
    const user = new HumanMessage("Can you help me set up a meeting?");
    const toolCall = new AIMessage({
      content: "",
      tool_calls: [{ id: "gemini-tool-0", name: "scheduleConsultation", args: {} }],
    });
    const toolResult = new ToolMessage({
      content: JSON.stringify({ success: true, message: "request submitted" }),
      tool_call_id: "gemini-tool-0",
    });

    const bounded = boundAssembledModelInput(
      [new SystemMessage("Policy"), user, toolCall, toolResult],
      [{ name: "scheduleConsultation", description: "request", jsonSchema: "{}" }],
      4000
    );

    const types = bounded.messages.map((message) => message._getType?.());
    assert.deepEqual(types, ["system", "human", "ai", "tool"]);
  });

  it("preserves tool-call and tool-result pairs when history is limited", () => {
    const system = new SystemMessage("Instructions");
    const firstUser = new HumanMessage("Book a consultation");
    const toolCall = new AIMessage({
      content: "",
      tool_calls: [{ id: "call-1", name: "scheduleConsultation", args: {} }],
    });
    const toolResult = new ToolMessage({
      content: "form submitted",
      tool_call_id: "call-1",
    });
    const followUp = new HumanMessage("Thanks");

    const groups = groupMessagesPreservingToolPairs([firstUser, toolCall, toolResult]);
    assert.equal(groups.length, 2);
    assert.equal(groups[1].length, 2);
    assert.equal(groups[1][0], toolCall);
    assert.equal(groups[1][1], toolResult);

    const bounded = boundAssembledModelInput(
      [system, firstUser, toolCall, toolResult, followUp],
      [{ name: "scheduleConsultation", description: "book", jsonSchema: "{}" }],
      120
    );

    const hasToolCall = bounded.messages.some((message) => {
      const toolCalls = (message as AIMessage).tool_calls;
      return message._getType?.() === "ai" && Array.isArray(toolCalls) && toolCalls.length > 0;
    });
    const hasToolResult = bounded.messages.some((message) => message._getType?.() === "tool");
    assert.equal(hasToolCall, hasToolResult);
    assert.ok(bounded.estimatedInputTokens <= 120);
  });

  it("overestimates input tokens so assembled content stays conservative", () => {
    const text = "ICDU evaluation pipeline";
    assert.ok(estimateTextTokens(text) >= Math.ceil(text.length / 4));
  });

  it("sets provider-side output limits and disables adapter retries", () => {
    const loaded = loadAssistantConfig({ GEMINI_API_KEY: "test-key", ASSISTANT_PROVIDER: "gemini" });
    assert.equal(loaded.ok, true);
    if (!loaded.ok) {
      return;
    }
    const fields = createGeminiChatModelFields(loaded.config);
    assert.equal(fields.maxOutputTokens, ASSISTANT_DEFAULT_MAX_OUTPUT_TOKENS);
    assert.equal(fields.maxRetries, 0);
    assert.equal(fields.streamUsage, true);
    assert.equal(fields.streaming, true);
    assert.ok(!("generationConfig" in fields));
    assert.ok(!("callbacks" in fields));
  });
});
