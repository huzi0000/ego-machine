import { MemWal } from "@mysten-incubation/memwal";

export function getMemwalClient(userId: string) {
  return MemWal.create({
    key: process.env.MEMWAL_PRIVATE_KEY!,
    accountId: process.env.MEMWAL_ACCOUNT_ID!,
    serverUrl: process.env.MEMWAL_RELAYER_URL!,
    namespace: userId,
  });
}

export async function saveTake(userId: string, text: string) {
  const memwal = getMemwalClient(userId);
  const job = await memwal.remember(text);
  // Return job with id for vault display
  return {
    job_id: job.job_id,
    text: text,
    timestamp: new Date().toISOString(),
  }
}

export async function getUserMemories(userId: string, query: string) {
  const memwal = getMemwalClient(userId);
  const result = await memwal.recall({ query, limit: 20 });
  return result.results;
}

export async function analyzeUserTakes(userId: string, text: string) {
  const memwal = getMemwalClient(userId);
  const result = await memwal.analyze(text);
  return result.facts;
}