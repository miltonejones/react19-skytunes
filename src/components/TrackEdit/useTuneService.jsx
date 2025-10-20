const API_URL = "https://u8m0btl997.execute-api.us-east-1.amazonaws.com";
export const useTuneService = () => {
  const getAppleLookup = async (searchTerm) => {
    const response = await fetch(
      `${API_URL}/apple/${encodeURIComponent(searchTerm)}`
    );
    return await response.json();
  };

  const getAlbumorArtistId = async (type, name, image) => {
    const response = await fetch(`${API_URL}/find`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, name, image }),
    });
    return await response.json();
  };

  const updateTable = async (track) => {
    const response = await fetch(`${API_URL}/update/s3Music`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(track),
    });
    return await response.json();
  };

  return {
    getAppleLookup,
    getAlbumorArtistId,
    updateTable,
  };
};
