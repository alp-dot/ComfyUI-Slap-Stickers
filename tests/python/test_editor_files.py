from pathlib import Path

import numpy as np
from PIL import Image
import pytest
import torch

from slap_stickers.editor_files import EditorFiles
from slap_stickers.grid import decode_grid
from tests.python.test_grid import geometry


def test_publishes_content_addressed_files_and_recreates_missing_files(tmp_path):
    packet = geometry()
    files = EditorFiles(tmp_path)
    result = files.prepare(packet)
    entry = result["slap_stickers"][0]
    assert entry["meta"]["format"] == 1
    assert entry["meta"]["image_w"] == 6
    assert entry["grid"]["type"] == "temp"
    grid_file = tmp_path / entry["grid"]["subfolder"] / entry["grid"]["filename"]
    preview_file = tmp_path / entry["preview"]["subfolder"] / entry["preview"]["filename"]
    decoded = decode_grid(grid_file.read_bytes(), 6, 4, entry["meta"]["intrinsics"])
    assert decoded.valid.all()
    with Image.open(preview_file) as image:
        assert image.size == (6, 4)
    timestamp = grid_file.stat().st_mtime_ns
    assert files.prepare(packet) == result
    assert grid_file.stat().st_mtime_ns == timestamp
    grid_file.unlink()
    assert files.prepare(packet) == result
    assert grid_file.exists()


def test_cache_is_bounded_and_new_input_changes_key(tmp_path):
    files = EditorFiles(tmp_path)
    packets = [geometry() for _ in range(10)]
    keys = []
    for i, packet in enumerate(packets):
        packet["depth"] += i
        keys.append(files.prepare(packet)["slap_stickers"][0]["meta"]["key"])
    assert len(set(keys)) == 10
    assert files.cached_count == 8


def test_replacing_only_normals_refreshes_the_published_grid(tmp_path):
    packet = geometry()
    files = EditorFiles(tmp_path)
    previous = files.prepare(packet)["slap_stickers"][0]
    packet["normal"] = torch.tensor([.6, 0., -.8]).expand_as(packet["points"]).clone()
    changed = files.prepare(packet)["slap_stickers"][0]
    assert changed["meta"]["key"] != previous["meta"]["key"]
    wire = (tmp_path / changed["grid"]["subfolder"] / changed["grid"]["filename"]).read_bytes()
    grid = decode_grid(wire, 6, 4, changed["meta"]["intrinsics"])
    np.testing.assert_allclose(grid.normals[1, 2], [.6, 0., -.8], atol=1e-6)
    assert files.prepare(packet)["slap_stickers"][0] == changed
    packet.pop("normal")
    assert files.prepare(packet)["slap_stickers"][0] == previous


def test_temp_subfolder_cannot_escape_via_symlink(tmp_path):
    outside = tmp_path / "outside"
    outside.mkdir()
    temp = tmp_path / "temp"
    temp.mkdir()
    (temp / "slap_stickers").symlink_to(outside, target_is_directory=True)
    with pytest.raises(ValueError, match="temp"):
        EditorFiles(temp).prepare(geometry())
    assert not list(outside.iterdir())
