
# System Architecture Design

## 1. Overview

This document outlines the proposed system architecture for the multi-terminal session management application. The design prioritizes scalability, observability, and extensibility, leveraging WebSockets for real-time communication and incorporating the Multi-Agent Communication Protocol (MCP) for inter-agent communication. The architecture is designed to support the execution of Gemini and Claude code within Ubuntu environments, provide a true black dark mode, and integrate with Google OAuth and Stripe for future enhancements.

## 2. Core Components

The application architecture will consist of the following primary components:

### 2.1. Client Application (Frontend)

The client application will be a web-based interface providing users with the ability to manage and observe their multi-terminal sessions. It will feature a true black dark mode for enhanced user experience. The frontend will communicate with the Backend Server primarily via WebSockets for real-time event streaming and RESTful APIs for initial data loading and configuration.

### 2.2. Backend Server

The Backend Server will act as the central hub for all application logic, data management, and communication. It will be responsible for:
- Handling WebSocket connections from client applications and agents.
- Managing session states for multiple terminals.
- Routing commands and events between clients and agents.
- Storing and retrieving session data and observability logs.
- Authenticating users (Google OAuth in V2).
- Processing payments (Stripe in V2).
- Interacting with the Credential Management System.

### 2.3. Agent (Terminal Session)

Each terminal session will be managed by a dedicated agent. These agents will be responsible for:
- Executing Gemini or Claude code within an Ubuntu environment.
- Communicating with the Backend Server via WebSockets to send events (e.g., output, status updates) and receive commands.
- Implementing the MCP protocol for structured communication and interoperability.

### 2.4. Database

A persistent database will store application data, including user information, session logs, and configuration settings. Given the requirement for an 


SQLite-like database, a relational database such as PostgreSQL or MySQL will be considered for production, offering more robust features and scalability. For initial development and local environments, SQLite can be used for simplicity.

### 2.5. Credential Management System

Instead of environment variables, a dedicated Credential Management System will securely store sensitive information such as API keys, service account credentials, and other necessary configurations. This system will be accessible by the Backend Server and potentially by agents (with appropriate access controls) to retrieve credentials at runtime. This enhances security and simplifies deployment.

### 2.6. Voice Command Service

To support voice commands, a dedicated service leveraging Whisper will be implemented. This service will:
- Receive audio input from the client application.
- Transcribe spoken commands into text.
- Forward the transcribed commands to the Backend Server for processing and routing to the appropriate agent or internal function.

## 3. Multi-Agent Communication Protocol (MCP) Integration

The MCP protocol will be central to enabling structured and interoperable communication between the Backend Server and the agents. MCP will define the message formats, communication patterns, and semantic meanings of messages exchanged. This will ensure that agents, regardless of their underlying implementation (Gemini or Claude), can understand and respond to commands from the server and provide consistent event data. Key aspects of MCP integration will include:
- **Standardized Event Formats:** Defining a common JSON schema for all events (e.g., `session_start`, `command_output`, `status_update`, `error`).
- **Command Structures:** Establishing clear command structures for instructing agents (e.g., `execute_code`, `terminate_session`, `get_status`).
- **Agent Registration:** A mechanism for agents to register themselves with the Backend Server upon startup, providing their capabilities and current status.
- **Heartbeat/Liveness Checks:** Regular communication between the server and agents to ensure agents are active and responsive.

## 4. Data Flow

The primary data flow within the system will be a one-way stream from the agents to the Backend Server and then to the client, as highlighted in the transcript. This ensures simplicity and efficiency for observability. However, commands will flow from the client to the Backend Server and then to the agents.

### 4.1. Agent to Backend Server (Observability Data)

1. **Event Generation:** Agents, after executing commands or performing actions, will generate events (e.g., `pre-tool use`, `post-tool use`, `notification`, `stop`, `sub-agent complete`).
2. **Event Summarization:** (As per transcript) Before sending, a small, fast model (e.g., Haiku) within the agent will summarize the event payload. This reduces network traffic and provides quick, high-level insights.
3. **WebSocket Transmission:** Summarized events will be sent to the Backend Server via WebSockets.

### 4.2. Backend Server Processing

1. **Event Reception:** The Backend Server receives events from agents via WebSockets.
2. **Data Persistence:** Events are stored in the database (e.g., SQLite for development, PostgreSQL/MySQL for production) for historical logging and analysis.
3. **WebSocket Broadcasting:** Simultaneously, the Backend Server broadcasts the received events to all connected client applications via WebSockets, enabling real-time observability.

### 4.3. Client to Backend Server (Commands and Requests)

1. **User Interaction:** Users interact with the client application to send commands (e.g., `execute_code`, `terminate_session`) or requests (e.g., `get_session_history`).
2. **API/WebSocket Transmission:** Commands and requests are sent to the Backend Server via RESTful API calls or WebSocket messages.

### 4.4. Backend Server to Agent (Commands)

1. **Command Routing:** The Backend Server receives commands from the client and routes them to the appropriate agent based on session ID or other identifiers.
2. **WebSocket Transmission:** Commands are sent to the target agent via WebSockets.

## 5. Security Considerations

Security will be a paramount concern throughout the design and implementation. Key security measures will include:
- **Authentication (V2):** Google OAuth will be used for user authentication, ensuring secure user access.
- **Authorization:** Role-based access control (RBAC) will be implemented to restrict user and agent actions based on their assigned permissions.
- **Secure Communication:** All communication, especially over WebSockets, will be encrypted using TLS/SSL to prevent eavesdropping and tampering.
- **Credential Management:** The dedicated Credential Management System will store sensitive information securely, separate from the application codebase.
- **Input Validation:** All inputs from clients and agents will be rigorously validated to prevent injection attacks and other vulnerabilities.
- **Least Privilege:** Components will operate with the minimum necessary permissions.

## 6. Future Enhancements (Version 2)

### 6.1. Google OAuth Integration

Google OAuth will be integrated into the Backend Server to provide secure and convenient user authentication. This will allow users to sign in using their existing Google accounts.

### 6.2. Stripe Payments Integration

Stripe will be integrated for payment processing, enabling subscription models or pay-per-use features for advanced functionalities in Version 2.

## 7. True Black Dark Mode Implementation

The client application will implement a true black dark mode. This will involve:
- **CSS Theming:** Utilizing CSS variables or a theming library to define color palettes, ensuring that background colors are set to pure black (`#000000`) and text/foreground elements provide sufficient contrast without being overly bright.
- **User Preference:** Allowing users to toggle between light and dark modes, with the preference persisted locally.

## 8. Credential Storage in Settings Panel

For user-specific credentials that are not managed by the central Credential Management System (e.g., personal API keys for specific external services), a secure settings panel will be implemented in the client application. This panel will allow users to input and manage their credentials, which will then be securely transmitted to the Backend Server and stored in the database, encrypted at rest. This approach avoids the use of environment variables for user-specific settings and provides a user-friendly interface for credential management.

## 9. Voice Command Support with Whisper

The integration of Whisper for voice commands will involve:
- **Client-side Audio Capture:** The client application will capture audio from the user's microphone.
- **Audio Transmission:** Captured audio will be sent to the Voice Command Service.
- **Transcription and Command Recognition:** The Voice Command Service, powered by Whisper, will transcribe the audio into text and then identify actionable commands based on predefined patterns or natural language understanding models.
- **Command Execution:** Recognized commands will be sent to the Backend Server for execution, potentially routing to specific agents or triggering internal application functions.

This detailed architecture provides a robust foundation for the multi-terminal session management application, addressing all specified requirements and laying the groundwork for future scalability and feature expansion. The next step will be to create a visual representation of this architecture.



## 10. MVP Team Structure and Responsibilities

For the Minimum Viable Product (MVP), the development will be driven by a three-agent team, each with distinct responsibilities that align with the proposed architecture:

### 10.1. Product Manager Agent

The Product Manager Agent will be responsible for:
- Defining and refining product requirements based on user feedback and market analysis.
- Prioritizing features and managing the product backlog.
- Overseeing the overall product vision and roadmap.
- Communicating with users and stakeholders to gather requirements and provide updates.
- Ensuring the developed features align with the business goals and user needs.

### 10.2. Frontend Developer Agent

The Frontend Developer Agent will focus on the Client Application (Frontend) component. Their responsibilities will include:
- Developing and maintaining the user interface, including the true black dark mode.
- Implementing real-time data visualization and interaction using WebSockets.
- Integrating with the Backend Server's APIs for data retrieval and command submission.
- Ensuring a responsive and intuitive user experience across various devices.
- Implementing the voice command input mechanism and displaying transcribed commands.

### 10.3. Backend Developer Agent

The Backend Developer Agent will be responsible for the Backend Server, Database, Credential Management System, and Voice Command Service components. Their responsibilities will include:
- Designing and implementing the server-side logic for session management and event routing.
- Developing and maintaining the WebSocket communication layer.
- Integrating with the database for data persistence and retrieval.
- Implementing the MCP protocol for communication with agents.
- Developing the Credential Management System and its integration points.
- Building and maintaining the Voice Command Service, including Whisper integration.
- Ensuring the security, scalability, and performance of the backend infrastructure.

This clear division of responsibilities within the MVP team will facilitate efficient development and ensure that each component of the architecture receives dedicated attention. The agents will collaborate through defined interfaces and communication protocols, mirroring the modularity of the system architecture itself.


