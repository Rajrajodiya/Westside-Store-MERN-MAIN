import { Helmet } from "react-helmet-async";

function SeoHelmet({ title, description }) {
  const defaultTitle = "WestSide Store — Fashion & Lifestyle";
  const defaultDescription = "Shop the latest fashion, beauty, home decor, and more at WestSide Store. India's favourite fashion destination.";

  return (
    <Helmet>
      <title>{title ? `${title} | WestSide Store` : defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta property="og:title" content={title ? `${title} | WestSide Store` : defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}

export default SeoHelmet;
