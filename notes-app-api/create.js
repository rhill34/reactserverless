// import uuid from "uuid";
// import AWS from "aws-sdk";

// AWS.config.update({region: "us-west-2" });
// const  dynamoDb = new AWS.DynamoDB.DocumentClient();

// export function main(event, context, callback){

//     const data = JSON.parse(event.body);

//     const params = {
//         TableName: process.env.tableName,
//         Item: {
//             userId: event.requestContext.identity.cognitoIdentityId,
//             notesId: uuid.v1(), <-----This was the Problem!!!!!!!
//             content: data.content,
//             attachment: data.attachment,
//             createdAt: Date.now()
//         }
//     };

//     dynamoDb.put(params, (error, data) => {
//         const headers = {
//             "Access-Control-Allow-Origin": "*",
//             "Access-Control-Allow-Credentials": true
//         };

//         if (error) {
//             const response = {
//                 statusCode: 500,
//                 headers: headers,
//                 body: JSON.stringify({ status: false })
//             };

//             callback(null, response);
//             return;
//         }

//         // Return status code 200 and the newly created item
//         const response = {
//             statusCode: 200,
//             headers: headers,
//             body: JSON.stringify(params.Item)
//         };
//         callback(null, response);
//     });
// }

import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      notesId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}