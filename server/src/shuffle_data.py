"""
This script should be used to shuffle the generations in the database.
"""

import json
import random


data = None

with open("data/expert_annotations.json", "r") as f:
    data = f.read()
    data = json.loads(data)
    # now we shuffle the annotations
    for e in data:
        if e["generations"]:
            random.shuffle(e["generations"])

if data:
    with open("data/expert_annotations.json", "w") as f:
        f.write(json.dumps(data, indent=4))

print("Done shuffling the data.")
