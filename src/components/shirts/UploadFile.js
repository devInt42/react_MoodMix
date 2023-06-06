import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { fabric } from "fabric";
import axios from "axios";

const UploadFile = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const imageContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const imagesStackRef = useRef([]); // 이미지 스택을 관리하기 위한 배열
  const [imageUrl, setImageUrl] = useState("");
  const [mergedImageSrc, setMergedImageSrc] = useState("");

  //기존 이미지 url
  useEffect(() => {
    setImageUrl(props.changeImage);
  }, [props.changeImage]);

  //canvas 범위 설정
  useEffect(() => {
    const newCanvas = new fabric.Canvas(canvasRef.current, {
      width: 250,
      height: 360,
    });
    setCanvas(newCanvas);
  }, []);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const fabricImg = new fabric.Image(img);
        fabricImg.scaleToWidth(canvas.width);
        fabricImg.set({
          left: canvas.width - fabricImg.getScaledWidth(),
        });
        canvas.add(fabricImg);
        imagesStackRef.current.push(fabricImg); // 이미지 스택에 추가
      };
      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  //이전 단계
  const deleteLastImage = () => {
    const lastImage = imagesStackRef.current.pop(); // 이미지 스택에서 마지막 이미지를 제거
    if (canvas !== null && lastImage) {
      canvas.remove(lastImage); // 캔버스에서 이미지 제거
      canvas.renderAll();
    }
  };

  //전체 삭제
  const resetCanvas = () => {
    if (canvas !== null) {
      canvas.clear();
      imagesStackRef.current = []; // 이미지 스택 초기화
    }
  };

  // 합치기 및 백엔드로 보내기
  const saveCanvasAsImage = () => {
    if (canvas !== null && imageUrl !== "") {
      const mergedImage = new Image();

      mergedImage.onload = function () {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = mergedImage.width;
        tempCanvas.height = mergedImage.height;

        const context = tempCanvas.getContext("2d");
        context.drawImage(mergedImage, 0, 0);

        const canvasImage = canvas.toDataURL();
        const canvasImageObj = new Image();

        canvasImageObj.onload = async function () {
          context.drawImage(canvasImageObj, 0, 0);

          const mergedDataURL = tempCanvas.toDataURL();
          setMergedImageSrc(mergedDataURL);
          console.log(mergedDataURL);

          // 이미지 확인 후 백엔드로 전송
          try {
            const response = await axios.post("<백엔드 URL>", {
              image: mergedDataURL,
            });
            console.log(response.data);
            // 여기서 필요한 작업 수행
          } catch (error) {
            console.error(error);
          }
        };

        canvasImageObj.crossOrigin = "anonymous"; // 이미지에 crossOrigin 설정
        canvasImageObj.src = canvasImage;
      };

      mergedImage.crossOrigin = "anonymous"; // 이미지에 crossOrigin 설정
      mergedImage.src = imageUrl;
    }
  };

  useImperativeHandle(ref, () => ({
    deleteLastImage: deleteLastImage,
    resetCanvas: resetCanvas, // resetCanvas 함수를 외부로 노출
  }));

  return (
    <div>
      <div
        ref={imageContainerRef}
        style={{
          width: "260px",
          height: "360px",
          overflow: "hidden",
        }}
      >
        <canvas ref={canvasRef} />
      </div>
      <button className="shirtBtn2" onClick={handleFileInputClick}>
        파일 선택
      </button>
      <button className="shirtBtn2" onClick={saveCanvasAsImage}>
        캔버스 저장
      </button>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
    </div>
  );
});

export default UploadFile;
