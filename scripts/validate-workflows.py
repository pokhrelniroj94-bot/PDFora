#!/usr/bin/env python3
"""Strict validation of GitHub Actions workflow files.

GitHub rejects a workflow that contains duplicate mapping keys, and then reports a run with
zero jobs. PyYAML silently keeps the last duplicate, so this script uses a loader that fails
on duplicates. It also checks structure and that referenced npm scripts and node scripts exist.
Usage: python scripts/validate-workflows.py   (run from the repository root)
"""
import glob, json, os, re, sys
import yaml

errors = []

class StrictLoader(yaml.SafeLoader):
    pass

def construct_mapping(loader, node, deep=False):
    seen = {}
    for key_node, _ in node.value:
        key = loader.construct_object(key_node, deep=deep)
        if key in seen:
            errors.append(f"{loader.name}: duplicate key '{key}' on line {key_node.start_mark.line + 1} (first on line {seen[key]})")
        seen[key] = key_node.start_mark.line + 1
    return yaml.SafeLoader.construct_mapping(loader, node, deep)

StrictLoader.add_constructor(yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG, construct_mapping)

def npm_scripts(directory):
    path = os.path.join(directory, "package.json")
    return set(json.load(open(path)).get("scripts", {})) if os.path.exists(path) else set()

files = sorted(glob.glob(".github/workflows/*.yml") + glob.glob(".github/workflows/*.yaml"))
if not files:
    errors.append("no workflow files found; run from the repository root")

for path in files:
    try:
        with open(path, encoding="utf-8") as handle:
            loader = StrictLoader(handle)
            loader.name = path
            try:
                doc = loader.get_single_data()
            finally:
                loader.dispose()
    except yaml.YAMLError as exc:
        errors.append(f"{path}: invalid YAML: {exc}")
        continue
    if not isinstance(doc, dict):
        errors.append(f"{path}: top level must be a mapping")
        continue
    triggers = doc.get("on", doc.get(True))  # PyYAML parses a bare `on` key as boolean True
    if not triggers:
        errors.append(f"{path}: missing 'on' triggers")
    jobs = doc.get("jobs")
    if not isinstance(jobs, dict) or not jobs:
        errors.append(f"{path}: missing 'jobs'")
        continue
    for name, job in jobs.items():
        if not isinstance(job, dict):
            errors.append(f"{path}: job '{name}' must be a mapping"); continue
        if "uses" not in job and "runs-on" not in job:
            errors.append(f"{path}: job '{name}' has no runs-on")
        workdir = (job.get("defaults") or {}).get("run", {}).get("working-directory", ".")
        for need in ([job.get("needs")] if isinstance(job.get("needs"), str) else job.get("needs") or []):
            if need not in jobs:
                errors.append(f"{path}: job '{name}' needs unknown job '{need}'")
        steps = job.get("steps") or []
        if "uses" not in job and not steps:
            errors.append(f"{path}: job '{name}' has no steps")
        for index, step in enumerate(steps, 1):
            if not isinstance(step, dict) or not ("run" in step or "uses" in step):
                errors.append(f"{path}: job '{name}' step {index} needs 'run' or 'uses'"); continue
            if "run" in step and "uses" in step:
                errors.append(f"{path}: job '{name}' step {index} cannot have both 'run' and 'uses'")
            run = step.get("run", "")
            step_dir = step.get("working-directory", workdir)
            for script in re.findall(r"npm run ([\w:.-]+)", run):
                if script not in npm_scripts(step_dir):
                    errors.append(f"{path}: job '{name}' step {index} runs missing npm script '{script}' in {step_dir}")
            for target in re.findall(r"(?:node(?: --check)?|python3?) ((?:[\w.-]+/)*[\w.-]+\.(?:mjs|js|py))", run):
                candidates = [os.path.join(step_dir, target), target]
                if not any(os.path.exists(c) for c in candidates):
                    errors.append(f"{path}: job '{name}' step {index} references missing file '{target}'")

if errors:
    print("Workflow validation FAILED:")
    for error in errors:
        print(" -", error)
    sys.exit(1)
print(f"Workflow validation passed for {len(files)} files: {', '.join(os.path.basename(f) for f in files)}")
