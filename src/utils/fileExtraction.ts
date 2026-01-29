import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up PDF.js worker
// In a Vite environment, we might need to handle the worker differently, 
// but let's try this first.
// Set up PDF.js worker using a more reliable HTTPS CDN URL
// pdfjs-dist 4.0.379 and above prefer .mjs for the worker
// Set up PDF.js worker using local import with Vite ?url suffix
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function extractTextFromFile(file: File): Promise<string> {
    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max allowed is 5MB.`);
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    let text = "";

    if (extension === 'pdf') {
        text = await extractTextFromPDF(file);
    } else if (extension === 'docx') {
        text = await extractTextFromDOCX(file);
    } else if (extension === 'doc') {
        throw new Error(".doc files are not supported. Please convert to .docx or .pdf");
    } else {
        // Treat as plain text
        text = await file.text();
    }

    if (!text || text.trim().length < 50) {
        throw new Error("Unable to read text from resume. This might be an image-based/scanned PDF. Please upload a structured text PDF or DOCX.");
    }

    return text;
}

async function extractTextFromPDF(file: File): Promise<string> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');
            fullText += pageText + '\n';
        }

        return fullText;
    } catch (e: any) {
        if (e.name === 'PasswordException') {
            throw new Error("This PDF is password protected. Please remove the password and try again.");
        }
        throw new Error(`Failed to parse PDF: ${e.message}`);
    }
}

async function extractTextFromDOCX(file: File): Promise<string> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
    } catch (e: any) {
        throw new Error(`Failed to parse DOCX: ${e.message}`);
    }
}
