# backend/workflows/nodes/actions.py
from typing import Any, Dict, Optional
import httpx
import json
import re
from .base import BaseWorkflowNode, registry

def _interpolate(template: str, data: Dict[str, Any]) -> str:
    """Resolve {{field.subfield}} or {{$json.key}} placeholders from context."""
    if not isinstance(template, str):
        return template

    def replacer(match):
        path = match.group(1).strip()
        # strip prefix if any (e.g. $json. or json.)
        if path.startswith("$json."):
            path = path[6:]
        elif path.startswith("json."):
            path = path[5:]
        elif path.startswith("$input."):
            path = path[7:]

        keys = path.split(".")
        val = data
        for k in keys:
            if isinstance(val, dict) and k in val:
                val = val[k]
            else:
                return match.group(0)  # leave unchanged if not found
        return str(val) if val is not None else ""

    return re.sub(r"\{\{([^}]+)\}\}", replacer, template)


class HttpRequestNode(BaseWorkflowNode):
    type = "http_request"
    name = "HTTP Request"
    category = "Action"
    description = "Make arbitrary HTTP/REST calls to any external API."
    icon = "Globe"
    inputs = ["main"]
    outputs = ["main"]
    parameters = [
        {
            "name": "method",
            "type": "select",
            "label": "Method",
            "options": ["GET", "POST", "PUT", "DELETE", "PATCH"],
            "default": "GET",
        },
        {
            "name": "url",
            "type": "string",
            "label": "URL Endpoint",
            "placeholder": "https://api.example.com/data?id={{id}}",
            "default": "https://jsonplaceholder.typicode.com/todos/1",
        },
        {
            "name": "headers",
            "type": "json",
            "label": "Headers (JSON)",
            "default": "{\"Content-Type\": \"application/json\"}",
        },
        {
            "name": "body",
            "type": "json",
            "label": "JSON Body (POST/PUT)",
            "default": "{}",
        },
        {
            "name": "timeout",
            "type": "number",
            "label": "Timeout (seconds)",
            "default": 30,
        }
    ]

    async def run(
        self,
        input_data: Dict[str, Any],
        params: Dict[str, Any],
        credentials: Optional[Dict[str, Any]] = None,
        context: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        method = params.get("method", "GET").upper()
        raw_url = params.get("url", "")
        url = _interpolate(raw_url, input_data)
        timeout = float(params.get("timeout", 30))

        # Parse & interpolate headers
        raw_headers = params.get("headers", "{}")
        headers = {}
        if isinstance(raw_headers, str):
            try:
                headers = json.loads(_interpolate(raw_headers, input_data))
            except Exception:
                headers = {}
        elif isinstance(raw_headers, dict):
            headers = raw_headers

        # Parse body
        body = None
        if method in ["POST", "PUT", "PATCH"]:
            raw_body = params.get("body", "{}")
            if isinstance(raw_body, str):
                try:
                    body = json.loads(_interpolate(raw_body, input_data))
                except Exception:
                    body = {"raw": _interpolate(raw_body, input_data)}
            elif isinstance(raw_body, dict):
                body = raw_body

        try:
            async with httpx.AsyncClient(timeout=timeout, follow_redirects=True) as client:
                res = await client.request(
                    method=method,
                    url=url,
                    headers=headers,
                    json=body if body is not None else None,
                )

                try:
                    json_data = res.json()
                except Exception:
                    json_data = {"text": res.text}

                return {
                    "status_code": res.status_code,
                    "headers": dict(res.headers),
                    "data": json_data,
                    "ok": res.is_success,
                }
        except Exception as e:
            return {
                "status_code": 500,
                "error": str(e),
                "data": {"error": str(e)},
                "ok": False,
            }


class CodeFunctionNode(BaseWorkflowNode):
    type = "code_function"
    name = "Python / Code Function"
    category = "Transform"
    description = "Execute custom Python transformation logic with $input and $json access."
    icon = "Code2"
    inputs = ["main"]
    outputs = ["main"]
    parameters = [
        {
            "name": "code",
            "type": "code",
            "label": "Python Script",
            "default": (
                "# Transform input data\n"
                "# $json contains upstream output data\n"
                "items = $json.get('data', {})\n"
                "result = {'transformed': True, 'count': len(items) if isinstance(items, (list, dict)) else 1, 'payload': items}\n"
            ),
        }
    ]

    async def run(
        self,
        input_data: Dict[str, Any],
        params: Dict[str, Any],
        credentials: Optional[Dict[str, Any]] = None,
        context: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        code = params.get("code", "result = $json")
        
        # Local execution namespace with safe builtins
        local_scope = {
            "$json": input_data,
            "$input": input_data,
            "json": json,
            "result": None,
        }

        # Replace $json/$input identifier syntax for clean python compilation
        exec_code = code.replace("$json", "input_var").replace("$input", "input_var")
        local_scope["input_var"] = input_data

        try:
            exec(exec_code, {"__builtins__": __builtins__}, local_scope)
            res = local_scope.get("result")
            if res is None:
                res = local_scope.get("output", input_data)
            return {"data": res, "success": True}
        except Exception as e:
            return {"error": str(e), "success": False, "data": input_data}


class LlmAgentNode(BaseWorkflowNode):
    type = "llm_agent"
    name = "AI Agent / LLM"
    category = "AI"
    description = "Process text, summarize, extract structured JSON, or make decisions using Local Brain or Cloud Groq."
    icon = "Brain"
    inputs = ["main"]
    outputs = ["main"]
    parameters = [
        {
            "name": "prompt",
            "type": "textarea",
            "label": "Prompt Template",
            "default": "Analyze this data and extract key insights:\n{{$json}}",
        },
        {
            "name": "system_prompt",
            "type": "textarea",
            "label": "System Persona",
            "default": "You are an expert AI data extraction and automation assistant. Return your findings clearly or in JSON when requested.",
        },
        {
            "name": "output_format",
            "type": "select",
            "label": "Output Format",
            "options": ["text", "json"],
            "default": "text",
        }
    ]

    async def run(
        self,
        input_data: Dict[str, Any],
        params: Dict[str, Any],
        credentials: Optional[Dict[str, Any]] = None,
        context: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        from graph.llm import call_llm_with_fallback

        raw_prompt = params.get("prompt", "{{$json}}")
        prompt = _interpolate(raw_prompt, input_data)
        system = params.get("system_prompt", "You are an AI automation node.")
        out_fmt = params.get("output_format", "text")

        if out_fmt == "json":
            system += "\nIMPORTANT: You must reply with valid JSON only. Do not include markdown codeblocks or extra text."

        response_text, provider = await call_llm_with_fallback(
            messages=[{"role": "user", "content": prompt}],
            system=system,
        )

        parsed_json = None
        if out_fmt == "json":
            try:
                # Strip markdown fences if any
                clean = re.sub(r"^```json\s*|\s*```$", "", response_text.strip(), flags=re.MULTILINE)
                parsed_json = json.loads(clean)
            except Exception:
                parsed_json = {"raw": response_text}

        return {
            "response": response_text,
            "json": parsed_json,
            "provider": provider,
        }


class ConditionIfNode(BaseWorkflowNode):
    type = "condition_if"
    name = "If / Branch Condition"
    category = "Logic"
    description = "Conditionally routes execution to True or False branches based on field evaluation."
    icon = "GitBranch"
    inputs = ["main"]
    outputs = ["true", "false"]
    parameters = [
        {
            "name": "field",
            "type": "string",
            "label": "Field Path to Test",
            "placeholder": "data.status or data.ok",
            "default": "ok",
        },
        {
            "name": "operator",
            "type": "select",
            "label": "Condition Operator",
            "options": ["is_truthy", "equals", "not_equals", "contains", "greater_than"],
            "default": "is_truthy",
        },
        {
            "name": "compare_value",
            "type": "string",
            "label": "Comparison Value",
            "default": "true",
        }
    ]

    async def run(
        self,
        input_data: Dict[str, Any],
        params: Dict[str, Any],
        credentials: Optional[Dict[str, Any]] = None,
        context: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        field = params.get("field", "ok")
        op = params.get("operator", "is_truthy")
        comp = params.get("compare_value", "true")

        # Resolve field path from input_data
        keys = field.split(".")
        val = input_data
        for k in keys:
            if isinstance(val, dict) and k in val:
                val = val[k]
            else:
                val = None
                break

        passed = False
        if op == "is_truthy":
            passed = bool(val)
        elif op == "equals":
            passed = str(val).lower() == str(comp).lower()
        elif op == "not_equals":
            passed = str(val).lower() != str(comp).lower()
        elif op == "contains":
            passed = str(comp).lower() in str(val).lower() if val else False
        elif op == "greater_than":
            try:
                passed = float(val) > float(comp)
            except Exception:
                passed = False

        return {
            "result": passed,
            "branch": "true" if passed else "false",
            "tested_value": val,
            "data": input_data,
        }

# Register action nodes
registry.register(HttpRequestNode())
registry.register(CodeFunctionNode())
registry.register(LlmAgentNode())
registry.register(ConditionIfNode())
