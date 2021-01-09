import { config } from "dotenv";
config();
import * as functions from "firebase-functions";
import { removeExpiredSecrets } from "./scheduled/cleanUp";
import { logger } from "./lib/logger";

import apiApp from "./api";

export const api = functions.region("asia-southeast2").https.onRequest(apiApp);
export const scheduledCleanUp = functions
  .region("asia-southeast2")
  .pubsub.schedule("0 * * * *") // m h d m d(w)
  .timeZone("Asia/Singapore")
  .onRun(async (ctx: functions.EventContext) => {
    logger.info(
      `[${ctx.eventType}] Removing expired secrets at ${ctx.timestamp}`
    );
    await removeExpiredSecrets().catch(logger.error);
    return null;
  });
