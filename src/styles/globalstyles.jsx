import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'

export const GlobalStyles = createGlobalStyle`
  ${reset}
  :root {
    --font-size: 62.5%;
    --background: #F2F2FC;
    --foreground: #333333;
    --card: #ffffff;
    --card-foreground: #333333;
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.145 0 0);
    --primary: #8A79BA;
    --primary-foreground: #ffffff;
    --secondary: oklch(0.95 0.0058 264.53);
    --secondary-foreground: #030213;
    --muted: #ececf0;
    --muted-foreground: #717182;
    --accent: #e9ebef;
    --accent-foreground: #030213;
    --destructive: #d4183d;
    --destructive-foreground: #ffffff;
    --border: #E0D9F0;
    --input: transparent;
    --input-background: #ffffff;
    --switch-background: #cbced4;
    --font-weight-medium: 500;
    --font-weight-normal: 400;
    --ring: oklch(0.708 0 0);
    --chart-1: oklch(0.646 0.222 41.116);
    --chart-2: oklch(0.6 0.118 184.704);
    --chart-3: oklch(0.398 0.07 227.392);
    --chart-4: oklch(0.828 0.189 84.429);
    --chart-5: oklch(0.769 0.188 70.08);
    --radius: 0.625rem;
    --sidebar: oklch(0.985 0 0);
    --sidebar-foreground: oklch(0.145 0 0);
    --sidebar-primary: #030213;
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.97 0 0);
    --sidebar-accent-foreground: oklch(0.205 0 0);
    --sidebar-border: oklch(0.922 0 0);
    --sidebar-ring: oklch(0.708 0 0);

    /* Typography scale with 1rem = 10px */
    --text-base: 1.6rem; /* 16px */
    --text-lg: 1.8rem;   /* 18px */
    --text-xl: 2rem;     /* 20px */
    --text-2xl: 2.4rem;  /* 24px */
  }

  .dark {
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.985 0 0);
    --card: oklch(0.145 0 0);
    --card-foreground: oklch(0.985 0 0);
    --popover: oklch(0.145 0 0);
    --popover-foreground: oklch(0.985 0 0);
    --primary: oklch(0.985 0 0);
    --primary-foreground: oklch(0.205 0 0);
    --secondary: oklch(0.269 0 0);
    --secondary-foreground: oklch(0.985 0 0);
    --muted: oklch(0.269 0 0);
    --muted-foreground: oklch(0.708 0 0);
    --accent: oklch(0.269 0 0);
    --accent-foreground: oklch(0.985 0 0);
    --destructive: oklch(0.396 0.141 25.723);
    --destructive-foreground: oklch(0.637 0.237 25.331);
    --border: oklch(0.269 0 0);
    --input: oklch(0.269 0 0);
    --ring: oklch(0.439 0 0);
    --font-weight-medium: 500;
    --font-weight-normal: 400;
    --chart-1: oklch(0.488 0.243 264.376);
    --chart-2: oklch(0.696 0.17 162.48);
    --chart-3: oklch(0.769 0.188 70.08);
    --chart-4: oklch(0.627 0.265 303.9);
    --chart-5: oklch(0.645 0.246 16.439);
    --sidebar: oklch(0.205 0 0);
    --sidebar-foreground: oklch(0.985 0 0);
    --sidebar-primary: oklch(0.488 0.243 264.376);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.269 0 0);
    --sidebar-accent-foreground: oklch(0.985 0 0);
    --sidebar-border: oklch(0.269 0 0);
    --sidebar-ring: oklch(0.439 0 0);
  }

  html { font-size: var(--font-size); }

  *, *::before, *::after { box-sizing: border-box; }

  body {
    margin: 0;
    background: var(--background);
    color: var(--foreground);
    font-family: 'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif;
  }

  /* Base typography */
  h1 { font-size: var(--text-2xl); font-weight: var(--font-weight-medium); line-height: 1.5; }
  h2 { font-size: var(--text-xl);  font-weight: var(--font-weight-medium); line-height: 1.5; }
  h3 { font-size: var(--text-lg);  font-weight: var(--font-weight-medium); line-height: 1.5; }
  h4 { font-size: var(--text-base);font-weight: var(--font-weight-medium); line-height: 1.5; }
  p  { font-size: var(--text-base);font-weight: var(--font-weight-normal); line-height: 1.5; }
  label  { font-size: var(--text-base);font-weight: var(--font-weight-medium); line-height: 1.5; }
  button { font-size: var(--text-base);font-weight: var(--font-weight-medium); line-height: 1.5; }
  input  { font-size: var(--text-base);font-weight: var(--font-weight-normal); line-height: 1.5; }

  /* Animation delay utilities */
  .animation-delay-100 { animation-delay: 0.1s; }
  .animation-delay-200 { animation-delay: 0.2s; }
  .animation-delay-300 { animation-delay: 0.3s; }
  .animation-delay-500 { animation-delay: 0.5s; }
`

export default GlobalStyles


