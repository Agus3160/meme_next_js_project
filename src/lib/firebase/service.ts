import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./app";
import { base64ToBlob, getFormattedDate } from "../util";

const saveImage = async (base64Images:string[], contentType:string, uuidCode:string) => {

  const path = getFormattedDate(new Date());

  const storageRefBlur = ref(storage, `${uuidCode}/blur_${path}.${contentType}`);
  const storageRefOriginal = ref(storage, `${uuidCode}/original_${path}.${contentType}`);

  const imageBlurBlob = base64ToBlob(base64Images[1].replace(/^data:image\/\w+;base64,/, ""), contentType);
  const imageOriginalBlob = base64ToBlob(base64Images[0].replace(/^data:image\/\w+;base64,/, ""), contentType);

  const metadata = {
    contentType: contentType
  }

  const snapshotBlurImg = await uploadBytes(storageRefBlur, imageBlurBlob, metadata);
  const snapshotOriginalImg = await uploadBytes(storageRefOriginal, imageOriginalBlob, metadata);

  const downloadBlurUrl = await getDownloadURL(snapshotBlurImg.ref);
  const downloadOriginalUrl = await getDownloadURL(snapshotOriginalImg.ref);

  return {
    urlBlurImg: downloadBlurUrl,
    urlOriginalImg: downloadOriginalUrl,
    pathBlurImg: snapshotBlurImg.ref.fullPath,
    pathOriginalImg: snapshotOriginalImg.ref.fullPath
  }
}

export {
  saveImage
}