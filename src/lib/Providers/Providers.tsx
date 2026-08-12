import { ThemeProvider } from "@/components/theme-provider";

const Providers = ({ children }: any) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {children}
    </ThemeProvider>
  );
};

export default Providers;