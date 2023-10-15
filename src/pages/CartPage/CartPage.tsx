import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { BackToPage } from '../../components/BackToPage/BackToPage';
// eslint-disable-next-line max-len
import { CartDescription } from '../../components/CartDescription/CartDescription';
import { Product } from '../../types/Products';
import './CartPage.scss';
import { NoResults } from '../../components/NoResults/NoResults';
import { useAppSelector } from '../../app/hooks';

export const CartPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.user);
  const userId = user?.id;
  const retrievedData = localStorage.getItem(`cart-${userId}`);
  const cartFromStorage = retrievedData ? JSON.parse(retrievedData) : [];
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [cartPhones, setCartPhones] = useState<Product[]>(cartFromStorage);
  const [checkout, setCheckout] = useState(false);
  let timeoutId: NodeJS.Timeout | null = null;

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const calculateTotal = (cartArray: Product[]) => {
    const newTotalPrice = cartArray.reduce(
      (sum: number, item: Product) => sum + item.price * (item.quantity || 1),
      0,
    );
    const newTotalItems = cartArray.reduce(
      (sum: number, item: Product) => sum + (item.quantity || 1),
      0,
    );

    setTotalPrice(newTotalPrice);
    setTotalItems(newTotalItems);
  };

  const updateCart = (updatedCart: Product[]) => {
    setCartPhones(updatedCart);
    localStorage.setItem(`cart-${userId}`, JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const handleDeleteClick = (name: string) => {
    const updatedCart = cartPhones.filter((product) => product.name !== name);

    updateCart(updatedCart);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleCheckOutClick = () => {
    setCheckout(true);

    timeoutId = setTimeout(() => {
      setCheckout(false);
    }, 3000);
  };

  return (
    <main className="cart-page">
      <div className="cart-page__container">
        <BackToPage />
        <div className="cart-page__title">Cart</div>
        {cartPhones.length > 0 ? (
          <div className="cart-page__row">
            <div className="cart-page__column cart-page__column_big">
              {cartPhones.map((phone) => (
                <CartDescription
                  key={phone.id}
                  phone={phone}
                  handleDeleteClick={handleDeleteClick}
                  updateCart={updateCart}
                />
              ))}
            </div>
            <div
              className={classNames({
                'cart-page__column': true,
                'cart-page__column_small': true,
                'column-cart': true,
              })}
            >
              <div className="column-cart__content">
                <div className="column-cart__price">{`$${totalPrice}`}</div>
                <div
                  data-cy="productQauntity"
                  className="column-cart__quantity"
                >
                  {`Total for ${totalItems} items`}
                </div>
                <button
                  type="button"
                  className="column-cart__checkout"
                  onClick={handleCheckOutClick}
                >
                  Checkout
                </button>
              </div>

              {checkout && (
                <div className="column-cart__content feature-message">
                  We are sorry, but this feature is not implemented yet
                </div>
              )}
            </div>
          </div>
        ) : (
          <NoResults category="cart" />
        )}
      </div>
    </main>
  );
};
