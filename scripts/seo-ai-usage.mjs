import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const logDir = path.join(root, 'seo-automation', 'local', 'logs');
const usageLogPath = path.join(logDir, 'ai-usage.jsonl');

function estimateTokens(text) {
  return Math.ceil(String(text || '').length / 4);
}

function compactMessageStats(messages) {
  return messages.map((message) => ({
    role: message.role,
    chars: String(message.content || '').length,
    estimatedTokens: estimateTokens(message.content || ''),
  }));
}

function getMaxEstimatedInputTokens(operation) {
  const specificKey = `SEO_AI_MAX_${String(operation || '').toUpperCase().replace(/[^A-Z0-9]+/g, '_')}_INPUT_TOKENS`;
  const specific = Number(process.env[specificKey] || 0);
  if (specific > 0) return specific;

  const global = Number(process.env.SEO_AI_MAX_INPUT_TOKENS || 0);
  if (global > 0) return global;

  return 12000;
}

function assertCompactTaskPacket({ operation, messages }) {
  const stats = compactMessageStats(messages);
  const estimatedInputTokens = stats.reduce((sum, item) => sum + item.estimatedTokens, 0);
  const maxEstimatedInputTokens = getMaxEstimatedInputTokens(operation);

  if (estimatedInputTokens > maxEstimatedInputTokens) {
    throw new Error(
      `AI task packet too large for ${operation}: estimated ${estimatedInputTokens} input tokens, limit ${maxEstimatedInputTokens}.`
    );
  }

  return {
    estimatedInputTokens,
    maxEstimatedInputTokens,
    messageStats: stats,
  };
}

function logAIUsage({ operation, model, requestStats, usage, metadata = {} }) {
  fs.mkdirSync(logDir, { recursive: true });
  const entry = {
    at: new Date().toISOString(),
    operation,
    model,
    estimatedInputTokens: requestStats?.estimatedInputTokens || null,
    maxEstimatedInputTokens: requestStats?.maxEstimatedInputTokens || null,
    messageStats: requestStats?.messageStats || [],
    usage: usage ? {
      prompt_tokens: usage.prompt_tokens ?? null,
      completion_tokens: usage.completion_tokens ?? null,
      total_tokens: usage.total_tokens ?? null,
    } : null,
    metadata,
  };

  fs.appendFileSync(usageLogPath, `${JSON.stringify(entry)}\n`);
  return entry;
}

export {
  assertCompactTaskPacket,
  logAIUsage,
};
