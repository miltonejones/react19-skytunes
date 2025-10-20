import { useState, useActionState } from "react";
import { useTuneService } from "./useTuneService";
import HorizCard from "../HorizCard/HorizCard";

// Main component
const TrackEdit = ({ trackItem, onComplete }) => {
  const tuneService = useTuneService();

  // const [trackItem, setTrackItem] = useState(null);
  const [iTunesResults, setITunesResults] = useState([]);

  // useActionState for form state management
  const [formState, formAction, isPending] = useActionState(
    async (previousState, formData) => {
      try {
        const searchTerm = formData.get("Title");
        if (!searchTerm) {
          return {
            ...previousState,
            success: false,
            message: "Please enter a title to search",
            error: "Missing search term",
          };
        }

        const appleData = await tuneService.getAppleLookup(searchTerm);
        setITunesResults(appleData.results || []);

        return {
          ...previousState,
          success: true,
          message: "Lookup completed successfully",
          data: {
            Title: searchTerm,
            discNumber: formData.get("discNumber"),
            trackNumber: formData.get("trackNumber"),
            artistName: formData.get("artistName"),
            albumName: formData.get("albumName"),
            Genre: formData.get("Genre"),
          },
        };
      } catch (error) {
        return {
          ...previousState,
          success: false,
          message: "Lookup failed",
          error: error.message,
        };
      }
    },
    { success: false, message: "", data: null, error: null }
  );

  const createKey = (name) => {
    return name?.replace(/[\s&-]/g, "").toLowerCase() || "";
  };

  const handleAppleClick = async (track) => {
    try {
      const trackItem = iTunesConvert(track);
      await getAlbum(track, trackItem);
    } catch (error) {
      alert("Error updating track: " + error.message);
    }
  };

  const getAlbum = async (itunes, track) => {
    const albumImage = itunes.artworkUrl100;
    const albumName = itunes.collectionName;
    const albumData = await tuneService.getAlbumorArtistId(
      "album",
      albumName,
      albumImage
    );

    const updatedTrack = {
      ...track,
      albumFk: albumData,
    };

    await getArtist(itunes, updatedTrack);
  };

  const getArtist = async (itunes, track) => {
    const albumImage = itunes.artworkUrl100;
    const artistName = itunes.artistName;
    const artistData = await tuneService.getAlbumorArtistId(
      "artist",
      artistName,
      albumImage
    );

    const updatedTrack = {
      ...track,
      artistFk: artistData,
    };

    await sendToAPI(updatedTrack);
  };

  const sendToAPI = async (track) => {
    const result = await tuneService.updateTable(stripTrack(track));
    alert(JSON.stringify(result));
    setITunesResults([]);
    onComplete && onComplete();
  };

  const stripTrack = (track) => {
    const {
      Genre,
      Title,
      albumFk,
      artistFk,
      discNumber,
      trackNumber,
      ID,
      albumImage,
      trackTime,
    } = track;
    return {
      Genre,
      Title,
      albumFk,
      artistFk,
      discNumber,
      trackNumber,
      ID,
      trackTime,
      albumImage,
    };
  };

  const iTunesConvert = (itunes) => {
    return {
      ...trackItem,
      Title: itunes.trackName,
      trackId: itunes.trackId,
      ID: trackItem.ID,
      albumName: itunes.collectionName,
      albumImage: itunes.artworkUrl100,
      Genre: itunes.primaryGenreName,
      genreKey: createKey(itunes.primaryGenreName),
      discNumber: itunes.discNumber,
      trackTime: itunes.trackTimeMillis,
      trackNumber: itunes.trackNumber,
      artistName: itunes.artistName,
      explicit: false,
    };
  };

  if (!trackItem) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      {/* Form Section */}
      <div className="w-full lg:w-1/4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6">
            <form action={formAction}>
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label
                    htmlFor="Title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    name="Title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    id="Title"
                    defaultValue={trackItem?.Title}
                    required
                  />
                </div>

                {/* Disc Number & Track Number */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="discNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Disc Number
                    </label>
                    <input
                      type="text"
                      name="discNumber"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      id="discNumber"
                      defaultValue={trackItem?.discNumber}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="trackNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Track Number
                    </label>
                    <input
                      type="text"
                      name="trackNumber"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      id="trackNumber"
                      defaultValue={trackItem?.trackNumber}
                    />
                  </div>
                </div>

                {/* Artist Name */}
                <div>
                  <label
                    htmlFor="artistName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Artist Name
                  </label>
                  <input
                    type="text"
                    name="artistName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    id="artistName"
                    defaultValue={trackItem?.artistName}
                  />
                </div>

                {/* Album Name */}
                <div>
                  <label
                    htmlFor="albumName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Album Name
                  </label>
                  <input
                    type="text"
                    name="albumName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    id="albumName"
                    defaultValue={trackItem?.albumName}
                  />
                </div>

                {/* Genre */}
                <div>
                  <label
                    htmlFor="Genre"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Genre
                  </label>
                  <input
                    type="text"
                    name="Genre"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    id="Genre"
                    defaultValue={trackItem?.Genre}
                  />
                </div>

                {/* Form Status Message */}
                {formState.message && (
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      formState.success
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                  >
                    {formState.message}
                  </div>
                )}

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => onComplete && onComplete()}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Searching...
                      </div>
                    ) : (
                      "Apple Lookup"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="w-full lg:w-3/4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {iTunesResults.map((item, index) => (
            <HorizCard
              key={index}
              title={item.trackName}
              src={item.artworkUrl100}
              caption={item.artistName}
              subcaption={item.collectionName}
              onCardClick={() => handleAppleClick(item)}
            />
          ))}
        </div>

        {iTunesResults.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎵</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No results yet
            </h3>
            <p className="text-gray-500">
              Enter a title and click "Apple Lookup" to search for tracks
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackEdit;
