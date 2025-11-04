import { useQueries, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getArtistDetail, getLibrary } from "../../connector";
import TrackList from "../TrackList/TrackList";
import { useEffect, useState } from "react";
import ArtistCarousel from "../ArtistCarousel/ArtistCarousel";

function useLibrary(rowData) {
  const [queries, setQueries] = useState([]);
  const MAX_LENGTH = 5;

  function getRandomRecordsWithArtistFk(data) {
    // Filter records to only include those with a defined artistFk
    const recordsWithArtistFk = data.records.filter(
      (record) => record.artistFk !== null && record.artistFk !== undefined
    );

    // If there are fewer than 10 records with artistFk, return all of them
    if (recordsWithArtistFk.length <= MAX_LENGTH) {
      return recordsWithArtistFk;
    }

    // Create a copy of the array to avoid modifying the original
    const availableRecords = [...recordsWithArtistFk];
    const randomRecords = [];

    // Select 10 random unique records
    for (let i = 0; i < MAX_LENGTH; i++) {
      if (availableRecords.length === 0) break;

      const randomIndex = Math.floor(Math.random() * availableRecords.length);
      const selectedRecord = availableRecords.splice(randomIndex, 1)[0];
      randomRecords.push(selectedRecord);
    }

    return randomRecords;
  }

  useEffect(() => {
    const randomRecords = getRandomRecordsWithArtistFk(rowData);
    const queries = randomRecords.map((record) => {
      const param = record.artistFk;
      return {
        queryKey: ["artist" + record.artistFk, param],
        queryFn: () => getArtistDetail(param),
      };
    });

    // const libout = useQueries({ queries });

    setQueries(queries);

    console.log("Random Records with artistFk:", { randomRecords, queries });
  }, [rowData]);

  return {
    queries,
  };
}

export default function Library({ onSongSelect, currentSongId, onSongInsert }) {
  const navigate = useNavigate();
  const { page } = useParams();

  const { data, refetch } = useSuspenseQuery({
    queryKey: ["songs", page],
    queryFn: () => getLibrary(page || 1),
  });

  const lib = useLibrary(data);

  const libout = useQueries({ queries: lib.queries });

  const artistItems = libout
    .filter((result) => result.isSuccess)
    .map((result) => result.data.row[0]);

  console.log("Library Artist Details:", { artistItems });

  const bannerProps = {
    artists: artistItems,
  };

  const handlePageChange = (pg) => navigate(`/library/${pg}`);

  return (
    <>
      {bannerProps.artists && <ArtistCarousel {...bannerProps} />}

      <TrackList
        currentSongId={currentSongId}
        records={data.records?.filter(
          (record) => record.Title.toLowerCase().indexOf("json") < 0
        )}
        count={data.count}
        handlePageChange={handlePageChange}
        onSongSelect={onSongSelect}
        onSongInsert={onSongInsert}
        page={page || 1}
        onUpdate={refetch}
      />
    </>
  );
}
