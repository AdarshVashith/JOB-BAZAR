
import subprocess
import tempfile
import os
import sys

# code_executor.py

from tools.executors.c_executor import execute_c
from tools.executors.cpp_executor import execute_cpp
from tools.executors.js_executor import execute_javascript
from tools.executors.java_executor import execute_java
from tools.executors.go_executor import execute_go
async def execute_python(code: str) -> str:

    # ---------------------------------------------------
    # Save generated code
    # ---------------------------------------------------

    with tempfile.NamedTemporaryFile(
        suffix=".py",
        delete=False,
        mode="w",
        encoding="utf-8",
    ) as f:

        f.write(code)

        code_path = f.name

    try:

        # ---------------------------------------------------
        # Run inside Docker sandbox
        # ---------------------------------------------------

        result = subprocess.run(

            [
                "docker",
                "run",
                "--rm",

                # Memory limit
                "--memory=128m",

                # CPU limit
                "--cpus=1",

                # Disable internet
                "--network=none",
                "--pids-limit=64",
                "--read-only",
                "-e",
                "LANGUAGE=python",

                # Mount generated code
                "-v",
                f"{code_path}:/tmp/code:ro",

                "agent-executor",
            ],

            capture_output=True,
            text=True,
            timeout=15,
            encoding="utf-8",
    errors="replace",
        )

        # ---------------------------------------------------
        # Handle execution errors
        # ---------------------------------------------------

        if result.returncode != 0:
            stdout = result.stdout or ""
            stderr = result.stderr or ""

            if "Cannot connect to the Docker daemon" in stderr or "docker: not found" in stderr:
                # Docker not running, fallback to local execution
                local_res = subprocess.run(
                    [sys.executable, code_path],
                    capture_output=True,
                    text=True,
                    timeout=15,
                    encoding="utf-8",
                    errors="replace",
                )
                return (local_res.stdout or local_res.stderr or "Code executed successfully.").strip()

            if stdout.strip():
                return result.stdout.strip()

            return stderr.strip()

        output = result.stdout.strip()

        if not output:
            output = "Code executed successfully."

        return output

    except subprocess.TimeoutExpired:
        return "Execution timed out."

    except Exception as e:
        try:
            local_res = subprocess.run(
                [sys.executable, code_path],
                capture_output=True,
                text=True,
                timeout=15,
                encoding="utf-8",
                errors="replace",
            )
            return (local_res.stdout or local_res.stderr or "Code executed successfully.").strip()
        except Exception:
            return f"Execution Environment Error:\n{e}"

    finally:

        # ---------------------------------------------------
        # Cleanup temp file
        # ---------------------------------------------------

        if os.path.exists(code_path):
            os.remove(code_path)