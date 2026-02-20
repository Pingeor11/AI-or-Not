import os
import json
import random

real_dir = "sample_300/real"
fake_dir = "sample_300/fake"
exts = (".jpg", ".jpeg", ".png", ".webp")

EXCLUDE_FILES = {
    "11328.jpg"
}

def list_images(folder):
    return [
        f for f in os.listdir(folder)
        if f.lower().endswith(exts)
        and f not in EXCLUDE_FILES
    ]

questions = []

for filename in list_images(real_dir):
    questions.append({
        "type": "image",
        "content": f"{real_dir}/{filename}",
        "answer": "not"
    })

for filename in list_images(fake_dir):
    questions.append({
        "type": "image",
        "content": f"{fake_dir}/{filename}",
        "answer": "ai"
    })

random.shuffle(questions)

with open("questions.json", "w", encoding="utf-8") as f:
    json.dump(questions, f, indent=2)

print("questions.json created with", len(questions), "items")
