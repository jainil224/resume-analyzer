import jsPDF from 'jspdf';

interface AnalysisData {
  overall_score: number;
  skills_match: number;
  experience_score: number;
  ats_score: number;
  formatting_score: number;
  matched_skills: string[];
  missing_skills: string[];
  strengths: string[];
  weaknesses: string[];
  ai_suggestions: string[];
}

export const generateAnalysisPDF = (data: AnalysisData, jobTitle?: string) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = 20;

  // Helper functions
  const addText = (text: string, x: number, y: number, options?: { fontSize?: number; fontStyle?: 'normal' | 'bold'; color?: [number, number, number]; maxWidth?: number }) => {
    const { fontSize = 12, fontStyle = 'normal', color = [0, 0, 0], maxWidth = contentWidth } = options || {};
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', fontStyle);
    pdf.setTextColor(...color);
    
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return lines.length * (fontSize * 0.4);
  };

  const addSection = (title: string, y: number) => {
    pdf.setFillColor(99, 102, 241);
    pdf.rect(margin, y, contentWidth, 8, 'F');
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text(title, margin + 4, y + 5.5);
    return y + 14;
  };

  const checkPageBreak = (neededSpace: number) => {
    if (yPos + neededSpace > 280) {
      pdf.addPage();
      yPos = 20;
    }
  };

  // Header
  pdf.setFillColor(30, 41, 59);
  pdf.rect(0, 0, pageWidth, 45, 'F');
  
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('Resume Analysis Report', margin, 25);
  
  if (jobTitle) {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(200, 200, 200);
    pdf.text(`Position: ${jobTitle}`, margin, 35);
  }
  
  pdf.setFontSize(10);
  pdf.setTextColor(200, 200, 200);
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin - 50, 35);

  yPos = 55;

  // Overall Score Section
  pdf.setFillColor(240, 249, 255);
  pdf.roundedRect(margin, yPos, contentWidth, 35, 3, 3, 'F');
  
  const scoreColor: [number, number, number] = data.overall_score >= 70 ? [34, 197, 94] : data.overall_score >= 50 ? [234, 179, 8] : [239, 68, 68];
  
  pdf.setFontSize(36);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...scoreColor);
  pdf.text(`${data.overall_score}`, margin + 15, yPos + 25);
  
  pdf.setFontSize(14);
  pdf.setTextColor(100, 100, 100);
  pdf.text('/100', margin + 45, yPos + 25);
  
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(30, 41, 59);
  pdf.text('Overall Score', margin + 70, yPos + 18);
  
  const scoreMessage = data.overall_score >= 80 ? 'Excellent Match!' : 
                       data.overall_score >= 60 ? 'Good Potential' : 
                       data.overall_score >= 40 ? 'Needs Improvement' : 'Significant Changes Needed';
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(...scoreColor);
  pdf.text(scoreMessage, margin + 70, yPos + 28);

  yPos += 45;

  // Score Breakdown
  yPos = addSection('Score Breakdown', yPos);
  
  const scores = [
    { label: 'Skills Match', score: data.skills_match, max: 40 },
    { label: 'Experience', score: data.experience_score, max: 30 },
    { label: 'ATS Compatibility', score: data.ats_score, max: 20 },
    { label: 'Formatting', score: data.formatting_score, max: 10 },
  ];

  const barWidth = (contentWidth - 20) / 4;
  scores.forEach((item, index) => {
    const x = margin + index * barWidth + 5;
    const percentage = (item.score / item.max) * 100;
    
    // Background bar
    pdf.setFillColor(229, 231, 235);
    pdf.roundedRect(x, yPos + 20, barWidth - 10, 8, 2, 2, 'F');
    
    // Progress bar
    const progressColor: [number, number, number] = percentage >= 70 ? [34, 197, 94] : percentage >= 50 ? [234, 179, 8] : [239, 68, 68];
    pdf.setFillColor(...progressColor);
    pdf.roundedRect(x, yPos + 20, (barWidth - 10) * (percentage / 100), 8, 2, 2, 'F');
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 41, 59);
    pdf.text(item.label, x, yPos + 8);
    
    pdf.setFontSize(11);
    pdf.text(`${item.score}/${item.max}`, x, yPos + 17);
  });

  yPos += 40;

  // Matched Skills
  checkPageBreak(40);
  yPos = addSection('Matched Skills', yPos);
  
  if (data.matched_skills.length > 0) {
    let xPos = margin;
    data.matched_skills.forEach((skill) => {
      const textWidth = pdf.getTextWidth(skill) + 10;
      if (xPos + textWidth > pageWidth - margin) {
        xPos = margin;
        yPos += 10;
        checkPageBreak(15);
      }
      
      pdf.setFillColor(220, 252, 231);
      pdf.roundedRect(xPos, yPos, textWidth, 8, 2, 2, 'F');
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(22, 101, 52);
      pdf.text(skill, xPos + 5, yPos + 5.5);
      xPos += textWidth + 4;
    });
    yPos += 15;
  } else {
    addText('No matched skills found', margin, yPos + 5, { color: [100, 100, 100] });
    yPos += 10;
  }

  // Missing Skills
  checkPageBreak(40);
  yPos = addSection('Missing Skills', yPos);
  
  if (data.missing_skills.length > 0) {
    let xPos = margin;
    data.missing_skills.forEach((skill) => {
      const textWidth = pdf.getTextWidth(skill) + 10;
      if (xPos + textWidth > pageWidth - margin) {
        xPos = margin;
        yPos += 10;
        checkPageBreak(15);
      }
      
      pdf.setFillColor(254, 243, 199);
      pdf.roundedRect(xPos, yPos, textWidth, 8, 2, 2, 'F');
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(146, 64, 14);
      pdf.text(skill, xPos + 5, yPos + 5.5);
      xPos += textWidth + 4;
    });
    yPos += 15;
  } else {
    addText('No missing skills identified', margin, yPos + 5, { color: [100, 100, 100] });
    yPos += 10;
  }

  // Strengths
  checkPageBreak(50);
  yPos = addSection('Strengths', yPos);
  
  data.strengths.forEach((strength, index) => {
    checkPageBreak(15);
    pdf.setFillColor(240, 253, 244);
    const textHeight = addText(`${index + 1}. ${strength}`, margin + 5, yPos + 5, { maxWidth: contentWidth - 10 });
    pdf.setTextColor(34, 197, 94);
    pdf.text('✓', margin, yPos + 5);
    yPos += textHeight + 8;
  });

  // Weaknesses
  checkPageBreak(50);
  yPos = addSection('Areas to Improve', yPos);
  
  data.weaknesses.forEach((weakness, index) => {
    checkPageBreak(15);
    pdf.setFillColor(255, 251, 235);
    const textHeight = addText(`${index + 1}. ${weakness}`, margin + 5, yPos + 5, { maxWidth: contentWidth - 10 });
    pdf.setTextColor(234, 179, 8);
    pdf.text('!', margin, yPos + 5);
    yPos += textHeight + 8;
  });

  // AI Suggestions
  checkPageBreak(50);
  yPos = addSection('AI-Powered Suggestions', yPos);
  
  data.ai_suggestions.forEach((suggestion, index) => {
    checkPageBreak(20);
    pdf.setFillColor(245, 243, 255);
    pdf.roundedRect(margin, yPos, contentWidth, 4 + Math.ceil(suggestion.length / 80) * 5, 2, 2, 'F');
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(88, 28, 135);
    pdf.text(`${index + 1}.`, margin + 3, yPos + 5);
    const textHeight = addText(suggestion, margin + 12, yPos + 5, { maxWidth: contentWidth - 20, color: [30, 41, 59] });
    yPos += textHeight + 10;
  });

  // Footer with copyright
  const pageCount = pdf.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 285, { align: 'center' });
    pdf.text('Generated by Resume Analyzer', margin, 285);
    
    // Copyright claim
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text('© Developed by Jainil Patel', pageWidth - margin - 45, 285);
  }

  // Save the PDF
  const fileName = jobTitle ? `resume-analysis-${jobTitle.toLowerCase().replace(/\s+/g, '-')}.pdf` : 'resume-analysis-report.pdf';
  pdf.save(fileName);
  
  // Save to download history
  saveToDownloadHistory(jobTitle, data.overall_score, fileName);
  
  return fileName;
};

// Download history management
export interface DownloadHistoryItem {
  id: string;
  fileName: string;
  jobTitle: string;
  score: number;
  downloadedAt: string;
}

const DOWNLOAD_HISTORY_KEY = 'resume_analyzer_download_history';

export const saveToDownloadHistory = (jobTitle: string | undefined, score: number, fileName: string) => {
  const history = getDownloadHistory();
  const newItem: DownloadHistoryItem = {
    id: crypto.randomUUID(),
    fileName,
    jobTitle: jobTitle || 'General Analysis',
    score,
    downloadedAt: new Date().toISOString(),
  };
  
  // Keep only last 20 downloads
  const updatedHistory = [newItem, ...history].slice(0, 20);
  localStorage.setItem(DOWNLOAD_HISTORY_KEY, JSON.stringify(updatedHistory));
};

export const getDownloadHistory = (): DownloadHistoryItem[] => {
  try {
    const stored = localStorage.getItem(DOWNLOAD_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const clearDownloadHistory = () => {
  localStorage.removeItem(DOWNLOAD_HISTORY_KEY);
};

export const deleteDownloadHistoryItem = (id: string) => {
  const history = getDownloadHistory();
  const updatedHistory = history.filter(item => item.id !== id);
  localStorage.setItem(DOWNLOAD_HISTORY_KEY, JSON.stringify(updatedHistory));
};
