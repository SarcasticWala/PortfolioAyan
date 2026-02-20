import { memo } from "react";

const Footer = memo(() => {
  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-6 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()}{" "}
          <span className="text-gradient font-medium">Ayan Das</span>. Built with passion & code.
        </p>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
export default Footer;
