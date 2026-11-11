import { db, settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

async function getSetting(key: string): Promise<string | null> {
  try {
    const [row] = await db.select().from(settingsTable).where(eq(settingsTable.key, key));
    return row?.value ?? null;
  } catch {
    return null;
  }
}

export async function sendTelegramNotification(message: string): Promise<boolean> {
  try {
    const botToken = await getSetting("telegram_bot_token");
    const chatId = await getSetting("telegram_chat_id");
    const enabled = await getSetting("telegram_enabled");

    if (!botToken || !chatId || enabled !== "true") {
      return false;
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

export async function detectChats(
  botToken: string
): Promise<{ chats: Array<{ id: string; title: string; type: string }>; error?: string }> {
  try {
    // 1. Validate token first
    const meRes = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    const meData = await meRes.json() as any;
    if (!meData.ok) {
      return { chats: [], error: `봇 토큰이 유효하지 않습니다: ${meData.description ?? "알 수 없는 오류"}` };
    }

    // 2. Delete webhook so getUpdates works
    await fetch(`https://api.telegram.org/bot${botToken}/deleteWebhook?drop_pending_updates=false`);

    // 3. Get updates
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?limit=100&allowed_updates=["message","channel_post","my_chat_member"]`);
    if (!response.ok) {
      return { chats: [], error: `getUpdates 실패 (HTTP ${response.status})` };
    }

    const data = await response.json() as any;
    if (!data.ok) {
      return { chats: [], error: `Telegram 오류: ${data.description ?? "알 수 없는 오류"}` };
    }

    const chats = new Map<string, { id: string; title: string; type: string }>();

    for (const update of data.result ?? []) {
      const chat =
        update.message?.chat ??
        update.channel_post?.chat ??
        update.my_chat_member?.chat ??
        update.chat_member?.chat;
      if (chat && chat.id) {
        const id = String(chat.id);
        if (!chats.has(id)) {
          chats.set(id, {
            id,
            title: chat.title ?? chat.username ?? chat.first_name ?? id,
            type: chat.type ?? "unknown",
          });
        }
      }
    }

    const result = Array.from(chats.values());
    if (result.length === 0) {
      return {
        chats: [],
        error: `채팅방이 감지되지 않았습니다. 봇(@${meData.result?.username})에게 먼저 메시지를 보낸 후 다시 시도하세요.`,
      };
    }

    return { chats: result };
  } catch (e: any) {
    return { chats: [], error: `네트워크 오류: ${e?.message ?? "알 수 없는 오류"}` };
  }
}
