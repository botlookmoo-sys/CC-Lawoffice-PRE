
import { GoogleGenAI } from "@google/genai";

// Always initialize GoogleGenAI with process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLegalAssistantResponse = async (
  history: { role: string; text: string }[],
  userMessage: string
): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    
    // Construct chat history for context
    const recentHistory = history.slice(-10);

    // Prompt engineering for a Legal Assistant
    const systemInstruction = `
      คุณคือ "AI ผู้ช่วยทางกฎหมาย" ประจำสำนักงาน "ชนะชัย ทนายความ" (Chana Chai Law Firm)
      หน้าที่ของคุณ:
      1. ให้ข้อมูลเบื้องต้นเกี่ยวกับกฎหมายไทยอย่างสุภาพและเป็นทางการ
      2. แนะนำบริการของสำนักงาน (คดีแพ่ง, อาญา, ครอบครัว, ธุรกิจ)
      3. ห้ามฟันธงผลคดี หรือรับประกันผลลัพธ์
      4. ทุกครั้งที่ให้คำแนะนำ ต้องลงท้ายเสมอว่า "คำแนะนำนี้เป็นเพียงข้อมูลเบื้องต้น ไม่ใช่คำปรึกษาทางกฎหมายอย่างเป็นทางการ โปรดติดต่อทนายความเพื่อรายละเอียดที่ชัดเจน"
      5. ตอบเป็นภาษาไทย
      6. พยายามแนะนำให้ผู้ใช้กรอกแบบฟอร์มติดต่อ หรือโทรหาสำนักงาน
    `;

    const contents = [
      ...recentHistory.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      })),
      {
        role: 'user',
        parts: [{ text: userMessage }]
      }
    ];

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    // response.text is a property, not a method.
    return response.text || "ขออภัย ระบบไม่สามารถประมวลผลคำตอบได้ในขณะนี้";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ AI";
  }
};

export const summarizeInquiry = async (message: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `สรุปใจความสำคัญของข้อความติดต่อทนายความนี้ให้สั้นกระชับ ไม่เกิน 1 บรรทัด สำหรับแอดมินอ่าน: "${message}"`,
        });
        // Accessing .text property directly.
        return response.text || "ไม่มีข้อมูลสรุป";
    } catch (e) {
        return "สรุปข้อมูลล้มเหลว";
    }
}
