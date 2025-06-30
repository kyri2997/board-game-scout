// src/app/layout.jsx
import "@/styles/globals.css"; 



export const metadata = {
    title: "Board Game Scout",
    description: "Get personalized board game recommendations",
  };
  
function RootLayout({ children }) {
    return (
      <html lang="en" className="light">
        <body >
          {children}
        </body>
      </html>
    );
  }
  
  export default RootLayout