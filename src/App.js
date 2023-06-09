import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import SignUp from "./pages/SignUpPage";
import Login from "./pages/LoginPage";
import FAQ from "./pages/FAQPage";
import QNA from "./pages/QNAPage";
import Tshirt from "./pages/TshirtListPage";
import AllList from "./pages/AllListsPage";
import Outer from "./pages/OuterListPage";
import Pants from "./pages/PantsListPage";
import SweatShirt from "./pages/SweatShirtListPage";
import Header from "./components/header/header";
import "./styles/pages/Header.css";
import Footer from "./components/footer/footer.js";
import MyPage from "./pages/MyPage";
import QNAWriteForm from "./components/QNA/WriteForm";
import SecretForm from "./components/QNA/SecretForm";
import BoardForm from "./components/QNA/BoardForm";
import FAQWriteForm from "./components/FAQ/WriteForm";
import ReplySecretForm from "./components/QNA/ReplySecretForm";
import QNAReplyForm from "./components/QNA/ReplyForm";
import DetailPage from "./components/product/DetailPage";
import WishListPage from "./pages/WishListPage";
import ShoppingListPage from "./pages/ShoppingListPage";
import OrderForm from "./components/order/OrderForm";
import CompleteOrder from "./components/order/CompleteOrder";
import ReviewPage from "./pages/ReviewPage";
import MyReview from "./components/review/MyReview";
import AllReviewPage from "./pages/AllReviewPage";

function App() {
  return (
    <Router>
      <div className="header-container">
        <Header />
      </div>
      <div className="content-container">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/MyPage" element={<MyPage />} />
          <Route path="/login/MyPage/review" element={<ReviewPage />} />
          <Route path="/allReview" element={<AllReviewPage />} />
          <Route path="/my/review" element={<MyReview />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/faq/write" element={<FAQWriteForm />} />
          <Route path="/qna" element={<QNA />} />
          <Route path="/qna/write" element={<QNAWriteForm />} />
          <Route path="/qna/reply" element={<QNAReplyForm />} />
          <Route path="/qna/private" element={<SecretForm />} />
          <Route path="/qna/reply/private" element={<ReplySecretForm />} />
          <Route path="/qna/board" element={<BoardForm />} />
          <Route path="/tshirt" element={<Tshirt />} />
          <Route path="/product" element={<DetailPage />} />
          <Route path="/sweatshirt" element={<SweatShirt />} />
          <Route path="/outer" element={<Outer />} />
          <Route path="/pants" element={<Pants />} />
          <Route path="/all" element={<AllList />} />
          <Route path="/product/wishList" element={<WishListPage />} />
          <Route path="/product/shoppingList" element={<ShoppingListPage />} />
          <Route
            path="/product/shoppingList/checkout"
            element={<OrderForm />}
          />
          <Route
            path="/product/shoppingList/completeOrder"
            element={<CompleteOrder />}
          />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
