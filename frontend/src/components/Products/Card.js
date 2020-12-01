import React from "react";
import { Link } from "react-router-dom";
import "./card.css";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
function Card(props) {
  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  return (
    <div className="card_product_list">
      <div className="card_product mt-5 mb-3 ml-2 mr-2">
        <div className="view view-cascade overlay">
          <img className="card-img-top" src={props.photo_main} alt="" />
          <a>
            <div className="mask rgba-white-slight"></div>
          </a>
        </div>

        <div className="card-body card-body-cascade text-center">
          <h5>{props.category}</h5>
          <h4 className="card-title">
            <strong>
              <a href="">{props.title}</a>
            </strong>
          </h4>

          <p className="card-text">{props.description}</p>

          <div className="card-footer">
            {props.discount_price ? (
              <>
                <span className="mr-2">Price :{props.discount_price} $</span>{" "}
                <span className ='solde-price'>${props.price}</span>
              </>
            ) : (
              <span className="mr-2">Price : ${props.price}</span>
            )}
            <Link to={`/products/${props.id}`}>
              <Button>View description</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  photo_main: PropTypes.string.isRequired,
};

export default Card;
