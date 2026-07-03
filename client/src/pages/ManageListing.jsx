import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'

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
    verified: '',
    monetized: '',
    country: '',
    age_range: '',
    images: [],
  });

  const platform = ['youtube', 'instagram', 'tiktok', 'facebook', 'twitter', 'linkedin', 'pinterest', 'twitch', 'discord'];
  const niches = ['technology', 'programming', 'web development', 'mobile app development', 'artificial intelligence', 'cybersecurity', 'gaming', 'education', 'business', 'finance', 'investing', 'cryptocurrency', 'marketing', 'digital marketing', 'seo', 'social media', 'health', 'fitness', 'nutrition', 'mental health', 'beauty', 'fashion', 'travel', 'food', 'cooking', 'photography', 'videography', 'music', 'movies', 'books', 'lifestyle', 'productivity', 'motivation', 'self improvement', 'career', 'freelancing', 'entrepreneurship', 'science', 'history', 'news', 'sports', 'parenting', 'pets', 'automobile', 'real estate', 'home decor', 'diy', 'crafts', 'comedy', 'podcast', 'other'];

  const ageRanges = ['13-17 years', '18-24 years', '25-34 years', '35-44 years', '45-54 years', '55-64 years', '65+ years', 'Mixed ages'];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div>
      <h1>Manage Listing page</h1>
    </div>
  )
}

export default ManageListing
