import React, { useState, useEffect } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { Button, Image } from "react-bootstrap";
import { load_user } from "../../JS/actions/account";
import { fetchCart } from "../../JS/actions/product";
import { connect } from "react-redux";
import "./card.css";

function ProductsDetails(props) {
  const [listing, setListing] = useState({});
  const [price, setPrice] = useState(0);
  const [redirect, setRedirect] = useState(false);

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    props.load_user();
    const id = props.match.params.id;
    
    axios
      .get(`http://127.0.0.1:8000/products/${id}`)
      .then((res) => {
        setListing(res.data);
        setPrice(numberWithCommas(res.data.price));
      })
      .catch((err) => {});
  }, [props.match.params.id]);

  const AddToCart = () => {
    if (props.account.user && props.account.access) {
      const user_id = props.account.user.id;
      const slug = listing.slug;
      console.log(user_id);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem("access")}`,
          Accept: "application/json",
        },
      };

      axios
        .post(
          `http://127.0.0.1:8000/products/add-to-cart/`,
          { slug, user_id },
          config
        )
        .then((res) => {
          props.fetchCart(props.account.user.id);
          console.log("done", res.data);
        })
        .catch((err) => {});
    } else {
      setRedirect(true);
    }
  };
  return (
    <div>
      {redirect ? <Redirect to="/login" /> : null}
      <div className="container mt-4">
        <div className="row">
          <div className="col">
            <Image className="img-main" src={listing.photo_main} />
          </div>
          {listing.photo_1 ? (
            <div className="col">
              {listing.photo_1 ? (
                <Image className="img-detail" src={listing.photo_1} alt="" />
              ) : null}
              {listing.photo_2 ? (
                <Image className="img-detail" src={listing.photo_2} alt="" />
              ) : null}
              {listing.photo_3 ? (
                <Image className="img-detail" src={listing.photo_3} alt="" />
              ) : null}
              {listing.photo_4 ? (
                <Image className="img-detail" src={listing.photo_4} alt="" />
              ) : null}
            </div>
          ) : null}

          <div className="col">
         {listing.discount_price ?<li className="listingdetail__list__item"> Price :<span className=" solde-price">${price}</span> $ {listing.discount_price} </li>
          :<li className="listingdetail__list__item">Price: ${price}</li>}
            <li className="listingdetail__list__item">
              Description: {listing.description}
            </li>
            <Button className="mt-5" onClick={AddToCart}>
              Add To Cart <i className="fa fa-cart-plus" aria-hidden="true"></i>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => ({
  account: state.account,
});
export default connect(mapStateToProps, { load_user, fetchCart })(
  ProductsDetails
);
