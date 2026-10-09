import React from "react";
import Title from "./Title";
import { useSelector } from "react-redux";
import ListingCard from "./ListingCard";

const LatestListing = () => {
  const { listings } = useSelector((state) => state.listing);

  return (
    <div className="mt-8 mb-8 mx-auto ">
      {/* <Title
        className="text-center mx-auto"
        title="Latest Listing"
        description="Discover the hottest social profile available right now."
      /> */}
      <div className="text-center my-5">
        <h2 className="text-gray-700 text-4xl font-semibold">
          Latest Listing
        </h2>
        <p className=" text-gray-500 text-sm max-w-md mx-auto ">
         Discover the hottest social profile available right now.
        </p>
      </div>
      <div className="flex flex-col gap-6 px-6">
        {listings.slice(0, 4).map((listing, index) => (
          <div key={index} className="mx-auto w-full max-w-3xl rounded-xl">
            <ListingCard listing={listing} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestListing;
