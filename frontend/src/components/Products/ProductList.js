import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import Card from "./Card";
import Pagination from "../layout/Pagination";
import Spinner from "../layout/spinner";
import "./card.css";
import { connect } from "react-redux";
import { fetchCart } from "../../JS/actions/product";

const Listings = ({ fetchCart, user }) => {
  const [listings, setListings] = useState([]);
  const [count, setCount] = useState(0);
  const [previous, setPrevious] = useState("");
  const [next, setNext] = useState("");
  const [active, setActive] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    if (user) fetchCart(user.id);

    const fetchData = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/products/?page=1`);

        setListings(res.data.results);
        setCount(res.data.count);
        setPrevious(res.data.previous);
        setNext(res.data.next);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const visitPage = (page) => {
    axios
      .get(`http://127.0.0.1:8000/products/?page=${page}`)
      .then((res) => {
        setListings(res.data.results);
        setPrevious(res.data.previous);
        setNext(res.data.next);
        setActive(page);
      })
      .catch((err) => {});
  };

  const previous_number = () => {
    axios
      .get(previous)
      .then((res) => {
        setListings(res.data.results);
        setPrevious(res.data.previous);
        setNext(res.data.next);
        if (previous) setActive(active - 1);
      })
      .catch((err) => {});
  };

  const next_number = () => {
    axios
      .get(next)
      .then((res) => {
        setListings(res.data.results);
        setPrevious(res.data.previous);
        setNext(res.data.next);
        if (next) setActive(active + 1);
      })
      .catch((err) => {});
  };

  return (
    <div className='container'>
      {loading ? (
        <Spinner />
      ) : (
        <main className="listings">
          <Helmet>
            <title>Products Lists - Listings</title>
            <meta name="description" content="Listings page" />
          </Helmet>
          <div className="listings__listings">
            {listings.map((listing) => (
              <Card
                key={listing.id}
                title={listing.title}
                category={listing.category}
                price={listing.price}
                discount_price={listing.discount_price}
                description={listing.description}
                photo_main={listing.photo_main}
                id={listing.id}
              />
            ))}
          </div>
          <section className="listings__pagination">
            <div className="row">
              <Pagination
                itemsPerPage={3}
                count={count}
                visitPage={visitPage}
                previous={previous_number}
                next={next_number}
                active={active}
                setActive={setActive}
              />
            </div>
          </section>
        </main>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.account.user,
});

export default connect(mapStateToProps, { fetchCart })(Listings);
