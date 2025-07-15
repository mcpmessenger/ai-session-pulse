
# Application Requirements

## Core Functionality
- Manage multi-terminal sessions using WebSockets.
- Ability to run Gemini code or Claude code via Ubuntu.

## User Interface
- Dark mode with true black (not blue or purple).

## Architecture
- Utilize MCP (Multi-Agent Communication Protocol) protocol.
- Proposed architecture should be provided with a diagram.

## Version 2 Features
- Google OAuth for user sign-in.
- Stripe for payments.

## Credential Management
- Settings panel to store necessary credentials (instead of environment variables).

## Voice Command
- Voice command support with Whisper for commands.

## Observability (from transcript)
- One-way data stream from agents to server.
- Server stores data in an SQLite-like database.
- Server streams events to the client via WebSockets.
- Summarization of agent work using a small, fast model (e.g., Haiku).
- Live activity pulse/event stream for all agents.
- Filtering of events by codebase/application and session ID.
- Ability to view full chat transcripts for stop events.
- Mobile-friendly UI.


