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

  const platforms = ['youtube', 'instagram', 'tiktok', 'facebook', 'twitter', 'linkedin', 'pinterest', 'twitch', 'discord'];
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
    const listing = userListings.find((listing) => listing.id === id);
    if (listing) {
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
        <form onSubmit={handleSubmit} className='space-y-8'>
          {/* Base Information */}
          <Section title='Base Information'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <InputField label='Listing Title *' value={formData.title} placeholder='e.g., Premium Travel Instagram Account' onChange={(v) => handleInputChange('title', v)} required={true} />

              <SelectField label='Platform *' options={platforms} value={formData.platform} onChange={(v) => handleInputChange('platform', v)} required={true} />
              
              <InputField label='Username/Handle *' value={formData.username} placeholder='@username' onChange={(v) => handleInputChange('username', v)} required={true} />
              
               <SelectField label='Niche/Category *' options={niches} value={formData.niche} onChange={(v) => handleInputChange('niche', v)} required={true} />
            </div>
          </Section>
        </form>
      </div>

    </div>
  )
}

/* Common Elements  */

const Section = ({ title, children }) => (
  <div className='bg-white rounded-lg border border-gray-200 p-6 space-y-6'>
    <h2 className='text-xl font-semibold text-gray-800'>{title}</h2>
    {children}
  </div>
)

const InputField = ({ label, value, onChange, type = 'text', placeholder, required = false, min = null, max = null }) => (
  <div>
    <label className='block text-sm font-medium text-gray-700 mb-2'>{label}</label>
    <input type={type} min={min} max={max} placeholder={placeholder} required={required} value={value} onChange={(e) => onChange(e.target.value)} className='w-full px-3 py-1.5 text-gray-600 border border-md focus:outline-none focus:ring-indigo-500 border-gray-300' />
  </div>
)

const SelectField = ({ label, options, value, onChange, required = false }) => (
  <div>
    <label className='block text-sm font-medium text-gray-700 mb-2'>{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className='w-full px-3 py-1.5 text-gray-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300' required={required}>
      <option value=''> Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      
    </select>
  </div>
)

export default ManageListing
