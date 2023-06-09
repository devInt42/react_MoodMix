import { useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Payment = ({
  userSeq,
  orderPersonName,
  orderedPhone,
  deliveryType,
  recipientName,
  recipientPhone1,
  recipientPhone2,
  totalPrice,
  totalCount,
  deliveredMemo,
  detailAddress,
  address,
  postcode,
}) => {
  useEffect(() => {
    const jquery = document.createElement("script");
    jquery.src = "https://code.jquery.com/jquery-1.12.4.min.js";
    const iamport = document.createElement("script");
    iamport.src = "https://cdn.iamport.kr/js/iamport.payment-1.1.7.js";
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
    return () => {
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
    };
  }, []);

  const navigate = useNavigate();

  const onClickPayment = () => {
    const { IMP } = window;
    const merchantKey = "imp88784171";
    IMP.init(merchantKey);

    const requiredValues = [
      totalPrice,
      recipientName,
      recipientPhone1,
      address,
      detailAddress,
      postcode,
    ];

    const hasEmptyValue = requiredValues.some((value) => value === "");

    if (hasEmptyValue) {
      alert("필수값을 모두 입력해주세요");
      return;
    }

    const data = {
      pg: "html5_inicis",
      pay_method: "card",
      merchant_uid: "merchant_" + new Date().getTime(),
      name: "플렉시핏 결제",
      amount: totalPrice,
      buyer_name: recipientName,
      buyer_tel: recipientPhone1,
      buyer_addr: address + " " + detailAddress,
      buyer_postcode: postcode,
      m_redirect_url: "/product/shoppingList/completeOrder",
    };
    IMP.request_pay(data, callback);
  };

  const sendOrderInfoData = async () => {
    const param = {
      data: {
        userSeq: userSeq,
        orderPersonName: orderPersonName,
        orderedPhone: orderedPhone,
        deliveryType: deliveryType,
        recipientName: recipientName,
        recipientPhone1: recipientPhone1,
        recipientPhone2: recipientPhone2,
        totalPrice: totalPrice,
        totalCount: totalCount,
        deliveredMemo: deliveredMemo,
        detailAddress: detailAddress,
        address: address,
        postcode: postcode,
      },
    };
    //INSERT
    try {
      const res = await axios.post("http://localhost:8080/order/insert", param);
    } catch (err) {
      console.error(err);
    }
  };

  const callback = (response) => {
    const { success, error_msg } = response;

    if (success) {
      alert("결제 성공");
      sendOrderInfoData();
      navigate("/product/shoppingList/completeOrder");
    } else {
      alert(`결제 실패 : ${error_msg}`);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="btn btn-dark"
        style={{ width: "100%", marginTop: "13px", height: "60px" }}
        onClick={onClickPayment}
      >
        결제하기
      </button>
    </div>
  );
};

export default Payment;
