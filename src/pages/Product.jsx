import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import { Footer, Navbar } from "../components";

const Product = () => {
  const { id } = useParams();

  const [product, setProduct] = useState({});
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    const controller = new AbortController();

    const getProducts = async () => {
      try {
        setLoading(true);

        // 🔹 Fetch single product
        const response = await fetch(
          `https://fakestoreapi.com/products/${id}`,
          { signal: controller.signal }
        );

        const data = await response.json();
        setProduct(data);
        setLoading(false);

        // 🔹 Fetch similar products
        setLoading2(true);

        const res2 = await fetch("https://fakestoreapi.com/products/");
        const allProducts = await res2.json();

        const filtered = allProducts.filter(
          (item) =>
            item.category === data.category &&
            item.id !== data.id
        );

        setSimilarProducts(filtered);
        setLoading2(false);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      }
    };

    getProducts();

    return () => controller.abort();
  }, [id]);

  // ---------------- LOADING UI ----------------
  const Loading = () => (
    <div className="container my-5 py-2">
      <div className="row">
        <div className="col-md-6 py-3">
          <Skeleton height={400} width={400} />
        </div>
        <div className="col-md-6 py-5">
          <Skeleton height={30} width={250} />
          <Skeleton height={90} />
          <Skeleton height={40} width={70} />
          <Skeleton height={50} width={110} />
          <Skeleton height={120} />
        </div>
      </div>
    </div>
  );

  // ---------------- PRODUCT UI ----------------
  const ShowProduct = () => (
    <div className="container my-5 py-2">
      <div className="row">
        <div className="col-md-6 col-sm-12 py-3">
          <img
            src={product.image}
            alt={product.title}
            className="img-fluid"
            width="400"
            height="400"
          />
        </div>

        <div className="col-md-6 py-5">
          <h4 className="text-uppercase text-muted">
            {product.category}
          </h4>

          <h1 className="display-5">{product.title}</h1>

          <p className="lead">
            {product.rating && product.rating.rate} ⭐
          </p>

          <h3 className="display-6 my-4">
            $ {product.price}
          </h3>

          <p className="lead">{product.description}</p>

          <button
            className="btn btn-outline-dark"
            onClick={() => addProduct(product)}
          >
            Add to Cart
          </button>

          <Link to="/cart" className="btn btn-dark mx-3">
            Go to Cart
          </Link>
        </div>
      </div>
    </div>
  );

  // ---------------- SIMILAR PRODUCTS LOADING ----------------
  const Loading2 = () => (
    <div className="d-flex">
      <Skeleton height={300} width={200} className="mx-2" />
      <Skeleton height={300} width={200} className="mx-2" />
      <Skeleton height={300} width={200} className="mx-2" />
      <Skeleton height={300} width={200} className="mx-2" />
    </div>
  );

  // ---------------- SIMILAR PRODUCTS ----------------
  const ShowSimilarProduct = () => (
    <div className="d-flex">
      {similarProducts.map((item) => (
        <div key={item.id} className="card mx-3 text-center" style={{ width: "200px" }}>
          <img
            src={item.image}
            alt={item.title}
            className="card-img-top p-3"
            height={200}
          />

          <div className="card-body">
            <h6>{item.title.substring(0, 15)}...</h6>
          </div>

          <div className="card-body">
            <Link
              to={`/product/${item.id}`}
              className="btn btn-dark btn-sm m-1"
            >
              Buy Now
            </Link>

            <button
              className="btn btn-dark btn-sm m-1"
              onClick={() => addProduct(item)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // ---------------- MAIN ----------------
  return (
    <>
      <Navbar />

      <div className="container">
        {loading ? <Loading /> : <ShowProduct />}

        <h2 className="mt-5">You may also Like</h2>

        <Marquee pauseOnHover pauseOnClick speed={50}>
          {loading2 ? <Loading2 /> : <ShowSimilarProduct />}
        </Marquee>
      </div>

      <Footer />
    </>
  );
};

export default Product;
