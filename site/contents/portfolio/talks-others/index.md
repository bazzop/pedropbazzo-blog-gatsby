---
title: Portfolio
description: Sharing Knowledge 🌎
date: 2021-01-02
template: portfolio
image: ./event.png
---

# 📚 Summary

<a id="backtothetop"></a>

- [Tech Talk](#techtalk01)
  - [Organizing an application with React](#techtalk01)
  - [Cloud Modernization](#techtalk02)  

- [Portfolio](#portfolio)
  - [Mobile](#mobile)
  - [Web](#web) 
  - [Web Responsive](#responsive)

- [Open Source Community](#github)
  - [Java EE 8 Design Patterns and Best Practices](#github01) 

- [Packages](#npm)
  - [Angular Dashboard](#npm01)<br/><br/><br/>
<br/>


<a id="techtalk01"></a> 

### [EN-US] Organizing an application with React 

<div style="text-align:center"><img src ="https://raw.githubusercontent.com/pedropbazzo/pedropbazzo-blog-gatsby/master/site/contents/portfolio/talks-others/tech-talk01.jpeg" />

## 👩🏼‍💻 [View structure in gist](https://gist.github.com/pedropbazzo/d39a1c8f5845d5daab36a70edb8ad2e3)

Folder Structure
================

Please note
------------

While this gist has been shared and followed for years, I regret not giving more background. It was originally a gist for the engineering org I was in, not a "general suggestion" for any React app.

Typically I avoid folders altogether. Heck, I even avoid new files. If I can build an app with one 2000 line file I will. New files and folders are a pain.

But when you're in a decently large organization where different development teams work within pretty well-defined feature boundaries of an application, I like the following approach but I would keep the feature folders flat, no route nesting.

Also, don't you dare throw this at your eng team and be like "this is the way". Make up your own minds and don't use me as some weird appeal to authority, I'm just an average dev like anybody else.

Motivations
-----------

- Clear feature ownership
- Module usage predictibility (refactoring, maintainence, you know
  what's shared, what's not, prevents accidental regressions,
  avoids huge directories of not-actually-reusable modules, etc)
- CI runs only the tests that matter (future)
- Code splitting (future)

How it works
------------

The file structure maps directly to the route hierarchy, which maps
directly to the UI hierarchy.

It's inverted from the model that we've used in other systems. If we
consider all folders being either a "generic" or a "feature" folder, we
only have one "feature" folder but many "generic" folders.

Examples of "feature" folders:

- Surveys
- Admin
- Users
- Author

Examples of "generic" folders:

- components
- helpers
- stores
- actions

Given this route config:

```js
var routes = (
  <Route name="App">
    <Route name="Admin">
      <Route name="Users"/>
      <Route name="Reports"/>
    </Route>
    <Route name="Course">
      <Route name="Assignments"/>
    </Route>
  </Route>
);
```

We would now set up our directories like this:

```
app
└── screens
    └── App
        └── screens
            ├── Admin
            │   └── screens
            │       ├── Reports
            │       └── Users
            └── Course
                └── screens
                    └── Assignments
```

Next, each of these screens has an `index.js` file, which is the file
that handles the entry into the screen, also known as a "Route Handler"
in react router. Its very much like a `Route` in Ember. We'll also have
some top-level application bootstrapping stuff at the root, like
`config/routes.js`.

```
app
├── config
│   └── routes.js
├── screens
│   └── App
│       ├── screens
│       │   ├── Admin
│       │   │   ├── screens
│       │   │   │   ├── Reports
│       │   │   │   │   └── index.js
│       │   │   │   └── Users
│       │   │   │       └── index.js
│       │   │   └── index.js
│       │   └── Course
│       │       ├── screens
│       │       │   └── Assignments
│       │       │       └── index.js
│       │       └── index.js
│       └── index.js
└── index.js
```

With this structure, each screen has its own directory to hold its
modules. In other words, we've introduced "scope" into our application
file structure.

Each will probably have a `components` directory.

```
app
├── config
│   └── routes.js
├── screens
│   └── App
│       ├── components
│       ├── screens
│       │   ├── Admin
│       │   │   ├── components
│       │   │   ├── screens
│       │   │   │   ├── Reports
│       │   │   │   │   ├── components
│       │   │   │   │   └── index.js
│       │   │   │   └── Users
│       │   │   │       ├── components
│       │   │   │       └── index.js
│       │   │   └── index.js
│       │   └── Course
│       │       ├── components
│       │       ├── screens
│       │       │   └── Assignments
│       │       │       ├── components
│       │       │       └── index.js
│       │       └── index.js
│       └── index.js
└── index.js
```

These components are used *only in the current screen*, not even the
child screens. So what about when you've got some shared components
between screens?

### Shared Modules

Every screen also has a "shared" generic directory. If its children
share any components with each other or the parent, we put the shared
code in "shared". Here is our growing app with some new shared, and not
shared modules.

```
app
├── config
│   └── routes.js
├── screens
│   └── App
│       ├── components
│       ├── screens
│       │   ├── Admin
│       │   │   ├── components
│       │   │   ├── screens
│       │   │   │   ├── Reports
│       │   │   │   │   ├── components
│       │   │   │   │   ├── stores
│       │   │   │   │   │   └── ReportsStore.js
│       │   │   │   │   └── index.js
│       │   │   │   └── Users
│       │   │   │       ├── components
│       │   │   │       └── index.js
│       │   │   ├── shared
│       │   │   │   └── stores
│       │   │   │       ├── AccountStore.js
│       │   │   │       └── UserStore.js
│       │   │   └── index.js
│       │   └── Course
│       │       ├── components
│       │       ├── screens
│       │       │   └── Assignments
│       │       │       ├── components
│       │       │       └── index.js
│       │       └── index.js
│       ├── shared
│       │   └── components
│       │       ├── Avatar.js
│       │       └── Icon.js
│       └── index.js
├── shared
│   └── util
│       └── createStore.js
└── index.js
```

Note `Admin/shared`; `Reports` and `Users` can both access the shared
stores. Additionally, every screen in the app can use `Avatar.js` and `Icon.js`.

We put shared components in the nearest `shared` directory possible and
move it toward the root as needed.

### Shared module resolution

The way modules in CommonJS are resolved is pretty straightforward in
practice: its all relative from the current file.

There is one piece of "magic" in the way modules resolve. When you do a
non-relative require like `require('moment')` the resolver will first
try to find it in `node_modules/moment`. If its not there, it will look
in `../node_modules/moment`, and on up the tree until it finds it.

We've made it so that `shared` resolves the same way with webpack
`modulesDirectories`. This way you don't have to
`require('../../../../../../../../../../shared/Avatar')` you can simply
do `require('components/Avatar')` no matter where you are.

### Tests

Tests live next to the modules they test. Tests for
`shared/util/createStore.js` live in `shared/util/__tests__/createStore.test.js`.

Now our app has a bunch of `__tests__` directories:

```
app
├── __tests__
├── config
│   └── routes.js
├── screens
│   └── App
│       ├── components
│       │   ├── __tests__
│       │   │   └── AppView.test.js
│       │   └── AppView.js

... etc.

├── shared
│   └── util
│       ├── __tests__
│       │   └── createStore.test.js
│       └── createStore.js
└── index.js
```

### Why "Screens"?

The other option is "views", which has become a lot like "controller".
What does it even mean? Screen seems pretty intuitive to me to mean "a
specific screen in the app" and not something that is shared. It has the
added benefit that there's no such thing as an "MSC" yet, so the word
"screen" causes people to ask "what's a screen?" instead of assuming
they know what a "view" is supposed to be.

---

<a id="techtalk02"></a>

### [EN-US] Cloud Modernization 

<h3 align="center">
    <img alt="techtalk02" title="#techtalk02" width="400px" src="https://raw.githubusercontent.com/pedropbazzo/pedropbazzo-blog-gatsby/master/site/contents/portfolio/talks-others/palestraAwsFamo.jpeg">
    <br>
</h3>

## What is cloud computing?

The concept of the cloud merges with that of the Internet, that is, computers around the world, united by a communication network, capable of offering information to anyone who has access to them. On the web, it doesn't matter to the user where the information is physically housed - it can be on any computer connected to the network.

Thus, the cloud allows access to different applications, without them being installed on our devices (computers, cell phones, tablets). In other words, a corporation acquires the service and the supplier takes care of the development, maintenance, data storage and backup of the saved systems and documents. The user is only responsible for accessing and using the resources.

Through the cloud, companies and people can easily connect, optimizing their processes. Thus, several people work collaboratively on the same platform or file, and security is guaranteed. Thus, there is no risk of compromising the entire process because a machine has broken or had an error.

## How did cloud computing come about?

Cloud computing has evolved through diverse solutions. A good example is the SaaS model (Software as a Service), in which the software provider is responsible for all the necessary structure for making the system available and the customer uses the product via the Internet, paying a fee for what he uses.

However, the most comprehensive concept, which is to provide computing resources on a global network, has its roots even in the 1960.

## Beginnings

The idea of ​​an “intergalactic computer network” was introduced in the 1960s by J.C.R. Licklider, who was responsible for the development of the ARPANET (Advanced Research Projects Agency Network), the first operational computer network based on packet switching.

Since the 1960s, cloud computing has developed in several ways, at least theoretically. However, in the 1990s, things started to become real, as the Internet began to offer more significant bandwidth packages, allowing cloud computing to reach the masses.

One of the first milestones in the history of cloud computing was the arrival of Hotmail in 1996, a pioneer in the concept of providing applications through a simple website. The consolidation of business applications happened with the arrival of Salesforce, right after.

## Evolution

Then came Amazon Web Services in 2002, which envisaged a set of cloud-based services, which in 2006 became Amazon EC2 / S3, the first widely accessible cloud computing infrastructure service. Today, AWS involves a large set of services aimed at the corporate environment.

By 2009 the world was already on this trend, and Google, Microsoft and other giants began offering browser-based business applications, such as Google Docs or Office Online, for example.

## Azure arrival

Azure, which appeared in 2010, is Microsoft's platform for running applications and services, based on the concepts of cloud computing. It allows you to use the company's computing and storage resources, along with a series of services and applications integrated with each device that accesses that cloud.

Azure is also an example of the growth of cloud computing: according to data from the American consultancy Wedbush Securities, Microsoft is very close to taking the lead in the cloud industry.

## What are the main benefits of investing in the cloud?

Investing in cloud computing can bring several benefits to the company. The first to be detected is the gain in operational mobility. After all, each professional will be able to access their work tools anywhere, just having an active connection to the Web.

At the same time, the possibility of hiring resources as needed reduces operating costs in the medium and long term. This is one of the main factors that lead companies to invest in the cloud, since the technology expands the capacity of the enterprise to plan efficiently and improves the openness to make new investments.

With automated backup routines, data security becomes more reliable. Legacy systems, for example, can run in a high-performance environment, which is unaffected by vulnerabilities on the client machine.

Check out other benefits of investing in cloud computing below.

## Scalability

Operational scalability is also a key factor in cloud computing. By handling resources according to internal demands, the company is able to prepare itself precisely for changes in the market. This will directly influence the enterprise's ability to remain productive and able to serve its customers with agility.

As resources are made available automatically, the return on investment (also known by the acronym ROI, Return On Investiment) will be high. The company will transform the amount invested in new systems quickly, either with the gain in productivity, or with the reduction of expenses with technology.

At the same time, the simplification of management policies translates into a strategic point for the company. IT professionals will be able to give a greater focus to internal projects and other factors that influence the performance of the sector. Thus, the company will innovate more.

Centralization of data
The centralization of information is another significant differential, since this model prevents data from being kept in different programs. This guideline prevents different types of forms of authentication and access from being generated, which would confuse employees.

Absence of geographical barriers
The cloud is a kind of virtual meeting point for employees. Imagine a company with several branches, whose employees are always exchanging information to streamline the business. Flat files can be sent by email. But what about when that document is too big to be attached?

A few decades ago, the solution would have been to send a package that would take a few days to reach the recipient. With cloud computing, this problem no longer exists: it is possible to upload the file to the cloud, follow it in real time and, if necessary, edit the document quickly, speeding up the work together.

Remote work and corporate mobility
With digital transformation, it is no longer necessary for every employee to have to travel daily to the workplace. The cloud complements the possibility of remote work, as professionals can access and send data through any computer or mobile device.

In addition, certain companies prioritize corporate mobility, which consists of the possibility for the professional to continue producing even in the field, receiving and passing on information in real time. The cloud fits perfectly in this process, since all that the employee needs to use it is to access his smartphone.

## How does cloud computing work?

Cloud computing uses a remote server to connect users' devices to centralized resources. A remote server stores all the data and programs you need and can be located geographically anywhere.

What really matters is that it is possible to access files from anywhere, even if they are stored on the other side of the world. There are three models of cloud computing: public, private and hybrid. We will get to know each one of them below.

## Public Cloud

In this model, computational resources, such as servers and storage capacity, are provided by third parties and made available to individual users or companies that wish to hire them.

In this way, the customer becomes responsible for what will be sent to the cloud. The provider takes care of maintenance, security and general management practices.

In the public cloud, everything is available on the Web and the information is shared among several users who use the files simultaneously.

## Private Cloud

Here, the company maintains the cloud infrastructure in its own environment, offering access to authorized users, such as employees and partners. The private cloud model provides the company with the possibility to customize the service according to their needs and preferences.

In general, this modality is adopted by organizations that follow certain regulations and rules designed to guarantee the security and privacy of data. As examples, we can mention financial institutions and government agencies.

## Hybrid cloud

Finally, when we mention the hybrid option, we are talking about the junction between the two previous models. This combination allows for optimal sharing of information between them.

Thus, according to the business demand, some resources are delegated to the private model and others are used publicly.

## What are the cloud services?

Today, cloud computing operates across a wide range of services, tools and features. Among the main ones, we can highlight three models.

## SaaS (Software as a Service)
SaaS ensures that you can access the software directly, without having to purchase the license. This use is made free of charge through the cloud.

In this model, the company can access the program over the Internet, without having to worry about installation, configuration and care with licenses.

## PaaS (Platform as a Service)
In this model, the client obtains a complete environment to develop, the so-called on demand, which provides the creation, modification and optimization of applications and programs.

The great thing about PaaS is that it includes operating and database management systems, as well as other valuable resources for running applications.

## IaaS (Infrastructure as a Service)

Finally, in the IaaS model, all infrastructure resources are rented. It can include equipment, such as servers, data centers, hardware solutions and racks, among other machines for data processing.

With IaaS everything is used according to the company's demand, and it will only pay for what it uses. It is especially valuable for companies that like to measure spending accurately.

## What is cloud computing today?

It is basically the Internet standard. Companies like Netflix, Spotify and other on-demand services are already part of the online ritual and conviviality. Fewer and fewer people store content on their computers, mobile phones and tablets, opting to move from work documents to personal photos on cloud services.

Organizations themselves are benefiting from cloud services, which bring speed, freedom of choice and cost savings.

As not everyone can keep up with technological developments closely, there are those who still fear for security, data privacy, network performance and savings in cloud computing. However, with applications naturally evolving into a model available on the Web, the tendency is for these concerns to disappear.

All this that currently still concerns a few will evolve technically, to the point that they are no longer a hindrance even for the most suspicious. Cloud computing will transform today's computing world! 

## On-Premise X Cloud Computing

<h3 align="center">
    <img alt="onpromise" title="#onpremise" width="962px" src="https://raw.githubusercontent.com/pedropbazzo/pedropbazzo-blog-gatsby/master/site/contents/portfolio/talks-others/onpremise.png">
    <br>
</h3>

Medium: https://medium.com/edureka/on-premise-vs-cloud-computing-f9aee3b05f50

AWS Services mind map: https://gitmind.com/app/doc/59c869085

Before building your architecture, it is essential to decide whether you want to manage your infrastructure locally (on your own) or let third parties manage it for you. These factors related to your environment should be considered for smooth operations.

Let's talk about a subject that interests most people: money. In general, you have money in your wallet and bank account. Here, the wallet is your local environment. On-Premise means that a company maintains all of its data, servers and everything in its IT environment internally. The company is responsible for administering, supporting and maintaining data at all times. This is the traditional way of hosting your architecture.
As a local environment refers to the maintenance of the entire internal infrastructure, it is also called “thermoelectric packaging”. An alternative to this is Cloud Computing.
---

<a id="portfolio"></a>
# <center>Portfolio</center>

## Some projects in my Portfolio
<a id="mobile"></a>
## 📱 Mobile


Application developed for Lóreal Paris - Dermaclub for Android and IOS platform

<h3 align="center">
    <img alt="Logo" title="#logo" width="400px" src="https://www.dermaclub.com.br/assets/images/logo.png">
    <br>
    <img alt="GitHub language count" src="https://img.shields.io/badge/dermaclub/v1-brightgreen">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen">
    <img src="https://github.com/Shpota/github-activity-generator/workflows/build/badge.svg">
</h3>

Mobile First | Access to the customer portal : https://loja.dermaclub.com.br/

<h3 align="center">
    <img alt="Logo" title="#logo" width="400px" src="https://raw.githubusercontent.com/pedropbazzo/pedropbazzo-blog-gatsby/master/site/contents/portfolio/talks-others/mobile.jpeg">
    <br>
</h3>

# Index

- [Summary](#sobre)
- [Technology Used](#tecnologias-utilizadas)
- [How to use](#como-usar)

<a id="sobre"></a>

## 📚 Summary

<strong>Dermaclub</strong>is a mobile application developed to bring another option to Loreal's customer<br><br>

A club for those who love skin care. Here you win <strong>year-round discounts</strong>and your purchases are worth points to exchange for products from participating brands.
<br><br>

<h3>Here you can find the brands most recommended by dermatologists</h3>

<br>

<h3 align="center">
    <img alt="Logo" title="#logo" width="400px" src="https://www.dermaclub.com.br/assets/images/LRP.png">
    <br><br>
    <img alt="Logo" title="#logo" width="400px" src="https://www.dermaclub.com.br/assets/images/VCY.png">
    <br><br>
    <img alt="Logo" title="#logo" width="400px" src="https://www.dermaclub.com.br/assets/images/SKC.png">
    <br><br>
    <img alt="Logo" title="#logo" width="400px" src="https://www.dermaclub.com.br/assets/images/cerave-logo.png">
    <br><br>
</h3>

<a id="tecnologias-utilizadas"></a>

## 🚀 Technologies Used

The project was developed using the following technologies

- [React Native](https://reactnative.dev/) <br>
  Were used here:

  - @babel/runtime;
  - @expo/vector-icons;
  - @react-native-community/async-storage;
  - @react-native-community/checkbox;
  - @react-native-community/datetimepicker;
  - @react-native-community/masked-view;
  - @react-native-community/viewpager;
  - @react-native-firebase/app;
  - @react-native-firebase/auth;
  - @react-native-firebase/firestore;
  - @react-native-firebase/storage;
  - @react-navigation/bottom-tabs;
  - @react-navigation/drawer;
  - @react-navigation/native;
  - @react-navigation/stack;
  - @rimiti/react-native-toastify;
  - axios;
  - expo;
  - expo-asset;
  - expo-constants;
  - expo-facebook;
  - expo-font;
  - expo-linear-gradient;
  - expo-permissions;
  - expo-secure-store;
  - expo-status-bar;
  - firebase;
  - formik;
  - moment;
  - native-base;
  - react;
  - react-dom;
  - react-moment;
  - react-native;
  - react-native-dotenv;
  - react-native-easy-toast;
  - react-native-elements;
  - react-native-fbsdk;
  - react-native-gesture-handler;
  - react-native-google-recaptcha-v2;
  - react-native-masked-text;
  - react-native-modal;
  - react-native-paper;
  - react-native-passmeter;
  - react-native-reanimated;
  - react-native-responsive-screen;
  - react-native-safe-area-context;
  - react-native-screens;
  - react-native-simple-radio-button;
  - react-native-slideshow;
  - react-native-swiper;
  - react-native-vector-icons;
  - react-native-web;
  - react-native-webview;
  - react-redux;
  - redux;
  - styled-components;
  - yup;

<a id="como-usar"></a>

## 🔥 How to use

- ### **Requirements**

  - It is necessary to have [Node.js] (https://nodejs.org/en/) installed on the machine
  - Also, it is necessary to have a package manager either [NPM] (https://www.npmjs.com/) or [Yarn] (https://yarnpkg.com/)

1. Running the Application:

```sh
  # Install the dependencies
  $ npm install

  # Launch the mobile application
  $ cd loreal.digital.aplicativo
  $ npm start
```

## License

This project is under the MIT license. 

## 👨‍💻  [Developed by:](https://github.com/pedropbazzo/) 

<h3 align="center">

[@pedropbazzo](https://www.instagram.com/pedropbazzo/)
</h3>    
<h3 align="center"><img alt="Avatar" title="#pedropbazzo" width="140px" src="https://avatars.githubusercontent.com/u/32115702?s=460&u=18b6f3c1f7fb02331ad007fd21a6fdd1c2105790&v=4">
    <br>
</h3>

<h3 align="center">

[Team Taking Consulting](https://www.taking.com.br/)
</h3>    
<h3 align="center"><img alt="Taking" title="#taking" width="140px" src="https://raw.githubusercontent.com/pedropbazzo/pedropbazzo-blog-gatsby/master/site/static/images/Taking_i%CC%81cone_logo.png">
    <br>
</h3>


<a id="web"></a>
## 💻 Web

Application Developed for Hospital Israelita Albert Einstein - for Web platform

<h3 align="center">
    <img alt="Logo" title="#logo" width="400px" src="https://raw.githubusercontent.com/pedropbazzo/pedropbazzo-blog-gatsby/master/site/contents/portfolio/talks-others/einstein1.png">
    <br>
    <img alt="web" src="https://img.shields.io/badge/web/dash/v1-brightgreen">
    <img alt="api" src="https://img.shields.io/badge/api/v1-brightgreen">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen">
    <img src="https://github.com/Shpota/github-activity-generator/workflows/build/badge.svg">
</h3>

Web | Access to the customer portal : https://dash-business.vercel.app/telemedicina

<h3 align="center">
    <img alt="Logo" title="#logo" width="400px" src="https://raw.githubusercontent.com/pedropbazzo/pedropbazzo-blog-gatsby/master/site/contents/portfolio/talks-others/dash-einstein.jpeg">
    <br>
</h3>

## 🚀 Technologies Used

The project was developed using the following technologies

- [React JS](https://pt-br.reactjs.org/docs/getting-started.html) <br>
- [Node JS](https://nodejs.org/en/docs/) <br>
  Were used here:<br/><br/>

- [Front]
- "@testing-library/jest-dom": "^5.11.4",
- "@testing-library/react": "^11.1.0",
- "@testing-library/user-event": "^12.1.10",
- "axios": "^0.21.0",
- "bootstrap": "^4.5.3",
- "chart.js": "^2.9.4",
- "multiselect-react-dropdown": "^1.6.3",
- "npm": "5",
- "npm5": "^5.0.0-beta.69",
- "react": "^17.0.1",
- "react-chartjs-2": "^2.11.1",
- "react-csv": "^2.0.3",
- "react-dom": "^17.0.1",
- "react-export-excel": "^0.5.3",
- "react-google-charts": "^3.0.15",
- "react-icons": "^3.11.0",
- "react-loading-skeleton": "^2.1.1",
- "react-map-gl": "^5.2.10",
- "react-router-dom": "^5.2.0",
- "react-scripts": "^4.0.0",
- "react-scroll": "^1.8.1",
- "react-select": "^3.2.0",
- "reactstrap": "^8.7.1",
- "styled-components": "^5.2.1",
- "web-vitals": "^0.2.4" <br/><br/>

- [Back]
- "cors": "^2.8.5",
- "express": "^4.17.1",
- "knex": "^0.21.12",
- "mssql": "^6.3.0",
- "mysql2": "^2.2.5",
- "npm5": "^5.0.0-beta.69",
- "request": "^2.88.2",
- "xlsx": "^0.16.9"<br/><br/>

- [Deploy]
- API - Heroku - Azure
- Front - Vercel - Azure - Firebase

## License

This project is under the MIT license. 

## 👨‍💻  [Developed by:](https://github.com/pedropbazzo/) 

<h3 align="center">

[@pedropbazzo](https://www.instagram.com/pedropbazzo/)
</h3>    
<h3 align="center"><img alt="Avatar" title="#pedropbazzo" width="140px" src="https://avatars.githubusercontent.com/u/32115702?s=460&u=18b6f3c1f7fb02331ad007fd21a6fdd1c2105790&v=4">
    <br>
</h3>

<h3 align="center">

[Team Taking Consulting](https://www.taking.com.br/)
</h3>    
<h3 align="center"><img alt="Taking" title="#taking" width="140px" src="https://raw.githubusercontent.com/pedropbazzo/pedropbazzo-blog-gatsby/master/site/static/images/Taking_i%CC%81cone_logo.png">
    <br>
</h3>
  
<a id="web"></a>
## 💻 Web

Application Developed for Hospital Israelita Albert Einstein - for Web platform

<h3 align="center">
    <img alt="Logo" title="#logo" width="400px" src="https://raw.githubusercontent.com/pedropbazzo/pedropbazzo-blog-gatsby/master/site/contents/portfolio/talks-others/einstein1.png">
    <br>
    <img alt="web" src="https://img.shields.io/badge/web/dash/v1-brightgreen">
    <img alt="api" src="https://img.shields.io/badge/api/v1-brightgreen">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen">
    <img src="https://github.com/Shpota/github-activity-generator/workflows/build/badge.svg">
</h3>

Web | Access to the customer portal : https://www.itau.com.br/empresas/emprestimos-financiamentos/conta-garantida/

<h3 align="center">
    <img alt="Logo" title="#logo" width="400px" src="https://raw.githubusercontent.com/pedropbazzo/pedropbazzo-blog-gatsby/master/site/contents/portfolio/talks-others/dash-einstein.jpeg">
    <br>
</h3>

## 👨‍💻  [Developed by:](https://github.com/pedropbazzo/) 

<h3 align="center">

[@pedropbazzo](https://www.instagram.com/pedropbazzo/)
</h3>    
<h3 align="center"><img alt="Avatar" title="#pedropbazzo" width="140px" src="https://avatars.githubusercontent.com/u/32115702?s=460&u=18b6f3c1f7fb02331ad007fd21a6fdd1c2105790&v=4">
    <br>
</h3>

<h3 align="center">

[Itaú Unibanco](https://www.itau.com.br/empresas/emprestimos-financiamentos/conta-garantida/)
</h3>    
<h3 align="center"><img alt="conta_garantida" title="#taking" width="140px" src="https://raw.githubusercontent.com/pedropbazzo/pedropbazzo-blog-gatsby/1550063601948d8b36a78ccdadcfd04710f9aa86/site/contents/portfolio/talks-others/logo_itau-empresas-01.svg>
    <br>
</h3>  
  
[![Watch the video](https://i.imgur.com/vKb2F1B.png)](https://youtu.be/-MA7A2fBdRA)  



<a id="responsive"></a>
## 💻   Web Responsive 📱

Application Developed for Dasa - for Web Responsive platform
 


<h3 align="center">
    <img alt="Logo" title="#logo" width="400px" src="https://raw.githubusercontent.com/pedropbazzo/pedropbazzo-blog-gatsby/master/site/contents/portfolio/talks-others/logo-dasa-ai.png">
    <br>
    <img alt="web" src="https://img.shields.io/badge/dasa.ai/v1-brightgreen">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen">
    <img src="https://github.com/Shpota/github-activity-generator/workflows/build/badge.svg">
</h3>
        
   
Web Responsive | Access to the customer portal : https://dasa.ai/

<h3 align="center">
    <img alt="Logo" title="#logo" width="400px" src="https://raw.githubusercontent.com/pedropbazzo/pedropbazzo-blog-gatsby/master/site/contents/portfolio/talks-others/responsive.png">
    <br>
</h3>
  


## 🚀 Technologies Used

The project was developed using the following technologies

- [React JS](https://pt-br.reactjs.org/docs/getting-started.html) <br>
- [Java](https://docs.oracle.com/en/java/) <br>
- [Python](https://docs.python.org/3/) <br>
- [Jenkins](https://www.jenkins.io/doc/) <br>
- [Sonnar](https://docs.sonarqube.org/latest/) <br>
- [Docker](https://docs.docker.com/) <br>
- [Fortify](https://community.microfocus.com/t5/Fortify-Product-Documentation/ct-p/fortify-product-documentation) <br><br/>

## License

This project is under the MIT license. 

## 👨‍💻  [Developed by:](https://github.com/pedropbazzo/) 

<h3 align="center">

[@pedropbazzo](https://www.instagram.com/pedropbazzo/)
</h3>    
<h3 align="center"><img alt="Avatar" title="#pedropbazzo" width="140px" src="https://avatars.githubusercontent.com/u/32115702?s=460&u=18b6f3c1f7fb02331ad007fd21a6fdd1c2105790&v=4">
    <br>
</h3>

<h3 align="center">

[Team Dasa Inova](https://dasa.com.br/inovacao/inteligencia-artificial)
</h3>    
<h3 align="center"><img alt="Dasai" title="#dasai" width="200px" src="https://raw.githubusercontent.com/pedropbazzo/pedropbazzo-blog-gatsby/master/site/contents/portfolio/talks-others/logo-dasa-ai.png">
    <br>
</h3>

  
  
  
[![Watch the video](https://i.imgur.com/vKb2F1B.png)](https://www.youtube.com/watch?v=qirav3a3Le0)


## 👩🏼‍💻 [Open Source Community](https://github.com/pedropbazzo/) 👨‍💻

<a id="github">

<div style="text-align:center"><img src ="https://raw.githubusercontent.com/pedropbazzo/pedropbazzo-blog-gatsby/master/site/contents/portfolio/talks-others/github.jpeg" /></a> 

<a id="github01"></a>

  - [Java EE 8 Design Patterns and Best Practices](https://github.com/pedropbazzo/Java-EE-8-Design-Patterns-and-Best-Practices)


## 👩🏼‍💻 [Packages](https://www.npmjs.com/package/pedropbazzo) 👨‍💻

<a id="npm">

<div style="text-align:center"><img src ="https://raw.githubusercontent.com/pedropbazzo/pedropbazzo-blog-gatsby/master/site/contents/portfolio/talks-others/npm.png" /></a> 

 - [Angular Dashboard](https://www.npmjs.com/package/pedropbazzo)<br/><br/><br/>
<a id="npm01"></a>

- 🔝 [Back to the top](#backtothetop)
---


---



