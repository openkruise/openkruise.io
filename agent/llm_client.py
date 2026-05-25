import os
import sys
import json
import requests

sys.path.append(os.path.abspath(os.path.dirname(__file__)))
import config

def generate_completion(prompt):
    provider = config.LLM_PROVIDER.lower()
    
    if provider == "gemini":
        if not config.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not set.")
        try:
            from google import genai  # pyrefly: ignore [missing-import]
            genai.configure(api_key=config.GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-flash-lite-latest')
            response = model.generate_content(prompt)
            return response.text
        except ImportError:
            raise ImportError("google-generativeai is not installed.")
            
    elif provider == "openrouter":
        if not config.OPENROUTER_API_KEY:
            raise ValueError("OPENROUTER_API_KEY is not set.")
        headers = {
            "Authorization": f"Bearer {config.OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }
        data = {
            "model": "google/gemini-1.5-flash", 
            "messages": [{"role": "user", "content": prompt}]
        }
        resp = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]
        
    elif provider == "claude":
        if not config.CLAUDE_API_KEY:
            raise ValueError("ANTHROPIC_API_KEY is not set.")
        headers = {
            "x-api-key": config.CLAUDE_API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }
        data = {
            "model": "claude-3-haiku-20240307",
            "max_tokens": 4096,
            "messages": [{"role": "user", "content": prompt}]
        }
        resp = requests.post("https://api.anthropic.com/v1/messages", headers=headers, json=data)
        resp.raise_for_status()
        return resp.json()["content"][0]["text"]
        
    elif provider == "ollama":
        url = f"{config.OLLAMA_URL.rstrip('/')}/api/generate"
        data = {
            "model": "llama3",
            "prompt": prompt,
            "stream": False
        }
        resp = requests.post(url, json=data)
        resp.raise_for_status()
        return resp.json()["response"]
        
    else:
        raise ValueError(f"Unknown LLM_PROVIDER: {provider}")
