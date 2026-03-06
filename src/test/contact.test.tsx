import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Contact from "@/components/Contact";

const mockToast = vi.fn();

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

describe("Contact component", () => {
  beforeEach(() => {
    mockToast.mockReset();
    vi.restoreAllMocks();
  });

  it("renders the contact form and matches snapshot", () => {
    const { container } = render(<Contact />);

    expect(screen.getByPlaceholderText("Your Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your Message")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });

  it("shows field validation messages for invalid inputs", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    render(<Contact />);
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText("Name must be at least 2 characters")).toBeInTheDocument();
    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    expect(screen.getByText("Message must be at least 10 characters")).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("submits successfully and resets form state", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ message: "ok" }),
    } as Response);

    render(<Contact />);

    fireEvent.change(screen.getByPlaceholderText("Your Name"), { target: { value: "Ayan Das" } });
    fireEvent.change(screen.getByPlaceholderText("Your Email"), { target: { value: "ayan@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Your Message"), { target: { value: "This is a valid test message." } });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByPlaceholderText("Your Name")).toHaveValue("");
    expect(screen.getByPlaceholderText("Your Email")).toHaveValue("");
    expect(screen.getByPlaceholderText("Your Message")).toHaveValue("");
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Message sent!",
      }),
    );
  });

  it("surfaces API validation errors and destructive toast", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 400,
      text: async () =>
        JSON.stringify({
          message: "Validation failed",
          errors: {
            name: ["Server says name is invalid"],
            email: ["Server says email is invalid"],
            message: ["Server says message is invalid"],
          },
        }),
    } as Response);

    render(<Contact />);

    fireEvent.change(screen.getByPlaceholderText("Your Name"), { target: { value: "Ayan Das" } });
    fireEvent.change(screen.getByPlaceholderText("Your Email"), { target: { value: "ayan@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Your Message"), { target: { value: "This is a valid test message." } });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText("Server says name is invalid")).toBeInTheDocument();
    expect(screen.getByText("Server says email is invalid")).toBeInTheDocument();
    expect(screen.getByText("Server says message is invalid")).toBeInTheDocument();
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Failed to send",
        variant: "destructive",
      }),
    );
  });
});
