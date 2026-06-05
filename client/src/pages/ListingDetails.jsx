import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getProfileLink, platformIcons } from '../assets/assets';
import { useSelector } from 'react-redux';
import { ArrowLeftIcon, ArrowUpRightFromSquareIcon, CheckCircle2, ChevronLeftIcon, ChevronRightIcon, DollarSign, Loader2Icon } from 'lucide-react';

const ListingDetails = () => {

  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "$";

  const [listing, setListing] = useState(null);
  const profileLink = listing && getProfileLink(listing.platform, listing.username);

  const { listingId } = useParams();
  const { listings } = useSelector((state) => state.listing);

  const [current, setCurrent] = useState(0);
  const images = listing?.images || [];

  const prevSlide = () => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  useEffect(() => {
    const listing = listings.find((listing) => listing.id === listingId);
    if (listing) {
      setListing(listing);
    }
  }, [listingId, listings])

  return listing ? (
    <div className="max-auto max-h-screen px-6 md:px-16 lg:px-24 xl:px-32">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 py-5">
        <ArrowLeftIcon className="size-4" /> Go to previous Page
      </button>

      <div className="flex items-start max-md:flex-col gap-10">
        <div className="flex-1 max-md:w-full">
          {/* Top Section*/}

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-5">

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

              <div className="flex items-center gap-3">
                <div className='p-2 rounded-xl'>{platformIcons[listing.platform]}</div>
                <div>
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-green-800">{listing.title}
                    <Link target='_blank' to={profileLink}>
                      <ArrowUpRightFromSquareIcon className="size-4 hover:text-indigo-500" />
                    </Link>
                  </h2>
                  <p className="text-sm text-gray-500">
                    @{listing.username} • {listing.platform?.charAt(0).toUpperCase() + listing.platform?.slice(1)}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {listing.verified && (
                      <span className="flex items-center text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    )}
                    {listing.monetized && (
                      <span className="flex items-center text-xs bg-green-50 text-green-600 px-2 py-1 rounded-md">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Monetized
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <h3 className='text-2xl font-bold text-gray-800'>${listing.price?.toLocaleString()}</h3>
                <p className="text-sm text-gray-500">USD</p>
              </div>

            </div>
          </div>

          {/* Screenshot Section */}

          {images?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 mb-5 overflow-hidden">
              <div className="p-4">
                <h4 className="font-semibold text-gray-800">Screenshots & Proof</h4>
              </div>
              {/* Slider Container */}
              <div className="relative w-full aspect-video overflow-hidden">
                <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
                  {images.map((img, index) => (
                    <img key={index} src={img} alt="Listing Proof" className="w-full shrink-0" />
                  ))}
                </div>

                {/* Navigation Buttons*/}

                <button onClick={prevSlide} className="absolute top-1/2 left-3  -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow " >
                  <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
                </button>

                <button onClick={nextSlide} className="absolute top-1/2 right-3  -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow " >
                  <ChevronRightIcon className="w-5 h-5 text-gray-700" />
                </button>

              </div>
            </div>
          )}
        </div>
        {/* Seller Info & Purchase Options */}
        <div></div>
      </div>

    </div>
  ) : (
    <div className="h-screen flex justify-center items-center">
      <Loader2Icon className="size-7 animate-spin text-indigo-600" />
    </div>
  )
}

export default ListingDetails
