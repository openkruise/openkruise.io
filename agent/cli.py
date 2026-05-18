import json
import time
from pathlib import Path

import click
import frontmatter

from .collect import collect_inventory
from .differ import generate_html_preview, generate_patch
from .frontmatter_check import validate_frontmatter
from .linkcheck import check_links
from .pr import create_draft_pr, load_config
from .report import generate_report
from .scorer import score_evaluations
from .tools.release_staleness import fetch_release_staleness
from .tools.blog_generator import generate_blog_posts


@click.group(
    help="Doc Agent CLI.",
    epilog=(
        "Examples:\n"
        "  python -m agent.cli collect --repo-root . --output inventory.json\n"
        "  python -m agent.cli evaluate --repo-root . --output-dir agent/artifacts\n"
        "  python -m agent.cli release-check --output-dir agent/artifacts\n"
        "  python -m agent.cli score --input-dir agent/artifacts --output scorecard.json\n"
        "  python -m agent.cli stage --input-dir agent/artifacts --output-dir agent/staging\n"
        "  python -m agent.cli report --input-dir agent/artifacts --output-dir agent/reports"
    ),
)
def cli():
    """Doc Agent CLI."""
    pass


def _ensure_exists(path: Path, label: str) -> None:
    if not path.exists():
        raise click.ClickException(f"missing {label}: {path}")


@cli.command()
@click.option("--repo-root", default=".", type=click.Path(file_okay=False, path_type=Path))
@click.option("--output", default="inventory.json", type=click.Path(dir_okay=False, path_type=Path))
def collect(repo_root: Path, output: Path):
    """Collect inventory metadata for markdown files."""
    start = time.monotonic()
    data = collect_inventory(repo_root, output)
    elapsed = time.monotonic() - start
    click.echo(f"Collected {len(data.get('files', []))} files in {elapsed:.2f}s -> {output}")


@cli.command()
@click.option("--repo-root", default=".", type=click.Path(file_okay=False, path_type=Path))
@click.option("--output-dir", default="artifacts", type=click.Path(file_okay=False, path_type=Path))
def evaluate(repo_root: Path, output_dir: Path):
    """Evaluate inventory items and write evaluation artifacts."""
    start = time.monotonic()
    repo_root = repo_root.resolve()
    output_dir = output_dir.resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    inventory_path = repo_root / "inventory.json"
    if not inventory_path.exists():
        collect_inventory(repo_root, inventory_path)

    inventory = json.loads(inventory_path.read_text(encoding="utf-8"))
    eval_dir = output_dir / "evaluations"
    eval_dir.mkdir(parents=True, exist_ok=True)

    written = 0
    for item in inventory.get("files", []):
        rel_path = Path(item["path"])
        file_path = repo_root / rel_path
        content = ""
        try:
            content = file_path.read_text(encoding="utf-8")
        except OSError:
            pass

        metadata = {}
        try:
            post = frontmatter.load(file_path)
            metadata = post.metadata if post else {}
        except Exception:
            metadata = {}

        evaluation = {
            "path": rel_path.as_posix(),
            "sha": item.get("sha"),
            "last_commit_date": item.get("last_commit_date"),
            "age_days": item.get("age_days"),
            "frontmatter": validate_frontmatter(metadata),
            "linkcheck": check_links(content, file_path, repo_root),
        }

        out_name = rel_path.as_posix().replace("/", "__") + ".json"
        out_path = eval_dir / out_name
        out_path.write_text(json.dumps(evaluation, indent=2, sort_keys=True), encoding="utf-8")
        written += 1

    elapsed = time.monotonic() - start
    click.echo(f"Evaluated {written} files in {elapsed:.2f}s -> {eval_dir}")


@cli.command()
@click.option("--input-dir", default="artifacts", type=click.Path(file_okay=False, path_type=Path))
@click.option("--output", default="scorecard.json", type=click.Path(dir_okay=False, path_type=Path))
def score(input_dir: Path, output: Path):
    """Score evaluations and write scorecard.json."""
    start = time.monotonic()
    input_dir = input_dir.resolve()
    output = output if output.is_absolute() else (input_dir / output)
    output.parent.mkdir(parents=True, exist_ok=True)
    scorecard = score_evaluations(input_dir, output)
    elapsed = time.monotonic() - start
    click.echo(f"Scorecard in {elapsed:.2f}s -> {output}")
    summary = scorecard.get("summary", {})
    click.echo(
        "Summary: total={total_files} high={high_priority} medium={medium_priority} low={low_priority}".format(
            **summary
        )
    )


@cli.command()
@click.option("--input-dir", default="artifacts", type=click.Path(file_okay=False, path_type=Path))
@click.option("--output-dir", default="staging", type=click.Path(file_okay=False, path_type=Path))
def stage(input_dir: Path, output_dir: Path):
    """Generate patch and preview artifacts from scorecard."""
    start = time.monotonic()
    input_dir = input_dir.resolve()
    output_dir = output_dir.resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    scorecard_path = input_dir / "scorecard.json"
    _ensure_exists(scorecard_path, "scorecard.json")
    scorecard = json.loads(scorecard_path.read_text(encoding="utf-8"))

    patch_path = output_dir / "suggestions.patch"
    preview_path = output_dir / "suggestions.preview.html"
    generate_patch(scorecard, patch_path)
    generate_html_preview(scorecard, preview_path)
    meta_path = patch_path.with_suffix(patch_path.suffix + ".meta.json")

    elapsed = time.monotonic() - start
    click.echo(f"Patch -> {patch_path}")
    click.echo(f"Patch meta -> {meta_path}")
    click.echo(f"Preview -> {preview_path}")
    click.echo(f"Staging complete in {elapsed:.2f}s")


@cli.command()
@click.option("--input-dir", default="artifacts", type=click.Path(file_okay=False, path_type=Path))
@click.option("--output-dir", default="reports", type=click.Path(file_okay=False, path_type=Path))
def report(input_dir: Path, output_dir: Path):
    """Generate summary.md and report.json from scorecard."""
    start = time.monotonic()
    input_dir = input_dir.resolve()
    output_dir = output_dir.resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    scorecard_path = input_dir / "scorecard.json"
    _ensure_exists(scorecard_path, "scorecard.json")
    report_path = generate_report(scorecard_path, output_dir)
    elapsed = time.monotonic() - start
    click.echo(f"Report -> {report_path}")
    click.echo(f"Reporting complete in {elapsed:.2f}s")


@cli.command("open-pr")
@click.option("--repo-root", default=".", type=click.Path(file_okay=False, path_type=Path))
@click.option("--config", "config_path", default="config.yaml", type=click.Path(dir_okay=False, path_type=Path))
@click.option("--artifacts-dir", default="artifacts", type=click.Path(file_okay=False, path_type=Path))
@click.option("--staging-dir", default="staging", type=click.Path(file_okay=False, path_type=Path))
@click.option("--report-dir", default="reports", type=click.Path(file_okay=False, path_type=Path))
@click.option("--create-pr/--no-create-pr", default=False)
@click.option("--dry-run/--execute", default=True)
def open_pr(
    repo_root: Path,
    config_path: Path,
    artifacts_dir: Path,
    staging_dir: Path,
    report_dir: Path,
    create_pr: bool,
    dry_run: bool,
):
    """Create a draft PR when explicitly requested and enabled."""
    repo_root = repo_root.resolve()
    config = load_config(repo_root / config_path)
    artifacts_dir = (repo_root / artifacts_dir).resolve()
    staging_dir = (repo_root / staging_dir).resolve()
    report_dir = (repo_root / report_dir).resolve()

    _ensure_exists(report_dir / "summary.md", "summary.md")
    _ensure_exists(artifacts_dir / "scorecard.json", "scorecard.json")
    _ensure_exists(staging_dir / "suggestions.patch", "suggestions.patch")
    _ensure_exists(staging_dir / "suggestions.preview.html", "suggestions.preview.html")

    result = create_draft_pr(
        repo_root=repo_root,
        config=config,
        create_pr=create_pr,
        dry_run=dry_run,
        summary_path=report_dir / "summary.md",
        artifacts_dir=artifacts_dir,
        staging_dir=staging_dir,
        report_dir=report_dir,
    )
    click.echo(json.dumps(result, indent=2, sort_keys=True))


@cli.command("release-check")
@click.option("--output-dir", default="agent/artifacts", type=click.Path(file_okay=False, path_type=Path))
@click.option("--blog-staging-dir", default="agent/staging/blog", type=click.Path(file_okay=False, path_type=Path))
@click.option("--enrich-evaluations/--no-enrich-evaluations", default=True,
              help="Patch existing evaluation JSONs with release_stale signal.")
def release_check(output_dir: Path, blog_staging_dir: Path, enrich_evaluations: bool):
    """
    Fetch latest GitHub releases for tracked sub-projects, write a release
    freshness report, generate blog post drafts, and optionally enrich
    existing evaluation JSONs with the release_stale signal.
    """
    start = time.monotonic()
    output_dir = output_dir.resolve()
    blog_staging_dir = blog_staging_dir.resolve()

    click.echo("Fetching release data from GitHub...")
    records = fetch_release_staleness()

    # Write freshness report
    output_dir.mkdir(parents=True, exist_ok=True)
    report_path = output_dir / "release_freshness.json"
    report_path.write_text(json.dumps(records, indent=2), encoding="utf-8")
    click.echo(f"Release freshness report -> {report_path}")

    # Print summary table
    click.echo("\n{:<22} {:<10} {:<12} {:<6} {}".format(
        "Sub-project", "Tag", "Published", "Days", "Status"))
    click.echo("-" * 70)
    for r in records:
        if "error" in r:
            click.echo(f"{r['name']:<22} ERROR: {r['error']}")
            continue
        status = "🔴 STALE" if r["stale"] else "🟢 OK"
        pub = r["published_at"][:10]
        click.echo(f"{r['name']:<22} {r['tag']:<10} {pub:<12} {r['days_since']:<6} {status}")
    click.echo("")

    # Generate blog post drafts
    written = generate_blog_posts(records, blog_staging_dir)
    for p in written:
        click.echo(f"Blog draft -> {p}")

    # Enrich existing evaluation JSONs with release_stale signal
    if enrich_evaluations:
        eval_dir = output_dir / "evaluations"
        if eval_dir.exists():
            # Build a lookup: doc path prefix -> release record
            # e.g. files under rollouts/ map to the "rollouts" record
            prefix_map: dict[str, dict] = {}
            for r in records:
                if "error" not in r:
                    prefix_map[r["name"]] = r
            # Also map "kruise" to the docs/ root (core kruise docs)
            prefix_map["docs"] = prefix_map.get("kruise", {})

            enriched = 0
            for eval_file in sorted(eval_dir.glob("*.json")):
                try:
                    data = json.loads(eval_file.read_text(encoding="utf-8"))
                except json.JSONDecodeError:
                    continue
                doc_path: str = data.get("path", "")
                matched: dict | None = None
                for prefix, record in prefix_map.items():
                    if doc_path.startswith(prefix + "/") or doc_path.startswith(prefix + "__"):
                        matched = record
                        break
                if matched:
                    data["release_stale"] = matched.get("stale", False)
                    data["release_days_since"] = matched.get("days_since")
                    eval_file.write_text(json.dumps(data, indent=2, sort_keys=True), encoding="utf-8")
                    enriched += 1
            click.echo(f"Enriched {enriched} evaluation(s) with release_stale signal.")

    elapsed = time.monotonic() - start
    click.echo(f"Release check complete in {elapsed:.2f}s")


if __name__ == "__main__":
    try:
        cli()
    except KeyboardInterrupt:
        raise SystemExit(130)
