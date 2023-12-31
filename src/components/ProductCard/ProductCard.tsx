import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Product } from '../../types/Products';
import './ProductCard.scss';
import { API_PRODUCT_URL } from '../../helpers/helper';
import favorite from '../../images/favourites.svg';
import favouriteAdded from '../../images/favourites-added.svg';
import { useAppSelector } from '../../app/hooks';

type Props = {
  card: Product;
};

export const ProductCard: React.FC<Props> = ({ card }) => {
  const { user } = useAppSelector((state) => state.user);
  const userId = user?.id;
  const [isClicked, setIsClicked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const favourites = localStorage.getItem(`favourites-${userId}`);
    const favouritesArray = favourites ? JSON.parse(favourites) : [];

    setIsAdded(favouritesArray.some(({ id }: Product) => id === card.id));

    const cartItems = localStorage.getItem(`cart-${userId}`);
    const cartArray = cartItems ? JSON.parse(cartItems) : [];

    setIsClicked(cartArray.some(({ id }: Product) => id === card.id));
  }, [card]);

  const saveFavouritesOnClick = () => {
    const getFavoritesByKey = localStorage.getItem(`favourites-${userId}`);
    const getFavoritesByKeyArray = getFavoritesByKey
      ? JSON.parse(getFavoritesByKey)
      : [];

    const index = getFavoritesByKeyArray.findIndex(
      ({ id }: Product) => id === card.id,
    );

    if (index === -1) {
      getFavoritesByKeyArray.push(card);
      setIsAdded(true);
    } else {
      getFavoritesByKeyArray.splice(index, 1);
      setIsAdded(false);
    }

    localStorage.setItem(
      `favourites-${userId}`,
      JSON.stringify(getFavoritesByKeyArray),
    );
    window.dispatchEvent(new Event('favouritesUpdated'));
  };

  const saveCartOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();

    const getCartByKey = localStorage.getItem(`cart-${userId}`);
    const getCartByKeyArray = getCartByKey ? JSON.parse(getCartByKey) : [];

    if (!getCartByKeyArray.some(({ id }: Product) => id === card.id)) {
      getCartByKeyArray.push({ ...card, quantity: 1 });
      setIsClicked(true);
    }

    localStorage.setItem(`cart-${userId}`, JSON.stringify(getCartByKeyArray));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <div data-cy="cardsContainer" className="card">
      <Link to={`/phones/${card.itemId}`} className="card__image">
        <img
          src={API_PRODUCT_URL + card.image}
          alt={card.name}
          className="card__img"
        />
      </Link>
      <div className="card__body">
        <div className="card__title">{card.name}</div>
        <div className="card__prices prices">
          <div className="prices__discount">${card.price}</div>
          <div className="prices__full-price">${card.fullPrice}</div>
        </div>
        <div className="card__description">
          <div className="card__screen card-screen">
            <div className="card-screen__left">Screen:</div>
            <div className="card-screen__right">{card.screen}</div>
          </div>
          <div className="card__capacity card-capacity">
            <div className="card-capacity__left">Capacity:</div>
            <div className="card-capacity__right">{card.capacity}</div>
          </div>
          <div className="card__ram card-ram">
            <div className="card-ram__left">RAM:</div>
            <div className="card-ram__right">{card.ram}</div>
          </div>
        </div>
      </div>
      <div className="card__footer">
        <button
          type="button"
          className={classNames({
            card__button: true,
            'card-button-template': true,
            'is-active': isClicked,
          })}
          onClick={saveCartOnClick}
        >
          {isClicked ? 'Added to cart' : 'Add to cart'}
        </button>
        <button
          type="button"
          className="card-button-template__like"
          onClick={saveFavouritesOnClick}
          data-cy="addToFavorite"
        >
          <img
            src={isAdded ? favouriteAdded : favorite}
            style={{
              backgroundColor: '#fff',
            }}
            alt="favourite"
            className="card-button-template__favourite"
          />
        </button>
      </div>
    </div>
  );
};
