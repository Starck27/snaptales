import LoginPage from "../pages/auth/login/login-page";
import RegisterPage from "../pages/auth/register/register-page";
import HomePage from "../pages/home/home-page";
import StoryDetailPage from "../pages/story-detail/story-detail-page";
import AboutPage from "../pages/about/about-page";
import {
  checkAuthenticatedRoute,
  checkUnauthenticatedRouteOnly,
} from "../utils/auth";
import NewPage from "../pages/new/new-page";

const routes = {
  "/login": () => checkUnauthenticatedRouteOnly(new LoginPage()),
  "/register": () => checkUnauthenticatedRouteOnly(new RegisterPage()),
  "/": () => checkAuthenticatedRoute(new HomePage()),
  "/new": () => checkAuthenticatedRoute(new NewPage()),
  "/stories/:id": () => checkAuthenticatedRoute(new StoryDetailPage()),
  "/about": () => checkAuthenticatedRoute(new AboutPage()),
};

export default routes;
