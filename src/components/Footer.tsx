
import { useEffect } from "react";

export default function Footer() {
  useEffect(() => {
    const styleId = "lokesh-infinite-footer-styles";
    document.getElementById(styleId)?.remove();

    const style = document.createElement("style");
    style.id = styleId;

    style.textContent = `
      @keyframes lokesh-marquee-right {
        from { transform: translateX(-50%); }
        to   { transform: translateX(0); }
      }

      @keyframes lokesh-marquee-left {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }

      .lokesh-marquee-track {
        display: flex;
        width: max-content;
        flex-shrink: 0;
        will-change: transform;
      }

      .lokesh-marquee-group {
        display: flex;
        flex: 0 0 auto;
        width: max-content;
      }

      .lokesh-marquee-right {
        animation: lokesh-marquee-right 55s linear infinite;
      }

      .lokesh-marquee-left {
        animation: lokesh-marquee-left 55s linear infinite;
      }

      @media (prefers-reduced-motion: reduce) {
        .lokesh-marquee-right,
        .lokesh-marquee-left {
          animation: none !important;
        }
      }
    `;

    document.head.appendChild(style);

    return () => style.remove();
  }, []);

  const topMessage = "Thanks for visiting my portfolio!";
  const bottomMessage = "Code & Crafted with";

  const repeatedLine = (message: string, isCredit = false) => (
    <>
      {Array.from({ length: 12 }, (_, index) => (
        <span
          key={index}
          className="inline-flex shrink-0 items-center whitespace-nowrap"
          aria-hidden="true"
        >
          <span>{message}</span>

          {isCredit && (
            <>
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                aria-hidden="true"
                style={{
                  marginLeft: "4px",
                  marginRight: "4px",
                  flexShrink: 0,
                  fill: "#b46a55",
                  display: "block",
                }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>

              <span>by Lokesh</span>
            </>
          )}

          <span
            style={{
              color: "#b46a55",
              marginLeft: "8px",
              marginRight: "8px",
            }}
          >
            |
          </span>
        </span>
      ))}
    </>
  );

  const renderMarquee = (
    message: string,
    direction: "right" | "left",
    isCredit = false
  ) => (
    <div className="overflow-hidden">
      <div
        className={`lokesh-marquee-track lokesh-marquee-${direction}`}
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
          fontWeight: 400,
          lineHeight: 1.7,
          color: "#c7b8a6",
        }}
      >
        <div className="lokesh-marquee-group">
          {repeatedLine(message, isCredit)}
        </div>

        <div className="lokesh-marquee-group" aria-hidden="true">
          {repeatedLine(message, isCredit)}
        </div>
      </div>
    </div>
  );

  return (
    <footer
      className="relative overflow-hidden"
      style={{ backgroundColor: "#0b1320" }}
    >
      <div className="flex flex-col gap-5 py-7 sm:gap-6 sm:py-8">
        {renderMarquee(topMessage, "right")}
        {renderMarquee(bottomMessage, "left", true)}
      </div>
    </footer>
  );
}
