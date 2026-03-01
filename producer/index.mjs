import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const dynamoClient = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(dynamoClient);

const sqsClient = new SQSClient({});

const TABLE_NAME = process.env.TABLE_NAME;
const QUEUE_URL = process.env.QUEUE_URL;

export const handler = async (event) => {
  try {
    // safe method detection
    const method = event?.requestContext?.http?.method || "POST";

    // ---------------- POST ----------------
    if (method === "POST") {
      const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body || {};

      if (!body.id || !body.message) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "id and message required" })
        };
      }

      // 1️⃣ Save to DynamoDB
      await ddb.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          id: body.id,
          message: body.message
        }
      }));

      // 2️⃣ Send to SQS
      await sqsClient.send(new SendMessageCommand({
        QueueUrl: QUEUE_URL,
        MessageBody: JSON.stringify({
          id: body.id,
          message: body.message,
          timestamp: new Date().toISOString()
        })
      }));

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Item saved & message queued" })
      };
    }

    // ---------------- GET ----------------
    if (method === "GET") {
      const id = event.queryStringParameters?.id;

      const result = await ddb.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: { id }
      }));

      return {
        statusCode: 200,
        body: JSON.stringify(result.Item || {})
      };
    }

    // ---------------- PUT ----------------
    if (method === "PUT") {
      const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body || {};

      await ddb.send(new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id: body.id },
        UpdateExpression: "SET message = :msg",
        ExpressionAttributeValues: {
          ":msg": body.message
        }
      }));

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Item updated" })
      };
    }

    // ---------------- DELETE ----------------
    if (method === "DELETE") {
      const id = event.queryStringParameters?.id;

      await ddb.send(new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id }
      }));

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Item deleted" })
      };
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Route not found" })
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};