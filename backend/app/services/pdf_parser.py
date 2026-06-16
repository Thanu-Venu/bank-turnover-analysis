import pdfplumber

def extract_text(pdf_path,password):
    text=""

    with pdfplumber.open(pdf_path,password=password) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"

    return text