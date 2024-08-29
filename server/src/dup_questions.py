import json

data = None
questions = set()

with open("data/expert_annotations_mistral.json", "r") as f:
    data = f.read()
    data = json.loads(data)
    # now we shuffle the annotations
    for e in data:
        if e["question_number"] in questions:
            print("DUP", e["question"])

        if e["question_number"]:
            questions.add(e["question_number"])

print(len(questions))
print(questions)
