# backend/workflows/nodes/triggers.py
from typing import Any, Dict, Optional
from datetime import datetime
from .base import BaseWorkflowNode, registry

class ManualTriggerNode(BaseWorkflowNode):
    type = "manual_trigger"
    name = "Manual Trigger"
    category = "Trigger"
    description = "Starts workflow manually on demand from the canvas or API."
    icon = "PlayCircle"
    inputs = []
    outputs = ["main"]
    parameters = [
        {
            "name": "test_payload",
            "type": "json",
            "label": "Test Payload (JSON)",
            "default": "{}",
            "description": "Initial mock data passed to downstream nodes."
        }
    ]

    async def run(
        self,
        input_data: Dict[str, Any],
        params: Dict[str, Any],
        credentials: Optional[Dict[str, Any]] = None,
        context: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        payload = params.get("test_payload", {})
        if isinstance(payload, str):
            import json
            try:
                payload = json.loads(payload)
            except Exception:
                payload = {"raw": payload}

        return {
            "triggered_at": datetime.utcnow().isoformat(),
            "trigger_type": "manual",
            "data": payload or input_data.get("data", {}),
        }


class WebhookTriggerNode(BaseWorkflowNode):
    type = "webhook_trigger"
    name = "Webhook Trigger"
    category = "Trigger"
    description = "Listens for incoming HTTP POST/GET requests on a unique URL slug."
    icon = "Webhook"
    inputs = []
    outputs = ["main"]
    parameters = [
        {
            "name": "http_method",
            "type": "select",
            "label": "HTTP Method",
            "options": ["POST", "GET", "PUT"],
            "default": "POST",
        },
        {
            "name": "response_mode",
            "type": "select",
            "label": "Response Mode",
            "options": ["immediately", "on_completion"],
            "default": "immediately",
        }
    ]

    async def run(
        self,
        input_data: Dict[str, Any],
        params: Dict[str, Any],
        credentials: Optional[Dict[str, Any]] = None,
        context: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        # input_data is populated by the webhook HTTP request payload
        return {
            "received_at": datetime.utcnow().isoformat(),
            "method": input_data.get("method", "POST"),
            "headers": input_data.get("headers", {}),
            "query_params": input_data.get("query_params", {}),
            "body": input_data.get("body", {}),
        }


class CronTriggerNode(BaseWorkflowNode):
    type = "cron_trigger"
    name = "Schedule / Cron Trigger"
    category = "Trigger"
    description = "Triggers workflow periodically on a schedule (e.g. every hour, daily)."
    icon = "Clock"
    inputs = []
    outputs = ["main"]
    parameters = [
        {
            "name": "interval",
            "type": "select",
            "label": "Interval",
            "options": ["every_5_minutes", "every_hour", "every_day", "custom_cron"],
            "default": "every_hour",
        },
        {
            "name": "cron_expression",
            "type": "string",
            "label": "Custom Cron (5-part expression)",
            "default": "0 * * * *",
        }
    ]

    async def run(
        self,
        input_data: Dict[str, Any],
        params: Dict[str, Any],
        credentials: Optional[Dict[str, Any]] = None,
        context: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        return {
            "scheduled_time": datetime.utcnow().isoformat(),
            "interval": params.get("interval", "every_hour"),
            "cron": params.get("cron_expression", "0 * * * *"),
        }

# Register trigger nodes
registry.register(ManualTriggerNode())
registry.register(WebhookTriggerNode())
registry.register(CronTriggerNode())
