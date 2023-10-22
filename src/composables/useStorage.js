import { ref } from 'vue';
import { projectStorage } from '../firebase/config';
import getUser from './getUser.js';

const { user } = getUser();

const useStorage = () => {
  const error = ref(null);
  const url = ref(null);
  const filePath = ref(null);
  const uploadValue = ref(0);

  const uploadImage = async (file) => {
    filePath.value = `covers/${user.value.uid}/${file.name}`;
    const storageRef = projectStorage.ref(filePath.value);

    try {
      const res = await storageRef.put(file);
      url.value = await res.ref.getDownloadURL();
    } catch (err) {
      console.log(err.message);
      error.value = err.message;
    }
  };

  const deleteImg = async (path) => {
    const storageRef = projectStorage.ref(path);

    try {
      const res = await storageRef.delete();
      return res;
    } catch (err) {
      console.log(err);
      error.value = 'Does not exist';
    }
  };

  const deleteAudio = async (path) => {
    const storageRef = projectStorage.ref(path);
    try {
      const res = await storageRef.delete();
      return res;
    } catch (err) {
      console.log(err);
      error.value = 'Does not exist';
    }
  };

  return {
    url,
    filePath,
    error,
    uploadValue,
    uploadImage,
    deleteImg,
    deleteAudio,
  };
};

export default useStorage;
