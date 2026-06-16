from app.services.pdf_parser import extract_text

text = extract_text(
    "test_data/sample.pdf"
)

with open("output.txt", "w", encoding="utf-8") as f:
    f.write(text)

print("Saved output to output.txt")