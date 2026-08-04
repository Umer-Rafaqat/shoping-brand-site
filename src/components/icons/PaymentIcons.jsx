function IconWrap({ children, bg = "#fff" }) {
  return (
    <span
      className="flex h-8 w-12 items-center justify-center rounded-md"
      style={{ backgroundColor: bg }}
    >
      {children}
    </span>
  );
}

export function VisaIcon() {
  return (
    <IconWrap>
      <svg width="34" height="12" viewBox="0 0 34 12" fill="none">
        <text
          x="0"
          y="10"
          fontFamily="Arial, sans-serif"
          fontWeight="700"
          fontStyle="italic"
          fontSize="12"
          fill="#1A1F71"
        >
          VISA
        </text>
      </svg>
    </IconWrap>
  );
}

export function MastercardIcon() {
  return (
    <IconWrap>
      <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
        <circle cx="12" cy="10" r="9" fill="#EB001B" />
        <circle cx="20" cy="10" r="9" fill="#F79E1B" fillOpacity="0.9" />
      </svg>
    </IconWrap>
  );
}

export function PayPalIcon() {
  return (
    <IconWrap>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M6.5 16.5H4.2l1.9-12h4.6c2.3 0 3.9 1.2 3.6 3.3-.3 2.3-2.2 3.6-4.4 3.6H8l-.5 3.1h-1z"
          fill="#003087"
        />
        <path
          d="M9.2 16.5H7l1.9-12h4.6c2.1 0 3.6 1 3.6 2.9 0 2.3-1.9 3.9-4.2 3.9h-2l-.5 3.1h-.4z"
          fill="#009cde"
          transform="translate(1.2 1.2)"
        />
      </svg>
    </IconWrap>
  );
}

export function ApplePayIcon() {
  return (
    <IconWrap bg="#000">
      <svg width="30" height="14" viewBox="0 0 30 14" fill="none">
        <text
          x="0"
          y="11"
          fontFamily="-apple-system, Arial, sans-serif"
          fontWeight="600"
          fontSize="10"
          fill="#fff"
        >
          Pay
        </text>
        <path
          d="M4.5 2.2c.4-.5.7-1.2.6-1.9-.6 0-1.3.4-1.7.9-.4.4-.7 1.1-.6 1.8.7.1 1.3-.3 1.7-.8z"
          fill="#fff"
        />
      </svg>
    </IconWrap>
  );
}

export function GPayIcon() {
  return (
    <IconWrap>
      <svg width="34" height="14" viewBox="0 0 34 14" fill="none">
        <text
          x="0"
          y="11"
          fontFamily="Arial, sans-serif"
          fontWeight="500"
          fontSize="11"
          fill="#5F6368"
        >
          <tspan fill="#4285F4">G</tspan>
          <tspan fill="#5F6368">Pay</tspan>
        </text>
      </svg>
    </IconWrap>
  );
}
