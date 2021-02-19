let siteMetadata = {
  title: `Pedro Bazzo`,
  capitalizeTitleOnHome: true,
  logo: `/images/logo.png`,
  icon: `/images/icon.png`,
  titleImage: `/images/wall.jpg`,
  introTag: `Senior IT Analyst Engineer | MBA in Front End Development`,
  description: `I work daily on creating new features for the Android and IOS application with React Native and the Web System with ReactJS and developing back-end with NodeJS, creating and maintaining microservices.`,
  author: `@pedropbazzo`,
  blogItemsPerPage: 20,
  portfolioItemsPerPage: 20,
  darkmode: true,
  switchTheme: true,
  navLinks: [
    {
      name: "HOME",
      url: "/",
    },
    {
      name: "ABOUT",
      url: "/about",
    },
    {
      name: "BLOG",
      url: "/blog",
    },
    {
      name: "PORTFOLIO",
      url: "/portfolio",
    },
  ],
  footerLinks: [
    {
      name: "PRIVACY POLICY",
      url: "/privacy-policy",
    },
  ],
  social: [
    {
      name: "Github",
      icon: "/images/Github.svg",
      url: "https://www.github.com/pedropbazzo/",
    },
  ],
  contact: {
    api_url: "",
    /* Leave this completely empty (no space either) if you don't want a contact form. */
    description: `If you want to contact me for work purposes or if you have any questions send me an email. `,
    mail: "developerpedropbazzo@gmail.com",
    phone: "+55 15 998088356",
    address: "+55 \nSão Paulo",
  },
};

module.exports = {
  siteMetadata: siteMetadata,
  plugins: [
    {
      resolve: "gatsby-theme-elemental",
      options: {
        contentPath: "contents",
      },
    },
  ],
};
