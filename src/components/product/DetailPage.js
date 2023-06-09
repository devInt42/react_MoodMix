import { useState, useEffect, useRef } from "react";
import "../../styles/pages/Tshirt.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { RiLightbulbLine } from "react-icons/ri";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import UploadFile from "./UploadFile";
import { AiOutlineReload } from "react-icons/ai";
import { AiOutlineArrowLeft } from "react-icons/ai";
import ShoppingListPage from "../../pages/ShoppingListPage";

const DetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [clothId, setClothId] = useState("");
  const [clothColor, setClothColor] = useState(""); //default값
  const [clothName, setClothName] = useState("");
  const [clothPrice, setClothPrice] = useState("");
  const [clothFrontImage, setClothFrontImage] = useState("");
  const [clothBackImage, setClothBackImage] = useState("");
  const [showPopup, setShowPopup] = useState(false); //팝업
  const [showMyBagPopup, setShowMyBagPopup] = useState(false); //장바구니 팝업
  const [colors, setColors] = useState([]); // 색상 list
  const [size, setSize] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [showWishListPopup, setShowWishListPopup] = useState(false);
  const userSeq = sessionStorage.getItem("userSeq");
  const [wishList, setWishList] = useState("");
  //canvas 앞면
  const frontCanvasRef = useRef(null);
  const frontUploadFileRef = useRef(null);
  const [frontCanvasVisible, setFrontCanvasVisible] = useState(true);
  const [mergedFrontImage, setMergedFrontImage] = useState("");
  //canvas 뒷면
  const backCanvasRef = useRef(null);
  const backUploadFileRef = useRef(null);
  const [backCanvasVisible, setBackCanvasVisible] = useState(false);
  const [mergedBackImage, setMergedBackImage] = useState("");
  //장바구니 사이즈개수
  const [sizeCounts, setSizeCounts] = useState({
    S: 0,
    M: 0,
    L: 0,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [myBagFrontVisible, setMyBagFrontVisible] = useState(true);

  useEffect(() => {
    if (totalCount > 0) {
      setTotalPrice(clothPrice * totalCount);
    }
  }, [totalCount, clothPrice]);

  useEffect(() => {
    setMergedFrontImage(clothFrontImage);
    setMergedBackImage(clothBackImage);
  }, []);

  const handleIncreaseCount = (size) => {
    setSizeCounts((prevCounts) => ({
      ...prevCounts,
      [size]: prevCounts[size] + 1,
    }));
    setTotalCount((prevTotalCount) => prevTotalCount + 1);
  };

  const handleDecreaseCount = (size) => {
    setSizeCounts((prevCounts) => ({
      ...prevCounts,
      [size]: Math.max(prevCounts[size] - 1, 0),
    }));
    setTotalCount((prevTotalCount) => prevTotalCount - 1);
  };

  const handleDefaultSize = () => {
    setSizeCounts((prevCounts) => ({
      ...prevCounts,
      [selectedSize]: prevCounts[selectedSize] + 1,
    }));
    if (selectedSize) {
      setTotalCount(1);
    }
  };

  const getFrontImage = (e) => {
    setMergedFrontImage(e);
  };

  const saveMyBagList = async () => {
    const param = {
      data: {
        clothId: clothId,
        userSeq: userSeq,
        mergedFrontImage: mergedFrontImage,
        mergedBackImage: mergedBackImage,
        totalCount: totalCount,
        selectedSize: selectedSize,
        clothColor: clothColor,
      },
    };
    try {
      const res = await axios.post(
        "http://localhost:8080/clothes/myBag/insert",
        param
      );
      if (res.data.resultMsg === "false") {
        alert("로그인 페이지로 이동합니다.");
        navigate("/login");
      }
      if (res.data.resultMsg === "noData") {
        alert("최소 하나의 상품을 선택해주세요.");
      } else {
        alert("장바구니에 저장되었습니다.");
        toggleMyBagPopup();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getBackImage = (e) => {
    setMergedBackImage(e);
  };

  const handleFrontResetCanvas = () => {
    if (frontUploadFileRef.current) {
      frontUploadFileRef.current.resetFrontCanvas();
    }
  };

  const handleFrontPreviousButtonClick = () => {
    if (frontUploadFileRef.current) {
      frontUploadFileRef.current.deleteLastFrontImage();
    }
  };

  const handleBackResetCanvas = () => {
    if (backUploadFileRef.current) {
      backUploadFileRef.current.resetBackCanvas();
    }
  };

  const handleBackPreviousButtonClick = () => {
    if (backUploadFileRef.current) {
      backUploadFileRef.current.deleteLastBackImage();
    }
  };

  useEffect(() => {
    const canvas = frontCanvasRef.current;
    const context = canvas.getContext("2d");

    const drawFrontImage = () => {
      const image = new Image();
      image.src = clothFrontImage;
      image.onload = () => {
        canvas.width = 787;
        canvas.height = 601;
        context.drawImage(image, 0, 0);
      };
    };
    drawFrontImage();
  }, [clothFrontImage]);

  useEffect(() => {
    if (backCanvasRef.current) {
      const canvas = backCanvasRef.current;
      const context = canvas.getContext("2d");

      const drawBackImage = () => {
        const image = new Image();
        image.src = clothBackImage;
        image.onload = () => {
          canvas.width = 787;
          canvas.height = 601;
          context.drawImage(image, 0, 0);
        };
      };
      drawBackImage();
    }
  }, [clothBackImage]);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const toggleWishListPopup = () => {
    setShowWishListPopup(!showWishListPopup);
  };

  const toggleMyBagPopup = () => {
    setShowMyBagPopup(!showMyBagPopup);
    setTotalCount(0);
    setTotalPrice(0);
    setSizeCounts({ S: 0, M: 0, L: 0 });
  };

  const handleFrontButtonClick = () => {
    setClothFrontImage(clothFrontImage);
    setFrontCanvasVisible(true);
    setBackCanvasVisible(false);
    handleBackResetCanvas();
  };

  const handleBackButtonClick = () => {
    setClothBackImage(clothBackImage);
    setFrontCanvasVisible(false);
    setBackCanvasVisible(true);
    handleFrontResetCanvas();
  };

  const selectColor = (color) => {
    setClothColor(color);
  };

  const selectSize = (size) => {
    setSelectedSize(size);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("clothId");
    setClothId(id);
    <ShoppingListPage clothId={clothId} />;
  }, [location]);

  const getDetailInfo = async () => {
    const param = {
      data: {
        clothId: clothId,
        clothColor: clothColor,
      },
    };
    try {
      const res = await axios.post(
        `http://localhost:8080/clothes/detail`,
        param
      );
      if (res.data && res.data.resultData && res.data.resultData.length > 0) {
        setClothName(res.data.resultData[0].cloth_name);
        setClothPrice(res.data.resultData[0].cloth_discount);
        setClothFrontImage(res.data.resultData[0].cloth_FrontImage);
        setClothBackImage(res.data.resultData[0].cloth_BackImage);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getColorByProduct = async () => {
    const param = {
      data: {
        clothId: clothId,
      },
    };
    try {
      const res = await axios.post(
        `http://localhost:8080/clothes/color`,
        param
      );
      const colorsArray = res.data.resultData.map((item) => item.cloth_color);
      setColors(colorsArray);
      setClothColor(colorsArray[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const getSizeByProduct = async () => {
    const param = {
      data: {
        clothId: clothId,
      },
    };
    try {
      const res = await axios.post(`http://localhost:8080/clothes/size`, param);
      const sizeArray = res.data.resultData.map((item) => item.cloth_size);
      setSize(sizeArray);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getColorByProduct();
    getSizeByProduct();
  }, [clothId]);

  useEffect(() => {
    getDetailInfo();
  }, [clothId, clothColor]);

  useEffect(() => {
    setClothFrontImage(clothFrontImage);
  }, []);

  const getWishList = async () => {
    const param = {
      data: {
        userSeq: userSeq,
      },
    };
    try {
      const res = await axios.post(
        "http://localhost:8080/clothes/getWishList",
        param
      );

      setWishList(res.data.resultData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getWishList();
  }, []);

  const insertProduct = async () => {
    const param = {
      data: {
        clothId: clothId,
        userSeq: userSeq,
        wishList: wishList,
      },
    };
    try {
      const res = await axios.post(
        "http://localhost:8080/clothes/wishlist/insert",
        param
      );
      if (res.data.resultMsg === "false") {
        alert("로그인 페이지로 이동합니다.");
        navigate("/login");
      }
      if (res.data.resultMsg === "duplicate") {
        alert("이미 담겨져 있는 상품입니다.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClick = () => {
    toggleWishListPopup();
    insertProduct();
  };

  return (
    <div className="detail-container">
      <div className="cropList" style={{ display: "flex" }}>
        <div style={{ display: frontCanvasVisible ? "block" : "none" }}>
          <AiOutlineReload
            size={"25px"}
            style={{
              color: "#ccc",
              marginBottom: "2px",
              marginLeft: "5px",
            }}
            onClick={handleFrontResetCanvas}
          />
          <div className="cropFont" onClick={handleFrontResetCanvas}>
            처음으로
          </div>
        </div>
        <div
          style={{
            marginLeft: "10px",
            display: frontCanvasVisible ? "block" : "none",
          }}
        >
          <AiOutlineArrowLeft
            size={"25px"}
            style={{ color: "#ccc", marginBottom: "2px", marginLeft: "5px" }}
            onClick={handleFrontPreviousButtonClick}
          />
          <div className="cropFont" onClick={handleFrontPreviousButtonClick}>
            이전으로
          </div>
        </div>
        <div style={{ display: frontCanvasVisible ? "none" : "block" }}>
          <AiOutlineReload
            size={"25px"}
            style={{
              color: "#ccc",
              marginBottom: "2px",
              marginLeft: "5px",
            }}
            onClick={handleBackResetCanvas}
          />
          <div className="cropFont" onClick={handleBackResetCanvas}>
            처음으로
          </div>
        </div>
        <div
          style={{
            marginLeft: "10px",
            display: frontCanvasVisible ? "none" : "block",
          }}
        >
          <AiOutlineArrowLeft
            size={"25px"}
            style={{ color: "#ccc", marginBottom: "2px", marginLeft: "5px" }}
            onClick={handleBackPreviousButtonClick}
          />
          <div className="cropFont" onClick={handleBackPreviousButtonClick}>
            이전으로
          </div>
        </div>
      </div>

      <div className="test222">
        <button className="additional-button" onClick={togglePopup}>
          <RiLightbulbLine size={"25px"} style={{ paddingRight: "10px" }} />
          커스텀 하는 방법
        </button>
        {mergedFrontImage && (
          <div className="newImageSrc">
            <img
              src={mergedFrontImage}
              alt="Merged Image"
              style={{ width: "200px", height: "150px" }}
            />
          </div>
        )}
        {mergedFrontImage && <div className="newImageSrc2">앞면</div>}
        {mergedBackImage && (
          <div className="newImageSrc3">
            <img
              src={mergedBackImage}
              alt="Merged Image"
              style={{ width: "200px", height: "150px" }}
            />
          </div>
        )}
        {mergedBackImage && <div className="newImageSrc4">뒷면</div>}
        <div className="shirtBtns">
          <button className="shirtBtn" onClick={handleFrontButtonClick}>
            앞면
          </button>
          <button className="shirtBtn" onClick={handleBackButtonClick}>
            뒷면
          </button>
        </div>

        {frontCanvasVisible ? (
          <UploadFile
            ref={frontUploadFileRef}
            clothFrontImage={clothFrontImage}
            getFrontImage={getFrontImage}
            frontCanvasVisible={frontCanvasVisible}
          />
        ) : (
          <UploadFile
            ref={backUploadFileRef}
            clothBackImage={clothBackImage}
            getBackImage={getBackImage}
            backCanvasVisible={backCanvasVisible}
          />
        )}

        {showPopup && (
          <div className="popup-container">
            <button className="popup-close-button" onClick={togglePopup}>
              X
            </button>
            <div className="popup-content">
              <div className="custom-title"> # 커스텀 하는 방법</div>
              <div className="custom-content">
                <div className="custom-content2">
                  <AiOutlineCloudUpload
                    size={"20px"}
                    style={{ marginRight: "5px" }}
                  />
                  이미지 업로드
                </div>
                <div className="custom-content3">
                  여행&감성 사진, 내 작품 등 특별한 추억을 패션으로 간직하세요.{" "}
                </div>
              </div>
            </div>
            <ul>
              <li className="textdesc">
                PNG, AI, JPG 형식의 고화질의 이미지 사용을 권장합니다. 이미지
                파일의 적정 해상도는 실제 프린트할 이미지 가로 세로의 긴 면이
                최소 2500px 이상 + 해상도 150dpi 이상으로 지정해주세요.
              </li>
              <li className="textdesc">
                상품마다 이미지 크기가 다르므로, 해당 상품의 이미지 가이드를
                확인해 주세요.
              </li>
              <li className="textdesc">
                작은 원본 이미지를 임의로 크게 확대할 경우 인쇄 시 화질이 깨질
                수 있습니다.
              </li>
              <li className="textdesc">
                모니터, 핸드폰에 따라 실제 인쇄 색상과 다르게 보일 수 있습니다.
              </li>
              <li className="textdesc">
                형광, 반사광, 야광, 홀로그램, 골드, 실버는 겹쳐서 인쇄가
                불가합니다.
              </li>
            </ul>
          </div>
        )}

        {showMyBagPopup && (
          <div className="MyBagpopup-container">
            <button className="popup-close-button" onClick={toggleMyBagPopup}>
              X
            </button>

            <div className="left-section">
              {myBagFrontVisible ? (
                <img
                  src={mergedFrontImage}
                  alt="front Image"
                  className="front-image"
                ></img>
              ) : (
                <img
                  src={mergedBackImage}
                  alt="Back Image"
                  className="front-image"
                ></img>
              )}
            </div>
            <div className="right-section">
              <div className="mybag-title">수량을 선택해 주세요</div>
              <div className="mybag-name">{clothName}</div>
              <div className="quantity-select">
                {size.map((size) => (
                  <div key={size}>
                    <span className="newBtn" onClick={() => selectSize(size)}>
                      {size}
                    </span>{" "}
                    <div className="mini-select">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => handleDecreaseCount(size)}
                      >
                        -
                      </button>

                      <span className="sizeCount">{sizeCounts[size]}</span>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => handleIncreaseCount(size)}
                      >
                        +
                      </button>
                    </div>{" "}
                    <hr />
                  </div>
                ))}
              </div>
              <span className="price">{totalCount}개 상품 금액</span>
              <span className="totalPrice">{totalPrice}원</span>
              <div className="buttons">
                <button
                  type="button"
                  className="btn btn-dark"
                  style={{
                    width: "150px",
                    marginRight: "5px",
                  }}
                >
                  <Link className="wishListLink" to="/product/shoppingList">
                    구매하기
                  </Link>
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  style={{ width: "150px" }}
                  onClick={() => {
                    saveMyBagList();
                  }}
                >
                  장바구니 담기
                </button>
              </div>{" "}
            </div>
            <button
              type="button"
              className="btn btn-dark"
              style={{ marginLeft: "270px" }}
              onClick={() => setMyBagFrontVisible(!myBagFrontVisible)}
            >
              {myBagFrontVisible ? "뒷면" : "앞면"}
            </button>
          </div>
        )}

        <canvas
          ref={frontCanvasRef}
          alt="T-shirt"
          style={{ display: frontCanvasVisible ? "block" : "none" }}
        ></canvas>

        <canvas
          ref={backCanvasRef}
          alt="T-shirt"
          style={{ display: backCanvasVisible ? "block" : "none" }}
        ></canvas>
        {showPopup && <div className="popup-background"></div>}
      </div>
      <div className="text-area">
        <div className="text-title">{clothName}</div>
        <div className="text-price">{clothPrice}원</div>
        <div className="text-color">
          <span>색상 </span>
          <div>
            {colors.map((color) => (
              <button
                key={color}
                className={
                  clothColor === color
                    ? "selected-color circle"
                    : "color circle"
                }
                style={{ backgroundColor: color }}
                onClick={() => selectColor(color)}
              />
            ))}
          </div>
        </div>
        <div className="text-size">사이즈</div>
        <div className="size-buttons">
          {size.map((size) => (
            <button
              key={size}
              className={`size-button ${
                selectedSize === size ? "selected" : ""
              }`}
              onClick={() => selectSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
        <div className="deliver-cost">배송비</div>
        <div className="deliver-cost2">3000원</div>

        <button
          type="button"
          className="btn btn-dark"
          style={{
            width: "200px",
            height: "50px",
            marginTop: "180px",
            marginLeft: "20px",
            marginRight: "8px",
          }}
          onClick={() => {
            toggleMyBagPopup();
            handleDefaultSize();
          }}
        >
          장바구니 담기
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          style={{
            width: "200px",
            height: "50px",
            marginTop: "180px",
            marginRight: "3px",
          }}
          onClick={handleClick}
        >
          찜하기
        </button>
        {showWishListPopup && (
          <div className="popup-container2">
            <button
              className="popup-close-button"
              onClick={toggleWishListPopup}
            >
              X
            </button>
            <div>
              <div className="WishPopup">
                선택하신 상품을 <span className="wishTitle"> 관심상품 </span> 에
                담았습니다.
              </div>
              <div className="WishPopup">
                지금 <span className="wishTitle"> 관심상품 </span>을
                확인하시겠습니까?
              </div>
              <hr style={{ marginTop: "20px", marginBottom: "30px" }} />
              <button
                type="button"
                className="btn btn-outline-secondary"
                style={{ marginRight: "10px" }}
                onClick={toggleWishListPopup}
              >
                쇼핑 계속하기
              </button>
              <button type="button" className="btn btn-dark">
                <Link className="wishListLink" to="/product/wishList">
                  관심상품 확인
                </Link>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPage;
