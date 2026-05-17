"""Shared pytest setup.

The checkers live in ``scripts/doc_agent/checkers/``. Putting that package's
parent (``scripts/doc_agent``) on ``sys.path`` lets the tests do a clean
``from checkers import ...`` — the same mechanism ``evaluate.py`` uses, so
the tests exercise the modules exactly as the agent loads them.
"""

import os
import sys

_TESTS_DIR = os.path.dirname(os.path.abspath(__file__))
_CHECKERS_PARENT = os.path.join(
    os.path.dirname(_TESTS_DIR), "scripts", "doc_agent"
)

if _CHECKERS_PARENT not in sys.path:
    sys.path.insert(0, _CHECKERS_PARENT)
