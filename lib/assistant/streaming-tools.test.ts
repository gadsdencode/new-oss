import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { GoogleGenerativeAIAdapter, LangChainAdapter } from "@copilotkit/runtime";
import { AIMessage } from "@langchain/core/messages";
import {
  createAssistantServiceAdapter,
  createGeminiChatModelFields,
  filterEmptyAssistantMessages,
  instrumentLangChainStream,
  normalizeCopilotKitStreamChunk,
  readUsageMetadata,
} from "./adapter";
import { loadAssistantConfig } from "./config";
import { VISITOR_UNAVAILABLE_MESSAGE } from "./constants";

describe("installed GoogleGenerativeAIAdapter contract", () => {
  it("only documents model and apiKey on the CopilotKit 1.10.6 adapter", () => {
    const adapter = new GoogleGenerativeAIAdapter({
      model: "gemini-2.5-flash",
      apiKey: "not-a-real-key",
    });
    assert.equal(adapter instanceof LangChainAdapter, true);
    assert.equal(typeof adapter.process, "function");
  });
});

describe("streaming and tool compatibility", () => {
  it("keeps empty assistant messages that carry tool calls", () => {
    const kept = filterEmptyAssistantMessages([
      new AIMessage(""),
      new AIMessage({
        content: "",
        tool_calls: [{ id: "call-1", name: "showCoreServices", args: {} }],
      }),
    ]);
    assert.equal(kept.length, 1);
    const [message] = kept;
    assert.equal(message instanceof AIMessage, true);
    assert.equal((message as AIMessage).tool_calls?.[0]?.name, "showCoreServices");
  });

  it("preserves streamed text and tool-call chunks while capturing usage", async () => {
    const chunks = [
      {
        content: "Here are the services",
        tool_call_chunks: undefined,
        usage_metadata: { input_tokens: 120, output_tokens: 8, total_tokens: 128 },
      },
      {
        content: "",
        tool_call_chunks: [{ id: "call-2", name: "showCoreServices", args: "{}", index: 0 }],
        usage_metadata: { input_tokens: 120, output_tokens: 24, total_tokens: 144 },
      },
    ];

    const source = new ReadableStream({
      start(controller) {
        for (const chunk of chunks) {
          controller.enqueue(chunk);
        }
        controller.close();
      },
    });

    const captured: Array<{ inputTokens?: number; outputTokens?: number; totalTokens?: number }> = [];
    const instrumented = instrumentLangChainStream(source, {
      signal: new AbortController().signal,
      onUsage: (usage) => captured.push(usage),
    });

    assert.equal(typeof instrumented.getReader, "function");
    const reader = instrumented.getReader();
    const received: unknown[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      received.push(value);
    }

    assert.deepEqual(received, chunks);
    assert.equal(captured.at(-1)?.outputTokens, 24);
    assert.deepEqual(readUsageMetadata(chunks[1]), {
      inputTokens: 120,
      outputTokens: 24,
      totalTokens: 144,
      reasoningTokens: undefined,
      source: "provider",
    });
  });

  it("adds CopilotKit action ids to Gemini tool chunks that omit them", () => {
    const geminiChunk = {
      content: "",
      tool_call_chunks: [{ name: "scheduleConsultation", args: "{}", index: 0 }],
    };
    const normalized = normalizeCopilotKitStreamChunk(geminiChunk) as typeof geminiChunk & {
      tool_call_chunks: Array<{ id?: string; name?: string }>;
    };
    assert.equal(normalized.tool_call_chunks[0]?.name, "scheduleConsultation");
    assert.equal(normalized.tool_call_chunks[0]?.id, "gemini-tool-0");

    const fromToolCalls = normalizeCopilotKitStreamChunk({
      content: "",
      tool_calls: [{ name: "showCoreServices", args: {} }],
    }) as { tool_call_chunks: Array<{ id?: string; name?: string; args?: string }> };
    assert.equal(fromToolCalls.tool_call_chunks[0]?.name, "showCoreServices");
    assert.equal(fromToolCalls.tool_call_chunks[0]?.id, "gemini-tool-0");
    assert.equal(fromToolCalls.tool_call_chunks[0]?.args, "{}");
  });

  it("flattens Gemini array content so CopilotKit can render text parts", () => {
    const normalized = normalizeCopilotKitStreamChunk({
      content: [{ type: "thinking", thought: "..." }, { type: "text", text: "Overture was founded in 2005." }],
    }) as { content: unknown };
    assert.equal(normalized.content, "Overture was founded in 2005.");
  });

  it("propagates cancellation to the wrapped stream reader", async () => {
    const controller = new AbortController();
    const source = new ReadableStream({
      start() {
        // Intentionally never enqueues so the wrapper must observe abort.
      },
    });
    const instrumented = instrumentLangChainStream(source, {
      signal: controller.signal,
      onUsage: () => undefined,
    });
    const reader = instrumented.getReader();
    controller.abort();
    await assert.rejects(() => reader.read(), (error: unknown) => {
      assert.ok(error instanceof Error);
      assert.equal(error.message, VISITOR_UNAVAILABLE_MESSAGE);
      return true;
    });
  });

  it("builds a CopilotKit LangChainAdapter without exposing unsupported GoogleGenerativeAIAdapter options", () => {
    const loaded = loadAssistantConfig({ GEMINI_API_KEY: "test-key", ASSISTANT_PROVIDER: "gemini" });
    assert.equal(loaded.ok, true);
    if (!loaded.ok) {
      return;
    }
    const adapter = createAssistantServiceAdapter(loaded.config);
    assert.equal(adapter instanceof LangChainAdapter, true);
    const fields = createGeminiChatModelFields(loaded.config);
    assert.equal(fields.model, loaded.config.model);
    assert.equal(fields.apiKey, loaded.config.apiKey);
    assert.equal(fields.maxRetries, 0);
  });
});
