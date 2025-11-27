import html2canvas from "html2canvas";

export async function downloadPNG(selector: string, fileName: string) {
  setTimeout(async () => {
    const element = document.querySelector(selector) as HTMLElement | null;
    if (!element) {
      console.warn(`${selector} not found.`);
      return;
    }

    try {
      await document.fonts.ready;
      const canvas = await html2canvas(element, {
        backgroundColor: "#f8f8f8",
        scale: 2,
        useCORS: true,
        logging: false,
        imageTimeout: 0,
      });

      const dataUrl = canvas.toDataURL("image/png", 1.0);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${fileName}.png`;
      a.click();
    } catch (err) {
      console.error("Error generating PNG:", err);
    }
  }, 300);
}
