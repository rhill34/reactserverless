import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

// This follows exactly the same structure as our previous function.
//The major difference here is what we are doing a dynamoDbLib.call('get', params) to get a note object given notesId and userId that is passed in through the request.
export async function main(event, context) {
    const params = {
        TableName: process.env.tableName,
        // 'Key' defines the partition key and sort key of the item to be retrieved
        // - 'userId': Identity Pool identity id of the authenticated user
        // - 'noteId': path parameter
        Key: {
            userId:
                event.requestContext.identity.cognitoIdentityId,
            notesId: event.pathParameters.id
        }
    };
    try {
        const result = await dynamoDbLib.call("get",
            params);
        if (result.Item) {
            // Return the retrieved item
            return success(result.Item);
        } else {
            return failure({
                status: false, error: "Item not found."
            });
        }
    } catch (e) {
        console.log(e);
        return failure({ status: false });
    }
}