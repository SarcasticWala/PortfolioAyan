import { render, screen } from "@testing-library/react";
import Projects from "@/components/Projects";

vi.mock("@/components/kokonutui/CardFlip", () => ({
  default: ({
    title,
    subtitle,
    ctaHref,
    githubHref,
  }: {
    title?: string;
    subtitle?: string;
    ctaHref?: string;
    githubHref?: string;
  }) => (
    <article data-testid="project-card">
      <h3>{title}</h3>
      <p>{subtitle}</p>
      <a href={ctaHref}>Live</a>
      <a href={githubHref}>GitHub</a>
    </article>
  ),
}));

describe("Projects component", () => {
  it("renders all featured projects and matches snapshot", () => {
    const { container } = render(<Projects />);
    const cards = screen.getAllByTestId("project-card");

    expect(cards).toHaveLength(6);
    expect(screen.getByText("CodeSphere")).toBeInTheDocument();
    expect(screen.getByText("CGEC Store")).toBeInTheDocument();
    expect(screen.getByText("Esperenza 2k25")).toBeInTheDocument();
    expect(screen.getByText("TathaagatFoundation")).toBeInTheDocument();
    expect(screen.getByText("Chat-A-Verse")).toBeInTheDocument();
    expect(screen.getByText("expense-tracker")).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
});
