export default {
  content: ["./index.html", "./src/**/*.{js,html}"],
  theme: {
    extend: {
      colors: {
        sakura: "#FCE4EC",
        lilac: "#E1BEE7",
        mint: "#A7FFEB",
        sky: "#E3F2FD",
        navy: "#0f172a",
        indigo: "#1e293b"
      },
      borderRadius: {
        xl: "1.25rem"
      },
      boxShadow: {
        glass: "0 12px 30px rgba(0,0,0,0.08)"
      }
    }
  },
  plugins: []
};
