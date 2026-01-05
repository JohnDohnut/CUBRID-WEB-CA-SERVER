# CUBRID Web CA Server

CUBRID 데이터베이스 및 브로커 관리를 위한 NestJS 기반 웹 애플리케이션입니다. CMS(Central Management System)와의 통합을 통해 호스트, 데이터베이스, 브로커 등을 중앙에서 관리할 수 있습니다.

## 주요 기능

- **인증 및 사용자 관리**: JWT 기반 인증, 사용자 등록, 프로필 관리
- **호스트 관리**: CUBRID CMS 호스트 추가, 수정, 삭제 및 인증 토큰 관리
- **데이터베이스 관리**: 데이터베이스 시작/중지/재시작, 프로파일 관리, 볼륨 정보 조회
- **브로커 관리**: 브로커 시작/중지/재시작, 상태 조회, 애플리케이션 서버 정보
- **CMS 설정 관리**: 환경 정보, 파라미터 덤프, 통계 덤프, 시스템 파라미터 설정
- **로그 관리**: 브로커 로그, 데이터베이스 로그, CMS 로그 조회 및 파일 내용 보기
- **리소스 모니터링**: 호스트 통계 정보 조회
- **파일 관리**: CMS 호스트의 파일 존재 여부 확인
- **프록시 API**: CMS API 요청 전달

## 기술 스택

- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.7
- **Runtime**: Node.js 18+
- **Authentication**: Passport.js + JWT
- **HTTP Client**: Axios
- **Documentation**: TypeDoc
- **Build Tool**: Nest CLI
- **Package Tool**: pkg (실행 파일 생성)

## 사전 요구사항

- Node.js 18 이상
- npm 또는 yarn
- CUBRID CMS 호스트 접근 권한

## 설치

```bash
# 저장소 클론
git clone <repository-url>
cd CUBRID-WEB-CA-SERVER

# 의존성 설치
npm install

# 프로젝트 빌드
npm run build
```

## 환경 설정

애플리케이션은 명령줄 인수를 통해 설정을 받습니다:

### 필수 인수

- `--SEED`: 암호화 키 생성용 시드 값
- `--SALT`: 암호화 키 생성용 솔트 값

### 선택 인수

- `--PORT`: 서버 포트 (기본값: 8080)
- `--ENV`: 환경 설정 (development/production, 기본값: development)
- `--ORIGINS`: 허용할 CORS origin 목록 (쉼표로 구분, 기본값: "*")

### 실행 예시

```bash
# 개발 환경
npm run dev

# 특정 포트로 개발 서버 실행
npm run dev:port

# 프로덕션 환경
npm run start:prod -- --SEED=myseed --SALT=mysalt --PORT=8080 --ENV=production

# CORS origin 지정
npm run start:prod -- --SEED=myseed --SALT=mysalt --ORIGINS=http://localhost:3000,https://example.com
```

## 사용 가능한 스크립트

### 개발

```bash
npm run dev                    # 개발 서버 시작 (watch 모드)
npm run dev:port               # 포트 8081로 개발 서버 시작
npm run dev:no-port            # 포트 없이 개발 서버 시작
npm run start                  # 프로덕션 모드로 시작
npm run start:dev              # 개발 모드로 시작 (watch)
npm run start:debug            # 디버그 모드로 시작
```

### 빌드 및 패키징

```bash
npm run build                  # TypeScript 컴파일
npm run start:prod             # 빌드된 파일로 프로덕션 서버 시작
npm run start:prod:seed        # 시드/솔트와 함께 프로덕션 서버 시작

# 실행 파일 생성 (pkg 사용)
npm run pkg:win                # Windows 실행 파일 생성
npm run pkg:linux              # Linux 실행 파일 생성
npm run pkg:all                # 모든 플랫폼 실행 파일 생성
```

### 코드 품질

```bash
npm run lint                   # ESLint로 코드 검사 및 자동 수정
npm run format                 # Prettier로 코드 포맷팅
```

### 테스트

```bash
npm run test                   # 단위 테스트 실행
npm run test:watch             # watch 모드로 테스트 실행
npm run test:cov               # 커버리지 포함 테스트
npm run test:debug             # 디버그 모드로 테스트 실행
npm run test:e2e               # E2E 테스트 실행
```

### 문서화

```bash
npm run docs                   # TypeDoc 문서 생성
npm run docs:build              # 문서 빌드 (docs 폴더)
npm run docs:ser ve             # 문서 서버 실행 (포트 7777)
npm run docs:docx              # 문서를 DOCX로 변환
```

## 프로젝트 구조

```
src/
├── auth/                      # 인증 모듈 (로그인, 회원가입)
├── user/                      # 사용자 관리 모듈
├── host/                      # 호스트 관리 모듈
├── database/                  # 데이터베이스 관리 모듈
├── broker/                    # 브로커 관리 모듈
├── cms-config/                # CMS 설정 관리 모듈
├── cms-auth/                  # CMS 인증 모듈
├── cms-https-client/          # CMS HTTPS 클라이언트 (프록시 포함)
├── monitoring/                # 모니터링 모듈 (HA, 리소스)
├── log/                       # 로그 관리 모듈
├── file/                      # 파일 관리 모듈
├── common/                    # 공통 유틸리티
│   ├── decorators/            # 에러 핸들링 데코레이터
│   └── interceptors/          # 인터셉터 (로깅, 응답 변환)
├── config/                    # 설정 관리
├── security/                  # 보안 유틸리티 (암호화, 해싱)
├── storage/                   # 파일 저장소 관리
├── lock/                      # 파일 락 관리
├── repository/                # 데이터 저장소 (사용자 데이터)
├── token/                     # JWT 토큰 관리
├── error/                     # 에러 클래스 및 핸들링
├── type/                      # TypeScript 타입 정의
│   ├── cms-request/          # CMS 요청 타입
│   ├── cms-response/         # CMS 응답 타입
│   └── dto/                  # DTO 타입
└── util/                      # 유틸리티 함수
```

## API 문서

### Postman 컬렉션

프로젝트에 포함된 Postman 컬렉션을 사용하여 API를 테스트할 수 있습니다:

- `WebCA_Server.postman_collection.json`: 모든 API 엔드포인트 포함

### TypeDoc 문서

문서를 생성하고 서버를 실행하려면:

```bash
# 문서 생성
npm run docs:build

# 문서 서버 실행 (포트 7777)
npm run docs:serve
```

문서는 다음 주소에서 확인할 수 있습니다:
- **로컬**: `http://localhost:7777`
- **원격**: `http://<서버주소>:7777`

## 배포

### 자동 배포 스크립트

프로젝트에는 자동 배포 스크립트가 포함되어 있습니다.

> ⚠️ **주의**: 배포 스크립트는 포트 7777(문서 서버)과 8080(WebCA 서버)에서 실행 중인 프로세스를 자동으로 종료합니다.

#### Windows (PowerShell)

```powershell
# Linux 버전 배포
.\deploy.ps1 -Platform linux

# Windows 버전 배포
.\deploy.ps1 -Platform win

# 모든 플랫폼 배포
.\deploy.ps1 -Platform both
```

#### Linux/macOS (Bash)

```bash
# Linux 버전 배포
./deploy.sh linux

# Windows 버전 배포
./deploy.sh win

# 모든 플랫폼 배포
./deploy.sh both
```

### 수동 배포

```bash
# 1. 프로젝트 빌드
npm run build

# 2. 프로덕션 서버 시작
npm run start:prod -- --SEED=<seed> --SALT=<salt> --PORT=8080

# 또는 실행 파일 생성 후 실행
npm run pkg:linux
./dist/webca-server-linux --SEED=<seed> --SALT=<salt> --PORT=8080
```

## 아키텍처 개요

### 에러 핸들링

프로젝트는 도메인별 에러 핸들링 데코레이터를 사용합니다:

- `@HandleHostErrors()`: 호스트 관련 에러 처리
- `@HandleBrokerErrors()`: 브로커 관련 에러 처리
- `@HandleDatabaseErrors()`: 데이터베이스 관련 에러 처리
- `@HandleCmsConfigErrors()`: CMS 설정 관련 에러 처리
- `@HandleResourceMonitoringErrors()`: 리소스 모니터링 관련 에러 처리

각 데코레이터는 하위 도메인 에러를 상위 도메인 에러로 변환합니다.

### CMS 통신

- `postAuthenticated()`: 인증된 POST 요청 (대부분의 서비스에서 사용)
- `forwardAuthenticated()`: 프록시 요청 전달 (프록시 컨트롤러에서만 사용)

### 인증

- JWT 기반 인증
- Passport.js 전략 사용
- 전역 JWT 가드 적용

### 데이터 저장

- 사용자 데이터는 파일 기반 저장소에 저장
- 파일 락을 사용한 동시성 제어
- 암호화된 저장

## 주요 모듈 설명

### Auth Module
사용자 인증 및 회원가입을 처리합니다.

### Host Module
CUBRID CMS 호스트를 관리합니다. 호스트 추가, 수정, 삭제 및 인증 토큰 관리 기능을 제공합니다.

### Database Module
데이터베이스 시작/중지/재시작, 프로파일 저장, 볼륨 정보 조회 기능을 제공합니다.

### Broker Module
CUBRID 브로커의 시작/중지/재시작, 상태 조회, 애플리케이션 서버 정보 조회 기능을 제공합니다.

### CMS Config Module
CMS 환경 정보, 데이터베이스 파라미터, 통계 정보, 시스템 파라미터 설정 기능을 제공합니다.

### Monitoring Module
HA(High Availability) 모니터링 및 리소스 모니터링 기능을 제공합니다.

## 문제 해결

### 포트가 이미 사용 중인 경우

```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/macOS
lsof -ti:8080 | xargs kill -9
```

### SSL 인증서 오류

애플리케이션은 자동으로 자체 서명 SSL 인증서를 생성합니다. `ssl/` 폴더에 저장됩니다.

### CORS 오류

`--ORIGINS` 인수로 허용할 origin을 지정하거나, 개발 환경에서는 `*`를 사용할 수 있습니다.

## 라이선스

이 프로젝트는 **Apache License 2.0 with Non-Commercial Use Restriction**으로 라이선스됩니다.

### 라이선스 요약

Copyright 2024 CUBRID Web CA Server

Apache License, Version 2.0에 따라 라이선스됩니다. 자세한 내용은 LICENSE 파일을 참조하세요.

### 추가 제한사항

**상업적 사용 금지**: 이 소프트웨어는 비상업적 용도로만 사용할 수 있습니다. 상업적 사용(판매, 라이선싱, 상업적 목적의 사용 등)은 저작권자의 명시적 서면 허가 없이는 엄격히 금지됩니다.

상업적 라이선싱 문의는 프로젝트 관리자에게 연락하세요.

## 기여

프로젝트에 기여하고 싶으시다면:

1. 이슈를 생성하여 변경 사항을 논의하세요
2. Fork 후 브랜치를 생성하세요
3. 변경 사항을 커밋하고 테스트를 작성하세요
4. Pull Request를 제출하세요

## 지원

문제가 발생하거나 질문이 있으시면 이슈를 생성해주세요.
