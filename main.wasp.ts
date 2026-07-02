// @ts-nocheck
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
import { EditWorkPage } from "./src/client/pages/EditWorkPage" with { type: "ref" };
import { TermsPage } from "./src/client/pages/TermsPage" with { type: "ref" };
import { devSeedUsers } from "./src/dbSeed" with { type: "ref" };

// Import Queries
import {
  getWorks,
  getApprovedWorks,
  getWork,
  getCategories,
  getCollections,
  getFavorites,
  getHistory,
} from "./src/server/queries" with { type: "ref" };
// Import Actions
import {
  createWork,
  updateWork,
  deleteWork,
  toggleFavorite,
  approveWork,
  rejectWork,
} from "./src/server/actions" with { type: "ref" };

export default app({
  name: "kickApp",
  title: "K.I.C.K — Acervo Multicultural",
  wasp: { version: "^0.24.0" },
  head: [
    "<link rel='icon' href='/favicon.ico' />",
    "<link rel='preconnect' href='https://fonts.googleapis.com' />",
    "<link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />",
    "<link href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap' rel='stylesheet' />",
  ],
  auth: {
    userEntity: "User",
    methods: {
      email: {
        fromField: {
          name: "K.I.C.K Acervo",
          email: "hello@example.com",
        },
        emailVerification: {
          clientRoute: "EmailVerificationRoute",
        },
        passwordReset: {
          clientRoute: "PasswordResetRoute",
        },
        userSignupFields,
      },
    },
    onAuthSucceededRedirectTo: "/catalog",
    onAuthFailedRedirectTo: "/login",
  },
  emailSender: {
    provider: "Dummy",
  },
  client: {
    rootComponent: App,
  },
  db: {
    seeds: [devSeedUsers],
  },
  spec: [
    // Public routes
    route("LandingRoute", "/", page(LandingPage)),
    route("CatalogRoute", "/catalog", page(CatalogPage)),
    route("TermsRoute", "/terms", page(TermsPage)),
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

    // Protected routes (require login)
    route(
      "DashboardRoute",
      "/dashboard",
      page(DashboardPage, { authRequired: true }),
    ),
    route(
      "AddWorkRoute",
      "/add-work",
      page(AddWorkPage, { authRequired: true }),
    ),
    route(
      "EditWorkRoute",
      "/edit-work/:id",
      page(EditWorkPage, { authRequired: true }),
    ),

    // Queries (with entities for cache invalidation)
    query(getWorks, { entities: ["Work", "Category", "Collection"] }),
    query(getApprovedWorks, { entities: ["Work", "Category", "Collection"] }),
    query(getWork, {
      entities: ["Work", "Category", "Collection", "Favorite"],
    }),
    query(getCategories, { entities: ["Category"] }),
    query(getCollections, { entities: ["Collection"] }),
    query(getFavorites, { entities: ["Favorite", "Work"] }),
    query(getHistory, { entities: ["History", "User"] }),

    // Actions (with entities for cache invalidation)
    action(createWork, { entities: ["Work", "History"] }),
    action(updateWork, { entities: ["Work", "History"] }),
    action(deleteWork, { entities: ["Work", "History", "Favorite"] }),
    action(toggleFavorite, { entities: ["Favorite"] }),
    action(approveWork, { entities: ["Work", "History"] }),
    action(rejectWork, { entities: ["Work", "History", "Favorite", "User"] }),
  ],
});
