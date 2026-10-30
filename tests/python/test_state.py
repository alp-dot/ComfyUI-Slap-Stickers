import json
from pathlib import Path

import pytest

from slap_stickers.state import parse_state, serialize_state


CASES = json.loads((Path(__file__).parents[1] / "fixtures/state/normalization.json").read_text())


@pytest.mark.parametrize("case", CASES, ids=lambda c: c["name"])
def test_state_contract(case):
    raw = case["input"] if isinstance(case["input"], str) else json.dumps(case["input"])
    if "error" in case:
        with pytest.raises(ValueError, match="^" + __import__("re").escape(case["error"]) + "$"):
            parse_state(raw)
    else:
        assert parse_state(raw) == case["expected"]
        assert json.loads(serialize_state(parse_state(raw))) == case["expected"]


def test_serialize_rounds_and_retains_unknown_fields():
    state = parse_state(json.dumps({"stickers": [{"id": "a", "source": {"filename": "a.png"}, "size": 0.12345678, "later": {"x": 2}}]}))
    assert json.loads(serialize_state(state))["stickers"][0]["size"] == 0.123457
    assert state["stickers"][0]["size"] == 0.12345678
    assert json.loads(serialize_state(state))["stickers"][0]["later"] == {"x": 2}
