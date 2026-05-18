Troubleshooting

Tests fail with ModuleNotFoundError
- Ensure dependencies installed: python -m pip install -r requirements.txt
- Ensure pytest uses repo root (pytest.ini includes pythonpath = .)

PlantUML rendering issues
- Verify plantuml is installed
- Run: plantuml -tpng docs/architecture/*.puml

Missing artifacts
- Re-run the CLI pipeline in order
