import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { Product } from '../../types/Products';
import { NoResults } from '../../components/NoResults/NoResults';
import { useAppSelector } from '../../app/hooks';
import { BackToPage } from '../../components/BackToPage/BackToPage';

export const Favoutires: React.FC = () => {
  const { user } = useAppSelector((state) => state.user);
  const userId = user?.id;
  const retrievedData = localStorage.getItem(`favourites-${userId}`);
  const favouritesFromStorage = retrievedData ? JSON.parse(retrievedData) : [];
  const [favouritePhones] = useState<Product[]>(favouritesFromStorage);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');

  const filteredByQueryPhones = useMemo(() => {
    return favouritePhones.filter(
      (product) =>
        query === null ||
        query === '' ||
        product.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [favouritePhones, query]);

  return (
    <main className="phones-page">
      <div className="phones-page__container">
        <BackToPage />
        <div className="phones-page__title">Favourites</div>
        <div className="phones-page__subtitle">
          {filteredByQueryPhones.length} models
        </div>
        {filteredByQueryPhones.length > 0 ? (
          <div className="phones-page__row">
            {filteredByQueryPhones.map((phone) => (
              <ProductCard key={phone.id} card={phone} />
            ))}
          </div>
        ) : (
          <NoResults category="favourites" />
        )}
      </div>
    </main>
  );
};
