// --------------------
// CONSUMER LAMBDA WITH IDEMPOTENCY (ES MODULE VERSION)
// --------------------
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

// Create DynamoDB client
const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    try {
      const messageBody = JSON.parse(record.body);
      const messageId = messageBody.id;

      // ---------- IDEMPOTENCY CHECK ----------
      const existing = await dynamo.send(new GetCommand({
        TableName: 'processed-messages',
        Key: { messageId }
      }));

      if (existing.Item) {
        console.log("Already processed:", messageId);
        continue; // skip this message
      }
      // ---------------------------------------

      // ---------- BUSINESS LOGIC ----------
      console.log("Processing message:", messageBody);

      // Simulate background work
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log("Finished processing:", messageId);
      // -------------------------------------

      // ---------- MARK MESSAGE AS PROCESSED ----------
      await dynamo.send(new PutCommand({
        TableName: 'processed-messages',
        Item: {
          messageId,
          processedAt: new Date().toISOString()
        }
      }));
      // -----------------------------------------------

    } catch (error) {
      console.error("Error processing message:", error);
      throw error; // triggers SQS retry / DLQ if needed
    }
  }

  return {
    statusCode: 200,
    body: "Messages processed"
  };
};