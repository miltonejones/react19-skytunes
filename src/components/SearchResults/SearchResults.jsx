import { useQueries } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSearch } from "../../connector";
import TrackList from "../TrackList/TrackList";
import TrackGrid from "../TrackGrid/TrackGrid";
import "./SearchResults.css";
import Banner from "../Banner/Banner";

const SearchResults = ({ currentSongId, onSongSelect, onSongInsert }) => {
  const navigate = useNavigate();
  const { param } = useParams();
  const [one, two, three] = useQueries({
    queries: [
      {
        queryKey: ["findmusic", param],
        queryFn: () => getSearch("music", param),
      },
      {
        queryKey: ["findartist", param],
        queryFn: () => getSearch("artist", param),
      },
      {
        queryKey: ["findalbum", param],
        queryFn: () => getSearch("album", param),
      },
    ],
  });

  const handleClick = (type, id) => {
    navigate(`/${type}/detail/${id}`);
  };

  return (
    <div className="search">
      {one?.data && (
        <div>
          <Banner title="Songs" />
          <TrackList
            currentSongId={currentSongId}
            records={one.data.records}
            count={one.data.count}
            onSongSelect={onSongSelect}
            onSongInsert={onSongInsert}
            page={1}
            css="small"
          />
        </div>
      )}
      {two?.data && (
        <div>
          <Banner title="Artists" />
          <TrackGrid
            key={1}
            page={1}
            css="small"
            count={two.data.count}
            items={two.data.records}
            handleClick={(id) => handleClick("artist", id)}
          />
        </div>
      )}
      {three?.data && (
        <div>
          <Banner title="Albums" />
          <TrackGrid
            key={1}
            page={1}
            css="small"
            count={three.data.count}
            items={three.data.records}
            handleClick={(id) => handleClick("album", id)}
          />
        </div>
      )}
    </div>
  );
};

export default SearchResults;
