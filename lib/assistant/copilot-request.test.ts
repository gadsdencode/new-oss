import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseCopilotKitRequest, findExcessUserMessage } from "./copilot-request";

const generateQuery = `mutation generateCopilotResponse($data: GenerateCopilotResponseInput!, $properties: JSONObject) {
  generateCopilotResponse(data: $data, properties: $properties) {
    threadId
    runId
  }
}`;

function generateBody(messages: unknown[]) {
  return {
    operationName: "generateCopilotResponse",
    query: generateQuery,
    variables: {
      data: {
        frontend: { actions: [], url: "https://example.test/" },
        messages,
        metadata: { requestType: "Chat" },
        threadId: "thread-1",
      },
    },
  };
}

describe("CopilotKit 1.10.6 request parsing", () => {
  it("accepts generateCopilotResponse with text, tool, and continuation messages", () => {
    const parsed = parseCopilotKitRequest(
      generateBody([
        { textMessage: { role: "user", content: "What services do you offer?" } },
        { actionExecutionMessage: { name: "showCoreServices", arguments: "{}" } },
        { resultMessage: { result: "ok" } },
      ])
    );
    assert.equal(parsed.kind, "generation");
    if (parsed.kind !== "generation") {
      return;
    }
    assert.equal(parsed.isToolContinuation, true);
    assert.equal(parsed.messages[0]?.kind, "user-text");
    assert.equal(parsed.messages[1]?.kind, "tool-call");
    assert.equal(parsed.messages[2]?.kind, "tool-result");
  });

  it("classifies CopilotKit metadata operations without treating them as generations", () => {
    const parsed = parseCopilotKitRequest({
      operationName: "availableAgents",
      query: "query availableAgents { availableAgents { agents { name } } }",
    });
    assert.equal(parsed.kind, "metadata");
  });

  it("rejects unknown operations instead of passing them through to the model", () => {
    const parsed = parseCopilotKitRequest({
      operationName: "inventedOperation",
      query: "query inventedOperation { foo }",
    });
    assert.equal(parsed.kind, "invalid");
  });

  it("bounds user text and tool-result size while allowing smaller continuations", () => {
    const oversizedUser = parseCopilotKitRequest(
      generateBody([{ textMessage: { role: "user", content: "x".repeat(4_001) } }])
    );
    assert.equal(oversizedUser.kind, "generation");
    if (oversizedUser.kind === "generation") {
      assert.equal(findExcessUserMessage(oversizedUser.messages, 4_000, 8_000), "user");
    }

    const toolContinuation = parseCopilotKitRequest(
      generateBody([
        { textMessage: { role: "user", content: "Hello" } },
        { resultMessage: { result: "y".repeat(100) } },
      ])
    );
    assert.equal(toolContinuation.kind, "generation");
    if (toolContinuation.kind === "generation") {
      assert.equal(toolContinuation.isToolContinuation, true);
      assert.equal(findExcessUserMessage(toolContinuation.messages, 4_000, 8_000), null);
    }
  });
});
