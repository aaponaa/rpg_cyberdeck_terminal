from pathlib import Path
import os


def get_project_root() -> Path:
    return Path(__file__).parent


def get_path(*path: [str]) -> str:
    return os.path.sep.join([str(get_project_root())] + [*path])


def capitalize(s: str) -> str:
    return "" if s is None else (s[0].upper() + s[1:])
