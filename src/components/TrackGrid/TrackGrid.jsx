import React, { use } from "react";
import Card from "../Card/Card";
import Paginator from "../Paginator/Paginator";
import { useParams } from "react-router-dom";

const TrackGrid = ({
  page,
  css,
  items,
  count,
  handleClick,
  handlePageChange,
}) => {
  if (!items || items.length === 0) {
    return <>No items to display</>;
  }
  return (
    <>
      <Paginator
        onPageClick={handlePageChange}
        count={count}
        currentPage={page || 1}
      />
      <div className={"row-6 " + css}>
        {items.map((datum) => (
          <Card
            key={datum.ID}
            image={datum.Thumbnail || datum.albumImage || datum.image}
            title={datum.Name || datum.Genre || datum.Title}
            caption={`${datum.TrackCount} tracks`}
            onClick={() => handleClick(datum.ID)}
          />
        ))}
      </div>{" "}
    </>
  );
};

export default TrackGrid;
