:root {
  --orange: #ed8b18;
  --orange-dark: #cf7110;
  --orange-light: #fff5e7;

  --green: #397548;
  --green-dark: #285a35;
  --green-light: #edf5ef;

  --cream: #faf8f3;
  --white: #ffffff;

  --text: #242424;
  --text-light: #686868;

  --border: #e9e7e1;

  --shadow: 0 14px 40px rgba(0, 0, 0, 0.06);
}


* {
  box-sizing: border-box;
}


html {
  scroll-behavior: smooth;
  scroll-padding-top: 90px;
}


body {
  margin: 0;

  font-family:
    "Pretendard",
    "Noto Sans KR",
    "Apple SD Gothic Neo",
    Arial,
    sans-serif;

  color: var(--text);
  background: var(--white);

  line-height: 1.65;
  word-break: keep-all;
}


a {
  color: inherit;
  text-decoration: none;
}


img {
  max-width: 100%;
}


button {
  font: inherit;
}


.container {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
}



/* =========================================
   HEADER
========================================= */

.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;

  background: rgba(255, 255, 255, 0.97);
  border-bottom: 1px solid var(--border);
}


.header-inner {
  max-width: 1180px;
  min-height: 88px;

  margin: 0 auto;
  padding: 10px 20px;

  display: flex;
  align-items: center;
