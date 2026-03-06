import { render, screen, cleanup } from "@testing-library/react";
import App from "@/App";

vi.mock("@/pages/Index", () => ({
  default: () => <div data-testid="index-page">Index Page</div>,
}));

vi.mock("@/pages/NotFound", () => ({
  default: () => <div data-testid="not-found-page">Not Found Page</div>,
}));

vi.mock("@/components/Orb", () => ({
  default: () => <div data-testid="orb-background" />,
}));

vi.mock("@/components/FloatingOrbs", () => ({
  default: () => <div data-testid="floating-orbs" />,
}));

describe("App routes", () => {
  afterEach(() => {
    cleanup();
    window.history.replaceState({}, "", "/");
  });

  it("loads the index route", () => {
    window.history.pushState({}, "", "/");
    render(<App />);

    expect(screen.getByTestId("index-page")).toBeInTheDocument();
    expect(screen.queryByTestId("not-found-page")).not.toBeInTheDocument();
  });

  it("loads not found route for unknown paths", () => {
    window.history.pushState({}, "", "/missing-route");
    render(<App />);

    expect(screen.getByTestId("not-found-page")).toBeInTheDocument();
    expect(screen.queryByTestId("index-page")).not.toBeInTheDocument();
  });
});
