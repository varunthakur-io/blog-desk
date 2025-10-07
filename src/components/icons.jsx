import React from 'react';

export const Icons = {
  gitHub: (props) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-github"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.44-.78-3.46 0 0-1.09-.35-3.56 1.06a9.53 9.53 0 0 0-6.29 0c-2.47-1.41-3.56-1.06-3.56-1.06A4.8 4.8 0 0 0 2 13.5c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
      />
      <path d="M9 18c-4.51 2-5-2-5-2s1 .5 2 2c2.5 2.5 4.9 1 4.9 1"
      />
    </svg>
  ),
  google: (props) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-google"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <path d="M21.17 8H12" />
      <path d="M3.95 6.06L12 12" />
      <path d="M12 12L20.05 17.94" />
      <path d="M8 12H3.95" />
      <path d="M12 12V3.95" />
      <path d="M12 12V20.05" />
    </svg>
  ),
};
