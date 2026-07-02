import { app, page, route, query, action } from "@wasp.sh/spec";
import { App } from "./src/App" with { type: "ref" };
import { EmailVerificationPage } from "./src/auth/email/EmailVerificationPage" with { type: "ref" };
import { LoginPage } from "./src/auth/email/LoginPage" with { type: "ref" };
import { PasswordResetPage } from "./src/auth/email/PasswordResetPage" with { type: "ref" };
import { RequestPasswordResetPage } from "./src/auth/email/RequestPasswordResetPage" with { type: "ref" };
import { SignupPage } from "./src/auth/email/SignupPage" with { type: "ref" };
import { userSignupFields } from "./src/auth/email/userSignupFields" with { type: "ref" };
import { LandingPage } from "./src/client/pages/LandingPage" with { type: "ref" };
import { CatalogPage } from "./src/client/pages/CatalogPage" with { type: "ref" };
import { DashboardPage } from "./src/client/pages/DashboardPage" with { type: "ref" };
import { AddWorkPage } from "./src/client/pages/AddWorkPage" with { type: "ref" };

// Import Queries
import { getWorks, getWork, getCategories, getCollections, getFavorites } from "./src/server/queries" with { type: "ref" };
// Import Actions
import { createWork, updateWork, deleteWork, toggleFavorite } from "./src/server/actions" with { type: "ref" };

export default app({
  name: "kickApp",
  title: "kick-app",
  wasp: { version: "^0.24.0" },
  head: ["<link rel='icon' href='/favicon.ico' />"],
  auth: {
    userEntity: "User",
    methods: {
      email: {
        fromField: {
          name: "Basic App",
          email: "hello@example.com",
        },
        userSignupFields,
      },
    },
    onAuthSucceededRedirectTo: "/",
    onAuthFailedRedirectTo: "/login",
  },
  emailSender: {
    provider: "Dummy",
  },
  client: {
    rootComponent: App,
  },
  spec: [
    route("LandingRoute", "/", page(LandingPage)),
    route("CatalogRoute", "/catalog", page(CatalogPage)),
    route("DashboardRoute", "/dashboard", page(DashboardPage)),
    route("AddWorkRoute", "/add-work", page(AddWorkPage)),
    route("LoginRoute", "/login", page(LoginPage)),
    route("SignupRoute", "/signup", page(SignupPage)),
    route(
      "RequestPasswordResetRoute",
      "/request-password-reset",
      page(RequestPasswordResetPage),
    ),
    route("PasswordResetRoute", "/password-reset", page(PasswordResetPage)),
    route(
      "EmailVerificationRoute",
      "/email-verification",
      page(EmailVerificationPage),
    ),

    // Queries
    query(getWorks),
    query(getWork),
    query(getCategories),
    query(getCollections),
    query(getFavorites),

    // Actions
    action(createWork),
    action(updateWork),
    action(deleteWork),
    action(toggleFavorite),
  ],
});
