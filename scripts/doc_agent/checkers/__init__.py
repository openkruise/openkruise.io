"""Documentation evaluation checkers for the OpenKruise Document Agent.

Each checker module exposes a single entry point::

    def run(docs_dir: str) -> list[dict]

so the evaluator can call them uniformly. Checkers are intentionally
independent (no shared state) so they can be run or tested in isolation.
"""
