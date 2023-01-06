export const geoFormatImport = async (geoListJSON) => {
  const getJSON = () => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsText(geoListJSON);
      reader.onload = () => resolve(JSON.parse(reader.result));
      reader.onerror = (error) => reject(error);
    });
  };

  const data = await getJSON();

  const finalResult = data.map((country) => {
    return { code: country.countryCode, name: country.countryName };
  });

  return finalResult;
};

export const congFormatImport = async (congListJSON) => {
  const getJSON = () => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsText(congListJSON);
      reader.onload = () => resolve(JSON.parse(reader.result));
      reader.onerror = (error) => reject(error);
    });
  };

  const data = await getJSON();

  const finalResult = data.map((congregation) => {
    return { name: congregation.congName, number: +congregation.congNumber, language: congregation.language };
  });

  return finalResult;
};
