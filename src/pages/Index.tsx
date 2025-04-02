
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to landing page when accessing root
    navigate('/');
  }, [navigate]);

  return null; // This page will redirect, so no need to render anything
};

export default Index;
