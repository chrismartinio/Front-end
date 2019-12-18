import { updateObject } from "../utility/utility.js";
const initalState = {
  gallery: [],
  selectedImages: [null, null, null, null, null],
  captions: ["Selfie", "Selfie", "Selfie", "Selfie", "Selfie"],
  selectedImage: null,
  promptIndex: 0,
  cameraActive: false,
  imageSelection: false,
  captionSelection: false,
  gallerySelection: false
};

addToArray = (state, key, val) => {
  var tempArr = [...state[key]];
  tempArr[state.promptIndex] = val;
  return tempArr;
};

const uploadMediaReducer = (state = initalState, action) => {
  switch (action.type) {
    case "SELECT_IMAGE":
      return updateObject(state, { selectedImage: action.img });
    case "SELECT_CAPTION":
      return state;
    case "RETRIEVE_GALLERY":
      return updateObject(state, { gallery: action.gallery });
    case "ADD_IMAGE_TO_SEND":
      return updateObject(state, {
        selectedImages: addToArray(state, "selectedImages", action.img)
      });
    case "CLEAR_IMG_SELECTION":
      return updateObject(state, {
        selectedImages: [null, null, null, null, null]
      });
    case "UPDATE_CAPTIONS":
      return updateObject(state, {
        captions: addToArray(state, "captions", action.caption)
      });
    case "CLEAR_CAPTIONS":
      return updateObject(state, {
        captions: ["Selfie", "Selfie", "Selfie", "Selfie", "Selfie"]
      });
    case "PROMPT_INDEX":
      return updateObject(state, { promptIndex: action.index });
    case "TOGGLE_CAMERA":
      return updateObject(state, { cameraActive: !state.cameraActive });
    case "TOGGLE_IMAGES":
      return updateObject(state, { imageSelection: !state.imageSelection });
    case "TOGGLE_CAPTIONS":
      return updateObject(state, { captionSelection: !state.captionSelection });
    case "Toggle_Gallery":
      return updateObject(state, { gallerySelection: !state.gallerySelection });

    default:
      return state;
  }
};

export default uploadMediaReducer;
