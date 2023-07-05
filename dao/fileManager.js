const fs = require('fs');

const fileManager = {
 
  readDataFromFile: (filePath) => {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error al leer los datos del archivo ${filePath}:`, error);
      return null;
    }
  },


  writeDataToFile: (filePath, data) => {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log('Datos guardados correctamente en el archivo:', filePath);
    } catch (error) {
      console.error(`Error al escribir los datos en el archivo ${filePath}:`, error);
    }
  },

 
  addObjectToFile: (filePath, newObject) => {
    try {
      const data = fileManager.readDataFromFile(filePath);
      if (data) {
        data.push(newObject);
        fileManager.writeDataToFile(filePath, data);
      }
    } catch (error) {
      console.error(`Error al agregar un nuevo objeto al archivo ${filePath}:`, error);
    }
  },

  
  updateObjectInFile: (filePath, objectId, updatedObject) => {
    try {
      const data = fileManager.readDataFromFile(filePath);
      if (data) {
        const index = data.findIndex((obj) => obj.id === objectId);
        if (index !== -1) {
          data[index] = { ...data[index], ...updatedObject };
          fileManager.writeDataToFile(filePath, data);
        }
      }
    } catch (error) {
      console.error(`Error al actualizar el objeto en el archivo ${filePath}:`, error);
    }
  },

  
  deleteObjectFromFile: (filePath, objectId) => {
    try {
      const data = fileManager.readDataFromFile(filePath);
      if (data) {
        const updatedData = data.filter((obj) => obj.id !== objectId);
        fileManager.writeDataToFile(filePath, updatedData);
      }
    } catch (error) {
      console.error(`Error al eliminar el objeto del archivo ${filePath}:`, error);
    }
  },
};

module.exports = fileManager;
