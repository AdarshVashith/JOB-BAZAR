import asyncpg
from config import get_settings

settings = get_settings()

db_pool = None

SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_jti TEXT NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agent_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    goal TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'running',
    tokens_used INT DEFAULT 0,
    cost NUMERIC DEFAULT 0,
    plan JSONB DEFAULT '[]'::jsonb,
    steps JSONB DEFAULT '[]'::jsonb,
    events JSONB DEFAULT '[]'::jsonb,
    result TEXT,
    code_output TEXT,
    duration NUMERIC DEFAULT 0,
    model TEXT,
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_agent_runs_status ON agent_runs (status);
CREATE INDEX IF NOT EXISTS idx_agent_runs_user ON agent_runs (user_id);

CREATE TABLE IF NOT EXISTS user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    model TEXT DEFAULT 'llama-3.3-70b-versatile',
    web_search BOOLEAN DEFAULT TRUE,
    smart_cache BOOLEAN DEFAULT FALSE,
    smart_suggestion BOOLEAN DEFAULT TRUE,
    rag_threshold NUMERIC DEFAULT 1.5,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_api_keys (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    groq_key TEXT DEFAULT '',
    serpapi_key TEXT DEFAULT '',
    github_token TEXT DEFAULT '',
    openai_key TEXT DEFAULT '',
    anthropic_key TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    type TEXT,
    title TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cached_runs (
    id SERIAL PRIMARY KEY,
    user_id UUID,
    route TEXT,
    goal TEXT,
    result JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orion_activity (
    id SERIAL PRIMARY KEY,
    user_id UUID,
    event_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orion_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    device_name TEXT NOT NULL,
    os TEXT,
    version TEXT,
    verified BOOLEAN DEFAULT TRUE,
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, device_name)
);

CREATE TABLE IF NOT EXISTS uploaded_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    filename TEXT NOT NULL,
    file_url TEXT,
    file_type TEXT,
    file_size INT,
    chunk_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, filename)
);

CREATE TABLE IF NOT EXISTS platform_updates (
    id SERIAL PRIMARY KEY,
    title TEXT,
    message TEXT,
    type TEXT,
    priority TEXT,
    version TEXT,
    target TEXT,
    active BOOLEAN DEFAULT TRUE,
    show_banner BOOLEAN DEFAULT FALSE,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assistant_memory (
    id SERIAL PRIMARY KEY,
    user_id UUID,
    session_id TEXT,
    topic TEXT,
    summary TEXT,
    category TEXT,
    source TEXT,
    pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
    edges JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT FALSE,
    webhook_slug TEXT UNIQUE,
    cron_expression TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_workflows_user ON workflows (user_id);
CREATE INDEX IF NOT EXISTS idx_workflows_webhook ON workflows (webhook_slug);

CREATE TABLE IF NOT EXISTS workflow_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending',
    trigger_type TEXT NOT NULL DEFAULT 'manual',
    node_results JSONB DEFAULT '{}'::jsonb,
    error TEXT,
    duration_ms INT DEFAULT 0,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    finished_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_wf ON workflow_executions (workflow_id);

CREATE TABLE IF NOT EXISTS workflow_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    encrypted_data TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
"""

async def init_db():
    global db_pool

    ssl_mode = "require" if settings.environment == "production" else False
    db_pool = await asyncpg.create_pool(
        settings.database_url,
        min_size=2,
        max_size=20,
        ssl=ssl_mode,
    )
    
    async with db_pool.acquire() as conn:
        await conn.execute(SCHEMA_SQL)

async def get_db():
    return db_pool