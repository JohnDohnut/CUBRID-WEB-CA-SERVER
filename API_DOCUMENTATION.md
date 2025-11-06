# WebCA Server API Documentation

## Overview

This document describes all REST API endpoints provided by the WebCA Server. All endpoints require JWT authentication unless marked as `Public`.

**Base URL**: `https://your-server:port`  
**Authentication**: JWT Bearer Token in `Authorization` header  
**Content-Type**: `application/json`

---

## Authentication

### Public Endpoints (No Authentication Required)

- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Authenticated Endpoints

All other endpoints require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

---

## Table of Contents

1. [App Controller](#app-controller)
2. [Auth Controller](#auth-controller)
3. [User Controller](#user-controller)
4. [Host Controller](#host-controller)
5. [Broker Controller](#broker-controller)
6. [CMS Database Controller](#cms-database-controller)
7. [CMS File Controller](#cms-file-controller)
8. [CMS Auth Controller](#cms-auth-controller)
9. [CMS Config Controller](#cms-config-controller)
10. [CMS HTTPS Client Controller](#cms-https-client-controller)

---

## App Controller

### GET /
Health check endpoint.

**Authentication**: Not required

**Response**:
```json
"GET / "
```

### POST /
Health check endpoint.

**Authentication**: Not required

**Response**:
```json
"POST /"
```

---

## Auth Controller

Base Path: `/auth`

### POST /auth/login
Authenticates a user and returns a JWT token.

**Authentication**: Public (No authentication required)

**Request Body**:
```json
{
  "id": "user123",
  "password": "password123"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors**:
- `UserError`: User not found or password incorrect

---

### POST /auth/register
Registers a new user account.

**Authentication**: Public (No authentication required)

**Request Body**:
```json
{
  "id": "newuser",
  "password": "newpassword123"
}
```

**Response**: `200 OK` (Empty body)

**Errors**:
- `UserError`: User already exists or registration fails

---

## User Controller

Base Path: `/user`

All endpoints require JWT authentication. User ID is extracted from JWT token.

### GET /user
Retrieves the current user's data.

**Authentication**: Required

**Response**:
```json
{
  "uuid": "123",
  "id": "user1",
  "department": "IT",
  "host_list": {},
  "db_list": {}
}
```

**Note**: Password field is excluded from response.

**Errors**:
- `UserError`: User not found

---

### POST /user/credential
Changes the user's password.

**Authentication**: Required

**Request Body**:
```json
{
  "oldPassword": "old123",
  "newPassword": "new456"
}
```

**Response**: `200 OK` (Empty body)

**Errors**:
- `UserError`: Old password incorrect or new password invalid

---

### DELETE /user/account
Deletes the user's account permanently.

**Authentication**: Required

**Response**:
```json
true
```

**Errors**:
- `UserError`: User not found

---

### POST /user/account
Updates user information.

**Authentication**: Required

**Request Body**:
```json
{
  "department": "Engineering"
}
```

**Response**: `200 OK` (Empty body)

**Errors**:
- `UserError`: User not found or update fails

---

## Host Controller

Base Path: `/host`

All endpoints require JWT authentication. All operations use `hostUid` in the request body (not in URL path).

### POST /host
Adds a new host to user's host list.

**Authentication**: Required

**Request Body** (`AddHostRequest`):
```json
{
  "address": "192.168.1.100",
  "port": "8001",
  "name": "Production Server",
  "password": "host_password"
}
```

**Response**: `200 OK` (Empty body)

**Note**: Password is encrypted and stored securely.

---

### GET /host
Gets all hosts for the authenticated user.

**Authentication**: Required

**Response** (`GetHostsResponse`):
```json
{
  "hosts": [
    {
      "uid": "host-uid-1",
      "address": "192.168.1.100",
      "port": "8001",
      "name": "Production Server",
      "token": "cms_token_if_authenticated"
    }
  ]
}
```

**Note**: Password field is excluded from response.

---

### POST /host/get
Gets a specific host by UID.

**Authentication**: Required

**Request Body** (`HostUidRequest`):
```json
{
  "hostUid": "host-uid"
}
```

**Response** (`HostResponse`):
```json
{
  "uid": "host-uid",
  "address": "192.168.1.100",
  "port": "8001",
  "name": "Production Server",
  "token": "cms_token_if_authenticated"
}
```

**Note**: Password field is excluded from response.

---

### PUT /host
Updates an existing host.

**Authentication**: Required

**Request Body** (`UpdateHostClientRequest`):
```json
{
  "uid": "host-uid",
  "address": "192.168.1.100",
  "port": "8001",
  "name": "Updated Server Name",
  "password": "new_password"
}
```

**Response**: `200 OK` (Empty body)

---

### DELETE /host
Deletes a host and returns updated host list.

**Authentication**: Required

**Request Body** (`HostUidRequest`):
```json
{
  "hostUid": "host-uid"
}
```

**Response** (`SafeHostList`):
```json
{
  "hosts": []
}
```

**Note**: Password fields are excluded from response.

---

## Broker Controller

Base Path: `/broker`

All endpoints require JWT authentication. Operations use `hostUid` in the request body.

### POST /broker/list
Gets list of brokers for a specific host.

**Authentication**: Required

**Request Body** (`HostUidRequest`):
```json
{
  "hostUid": "host-uid"
}
```

**Response** (`BrokerListClientResponse`):
```json
[
  {
    "broker": [
      {
        "name": "query_editor",
        "state": "ON",
        "port": "33000",
        "pid": "12345"
      }
    ]
  }
]
```

---

### POST /broker/stop
Stops a broker.

**Authentication**: Required

**Request Body** (`BrokerClientRequest`):
```json
{
  "hostUid": "host-uid",
  "bname": "query_editor"
}
```

**Response** (`BaseCmsResponse`):
```json
{
  "status": "success",
  "note": "none",
  "task": "broker_stop",
  "__EXEC_TIME": "100 ms"
}
```

**Errors**:
- `ValidationError`: Missing required fields (`hostUid` or `bname`)
- `BrokerError`: Broker stop failed

---

### POST /broker/start
Starts a broker.

**Authentication**: Required

**Request Body** (`BrokerClientRequest`):
```json
{
  "hostUid": "host-uid",
  "bname": "query_editor"
}
```

**Response** (`BaseCmsResponse`):
```json
{
  "status": "success",
  "note": "none",
  "task": "broker_start",
  "__EXEC_TIME": "100 ms"
}
```

**Errors**:
- `ValidationError`: Missing required fields (`hostUid` or `bname`)
- `BrokerError`: Broker start failed

---

### POST /broker/restart
Restarts a broker (stop → start sequence).

**Authentication**: Required

**Request Body** (`BrokerClientRequest`):
```json
{
  "hostUid": "host-uid",
  "bname": "query_editor"
}
```

**Response**:
```json
true
```

**Errors**:
- `ValidationError`: Missing required fields (`hostUid` or `bname`)
- `BrokerError`: Broker stop/start failed

---

### POST /broker/status
Gets broker status including application server information.

**Authentication**: Required

**Request Body** (`BrokerClientRequest`):
```json
{
  "hostUid": "host-uid",
  "bname": "query_editor"
}
```

**Response** (`GetBrokerStatusClientResponse`):
```json
{
  "asinfo": [
    {
      "as_id": "1",
      "as_status": "IDLE",
      "as_pid": "2263",
      "as_cpu": "0.00",
      "as_client_ip": "0.0.0.0"
    }
  ],
  "bname": "query_editor",
  "time": "2013/02/01 15:41:08"
}
```

**Errors**:
- `ValidationError`: Missing required fields (`hostUid` or `bname`)
- `BrokerError`: Failed to get broker status

---

## CMS Database Controller

Base Path: `/cms-database`

All endpoints require JWT authentication. All operations use `hostUid` in the request body.

### POST /cms-database/start-info
Gets start information for databases on a host.

**Authentication**: Required

**Request Body** (`HostUidRequest`):
```json
{
  "hostUid": "host-uid"
}
```

**Response** (`StartInfoClientResponse`):
```json
{
  "startinfo": [
    {
      "dbname": "demodb",
      "status": "ON",
      "port": "30000"
    }
  ]
}
```

**Note**: CMS envelope fields (`__EXEC_TIME`, `note`, `status`, `task`) are excluded.

**Errors**:
- `ValidationError`: Missing required field (`hostUid`)
- `DatabaseError`: Failed to get start info

---

### POST /cms-database/start
Starts a database on a host.

**Authentication**: Required

**Request Body** (`DatabaseClientRequest`):
```json
{
  "hostUid": "host-uid",
  "dbname": "demodb"
}
```

**Response**:
```json
true
```

**Errors**:
- `ValidationError`: Missing required fields (`hostUid` or `dbname`)
- `DatabaseError`: Database start failed

---

### POST /cms-database/stop
Stops a database on a host.

**Authentication**: Required

**Request Body** (`DatabaseClientRequest`):
```json
{
  "hostUid": "host-uid",
  "dbname": "demodb"
}
```

**Response**:
```json
true
```

**Errors**:
- `ValidationError`: Missing required fields (`hostUid` or `dbname`)
- `DatabaseError`: Database stop failed

---

### POST /cms-database/restart
Restarts a database on a host (stop → start sequence).

**Authentication**: Required

**Request Body** (`DatabaseClientRequest`):
```json
{
  "hostUid": "host-uid",
  "dbname": "demodb"
}
```

**Response**:
```json
true
```

**Errors**:
- `ValidationError`: Missing required fields (`hostUid` or `dbname`)
- `DatabaseError`: Database stop/start failed

---

## CMS File Controller

Base Path: `/cms/file`

All endpoints require JWT authentication.

### POST /cms/file/checkfile
Checks if a file exists on the specified CMS host.

**Authentication**: Required

**Request Body** (`CheckFileClientRequest`):
```json
{
  "hostUid": "host-uid"
}
```

**Response** (`CheckFileClientResponse`):
```json
{
  "status": "success",
  "note": "none",
  "task": "checkfile",
  "__EXEC_TIME": "50 ms",
  "file_exists": true
}
```

**Errors**:
- `HostError`: Host not found
- `CmsError`: Invalid token or CMS request failed

---

## CMS Auth Controller

Base Path: `/cms-auth`

All endpoints require JWT authentication.

### POST /cms-auth/login
Handles CMS login for a specific host.

**Authentication**: Required

**Request Body**:
```json
{
  "uid": "host-uid"
}
```

**Response**:
```json
true
```

**Note**: Authenticates with CMS host and stores CMS token server-side.

**Errors**:
- `HostError`: Host not found
- `CmsError`: CMS authentication failed

---

## CMS Config Controller

Base Path: `/cms-config`

All endpoints require JWT authentication.

### POST /cms-config/env
Gets environment information from a CMS host.

**Authentication**: Required

**Request Body** (`HostUidRequest`):
```json
{
  "hostUid": "host-uid"
}
```

**Response** (`GetEnvClientResponse`):
```json
{
  "BROKERVER": "VERSION 11.4.1.1787",
  "CUBRID": "/home/cubrid/CUBRID-11.4.1.1787-8d83685-Linux.x86_64",
  "CUBRIDVER": "CUBRID 11.4 (11.4.1.1787-8d83685) (64bit release build for Linux)",
  "CUBRID_DATABASES": "/home/cubrid/CUBRID-11.4.1.1787-8d83685-Linux.x86_64/databases",
  "CUBRID_DBMT": "/home/cubrid/CUBRID-11.4.1.1787-8d83685-Linux.x86_64",
  "HOSTMONTAB0": "OFF",
  "HOSTMONTAB1": "OFF",
  "HOSTMONTAB2": "OFF",
  "HOSTMONTAB3": "OFF",
  "osinfo": "LINUX"
}
```

**Note**: CMS envelope fields (`__EXEC_TIME`, `note`, `status`, `task`) are excluded.

**Errors**:
- `ValidationError`: Missing required field (`hostUid`)
- `Error`: Failed to get environment info

---

## CMS HTTPS Client Controller

Base Path: `/cms-https-client`

All endpoints require JWT authentication.

### POST /cms-https-client/forward
Forwards an authenticated request from the client to the CMS API (universal proxy endpoint).

**Authentication**: Required

**Request Body** (`CmsForwardClientRequest`):
```json
{
  "hostUid": "host-uid",
  "task": "getenv"
}
```

**Response**: Raw CMS API response (varies by task)

**Note**: This is a universal forwarding endpoint. The server adds the CMS authentication token automatically. Use specific endpoints when available (e.g., `/cms-config/env` instead of `/cms-https-client/forward` with `task: "getenv"`).

**Errors**:
- `HostError`: Host not found
- `CmsError`: CMS request failed

---

## Common Request Types

### HostUidRequest
```json
{
  "hostUid": "string"
}
```

### BrokerClientRequest
```json
{
  "hostUid": "string",
  "bname": "string"
}
```

### DatabaseClientRequest
```json
{
  "hostUid": "string",
  "dbname": "string"
}
```

### CmsForwardClientRequest
```json
{
  "hostUid": "string",
  "task": "string"
}
```

---

## Common Response Types

### BaseCmsResponse
```json
{
  "status": "success" | "fail",
  "note": "string",
  "task": "string",
  "__EXEC_TIME": "string"
}
```

---

## Error Responses

All errors follow a consistent format:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": {
    "kind": "VALIDATION" | "BROKER" | "DATABASE" | "CMS" | "HOST" | "USER",
    "code": "ERROR_CODE",
    "additionalData": {}
  }
}
```

### Common Error Codes

- `VALIDATION`: Request validation errors
  - `MISSING_REQUIRED_FIELD`: Required field missing
  - `INVALID_FIELD_FORMAT`: Invalid field format
- `BROKER`: Broker operation errors
  - `GET_BROKERS_FAILED`: Failed to get broker list
  - `BROKER_STOP_FAILED`: Failed to stop broker
  - `BROKER_START_FAILED`: Failed to start broker
- `DATABASE`: Database operation errors
  - `GET_START_INFO_FAILED`: Failed to get start info
  - `START_DATABASE_FAILED`: Failed to start database
  - `STOP_DATABASE_FAILED`: Failed to stop database
- `CMS`: CMS communication errors
  - `INVALID_TOKEN`: Invalid CMS token
  - `REQUEST_FAILED`: CMS request failed
- `HOST`: Host management errors
  - `NO_SUCH_HOST`: Host not found
- `USER`: User management errors
  - `USER_NOT_FOUND`: User not found
  - `INVALID_PASSWORD`: Invalid password

---

## Notes

1. **Authentication**: Most endpoints require JWT authentication. Include the token in the `Authorization` header as `Bearer <token>`.

2. **hostUid**: All CMS-related operations require `hostUid` in the request body, not in the URL path.

3. **Password Security**: Password fields are never returned in responses. They are encrypted and stored securely on the server.

4. **CMS Token**: CMS authentication tokens are managed server-side and never exposed to clients. Clients only need to provide `hostUid`.

5. **Task Parameter**: Single-purpose endpoints (e.g., `/cms-config/env`) don't require a `task` parameter. The universal `/cms-https-client/forward` endpoint requires `task` parameter.

6. **Response Envelope**: CMS responses include envelope fields (`__EXEC_TIME`, `note`, `status`, `task`). These are automatically stripped from client responses for single-purpose endpoints.

---

## Version

Document Version: 1.0.0  
Last Updated: 2025-01-XX

