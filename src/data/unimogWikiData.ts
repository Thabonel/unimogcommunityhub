
// Static Wikipedia data for Unimogs
// This data was fetched from the Wikipedia API and stored locally to reduce API calls
export const unimogWikiData = {
  title: "Unimog",
  extract: "The Unimog is a range of multi-purpose all-wheel drive medium trucks produced by Mercedes-Benz, a division of Daimler AG. The name Unimog is pronounced [ˈuːnɪmɔk] in German and is an acronym for the German \"UNIversal-MOtor-Gerät\", Gerät being the German word for device or machine. Daimler Benz took over manufacture of the Unimog in 1951 and they are currently built in the Mercedes-Benz truck plant in Wörth am Rhein in Germany. Despite references to the Unimog in Mercedes-Benz passenger car brochures, it is considered a commercial vehicle product line in the M-B hierarchy.",
  thumbnail: {
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Bundesarchiv_B_145_Bild-F079059-0026%2C_Mercedes-Benz_Unimog.jpg/320px-Bundesarchiv_B_145_Bild-F079059-0026%2C_Mercedes-Benz_Unimog.jpg",
    width: 320,
    height: 212
  },
  content_urls: {
    desktop: {
      page: "https://en.wikipedia.org/wiki/Unimog"
    }
  }
};

// Function to get the data without needing to make API calls
export const getUnimogWikiData = () => {
  return unimogWikiData;
};
