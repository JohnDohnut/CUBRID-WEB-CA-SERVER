# Type Directory Structure

이 디렉토리는 클라이언트-서버 간 통신과 서버-CMS 간 통신에 사용되는 타입들을 분리하여 관리합니다.

## 디렉토리 구조

### 1. Client ↔ Server 통신

#### `request/` - 클라이언트에서 서버로 보내는 요청
- **용도**: 클라이언트가 서버의 REST API에 보내는 요청 body
- **특징**: hostUid 등을 포함한 클라이언트 입력 데이터
- **예시**: `BrokerRequest`, `AddHostRequest`, `ChangePasswordRequest`

#### `response/` - 서버에서 클라이언트로 보내는 응답
- **용도**: 서버가 클라이언트에 반환하는 응답 데이터
- **특징**: 비즈니스 로직 처리 결과, password 제외된 데이터 등
- **예시**: `UserResponse`, `LoginResponse`, `HostResponse`

### 2. Server ↔ CMS 통신

#### `cms-request/` - 서버에서 CMS로 보내는 요청
- **용도**: 서버가 CMS API에 보내는 요청
- **특징**: task, token 등을 포함한 CMS API 스펙 준수
- **예시**: `BaseCmsRequest`, `StartDatabaseRequest`

#### `cms-response/` - CMS에서 서버로 받는 응답
- **용도**: CMS API로부터 받는 응답
- **특징**: BaseCmsResponse를 포함한 CMS 스펙 준수
- **예시**: `StartInfoResponse`, `BaseCmsResponse`, `LoginCmsResponse`

## 사용 패턴

```
클라이언트 → 서버
  ClientRequest (request/)
    ↓
  Controller (비즈니스 로직)
    ↓
  Service → CMS
    CmsRequest (cms-request/)
      ↓
    CmsResponse (cms-response/)
      ↓
  Controller (데이터 변환)
    ↓
  ClientResponse (response/)
      ↓
  클라이언트
```

## 네이밍 규칙

### Client ↔ Server
- Request: `[Action][Entity]Request` (예: `UpdateUserInfoRequest`)
- Response: `[Entity]Response` 또는 `Get[Entity]Response` (예: `UserResponse`, `GetHostsResponse`)

### Server ↔ CMS  
- Request: `[Action]CmsRequest` (예: `StartDatabaseRequest`)
- Response: `[Action]CmsResponse` (예: `StartInfoResponse`, `BaseCmsResponse`)

## 주의사항

1. **password 필드**: 항상 response에서 제외 (`Omit<User, 'password'>`)
2. **hostUid**: 클라이언트 요청에는 포함, CMS 요청에는 포함하지 않음
3. **BaseCmsResponse**: CMS 응답은 항상 BaseCmsResponse를 extends
4. **status 필드**: CMS는 항상 200/201 HTTP status를 반환하므로 body의 `status` 필드로 성공 여부 판단

