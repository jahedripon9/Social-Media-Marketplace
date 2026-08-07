import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Loader2Icon } from 'lucide-react';

const ManageListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userListings } = useSelector((state) => state.listing);

  const [loadingListing, setLoadingListing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    platform: '',
    username: '',
    followers_count: '',
    engagement_rate: '',
    monthly_views: '',
    niche: '',
    price: '',
    description: '',
    verified: false,
    monetized: false,
    country: '',
    age_range: '',
    images: [],
  });

  const platformsx = ['youtube', 'instagram', 'tiktok', 'facebook', 'twitter', 'linkedin', 'pinterest', 'twitch', 'discord'];
  const niches = ['technology', 'programming', 'web development', 'mobile app development', 'artificial intelligence', 'cybersecurity', 'gaming', 'education', 'business', 'finance', 'investing', 'cryptocurrency', 'marketing', 'digital marketing', 'seo', 'social media', 'health', 'fitness', 'nutrition', 'mental health', 'beauty', 'fashion', 'travel', 'food', 'cooking', 'photography', 'videography', 'music', 'movies', 'books', 'lifestyle', 'productivity', 'motivation', 'self improvement', 'career', 'freelancing', 'entrepreneurship', 'science', 'history', 'news', 'sports', 'parenting', 'pets', 'automobile', 'real estate', 'home decor', 'diy', 'crafts', 'comedy', 'podcast', 'other'];

  const ageRanges = ['13-17 years', '18-24 years', '25-34 years', '35-44 years', '45-54 years', '55-64 years', '65+ years', 'Mixed ages'];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;
    if (files.length + formData.images.length > 5) return toast.error('You can only upload up to 5 images.');
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
  }

  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  }

  // get listing data for edit if `id` is provided (edit mode)

  useEffect(() => {
    if (!id) return;

    setIsEditing(true);
    setLoadingListing(true);
    const listing = userListings.find((listing) => listing._id === id);
    if (!listing) {
      setFormData(listing);
      setLoadingListing(false);
    } else {
      toast.error('Listing not found');
      navigate('/my-listings');
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  }

  if (loadingListing) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <Loader2Icon className='animate-spin size-7 text-indigo-600' />
      </div>
    )
  }

  return (
    <div className='min-h-screen py-8'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800'>
          {isEditing ? 'Edit Listing' : 'List Your Account'}
        </h1>
        <p className='text-gray-600 mt-2'>
          {isEditing ? 'Update your existing account listing' : 'Create a mock listing to display your account information'}
        </p>
      </div>
      </div>

    </div>
  )
}

export default ManageListing
