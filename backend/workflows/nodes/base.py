# backend/workflows/nodes/base.py
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
import time

class BaseWorkflowNode(ABC):
    """
    Abstract Base Class for all pluggable workflow nodes.
    Each node provides schema descriptors and an async execution handler.
    """
    type: str = "base"
    name: str = "Base Node"
    category: str = "General"  # Trigger, Action, Transform, AI, Logic
    description: str = ""
    icon: str = "Zap"
    inputs: List[str] = ["main"]
    outputs: List[str] = ["main"]
    parameters: List[Dict[str, Any]] = []

    def to_schema(self) -> Dict[str, Any]:
        return {
            "type": self.type,
            "name": self.name,
            "category": self.category,
            "description": self.description,
            "icon": self.icon,
            "inputs": self.inputs,
            "outputs": self.outputs,
            "parameters": self.parameters,
        }

    @abstractmethod
    async def run(
        self,
        input_data: Dict[str, Any],
        params: Dict[str, Any],
        credentials: Optional[Dict[str, Any]] = None,
        context: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Execute node logic.
        :param input_data: Combined JSON outputs from parent nodes in DAG
        :param params: Configured parameters from node UI
        :param credentials: Decrypted credentials if requested
        :param context: Execution metadata (workflow_id, execution_id, user_id)
        :return: Output dictionary to be passed to child nodes
        """
        pass


class NodeRegistry:
    """Registry holding all available pluggable workflow nodes."""
    _nodes: Dict[str, BaseWorkflowNode] = {}

    @classmethod
    def register(cls, node: BaseWorkflowNode):
        cls._nodes[node.type] = node

    @classmethod
    def get(cls, node_type: str) -> Optional[BaseWorkflowNode]:
        return cls._nodes.get(node_type)

    @classmethod
    def list_all(cls) -> List[Dict[str, Any]]:
        return [node.to_schema() for node in cls._nodes.values()]

registry = NodeRegistry
