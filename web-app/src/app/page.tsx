import { getProducts } from '@/lib/products';
import HomeClient from './HomeClient';

export default async function Home() {
  const products = await getProducts();
  const featuredProducts = products.slice(0, 4);

  return <HomeClient featuredProducts={featuredProducts} />;
}
