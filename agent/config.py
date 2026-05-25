import os

# Set LLM_PROVIDER to 'gemini', 'openrouter', 'ollama', or 'claude'
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "gemini")

# API Keys
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
CLAUDE_API_KEY = os.getenv("ANTHROPIC_API_KEY")
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")

# GitHub Configuration
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_REPO = "openkruise/openkruise.io"
