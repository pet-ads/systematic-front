import html2canvas from "html2canvas";

export async function downloadPNG(selector: string, fileName: string) {
  const element = document.querySelector(selector) as HTMLElement | null;
  if (!element) return console.warn(`${selector} not found`);

  try {
    await document.fonts.ready;

    const originalWidth = element.style.width;
    const originalWhiteSpace = element.style.whiteSpace;
    element.style.width = "max-content"; 
    element.style.whiteSpace = "normal"; 

    await new Promise(requestAnimationFrame);

    const canvas = await html2canvas(element, {
      backgroundColor: "#f8f8f8",
      scale: 2,
      useCORS: true,
      logging: false,
      imageTimeout: 0,
    });

 
    element.style.width = originalWidth;
    element.style.whiteSpace = originalWhiteSpace;

    const dataUrl = canvas.toDataURL("image/png", 1.0);
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${fileName}.png`;
    a.click();
  } catch (err) {
    console.error("Error generating PNG:", err);
  }
}

