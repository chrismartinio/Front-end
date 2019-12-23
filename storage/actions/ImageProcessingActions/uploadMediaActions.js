export const retrieveGallery = gallery => ({
  type: "RETRIEVE_GALLERY",
  gallery
});

export const selectImage = img => ({ type: "SELECT_IMAGE", img });

export const addImageToSend = img => ({ type: "ADD_IMAGE_TO_SEND", img });

export const clearImgSelection = () => ({ type: "CLEAR_IMG_SELECTION" });

export const clearCaptions = () => ({ type: "CLEAR_CAPTIONS" });

export const updateCaptions = caption => ({ type: "UPDATE_CAPTIONS", caption });

export const promptIndex = index => ({ type: "PROMPT_INDEX", index });

export const toggleCamera = () => ({ type: "TOGGLE_CAMERA" });

export const toggleImages = () => ({ type: "TOGGLE_IMAGES" });

export const toggleCaptions = () => ({ type: "TOGGLE_CAPTIONS" });

export const toggleGallery = () => ({ type: "Toggle_Gallery" });
