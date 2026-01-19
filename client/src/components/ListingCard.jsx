import React from "react";
import { platformIcons } from "../assets/assets";
import { BadgeCheck, LineChart, User } from "lucide-react";

const ListingCard = ({ listing }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";

  return (
    <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
      {/* Featured Banner */}
      {listing.featured && (
        <>
          <p className="py-1"></p>
          <div className=" absolute top-0 left-0 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-center text-xs font-semibold py-1 tracking-wide uppercase">
            Featured
          </div>
        </>
      )}
      <div className="p-5 pt-8">
        {/*Header */}
        <div classname="flex items-center gap-3 mb-3">
          {platformIcons[listing.platform]}
          <div classname="flex flex-col">
            <h2>{listing.title}</h2>
            <p>
              @{listing.username} -{" "}
              <span className="capitalize">{listing.platform}</span>
            </p>
          </div>
          {listing.verified && (
            <BadgeCheck className="text-green-500 ml-auto w-5 h-5" />
          )}
        </div>

        {/*Stats*/}
        <div className=" flex flex-wrap justify-between max-w-lg items-center gap-3 my-5">
          <div className="flex items-center text-sm text-gray-600">
            <User className="size-6 mr-1 text-gray-400" />
            <span className="text-lg font-medium text-slate-500 mr-1.5">
              {listing.followers_count.toLocaleString()}
            </span>{" "}
            followers
          </div>
          {listing.engagement_rate && (
            <div className="flex items-center text-sm text-gray-600">
              <LineChart className="size-6 mr-1 text-gray-400" />
              <span className="text-lg font-medium text-slate-800 mr-1.5">
                {listing.engagement_rate}
              </span>{" "}
              % engagement
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
