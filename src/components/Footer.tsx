// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="w-full border-t py-6 text-sm text-muted-foreground text-center">
      <p>
        &copy; {new Date().getFullYear()} MMU Health Connect. All rights
        reserved.
      </p>
    </footer>
  );
}
