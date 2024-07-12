import html2canvas from "html2canvas";
import { getTemplate } from "../template/getTemplate";

const prepareTemplateToPost = async (templateId: string, canvas: HTMLCanvasElement | null, container: HTMLDivElement | null) => {

  if (!canvas || !container || !templateId) return;

  const ctx = canvas.getContext('2d');

  const img = new Image()

  const templateImageBlob = await getTemplate(templateId)

  if (typeof (templateImageBlob) === 'string') throw new Error(templateImageBlob)

  if (!templateImageBlob) throw new Error('Template not found')

  img.src = URL.createObjectURL(templateImageBlob);

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;

    const scale = (parseFloat(container.style.width.replace('px', '').trim()) / img.width);

    canvas.style.transformOrigin = 'top left';
    canvas.style.transform = `scale(${scale})`;
    container.style.height = `${img.height * scale}px`;

    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
  }
}

const generateCanvas = async (canvas: HTMLCanvasElement, div: HTMLDivElement) => {
  if (!canvas || !div) return;

  // Use html2canvas to capture the screenshot
  const screenshotCanvas = await html2canvas(
    div,
    {
      height: parseFloat(div.style.height.replace('px', '').trim()),
      removeContainer: false,
      scale: 1.5,
      allowTaint: false
    }
  );

  // Create a new canvas to adjust the size
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = canvas.width;
  finalCanvas.height = canvas.height;
  const ctx = finalCanvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) throw new Error('Context not found');

  // Draw the screenshot onto the new canvas at the correct size
  ctx.drawImage(screenshotCanvas, 0, 0, canvas.width, canvas.height);

  return finalCanvas
}

const downloadImage = async (canvas: HTMLCanvasElement) => {
  // Create a link element to download the image
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = `meme_${Date.now()}.png`;
  link.click();
}

function resizeCanvas(originalCanvas: HTMLCanvasElement, newWidth: number) {
  const originalWidth = originalCanvas.width;
  const originalHeight = originalCanvas.height;
  
  // Calculate the new height to maintain aspect ratio
  const aspectRatio = originalHeight / originalWidth;
  const newHeight = newWidth * aspectRatio;
  
  // Create a new canvas with the new dimensions
  const resizedCanvas = document.createElement('canvas');
  resizedCanvas.width = newWidth;
  resizedCanvas.height = newHeight;
  
  // Draw the original canvas content onto the new canvas
  const context = resizedCanvas.getContext('2d');
  if (!context) throw new Error('Context not found');
  context.drawImage(originalCanvas, 0, 0, originalWidth, originalHeight, 0, 0, newWidth, newHeight);
  
  return resizedCanvas;
}

export {
  prepareTemplateToPost,
  generateCanvas,
  downloadImage,
  resizeCanvas
}