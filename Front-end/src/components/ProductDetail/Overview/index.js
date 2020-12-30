import { CheckOutlined } from '@ant-design/icons';
import { Button, Col, Image, InputNumber, Rate, Row } from 'antd';
import ImgLoadFailed from 'assets/imgs/loading-img-failed.png';
import helpers from 'helpers';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cartActions from 'reducers/carts';
import './index.scss';

// Hàm đếm số sản phẩm đó trong giỏ hàng
function countItemInCart(productCode, carts) {
  let count = 0;
  if (carts) {
    carts.forEach((item) => {
      if (item.code === productCode) count += item.amount;
    });
  }
  return count;
}

function ProductOverview(props) {
  const { products } = props;
  const {
    avt,
    name,
    brand,
    code,
    price,
    rate,
    discount,
    stock,
  } = products.product;

  const { catalogs, ...productRest } = products.productDetail;
  const imgList = [avt, ...catalogs];
  const rateTotal = rate.reduce((a, b) => a + b, 0);
  const priceBefore = price + (price * discount) / 100;
  const rateAvg = helpers.calStar(rate);

  const numOfProduct = useRef(1);
  const [avtIndex, setAvtIndex] = useState(0);
  const carts = useSelector((state) => state.carts);
  const currentStock = stock - countItemInCart(code, carts);

  const dispatch = useDispatch();

  // fn: hiên thị danh sách hình ảnh sp
  const showCatalogs = (catalog) => {
    return catalog.map((item, index) => (
      <Image
        key={index}
        src={item}
        width={48}
        className={`catalog-item p-8 ${index === avtIndex ? 'active' : ''}`}
        onMouseEnter={() => setAvtIndex(index)}
      />
    ));
  };

  // fn: hiển thị vài thông tin cơ bản của sản phẩm
  const showOverviewInfo = (product) => {
    let result = [];
    let i = 0;
    for (let key in product) {
      if (i >= 5) break;
      if (typeof product[key] === 'string') {
        result.push(
          <p key={i++} className="m-b-8">
            {`- ${helpers.convertProductKey(key)}: ${product[key]}`}
          </p>,
        );
      }
    }
    return result;
  };

  // fn: Thêm vào giỏ hàng
  const addCart = () => {
    let product = { code, name, price, amount: numOfProduct.current, avt };
    dispatch(cartActions.addToCart(product));
  };

  // rendering ...
  return (
    <Row className="Product-Overview bg-white p-16">
      {/* Hình ảnh và thông số cơ bản sản phẩm */}
      <Col span={24} md={8}>
        <div
          style={{ height: 268 }}
          className="d-flex align-i-center justify-content-center ">
          <Image
            style={{ maxHeight: '100%' }}
            fallback={ImgLoadFailed}
            src={imgList[avtIndex]}
          />
        </div>
        <div className="d-flex w-100 bg-white p-b-16 p-t-8">
          {showCatalogs(imgList)}
        </div>
        <div className="p-l-16 p-t-16 product-info">
          {showOverviewInfo(productRest)}
        </div>
      </Col>

      {/* Tên và thông tin cơ bản */}
      <Col span={24} md={16} className="p-l-16">
        {/* Tên sp */}
        <h2 className="font-size-24px ">
          {helpers.reduceProductName(name, 140)}
        </h2>

        {/* Đánh giá sản phẩm */}
        <div className="p-tb-8">
          <Rate disabled defaultValue={rateAvg} allowHalf />
          <a href="#evaluation" className="m-l-8">
            (Có {rateTotal} đánh giá)
          </a>
        </div>

        {/* Mã, thương hiệu */}
        <div
          className="font-size-16px font-weight-400"
          style={{ color: '#aaa' }}>
          Thương hiệu:
          <span className="product-brand font-weight-500">&nbsp;{brand}</span>
          &nbsp; | &nbsp;<span>{code}</span>
        </div>

        {/* Giá */}
        <h1 className="product-price font-weight-700 p-tb-8">
          {price === 0 ? 'Liên hệ' : helpers.formatProductPrice(priceBefore)}
        </h1>
        <h3 className="font-weight-700" style={{ color: '#333' }}>
          Bạn có 1 mã giảm giá {discount}% cho sản phẩm này
        </h3>
        <div className="d-flex flex-direction-column m-t-8 m-b-16 p-tb-8 p-lr-16 discount">
          <span className="discount-price font-size-16px font-weight-700">
            Giá: {helpers.formatProductPrice(price)}
          </span>
          <span>
            Đã giảm thêm: {helpers.formatProductPrice(priceBefore - price)}
            &nbsp;
            <span className="discount-decr"></span>
          </span>
          <div className="discount-mark"></div>
          <CheckOutlined className="discount-mark-icon" />
        </div>

        {/* Chọn số lượng */}
        <div className="p-t-12 option">
          {currentStock === 0 ? (
            <h3 className="m-r-8 m-t-8 font-size-18px" style={{ color: 'red' }}>
              <i>Sản phẩm hiện đang hết hàng !</i>
            </h3>
          ) : (
            <>
              <h3 className="m-r-8 m-t-8 font-size-16px">Chọn số lượng: </h3>
              <InputNumber
                name="numOfProduct"
                size="middle"
                defaultValue={1}
                min={1}
                max={currentStock}
                onChange={(value) => (numOfProduct.current = value)}
              />
            </>
          )}
        </div>

        {/* Button*/}
        <div className="btn-group p-tb-16 d-flex justify-content-around">
          <Button
            onClick={addCart}
            disabled={stock ? false : true}
            size="large"
            className="m-r-16 w-100 btn-group-item"
            style={{ backgroundColor: '#3555c5' }}>
            THÊM GIỎ HÀNG
          </Button>
          <Button
            disabled={stock ? false : true}
            size="large"
            className="w-100 btn-group-item"
            style={{ backgroundColor: '#39B3D7' }}>
            MUA NGAY LUÔN
          </Button>
        </div>
      </Col>
    </Row>
  );
}

ProductOverview.propTypes = {
  products: PropTypes.object,
};

export default ProductOverview;