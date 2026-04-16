import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Reusable SEO component to inject meta-tags into the HTML head.
 * Essential for social media sharing previews and search engines.
 */
const SEO = ({
  title,
  description,
  image,
  url,
  type = 'website',
  author,
  publishedTime,
  category,
}) => {
  const siteTitle = 'Blog Desk';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const defaultDescription = 'A modern platform for sharing thoughts and stories.';
  const siteUrl = window.location.origin;

  // Ensure image is absolute URL for social crawlers
  const seoImage = image?.startsWith('http')
    ? image
    : image
      ? `${siteUrl}${image}`
      : `${siteUrl}/favicon.ico`;

  const seoUrl = url ? `${siteUrl}${url}` : siteUrl;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {author && <meta name="author" content={author} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      {seoImage && <meta property="og:image" content={seoImage} />}
      <meta property="og:url" content={seoUrl} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Article Specific Tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {author && <meta property="article:author" content={author} />}
          {category && <meta property="article:section" content={category} />}
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      {seoImage && <meta name="twitter:image" content={seoImage} />}
    </Helmet>
  );
};

export default SEO;
