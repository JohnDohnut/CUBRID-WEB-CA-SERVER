# CUBRID Web CA Server

A NestJS-based web application for CUBRID database management with Certificate Authority functionality.

## Features

- **Authentication**: User login and session management
- **Host Management**: Add, remove, and manage database hosts
- **Broker Management**: CUBRID broker configuration and monitoring
- **CMS Integration**: Content management system integration
- **Documentation**: Auto-generated API documentation with TypeDoc

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start development server
npm run start:dev
```

## Available Scripts

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:prod         # Start production server

# Building
npm run build              # Build TypeScript to JavaScript
npm run pkg:linux          # Package for Linux
npm run pkg:win            # Package for Windows
npm run pkg:all            # Package for both platforms

# Documentation
npm run docs               # Generate TypeDoc documentation

# Testing
npm run test               # Run unit tests
npm run test:e2e           # Run end-to-end tests
```

## Deployment

> ⚠️ **Warning**: The deployment scripts will automatically kill any processes running on ports 7777 (documentation server) and 8080 (WebCA server) before starting new instances.

### Using PowerShell (Windows)

```bash
# Deploy Linux version
.\deploy.ps1 -Platform linux

# Deploy Windows version
.\deploy.ps1 -Platform win

# Deploy both platforms
.\deploy.ps1 -Platform both
```

### Using Bash (Linux/macOS)

```bash
# Deploy Linux version
./deploy.sh linux

# Deploy Windows version
./deploy.sh win

# Deploy both platforms
./deploy.sh both
```

## API Documentation

After deployment, documentation is available at:
- **Local**: `http://localhost:7777`
- **Remote**: `http://192.168.2.36:7777`

## Project Structure

```
src/
├── auth/           # Authentication module
├── broker/         # CUBRID broker management
├── cms/            # Content management
├── host/           # Host management
├── user/           # User management
├── type/           # Type definitions and DTOs
├── error/          # Error handling
├── security/       # Security utilities
└── storage/        # File storage management
```

## Configuration

The application uses environment variables for configuration. Key settings include:

- Database connection parameters
- Authentication secrets
- File storage paths
- Server ports

## License

This project is licensed under the **Apache License 2.0 with Non-Commercial Use Restriction**.

### License Summary

Copyright 2024 CUBRID Web CA Server

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

### Additional Restrictions

**Commercial Use Prohibition**: This software is licensed for non-commercial use only. Commercial use, including but not limited to selling, licensing, or using this software for commercial purposes, is strictly prohibited without explicit written permission from the copyright holders.

For commercial licensing inquiries, please contact the project maintainers.