const fs = require('fs');

const collectionPath = 'WebCA_Server.postman_collection.json';
const collection = JSON.parse(fs.readFileSync(collectionPath, 'utf-8'));

const userFolder = collection.item.find(folder => folder.name === 'User');

if (userFolder) {
    // Add GET /user/preferences
    userFolder.item.splice(1, 0, {
        "name": "Get User Preferences",
        "request": {
            "method": "GET",
            "header": [],
            "url": {
                "raw": "{{base_url}}/user/preferences",
                "host": ["{{base_url}}"],
                "path": ["user", "preferences"]
            },
            "description": {
                "content": "Get current user preferences.\n\n**URI:**\n```\nGET /user/preferences\n```\n\n**Authentication:** Required\n**Headers:**\n```\nAuthorization: Bearer <JWT_TOKEN>\n```\n\n**Success Response (200 OK):**\n```json\n{\n  \"dashboardInterval\": 10,\n  \"brokerStatusInterval\": 20\n}\n```\n\n**Error Response (401 Unauthorized):**\n```json\n{\n  \"statusCode\": 401,\n  \"message\": \"Unauthorized\",\n  \"error\": \"Unauthorized\"\n}\n```",
                "type": "text/markdown"
            }
        },
        "response": []
    });

    // Add PUT /user/preferences
    userFolder.item.splice(2, 0, {
        "name": "Update User Preferences",
        "request": {
            "method": "PUT",
            "header": [
                {
                    "key": "Content-Type",
                    "value": "application/json"
                }
            ],
            "body": {
                "mode": "raw",
                "raw": "{\n  \"dashboardInterval\": 20,\n  \"brokerStatusInterval\": 30\n}"
            },
            "url": {
                "raw": "{{base_url}}/user/preferences",
                "host": ["{{base_url}}"],
                "path": ["user", "preferences"]
            },
            "description": {
                "content": "Update user preferences.\n\n**URI:**\n```\nPUT /user/preferences\n```\n\n**Authentication:** Required\n**Headers:**\n```\nAuthorization: Bearer <JWT_TOKEN>\nContent-Type: application/json\n```\n\n**Request Body:**\n```json\n{\n  \"dashboardInterval\": 20,\n  \"brokerStatusInterval\": 30\n}\n```\n\n**Success Response (200 OK):**\n- Status: `200 OK`\n- Body: No content\n\n**Error Response (400 Bad Request):**\n```json\n{\n  \"statusCode\": 400,\n  \"message\": \"Invalid preference value\",\n  \"error\": \"Bad Request\"\n}\n```",
                "type": "text/markdown"
            }
        },
        "response": []
    });

    // Modify Update User Info -> Update User Profile
    const updateUserAccount = userFolder.item.find(item => item.name === 'Update User Info');
    if(updateUserAccount) {
        updateUserAccount.name = "Update User Profile";
        updateUserAccount.request.method = "PUT";
        updateUserAccount.request.url = {
            "raw": "{{base_url}}/user/profile",
            "host": ["{{base_url}}"],
            "path": ["user", "profile"]
        };
        updateUserAccount.request.body = {
            "mode": "raw",
            "raw": "{\n  \"department\": \"Engineering\",\n  \"user_preference\": {\n    \"dashboardInterval\": 30\n  }\n}"
        };
        updateUserAccount.request.description = {
            "content": "Update user profile information (department and/or preferences).\n\n**URI:**\n```\nPUT /user/profile\n```\n\n**Authentication:** Required\n**Headers:**\n```\nAuthorization: Bearer <JWT_TOKEN>\nContent-Type: application/json\n```\n\n**Request Body:**\n```json\n{\n  \"department\": \"Engineering\",\n  \"user_preference\": {\n    \"dashboardInterval\": 30\n  }\n}\n```\n\n**Success Response (200 OK):**\n- Status: `200 OK`\n- Body: No content\n\n**Error Response (400 Bad Request):**\n```json\n{\n  \"statusCode\": 400,\n  \"message\": \"Invalid field value\",\n  \"error\": \"Bad Request\"\n}\n```",
            "type": "text/markdown"
        }
    }

    // Fix incorrect methods for auth
    const authFolder = collection.item.find(folder => folder.name === 'Authentication');
    if (authFolder) {
        const login = authFolder.item.find(i => i.name === 'Login');
        if(login) login.request.method = 'POST';
        const register = authFolder.item.find(i => i.name === 'Register');
        if(register) register.request.method = 'POST';
    }
    
    // Fix incorrect methods for user
    const changePassword = userFolder.item.find(i => i.name === 'Change Password');
    if(changePassword) changePassword.request.method = 'POST';

    // This was POST /user/account, now I've changed it to PUT /user/profile, but there is still POST /user/account for updating user info (department).
    // The user may have been confused. The old one is called "Update User Info". My new one is "Update User Profile".
    // I have renamed the "Update User Info" to "Update User Profile".
    // I should check if there is another "Update User Info"
    const originalUpdateUserInfo = userFolder.item.find(item => item.request.url.path.join('/') === 'user/account' && item.request.method === 'GET');
    if(originalUpdateUserInfo) {
        originalUpdateUserInfo.name = "Update User Info (Legacy)";
        originalUpdateUserInfo.request.method = "POST";
    }

}


fs.writeFileSync(collectionPath, JSON.stringify(collection, null, '\t'));
console.log('Postman collection updated.');
