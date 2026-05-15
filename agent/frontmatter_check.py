def validate_frontmatter(metadata: dict) -> dict[str, object]:
    """Validate required frontmatter keys."""
    missing = []
    for key in ("title", "sidebar_position", "slug"):
        value = metadata.get(key)
        if value is None or value == "":
            missing.append(key)

    return {
        "missing": missing,
        "warnings": [],
        "valid": len(missing) == 0,
    }
