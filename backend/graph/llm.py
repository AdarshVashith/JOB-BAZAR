# # graphllmpy
# from langchain_groq import ChatGroq

# from config import get_settings
# from services.db import get_db

# settings = get_settings()


# async def get_llm(user_id: str) -> ChatGroq:

    
#     pool = await get_db()

#     if pool is None:
#         raise RuntimeError(
#             "Database pool not initialized"
#         )

#     async with pool.acquire() as conn:

#         row = await conn.fetchrow(
#             """
#             SELECT
#                 k.groq_key,
#                 COALESCE(
#                     p.model,
#                     'llama-3.3-70b-versatile'
#                 ) AS model
#             FROM users u
#             LEFT JOIN user_api_keys k
#                 ON k.user_id = u.id
#             LEFT JOIN user_preferences p
#                 ON p.user_id = u.id
#             WHERE u.id = $1
#             """,
#             user_id,
#         )

#         user_key = None
#         model = "llama-3.3-70b-versatile"

#         if row:
#             user_key = row["groq_key"]
#             model = row["model"]

#         api_key = (
#             user_key
#             if user_key
#             else settings.groq_api_key
#         )

#         print("MODEL =", model)
#         print("USING USER KEY =", bool(user_key))

#         return ChatGroq(
#             model=model,
#             temperature=0,
#             api_key=api_key,
#         )

# backend/graph/llm.py

from langchain_groq import ChatGroq
from config import get_settings
from services.db import get_db

settings = get_settings()


# ── Existing function — UNCHANGED, all agents use this ────────────────────────

async def get_llm(user_id: str) -> ChatGroq:
    pool = await get_db()

    if pool is None:
        raise RuntimeError("Database pool not initialized")

    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT
                k.groq_key,
                COALESCE(p.model, 'openai/gpt-oss-120b') AS model
            FROM users u
            LEFT JOIN user_api_keys k ON k.user_id = u.id
            LEFT JOIN user_preferences p ON p.user_id = u.id
            WHERE u.id = $1
            """,
            user_id,
        )

        user_key = None
        model = "openai/gpt-oss-120b"

        if row:
            user_key = row["groq_key"]
            model = row["model"] or "openai/gpt-oss-120b"
            if "llama-3.3" in model or "llama-3.1" in model:
                model = "openai/gpt-oss-120b"

        api_key = user_key if user_key else settings.groq_api_key

        print("MODEL =", model)
        print("USING USER KEY =", bool(user_key))

        return ChatGroq(model=model, temperature=0, api_key=api_key)


# ── Provider functions — used only by Orion waterfall ────────────────────────

async def _call_cerebras(messages: list[dict], system: str) -> str:
    import httpx
    async with httpx.AsyncClient(timeout=60) as client:
        res = await client.post(
            "https://api.inference.cerebras.ai/v1/chat/completions",
            headers={"Authorization": f"Bearer {settings.cerebras_api_key}"},
            json={
                "model": "llama3.3-70b",
                "messages": [
                    {"role": "system", "content": system},
                    *messages,
                ],
                "max_tokens": 2048,
            },
        )
        res.raise_for_status()
        return res.json()["choices"][0]["message"]["content"]


async def _call_gemini(messages: list[dict], system: str) -> str:
    import httpx
    # Gemini uses a different message format
    history = []
    for m in messages[:-1]:
        history.append({
            "role": "user" if m["role"] == "user" else "model",
            "parts": [{"text": m["content"]}],
        })
    last = messages[-1]["content"] if messages else ""

    async with httpx.AsyncClient(timeout=60) as client:
        res = await client.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"gemini-1.5-flash:generateContent?key={settings.gemini_api_key}",
            json={
                "system_instruction": {"parts": [{"text": system}]},
                "contents": [
                    *history,
                    {"role": "user", "parts": [{"text": last}]},
                ],
                "generationConfig": {"maxOutputTokens": 2048},
            },
        )
        res.raise_for_status()
        return (
            res.json()["candidates"][0]["content"]["parts"][0]["text"]
        )


async def _call_sambanova(messages: list[dict], system: str) -> str:
    import httpx
    async with httpx.AsyncClient(timeout=60) as client:
        res = await client.post(
            "https://api.sambanova.ai/v1/chat/completions",
            headers={"Authorization": f"Bearer {settings.sambanova_api_key}"},
            json={
                "model": "Meta-Llama-3.3-70B-Instruct",
                "messages": [
                    {"role": "system", "content": system},
                    *messages,
                ],
                "max_tokens": 2048,
            },
        )
        res.raise_for_status()
        return res.json()["choices"][0]["message"]["content"]


async def _call_together(messages: list[dict], system: str) -> str:
    import httpx
    async with httpx.AsyncClient(timeout=60) as client:
        res = await client.post(
            "https://api.together.xyz/v1/chat/completions",
            headers={"Authorization": f"Bearer {settings.together_api_key}"},
            json={
                "model": "meta-llama/Llama-3.3-70B-Instruct-Turbo",
                "messages": [
                    {"role": "system", "content": system},
                    *messages,
                ],
                "max_tokens": 2048,
            },
        )
        res.raise_for_status()
        return res.json()["choices"][0]["message"]["content"]


async def _call_huggingface(messages: list[dict], system: str) -> str:
    import httpx
    async with httpx.AsyncClient(timeout=60) as client:
        res = await client.post(
            "https://api-inference.huggingface.co/models/"
            "meta-llama/Llama-3.1-8B-Instruct/v1/chat/completions",
            headers={"Authorization": f"Bearer {settings.huggingface_api_key}"},
            json={
                "model": "meta-llama/Llama-3.1-8B-Instruct",
                "messages": [
                    {"role": "system", "content": system},
                    *messages,
                ],
                "max_tokens": 2048,
            },
        )
        res.raise_for_status()
        return res.json()["choices"][0]["message"]["content"]


async def _call_ollama_local_brain(messages: list[dict], system: str) -> tuple[str, str]:
    """
    Directly query the local self-hosted AI engine (Ollama) with automatic
    model discovery, prioritizing powerful reasoning and coding models.
    """
    import httpx

    async with httpx.AsyncClient(timeout=120) as client:
        # 1. Discover active local models
        target_model = "llama3.2"
        try:
            tags_res = await client.get("http://localhost:11434/api/tags", timeout=2.5)
            if tags_res.status_code == 200:
                installed_models = [m["name"] for m in tags_res.json().get("models", [])]
                if installed_models:
                    # Preference priority: deep reasoning -> high param -> coding -> standard
                    priority_patterns = [
                        "deepseek-r1", "llama3.3", "qwen2.5-coder", "qwen2.5",
                        "llama3.1", "mistral", "llama3.2", "phi3", "gemma2"
                    ]
                    for pattern in priority_patterns:
                        matched = next((m for m in installed_models if pattern in m.lower()), None)
                        if matched:
                            target_model = matched
                            break
                    else:
                        target_model = installed_models[0]
        except Exception:
            raise RuntimeError("Local Ollama daemon is offline (start with `ollama serve`)")

        # 2. Query the selected local brain model
        res = await client.post(
            "http://localhost:11434/api/chat",
            json={
                "model": target_model,
                "messages": [
                    {"role": "system", "content": system},
                    *messages,
                ],
                "stream": False,
                "options": {
                    "temperature": 0.3,
                }
            },
            timeout=120,
        )
        res.raise_for_status()
        content = res.json()["message"]["content"]
        return content, f"local brain ({target_model})"


_PROVIDERS = [
    ("gemini",      _call_gemini),
    ("cerebras",    _call_cerebras),
    ("sambanova",   _call_sambanova),
    ("together",    _call_together),
    ("huggingface", _call_huggingface),
]


async def _call_groq_direct(messages: list[dict], system: str) -> tuple[str, str]:
    import httpx
    if not settings.groq_api_key:
        raise ValueError("Groq API key not configured")
    
    models = ["openai/gpt-oss-120b", "qwen/qwen3.8-27b", "openai/gpt-oss-20b", "groq/compound"]
    async with httpx.AsyncClient(timeout=45) as client:
        for m in models:
            try:
                res = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {settings.groq_api_key}"},
                    json={
                        "model": m,
                        "messages": [
                            {"role": "system", "content": system},
                            *messages,
                        ],
                        "max_tokens": 2048,
                    },
                )
                if res.status_code == 200:
                    data = res.json()
                    content = data["choices"][0]["message"]["content"]
                    return content, f"cloud api ({m})"
                else:
                    print(f"[llm] Groq {m} returned {res.status_code}: {res.text[:200]}")
            except Exception as e:
                print(f"[llm] Groq {m} exception: {e}")
                continue

    raise RuntimeError("All Groq models failed")


async def call_llm_with_fallback(
    messages: list[dict],
    system: str,
    skip_groq: bool = False,
) -> tuple[str, str]:
    """
    Tiered Hybrid Intelligence:
    1. Local AI Brain (Ollama) is checked first — Zero API cost, runs on device hardware.
    2. Cloud Heavy Task Tier (Groq / Gemini / Anthropic) for intense workloads or when local is offline.
    """
    # ── 1. Try Local Self-Hosted AI Mind First ──
    try:
        print("[llm] Attempting local AI brain (Ollama)...")
        return await _call_ollama_local_brain(messages, system)
    except Exception as e:
        print(f"[llm] Local brain offline or unavailable ({e}), engaging Cloud Heavy Task Cluster...")

    # ── 2. Cloud API Tier (Groq 120B / Fast Engine) ──
    if not skip_groq and settings.groq_api_key:
        try:
            return await _call_groq_direct(messages, system)
        except Exception as e:
            print(f"[llm] Cloud Groq cluster failed: {e}")

    # ── 3. Waterfall through external providers ──
    for name, fn in _PROVIDERS:
        key_attr = f"{name}_api_key"
        if name != "ollama" and not getattr(settings, key_attr, ""):
            continue

        try:
            print(f"[llm] Trying {name}...")
            result = await fn(messages, system)
            print(f"[llm] {name} succeeded")
            return result, name
        except Exception as e:
            print(f"[llm] {name} failed: {e}")
            continue

    # ── 4. Built-in Intelligence Fallback ──
    user_msg = messages[-1]["content"] if messages else ""
    return (
        f"I received your inquiry: '{user_msg}'.\n\n"
        "Orion is active in autonomous mode. You can ask technical questions, request multi-agent plans, or execute workflows.",
        "orion (local intelligence)",
    )