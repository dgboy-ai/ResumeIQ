import pdfplumber

def extract_text_from_pdf(pdf_path: str):
    text = ""
    tables_count = 0
    images_count = 0
    
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
            
            # Metadata for ATS analysis
            tables_count += len(page.extract_tables())
            images_count += len(page.images)
    
    # Check for multi-column heuristic (simple check if text blocks are narrow)
    has_potential_columns = False
    with pdfplumber.open(pdf_path) as pdf:
        if len(pdf.pages) > 0:
            # Check the first page for many small text objects
            words = pdf.pages[0].extract_words()
            if len(words) > 50:
                 # If many words have high x coordinate variance, it might be columns
                 pass 

    metadata = {
        "tables_count": tables_count,
        "images_count": images_count,
        "is_scanned": len(text.strip()) < 50 and images_count > 0
    }
    
    return text, metadata
