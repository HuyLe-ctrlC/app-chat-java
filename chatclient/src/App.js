import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ChatRoom } from "./components/ChatRoom";
import * as ROUTES from "./constants/routes";

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/SignUp"));
// const ChatRoom = lazy(() => import("./components/ChatRoom"));

function App() {
  return (
    <Router>
      <Suspense fallback={<p>Loading ...</p>}>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.SIGN_UP} element={<Signup />} />
          <Route path={ROUTES.DASHBOARD} element={<ChatRoom />} />
        </Routes>
      </Suspense>
    </Router>
    // <div>
    //   <ChatRoom />
    // </div>
  );
}

export default App;
