import html2canvas from "html2canvas";
import { getTemplate } from "../template/getTemplate";

const prepareTemplateToPost = async (templateId: string, canvas: HTMLCanvasElement, container: HTMLDivElement) => {

  if (!canvas || !container || !templateId) return;

  const ctx = canvas.getContext('2d');

  const img = new Image()

  const templateImageBlob = await getTemplate(templateId)

  if(!templateImageBlob) return

  if(typeof(templateImageBlob) === 'string') throw new Error(templateImageBlob)

  img.src = URL.createObjectURL(templateImageBlob);

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;

    const scale = (Number(container.style.width) / img.width);

    canvas.style.transformOrigin = 'top left';
    canvas.style.transform = `scale(${scale})`;
    container.style.height = `${img.height * scale}px`;

    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
  }
}

const downloadImage = async (canvas: HTMLCanvasElement, div: HTMLDivElement) => {
  
  if (!canvas || !div) return;

  // Use html2canvas to capture the screenshot
  const screenshotCanvas = await html2canvas(
    div,
    {
      scale: 6,
      allowTaint: false
    }
  );

  // Create a new canvas to adjust the size
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = canvas.width;
  finalCanvas.height = canvas.height;
  const ctx = finalCanvas.getContext('2d');

  if (ctx) {
    // Draw the screenshot onto the new canvas at the correct size
    ctx.drawImage(screenshotCanvas, 0, 0, canvas.width, canvas.height);

    // Create a link element to download the image
    const link = document.createElement('a');
    link.href = finalCanvas.toDataURL('image/png');
    link.download = `meme_${Date.now()}.png`;
    link.click();
  }
}

export {
  prepareTemplateToPost,
  downloadImage
}